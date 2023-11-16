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
  channels = []
  messages = []
  constructor(private firestore: Firestore) {
    this.unsubUsers = this.subUsers();
  }

  ngOnDestroy() {
    this.unsubUsers();
    this.unsubUserData();
  }

  subUsers() {
    return onSnapshot(this.getColRef('users'), (querySnapshot) => {
      querySnapshot.forEach((singleUser) => {
        console.log('USER???', singleUser.data());
      });
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
      this.messages = channelRef.data()['messages']
      return this.currentChannel = channelRef.data();
    } else {
      console.error('Document does not exist');
      return null;
    }
  }


  readCurrentChannelFromFirestore(docId) {
    return onSnapshot(this.getDocRef('channels', docId), (document: any) => {
      {
        this.currentChannel.name = document.data().name;
        this.currentChannel.messages = document.data().messages;
        this.currentChannel.thread = document.data().thread;
        this.currentChannel.description = document.data().description;
        this.currentChannel.users = document.data().users;
        this.currentChannel.id = document.data().id;

      }
    }
    )
  }


  async addChannelToCollection() {
    await addDoc(this.getColRef('channels'),
      this.currentChannel.toJson()
    );
  }


  async updateDocumentInFirebase() {
    await updateDoc(this.getDocRef('channels', this.currentChannel.id), this.currentChannel.toJson())
  }



  ifChangesOnChannels() {
    const q = query(this.getColRef('channels'));
    const unsubscribe = onSnapshot(q, (snapshot) => {

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          this.channels.push(change.doc.data())
        }
        if (change.type === 'modified') {
          let channelToModifyIndex = this.channels.findIndex(channel => channel.name === change.doc.data()['name'])
          this.channels[channelToModifyIndex] = change.doc.data()
        }
        if (change.type === 'removed') {
          let channelToRemoveIndex = this.channels.findIndex(channel => channel.id === change.doc.data()['id'])
          this.channels.splice(channelToRemoveIndex, 1)
        }
      });
    });
  }


  readChannels() {
    const q = query(collection(this.firestore, "channels"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.channels.push(doc.data());
      });
    });
  }


  async readMessagesOfChannels() {
    if (this.currentChannel.id) {
      const unsub = onSnapshot(doc(this.firestore, "channels", this.currentChannel.id), (doc) => {
        this.messages = doc.data()['messages']
      });
    }
  }


}

