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
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject, distinctUntilChanged } from 'rxjs';


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
  userOnChannelCheck = []
  constructor(private firestore: Firestore) { }

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


  async ifChangesOnChannels() {
    const q = query(this.getColRef('channels'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const channelData = change.doc.data();
        let channelToModifyIndex = this.channels.findIndex(
          (channel) => channel.name === channelData['name']
        );

        if (change.type === 'added') {
          if (channelToModifyIndex === -1) {
            this.channels.push(channelData);
          }
        }

        if (change.type === 'modified') {
          if (channelToModifyIndex !== -1) {
            this.channels[channelToModifyIndex] = channelData;
            this.currentChannel = this.channels[channelToModifyIndex]

          }
        }

        if (change.type === 'removed') {
          if (channelToModifyIndex !== -1) {
            this.channels.splice(channelToModifyIndex, 1);
          }
        }
      });
    })
   
  }


  checkIfUserOnChannel() {
    let userId;
    this.loggedInUserDataSubject
      .pipe(distinctUntilChanged()) // Add this line to ensure distinct values
      .subscribe(data => {
        if (data && data.userId) {
          userId = data.userId;
          this.userOnChannelCheck = []; // Clear the array before populating it again
          this.channels.forEach(channel => {
            let index = channel.users.find(user => user.userId === userId);
  
            if (index !== undefined) {
              this.userOnChannelCheck.push(true);
            } else {
              this.userOnChannelCheck.push(false);
            }
          });
  
          console.log(this.userOnChannelCheck);
        }
      });
  }


  async defaultChannel() {
    let index = this.channels.findIndex(
      (channel) => channel.name === 'Entwickler'
    );
    this.currentChannel = this.channels[index];
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

}
