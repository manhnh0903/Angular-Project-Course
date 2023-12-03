import { Component } from '@angular/core';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Message } from 'src/app/classes/message.class';
import { Subject, startWith, takeUntil } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Conversation } from 'src/app/classes/conversation.class';

@Component({
  selector: 'app-tread',
  templateUrl: './tread.component.html',
  styleUrls: ['./tread.component.scss'],
})
export class TreadComponent {
  public sendMessageForm: FormGroup;
  public messages: Message[];
  private destroy$ = new Subject<void>();

  private opendThreadConversation: Conversation;

  public parentMessage: Message = new Message();

  constructor(
    public homeNav: HomeNavigationService,
    private fb: FormBuilder,
    private userService: UserService,
    private firestoreService: FirestoreService
  ) {
    this.sendMessageForm = this.fb.group({
      message: ['', [Validators.required]],
    });

    this.subMessageData();
  }

  noOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get message() {
    return this.sendMessageForm.get('message');
  }

  subMessageData() {
    this.homeNav.selectedMessage$
      .pipe(startWith(this.homeNav.currentTread), takeUntil(this.destroy$))
      .subscribe((data: Message) => {
        this.parentMessage = data;
        this.subThreadData();
      });
  }

  subThreadData() {
    this.firestoreService.threadData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.opendThreadConversation = new Conversation(data);
        this.updateCurrentMessage();
        console.log(this.opendThreadConversation);
      });
  }

  updateCurrentMessage() {
    this.opendThreadConversation.messages.forEach(
      (message: Message, index: number) => {
        this.opendThreadConversation.messages[index] = new Message(message);

        if (message.id === this.parentMessage.id) {
          this.parentMessage = message;
        }
      }
    );
  }

  sendForm() {
    const msg = new Message();

    msg.content = this.sendMessageForm.value.message;
    msg.profileImg = this.userService.user.profileImg;
    msg.sender = this.userService.user.name;
    msg.creationDate = this.firestoreService.getCurrentDate();
    msg.creationTime = this.firestoreService.getCurrentTime();
    msg.id = this.addMessageId();

    this.parentMessage.thread.push(msg);

    console.log('convo', this.opendThreadConversation);

    this.firestoreService.updateConversation(
      this.parentMessage.collectionId,
      this.opendThreadConversation.toJson()
    );
  }

  addMessageId() {
    let id: number;
    if (this.parentMessage.thread.length > 0) {
      id =
        this.parentMessage.thread[this.parentMessage.thread.length - 1].id + 1;
    } else {
      id = 0;
    }
    return id;
  }
}
