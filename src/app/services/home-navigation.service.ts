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
  public typeOfThread: string
  public pmCollectionId
  constructor(private firestoreService: FirestoreService) { }

  /**
   * Sets the main chat path.
   * @param path - The new path for the main chat.
   */
  setChatPath(path: string) {
    this.mainChatPath = path;
  }

  /**
   * Toggles the state of component thread.
   * If the thread is open, it will be closed; if it's closed, it will be opened.
   */
  toggleThread() {
    this.threadOpen = !this.threadOpen;
  }

  /**
   * Selects a message and opens the associated thread.
   *
   * @param messageData - The data related to the selected message.
   */
  async selectMessage(messageData: {}) {
    this.selectedMessageSubject.next(messageData);

    await this.firestoreService.subscribeToThreadDocument(
      messageData['messageType'],
      messageData['collectionId']
    );
    this.pmCollectionId = messageData['collectionId'];
    console.log(this.pmCollectionId);

    this.threadOpen = true;
  }
}
