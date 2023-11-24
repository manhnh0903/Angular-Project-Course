import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DabubbleUser } from 'src/app/classes/user.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';
import { UserService } from 'src/app/services/user.service';
import { Subject, lastValueFrom } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Message } from 'src/app/classes/message.class';
import { Conversation } from 'src/app/classes/conversation.class';

@Component({
  selector: 'app-pm-chat',
  templateUrl: './pm-chat.component.html',
  styleUrls: ['./pm-chat.component.scss'],
})
export class PmChatComponent {
  public sendMessageForm: FormGroup;
  public recipient: DabubbleUser;
  private destroy$ = new Subject<void>();
  private conversationId: string;
  public messages: any[];

  constructor(
    private fb: FormBuilder,
    public firestoreService: FirestoreService,
    private navService: HomeNavigationService,
    private userService: UserService
  ) {
    this.sendMessageForm = this.fb.group({
      message: ['', [Validators.required]],
    });
    this.subRecipientData();
    this.getConversationData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get message() {
    return this.sendMessageForm.get('message');
  }

  subRecipientData() {
    this.firestoreService.subscribedRecipientData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.recipient = new DabubbleUser(data);
        this.getConversationData();
        console.log(this.recipient);
      });
  }

  openUserDetails() {
    console.log('Test Log', this.recipient);
  }

  sendPm() {
    const msg = new Message();

    const name = this.recipient.name;

    msg.content = this.sendMessageForm.value.message;
    msg.profileImg = this.userService.user.profileImg;
    msg.sender = this.userService.user.name;

    // this.userService.user.directMessages.push();
    console.log(msg);
  }

  async setNewConversation() {
    const conversation = new Conversation();

    conversation.userId1 = this.userService.user.userId;
    conversation.userId2 = this.recipient.userId;

    await this.firestoreService.addNewConversation(conversation.toJson());

    console.log('new conversation', conversation);
  }

  async getConversationData() {
    const ConversationsSnapshot = await this.firestoreService.getPmsSnapshot();

    ConversationsSnapshot.forEach((doc) => {
      const docData = doc.data();

      const userId1 = docData['userId1'];
      const userId2 = docData['userId2'];
      const logedInUserId = this.userService.user.userId;
      const recipientUserId = this.recipient.userId;

      console.log('user1', userId1, 'user2', userId2);
      console.log(
        'loged in user:',
        logedInUserId,
        'recipient user:',
        recipientUserId
      );

      if (
        (userId1 === logedInUserId && userId2 === recipientUserId) ||
        (userId1 === recipientUserId && userId2 === logedInUserId)
      ) {
        this.conversationId = doc.id;
        console.log('pm ID', this.conversationId);
        this.subConversationData(this.conversationId);
      } else {
        console.log('Die Benutzer sind nicht in der Konversation');
      }
    });
  }

  async subConversationData(conversationId: string) {
    await this.firestoreService.subscribeToPMConversation(conversationId);

    this.firestoreService.conversationData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.messages = [];
        if (data && data.messages) {
          data.messages.forEach((msg: string) => {
            console.log(msg);
            this.messages.push(msg);
          });
        }
      });
  }
}
