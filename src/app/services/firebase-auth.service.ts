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

  async registerWithEmailAndPassword(user: DabubbleUser) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        user.email,
        user.password
      );
      console.log('user created user credentials:', userCredential);
      return userCredential;
    } catch (err) {
      console.error(err);
      return err;
    }
  }

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

  async updateEmailInFirebaseAuth(email: string) {
    try {
      await updateEmail(this.currentUser, email);

      /*     console.log('E-Mail-Adresse erfolgreich aktualisiert'); */
    } catch (err) {
      console.error(err);
    }
  }

  async sendForgotPasswordMail(email: string) {
    try {
      //evtl validieren ob email von angemeldeten user
      await sendPasswordResetEmail(this.auth, email);
    } catch (err) {
      console.error(err);
    }
  }

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

  userIsInDatabase(user) {
    let userFound: boolean = false;

    this.firestore.allUsers.forEach((DabubbleUser: DabubbleUser) => {
      if (DabubbleUser.name === user.displayName) {
        userFound = true;
      }
    });

    return userFound;
  }

  createNewGoogleUser(user) {
    const dabubbleUser = new DabubbleUser();

    dabubbleUser.email = user.email;
    dabubbleUser.name = user.displayName;
    dabubbleUser.userId = user.uid;
    dabubbleUser.profileImg = user.photoURL;

    this.firestore.newUser(dabubbleUser.toJson(), user.uid);
  }

  async logout() {
    try {
      await signOut(this.auth);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async checkAuth() {
    return new Promise<boolean>((resolve, reject) => {
      onAuthStateChanged(this.auth, (user: User | null) => {
        if (user) {
          //console.log('user is logged in check auth user data:', user.uid);
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
