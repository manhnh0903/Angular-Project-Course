import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  doc,
  updateDoc,
  collection,
  onSnapshot,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  async newUser(data: {}) {
    await addDoc(this.getRef('users'), data);
  }

  getRef(colName: string) {
    return collection(this.firestore, colName);
  }
}
