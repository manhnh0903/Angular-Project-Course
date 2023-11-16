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

    const userDataObservable = await this.firestoreService.getLogedInUserData(
      userId
    );
    userDataObservable.subscribe((data) => {
      this.user = new DabubbleUser(data);
      console.log('User service data:', this.user);
    });
  }
}
