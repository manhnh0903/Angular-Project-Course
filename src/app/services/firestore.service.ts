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
  QuerySnapshot,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private loggedInUserDataSubject = new BehaviorSubject<any>(null);
  private subscribedDocDataSubject = new BehaviorSubject<any>(null);
  subscribedDocData$: Observable<any> =
    this.subscribedDocDataSubject.asObservable();

  unsubUsers;
  unsubUserData: Function;
  currentChannel;
  channels = [];
  messages = [];
  allUsers = [];
  emailsForReactions = [];
  constructor(private firestore: Firestore) {}

  ngOnDestroy() {
    this.unsubUserData();
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

  subscribeToPmRecipient(userId: string) {
    const docRef = this.getDocRef('users', userId);

    onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const docData = snapshot.data();
        this.subscribedDocDataSubject.next(docData);
      } else {
        this.subscribedDocDataSubject.next(null);
      }
    });
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

  async readAllUsers() {
    this.allUsers = [];
    const querySnapshot = await getDocs(collection(this.firestore, 'users'));

    querySnapshot.forEach((user) => {
      this.allUsers.push(user.data());
    });
  }
}
