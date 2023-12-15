import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class HomeNavigationService {
  mainChatPath: string = 'chanel';
  pmRecipient: string;
  threadOpen: boolean = false;

  public selectedMessageSubject = new BehaviorSubject<any>(null);

  constructor(private firestoreService: FirestoreService) {}

  setChatPath(path: string) {
    this.mainChatPath = path;
  }

  toggleThread() {
    this.threadOpen = !this.threadOpen;
  }

  async selectMessage(messageData: {}) {
    this.selectedMessageSubject.next(messageData);

    await this.firestoreService.subscribeToThreadDocument(
      messageData['messageType'],
      messageData['collectionId']
    );

    this.threadOpen = true;
  }
}
