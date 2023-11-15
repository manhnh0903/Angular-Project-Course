import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { DabubbleUser } from '../classes/user.class';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user = new DabubbleUser();

  constructor(private firestoreService: FirestoreService) {}

  async getUserData(userCredential) {
    const userId = userCredential.user.uid;

    // Direkter Zugriff auf das Observable
    const userData$ = this.firestoreService.getLogedInUserData(userId);

    // Verwenden Sie async/await, um auf den Wert des Observables zu warten
    const userData = await userData$.toPromise();

    console.log('User Service Data', userData);

    this.user = new DabubbleUser(userData);
  }

  // async getUserData(userCredential) {
  //   const userId = userCredential.user.uid;

  //   const userData = await this.firestoreService.getLogedInUserData(userId);
  //   console.log('User Service Data', userData);

  //   this.user = new DabubbleUser();
  // }
}
