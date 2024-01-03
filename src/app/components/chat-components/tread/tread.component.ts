import { Component } from '@angular/core';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Message } from 'src/app/classes/message.class';
import { Subject, takeUntil } from 'rxjs';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Conversation } from 'src/app/classes/conversation.class';
import { Channel } from 'src/app/classes/channel.class';

@Component({
  selector: 'app-tread',
  templateUrl: './tread.component.html',
  styleUrls: ['./tread.component.scss'],
})
export class TreadComponent {
  public sendMessageForm: FormGroup;
  public messages: Message[];
  private destroy$ = new Subject<void>();
  public type = 'thread';
  public opendThreadConversation: Conversation | Channel;
  public threadCollection: string;
  public parentMessage: Message = new Message();

  constructor(
    public homeNav: HomeNavigationService,
    private fb: FormBuilder,

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

  /**
   * Getter method to access the 'message' form control from the sendMessageForm.
   *
   * @returns {AbstractControl} - The 'message' form control.
   */
  get message() {
    return this.sendMessageForm.get('message');
  }

  /**
   * Subscribes to message data for the selected message in the home navigation.
   * Updates the parent message and initiates the subscription to thread data.
   */
  subMessageData() {
    this.homeNav.selectedMessageSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.parentMessage = data;
        this.subThreadData();
      });
  }

  /**
   * Subscribes to thread data from the Firestore service.
   * Updates the open thread conversation based on the received data.
   * Determines the thread collection type (pms or channels) and updates the current message.
   */
  subThreadData() {
    this.firestoreService.threadDataSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          if (this.isConversation(data)) {
            this.opendThreadConversation = new Conversation(data);
            this.threadCollection = 'pms';
          } else if (this.isChannel(data)) {
            this.opendThreadConversation = new Channel(data);
            this.threadCollection = 'channels';
          }
          this.updateCurrentMessage();
        }
      });
  }

  /**
   * Checks whether the provided data represents a conversation.
   *
   * @param {Object} data - The data to be checked.
   * @returns {boolean} - True if the data represents a conversation, false otherwise.
   */
  isConversation(data: {}): boolean {
    return 'userId1' in data && 'userId2' in data && 'messages' in data;
  }

  /**
   * Checks whether the provided data represents a channel.
   *
   * @param {Object} data - The data to be checked.
   * @returns {boolean} - True if the data represents a channel, false otherwise.
   */
  isChannel(data: {}): boolean {
    return 'name' in data && 'description' in data;
  }

  /**
   * Updates the current message in the open thread conversation.
   * Iterates through the messages, creating new instances of each message.
   * Sets the parent message to the corresponding message in the updated messages array.
   */
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
}
