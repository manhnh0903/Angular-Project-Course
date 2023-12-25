import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { DabubbleUser } from '../classes/user.class';

@Injectable({
  providedIn: 'root',
})
export class HomeNavigationService {
  public selectedMessageSubject = new BehaviorSubject<any>(null);
  public mainChatPath: string = 'chanel';
  public pmRecipient: string;
  public pmRecipientData: DabubbleUser;
  public pmRecipientOverlayOpen: boolean = false;
  public threadOpen: boolean = false;
  public profileOverlay: boolean = false;
  public editProfileOpen: boolean = false;

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
