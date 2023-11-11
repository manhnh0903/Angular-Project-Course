import { Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  constructor(private auth: Auth) {}

  provider = new GoogleAuthProvider();

  async registerWithEmailAndPassword(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      console.log('user created', userCredential);
    } catch (err) {
      console.error(err);
    }
  }

  async loginWithEmailAndPassword(email: string, password: string) {
    console.log(email, password);

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
}
