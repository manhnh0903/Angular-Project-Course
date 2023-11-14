import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { DabubbleUser } from '../classes/user.class';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user = new DabubbleUser();

  constructor(private firestoreService: FirestoreService) {}

  getUserData(userCredential) {
    const userData = this.firestoreService.getLogedInUserData();

    this.user = new DabubbleUser();
  }
}
