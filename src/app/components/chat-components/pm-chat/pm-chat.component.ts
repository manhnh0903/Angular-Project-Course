import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DabubbleUser } from 'src/app/classes/user.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UserService } from 'src/app/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Message } from 'src/app/classes/message.class';
import { Conversation } from 'src/app/classes/conversation.class';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';

@Component({
  selector: 'app-pm-chat',
  templateUrl: './pm-chat.component.html',
  styleUrls: ['./pm-chat.component.scss'],
})
export class PmChatComponent {
  public conversation: Conversation = new Conversation();
  public sendMessageForm: FormGroup;
  public recipient: DabubbleUser;
  public conversationId: string;
  private destroy$ = new Subject<void>();
  public loading: boolean = true;
  public type = 'pm';
  @ViewChild('chatArea', { static: false }) chatArea: ElementRef;

  constructor(
    private fb: FormBuilder,
    public firestoreService: FirestoreService,
    public userService: UserService,
    private homeNavService: HomeNavigationService
  ) {
    this.sendMessageForm = this.fb.group({
      message: ['', [Validators.required]],
    });
    this.initializeAsync();
    this.scrollToBottom();
  }

  async initializeAsync() {
    await this.subRecipientData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Getter method for the 'message' form control.
   *
   * @returns The 'message' form control.
   */
  get message() {
    return this.sendMessageForm.get('message');
  }

  /**
   * Subscribes to changes in the recipient data through the subscribedRecipientDataSubject.
   * Upon receiving non-null data, initializes the recipient and conversation properties,
   * sets the loading flag to true, and triggers the retrieval of conversation data.
   * This subscription is managed until the component is destroyed.
   */
  async subRecipientData() {
    this.firestoreService.subscribedRecipientDataSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (data) => {
        if (data !== null) {
          this.recipient = new DabubbleUser(data);
          this.conversation = new Conversation();

          this.loading = true;
          await this.getConversationData();
        }
      });
  }

  /**
   * Opens user details by updating the pmRecipientData property with the current recipient
   * and setting the pmRecipientOverlayOpen flag to true, triggering the display of user details.
   */
  openUserDetails() {
    this.homeNavService.pmRecipientData = this.recipient;
    this.homeNavService.pmRecipientOverlayOpen = true;
  }

  /**
   * Sets up a new conversation between the logged-in user and the selected recipient.
   * Creates a new Conversation object, assigns user IDs, and adds the conversation to the Firestore database.
   */
  async setNewConversation() {
    const conversation = new Conversation();

    this.conversationId = undefined;
    conversation.userId1 = this.userService.user.userId;
    conversation.userId2 = this.recipient.userId;

    await this.firestoreService.addNewConversation(conversation.toJSON());
  }

  /**
   * Retrieves the snapshot of PM conversations from Firestore
   * and processes them to find or create a conversation involving the logged-in user and a recipient.
   * If a conversation is found, it sets up the conversation; otherwise, it creates a new one.
   */
  async getConversationData() {
    const ConversationsSnapshot = await this.firestoreService.getPmsSnapshot();
    let conversationFound = false;
    ConversationsSnapshot.forEach(async (doc) => {
      const docData = doc.data();
      const userId1 = docData['userId1'];
      const userId2 = docData['userId2'];

      if (this.userInConversation(userId1, userId2)) {
        this.conversationId = doc.id;
        this.setupConversation(userId1, userId2);
        conversationFound = true;
        return;
      }
    });
    if (!conversationFound) await this.createNewConversation();
  }

  /**
   * Creates  new conversation involving the logged-in user and a recipient.
   * after a conversation is created, it sets up the conversation.
   */
  async createNewConversation() {
    await this.setNewConversation();
    await this.getConversationData();
  }

  /**
   * Sets up the conversation based on the provided user IDs.
   * It initializes a new Conversation object, assigns the user IDs,
   * and subscribes to real-time data updates for the conversation.
   * @param userId1 - The ID of the first user in the conversation.
   * @param userId2 - The ID of the second user in the conversation.
   */
  async setupConversation(userId1: string, userId2: string) {
    this.conversation = new Conversation();
    this.conversation.userId1 = userId1;
    this.conversation.userId2 = userId2;
    await this.subConversationData(this.conversationId);
  }

  /**
   * Checks if the provided user IDs correspond to the logged-in user and the recipient.
   * Returns true if the user IDs match the current logged-in user and recipient, regardless of the order.
   * @param userId1 - The ID of the first user to check.
   * @param userId2 - The ID of the second user to check.
   * @returns True if the user IDs correspond to the logged-in user and recipient; otherwise, false.
   */
  userInConversation(userId1: string, userId2: string) {
    const logedInUserId = this.userService.user.userId;
    const recipientUserId = this.recipient.userId;

    return (
      (userId1 === logedInUserId && userId2 === recipientUserId) ||
      (userId1 === recipientUserId && userId2 === logedInUserId)
    );
  }

  /**
   * Subscribes to the conversation data for the given conversation ID, updating the current conversation.
   * Fetches and processes messages from the conversation, updating the conversation messages.
   * @param conversationId - The ID of the conversation to subscribe to.
   */
  async subConversationData(conversationId: string) {
    await this.firestoreService.subscribeToPMConversation(conversationId);
    this.firestoreService.conversationDataSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.conversation.messages = [];
        if (data && data.messages) {
          data.messages.forEach((msg: Message) => {
            const message = new Message(msg);
            this.conversation.messages.push(message);
          });
          this.handleMessagesUpdate();
        }
      });
  }

  /**
   * Handles logic after updating the conversation messages, such as stopping loading and scrolling to the bottom.
   */
  handleMessagesUpdate() {
    this.loading = false;
    setTimeout(() => {
      this.scrollToBottom();
    }, 1);
  }

  /**
   * Scrolls the chat area to the bottom, ensuring the latest messages are visible.
   * Uses the native element properties to set the scrollTop to the scrollHeight.
   */
  scrollToBottom() {
    if (this.chatArea && this.chatArea.nativeElement) {
      this.chatArea.nativeElement.scrollTop =
        this.chatArea.nativeElement.scrollHeight;
    }
  }
}
