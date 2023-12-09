import { DeclarationListEmitMode } from '@angular/compiler';
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
  where,
  docData,
  DocumentReference,
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { PmChatComponent } from '../components/pm-chat/pm-chat.component';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private loggedInUserDataSubject = new BehaviorSubject<any>(null);
  private subscribedRecipientDataSubject = new BehaviorSubject<any>(null);
  public subscribedRecipientData$: Observable<any> =
    this.subscribedRecipientDataSubject.asObservable();
  private conversationDataDataSubject = new BehaviorSubject<any>(null);
  public conversationData$: Observable<any> =
    this.conversationDataDataSubject.asObservable();
  private threadDataSubject = new BehaviorSubject<any>(null);
  threadData$: Observable<any> = this.threadDataSubject.asObservable();
  public conversation: any;
  unsubUserData: Function;
  public currentChannel;
  public channels = [];
  public allUsers = [];
  public emailsForReactions = [];
  private currentDate;
  public sorted = [];

  constructor(private firestore: Firestore) {}

  ngOnDestroy() {
    this.unsubUserData();
    this.destroyConversationDataSubject();
    this.destroyThreadDataSubject();
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
        this.subscribedRecipientDataSubject.next(docData);
      } else {
        this.subscribedRecipientDataSubject.next(null);
      }
    });
  }

  async subscribeToPMConversation(conversationID: string): Promise<void> {
    // this.destroyConversationDataSubject();

    const docRef = this.getDocRef('pms', conversationID);
    this.conversationDataDataSubject = new BehaviorSubject<any>(null);

    onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const convData = snapshot.data();
        this.conversationDataDataSubject.next(convData);
      } else {
        this.conversationDataDataSubject.next(null);
      }
    });

    this.conversationData$ = this.conversationDataDataSubject.asObservable();
  }

  private destroyConversationDataSubject(): void {
    this.conversationDataDataSubject.complete();
  }

  async subscribeToThreadDocument(col: string, docId: string) {
    const docRef = this.getDocRef(col, docId);
    this.threadDataSubject = new BehaviorSubject<any>(null);

    onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const threadData = snapshot.data();
        this.threadDataSubject.next(threadData);
      } else {
        this.threadDataSubject.next(null);
      }
    });

    this.threadData$ = this.threadDataSubject.asObservable();
  }

  private destroyThreadDataSubject(): void {
    this.threadDataSubject.complete();
  }

  async addNewConversation(data: {}) {
    const colRef = this.getColRef('pms');

    await addDoc(colRef, data);
  }

  async updateConversation(col, conversationID: string, data: {}) {
    const docRef = this.getDocRef(col, conversationID);

    await setDoc(docRef, data);
  }

  async getPmsSnapshot() {
    const colRef = this.getColRef('pms');

    return await getDocs(colRef);
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
      this.currentChannel = channelRef.data();
      this.currentChannel.messages = channelRef.data()['messages'];
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
    let initialSnapshot = true;
    const q = query(this.getColRef('channels'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let channelToModifyIndex = this.channels.findIndex(
          (channel) => channel.name === change.doc.data()['name']
        );
        if (!initialSnapshot && change.type === 'added') {
          if (channelToModifyIndex === -1)
            this.channels.push(change.doc.data());
        }
        if (!initialSnapshot && change.type === 'modified') {
          if (channelToModifyIndex !== -1)
            this.channels[channelToModifyIndex] = change.doc.data();
        }
        if (change.type === 'removed') {
          this.channels.splice(channelToModifyIndex, 1);
        }
      });
      initialSnapshot = false;
    });
    console.log(initialSnapshot);
  }

  async defaultChannel() {
    const q = query(collection(this.firestore, 'channels'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      this.channels.push(doc.data());
    });

    let index = this.channels.findIndex(
      (channel) => channel.name === 'Entwickler'
    );
    this.currentChannel = this.channels[index];
    console.log(this.currentChannel);
  }

  async readMessagesOfChannels() {
    if (this.currentChannel && this.currentChannel.id) {
      const unsub = onSnapshot(
        doc(this.firestore, 'channels', this.currentChannel.id),
        { includeMetadataChanges: true },
        (doc) => {
          this.currentChannel.messages = doc.data()['messages'];
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

  dateNameChecker(creationDay, creationDate) {
    if (creationDate !== this.getCurrentDate()) {
      return `${creationDay}, ` + `${creationDate}`;
    } else {
      return 'heute';
    }
  }

  /* 
    sortDates(obj): any {
      if (obj && obj.messages) {
        this.sorted = obj.messages.sort((a, b) => {
          let dateTimeA = this.parseDateTime(a.creationDate, a.creationTime);
          let dateTimeB = this.parseDateTime(b.creationDate, b.creationTime);
          return dateTimeB - dateTimeA;
        });
      }
      return this.sorted
    }
  
  
    parseDateTime(dateString, timeString) {
      let [day, month, year] = dateString.split('.').map(Number);
      let [hours, minutes] = timeString.split(':').map(Number);
      return new Date(year, month - 1, day, hours, minutes).getTime();
    } */

  getCurrentDate() {
    let datetime = new Date();
    const dayName = this.getDaysName();
    this.currentDate =
      datetime.getDate() +
      '.' +
      (datetime.getMonth() + 1) +
      '.' +
      datetime.getFullYear();

    return this.currentDate;
  }

  getCurrentTime() {
    let datetime = new Date();
    let hours = datetime.getHours();
    let minutes = datetime.getMinutes();
    let formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    let currentTime = `${hours}:${formattedMinutes}`;
    return currentTime;
  }

  getDaysName() {
    const weekday = [
      'Sonntag',
      'Montag',
      'Dienstag',
      'Mittwoch',
      'Donnerstag',
      'Freitag',
      'Samstag',
    ];
    const d = new Date();
    let day = weekday[d.getDay()];
    return day;
  }

  getsMonthName() {
    const month = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const d = new Date();
    let name = month[d.getMonth()];
    return name;
  }
}
