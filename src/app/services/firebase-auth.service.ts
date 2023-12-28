import { Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
  updateEmail,
  confirmPasswordReset,
} from '@angular/fire/auth';

import { DabubbleUser } from '../classes/user.class';

import { UserService } from './user.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  constructor(
    private auth: Auth,
    private userService: UserService,
    private firestore: FirestoreService
  ) {}

  provider = new GoogleAuthProvider();
  currentUser: User;
  oobCode: string;

  /**
   * Registers a user with email and password in Firebase.
   *
   * @param user - User information, including email and password.
   * @returns A Promise containing the user authentication information.
   */
  async registerWithEmailAndPassword(user: DabubbleUser) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        user.email,
        user.password
      );
      return userCredential;
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  /**
   * Logs in a user with email and password using Firebase authentication.
   *
   * @param email - The user's email address.
   * @param password - The user's password.
   * @throws Throws an error if login fails.
   */
  async loginWithEmailAndPassword(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      console.log('login successful:', userCredential.user.uid);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   * Updates the email address for the currently authenticated user in Firebase authentication.
   *
   * @param email - The new email address.
   */
  async updateEmailInFirebaseAuth(email: string) {
    try {
      await updateEmail(this.currentUser, email);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Sends a password reset email to the specified email address using Firebase authentication.
   *
   * @param email - The email address to which the password reset email will be sent.
   */
  async sendForgotPasswordMail(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Resets the password using Firebase authentication.
   *
   * @param newPassword - The new password to be set.
   */
  async resetPassword(newPassword: string) {
    try {
      if (!this.oobCode) {
        console.error('Ungültiger oder fehlender oobCode.');
      }
      await confirmPasswordReset(this.auth, this.oobCode, newPassword);
      console.log('neues Passwort gesetzt');
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Logs in the user with Google authentication.
   */
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, this.provider);
      const user = result.user;

      if (this.userIsInDatabase(user)) {
        console.log('login successful:', user);
      } else {
        this.createNewGoogleUser(user);
      }
    } catch (err) {
      console.error(err.code);
      console.error(err.message);
    }
  }

  /**
   * Checks if a user is already present in the database based on their display name.
   * @param user - The user object obtained from Google authentication.
   * @returns `true` if the user is found in the database, otherwise `false`.
   */
  userIsInDatabase(user) {
    let userFound: boolean = false;

    this.firestore.allUsers.forEach((DabubbleUser: DabubbleUser) => {
      if (DabubbleUser.name === user.displayName) {
        userFound = true;
      }
    });

    return userFound;
  }

  /**
   * Creates a new user in using Google authentication information.
   * @param user - The user object obtained from Google authentication.
   */
  createNewGoogleUser(user) {
    const dabubbleUser = new DabubbleUser();

    dabubbleUser.email = user.email;
    dabubbleUser.name = user.displayName;
    dabubbleUser.userId = user.uid;
    dabubbleUser.profileImg = user.photoURL;

    this.firestore.newUser(dabubbleUser.toJson(), user.uid);
  }

  /**
   * Logs the user out of the application.
   * @throws Error if there is an issue during the logout process.
   */
  async logout() {
    try {
      await signOut(this.auth);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   * Checks the authentication state of the user.
   * @returns A promise that resolves to a boolean value indicating whether the user is authenticated or not.
   */
  async checkAuth() {
    return new Promise<boolean>((resolve, reject) => {
      onAuthStateChanged(this.auth, (user: User | null) => {
        if (user) {
          this.currentUser = user;
          this.userService.getUserData(user.uid);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
}
