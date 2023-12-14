import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class HomeNavigationService {
  mainChatPath: string = 'chanel';
  pmRecipient: string;
  threadOpen: boolean = false;

  public selectedMessageSubject = new Subject<any>();
  selectedMessage$ = this.selectedMessageSubject.asObservable();

  constructor(private firestoreService: FirestoreService) {}

  setChatPath(path: string) {
    this.mainChatPath = path;
  }

  toggleThread() {
    this.threadOpen = !this.threadOpen;
  }

  async selectMessage(messageData: {}) {
    this.threadOpen = true;

    this.selectedMessageSubject.next(messageData);

    await this.firestoreService.subscribeToThreadDocument(
      messageData['messageType'],
      messageData['collectionId']
    );
  }
}
