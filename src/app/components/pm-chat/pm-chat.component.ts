import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DabubbleUser } from 'src/app/classes/user.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';
import { UserService } from 'src/app/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Message } from 'src/app/classes/message.class';

@Component({
  selector: 'app-pm-chat',
  templateUrl: './pm-chat.component.html',
  styleUrls: ['./pm-chat.component.scss'],
})
export class PmChatComponent {
  sendMessageForm: FormGroup;
  public recipient: DabubbleUser;
  private destroy$ = new Subject<void>();

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
    this.getConversation();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get message() {
    return this.sendMessageForm.get('message');
  }

  subRecipientData() {
    this.firestoreService.subscribedDocData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.recipient = new DabubbleUser(data);
        console.log(this.recipient);
      });
  }

  getConversation() {
    const conversations = this.userService.user.directMessages;

    conversations.forEach((conversation) => {
      console.log('Conversation', conversation);
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

    this.userService.user.directMessages.push();
    console.log(msg);
  }
}
