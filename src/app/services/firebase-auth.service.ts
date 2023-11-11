import { Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  constructor(private auth: Auth, private router: Router) {}

  provider = new GoogleAuthProvider();

  async registerWithEmailAndPassword(
    email: string,
    password: string,
    name: string
  ) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });
      this.router.navigate(['login']); // ändern Profilbild wählen etc
      console.log('user created', userCredential);
    } catch (err) {
      console.error(err);
    }
  }

  async loginWithEmailAndPassword(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      console.log('login successfull:', userCredential);
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

  async loginWithGoogle() {
    console.log(this.provider);

    try {
      const result = await signInWithPopup(this.auth, this.provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      console.log('Result:', result);
      console.log('credential:', credential);
      console.log('token:', token);
      console.log('user:', user);
    } catch (err) {
      console.error(err.code);
      console.error(err.message);
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
    } catch (err) {
      console.error(err);
    }
  }

  checkAuth(): void {
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        // Benutzer ist angemeldet
        console.log('Benutzer ist angemeldet:', user);
      } else {
        // Benutzer ist nicht angemeldet
        console.log('Benutzer ist nicht angemeldet');
        this.router.navigate(['login']);
      }
    });
  }
}
