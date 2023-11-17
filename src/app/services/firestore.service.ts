import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  doc,
  updateDoc,
  collection,
  onSnapshot,
  setDoc,
  getDoc,
  query,
  getDocs,
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private loggedInUserDataSubject = new BehaviorSubject<any>(null);
  unsubUsers;
  unsubUserData;
  currentChannel;
<<<<<<< HEAD
  channels = []
  messages = [];
  allUsers = []
=======
  channels = [];
  messages = [];
>>>>>>> 62afac846136cfbb42609358732f127899a690af
  constructor(private firestore: Firestore) {
    this.unsubUsers = this.subUsers();
  }

  ngOnDestroy() {
    this.unsubUsers();
    this.unsubUserData();
  }

  subUsers() {
    return onSnapshot(this.getColRef('users'), (querySnapshot) => {
      querySnapshot.forEach((singleUser) => {});
    });
  }

  async getLogedInUserData(userId: string) {
    const docRef = this.getDocRef('users', userId);

    this.unsubUserData = onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists) {
        const userData = docSnapshot.data();
        this.loggedInUserDataSubject.next(userData);
      } else return null;
    });

    return this.loggedInUserDataSubject.asObservable();
  }

  async newUser(data: {}, userId: string) {
    const userRef = this.getDocRef('users', userId);
    await setDoc(userRef, data);
  }

  getColRef(colName: string) {
    return collection(this.firestore, colName);
  }

  getDocRef(colName: string, docId: string) {
    return doc(this.getColRef(colName), docId);
  }

  async getCurrentChannel(colName: string, docId: string) {
    const channelRef = await getDoc(this.getDocRef(colName, docId));
    if (channelRef.exists()) {
      this.messages = channelRef.data()['messages'];
      return (this.currentChannel = channelRef.data());
    } else {
      console.error('Document does not exist');
      return null;
    }
  }

  async updateDocumentInFirebase() {
    await updateDoc(
      this.getDocRef('channels', this.currentChannel.id),
      this.currentChannel.toJson()
    );
  }

  ifChangesOnChannels() {
    const q = query(this.getColRef('channels'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let channelToModifyIndex = this.channels.findIndex(
          (channel) => channel.name === change.doc.data()['name']
        );
        if (change.type === 'added') {
          if (channelToModifyIndex === -1)
            this.channels.push(change.doc.data());
        }
        if (change.type === 'modified') {
          if (channelToModifyIndex !== -1)
            this.channels[channelToModifyIndex] = change.doc.data();
        }
        if (change.type === 'removed') {
          this.channels.splice(channelToModifyIndex, 1);
        }
      });
    });
  }

  readChannels() {
    const q = query(collection(this.firestore, 'channels'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let channelToModifyIndex = this.channels.findIndex(
          (channel) => channel.name === doc.data()['name']
        );
        if (channelToModifyIndex === -1) this.channels.push(doc.data());
      });
      console.log('channels:', this.channels);
    });
  }

  async readMessagesOfChannels() {
    if (this.currentChannel.id) {
      const unsub = onSnapshot(
        doc(this.firestore, 'channels', this.currentChannel.id),
        (doc) => {
          this.messages = doc.data()['messages'];
        }
      );
    }
  }
<<<<<<< HEAD



  async readAllUsers() {
    const querySnapshot = await getDocs(collection(this.firestore, "users"));
    querySnapshot.forEach((user) => {
      this.allUsers.push(user.data())
    });
  }
=======
>>>>>>> 62afac846136cfbb42609358732f127899a690af
}
