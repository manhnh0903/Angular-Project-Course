import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DabubbleUser } from 'src/app/classes/user.class';
import { FirestoreService } from 'src/app/services/firestore.service';

import { UserService } from 'src/app/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Message } from 'src/app/classes/message.class';
import { Conversation } from 'src/app/classes/conversation.class';

@Component({
  selector: 'app-pm-chat',
  templateUrl: './pm-chat.component.html',
  styleUrls: ['./pm-chat.component.scss'],
})
export class PmChatComponent {
  public conversation: Conversation = new Conversation();
  public sendMessageForm: FormGroup;
  public recipient: DabubbleUser;
  private conversationId: string;
  private destroy$ = new Subject<void>();
  public loading: boolean = true;

  @ViewChild('chatArea', { static: false }) chatArea: ElementRef;

  constructor(
    private fb: FormBuilder,
    public firestoreService: FirestoreService,
    public userService: UserService
  ) {
    this.sendMessageForm = this.fb.group({
      message: ['', [Validators.required]],
    });
    this.initializeAsync();
  }

  async initializeAsync() {
    await this.subRecipientData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get message() {
    return this.sendMessageForm.get('message');
  }

  async subRecipientData() {
    this.firestoreService.subscribedRecipientData$
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

  openUserDetails() {
    console.log('Test Log', this.recipient);
  }

  sendPm() {
    const msg = new Message();

    msg.content = this.sendMessageForm.value.message;
    msg.profileImg = this.userService.user.profileImg;
    msg.sender = this.userService.user.name;
    msg.creationDate = this.firestoreService.getCurrentDate();
    msg.creationTime = this.firestoreService.getCurrentTime();
    msg.id = this.addMessageId();
    msg.collectionId = this.conversationId;
    msg.creationDay = this.firestoreService.getDaysName();
    this.conversation.messages.push(msg);

    this.firestoreService.updateConversation(
      this.conversationId,
      this.conversation.toJson()
    );
  }

  addMessageId() {
    let id: number;
    if (this.conversation.messages.length > 0) {
      id =
        this.conversation.messages[this.conversation.messages.length - 1].id +
        1;
    } else {
      id = 0;
    }
    return id;
  }

  async setNewConversation() {
    const conversation = new Conversation();

    this.conversationId = undefined;

    conversation.userId1 = this.userService.user.userId;
    conversation.userId2 = this.recipient.userId;

    await this.firestoreService.addNewConversation(conversation.toJson());

    console.log('new conversation', conversation);
  }

  async getConversationData() {
    const ConversationsSnapshot = await this.firestoreService.getPmsSnapshot();
    let conversationFound = false;

    ConversationsSnapshot.forEach(async (doc) => {
      const docData = doc.data();
      const userId1 = docData['userId1'];
      const userId2 = docData['userId2'];

      if (this.userInConversation(userId1, userId2)) {
        this.conversationId = doc.id;
        console.log(this.conversationId);

        this.setupConversation(userId1, userId2);
        conversationFound = true;
        return;
      }

      if (!conversationFound) {
        console.log('Die Benutzer sind nicht in der Konversation');
      }
    });

    if (!conversationFound) {
      await this.setNewConversation();
      await this.getConversationData();
    }
  }

  async setupConversation(userId1: string, userId2: string) {
    this.conversation = new Conversation();

    this.conversation.userId1 = userId1;
    this.conversation.userId2 = userId2;
    await this.subConversationData(this.conversationId);

    console.log(this.conversation);
  }

  userInConversation(userId1: string, userId2: string) {
    const logedInUserId = this.userService.user.userId;
    const recipientUserId = this.recipient.userId;

    return (
      (userId1 === logedInUserId && userId2 === recipientUserId) ||
      (userId1 === recipientUserId && userId2 === logedInUserId)
    );
  }

  async subConversationData(conversationId: string) {
    await this.firestoreService.subscribeToPMConversation(conversationId);

    this.firestoreService.conversationData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.conversation.messages = [];
        if (data && data.messages) {
          data.messages.forEach((msg: Message) => {
            const message = new Message(msg);
            this.conversation.messages.push(message);
          });

          this.loading = false;
          setTimeout(() => {
            this.scrollToBottom();
          }, 1);
        }
      });
  }

  scrollToBottom() {
    if (this.chatArea && this.chatArea.nativeElement) {
      this.chatArea.nativeElement.scrollTop =
        this.chatArea.nativeElement.scrollHeight;
    }
  }
}
