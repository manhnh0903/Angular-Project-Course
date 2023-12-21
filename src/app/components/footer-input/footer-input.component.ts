import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { Firestore, updateDoc } from '@angular/fire/firestore';
import { FormControl, Validators } from '@angular/forms';
import { CursorPositionService } from 'src/app/services/cursor-position.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UserService } from 'src/app/services/user.service';
import { Message } from 'src/app/classes/message.class';
@Component({
  selector: 'app-footer-input',
  templateUrl: './footer-input.component.html',
  styleUrls: ['./footer-input.component.scss']
})
export class FooterInputComponent {
  firestore = inject(Firestore);
  public emojiOpened = false
  private newMessage;
  public mentionsOpen = false
  sendMessageForm = new FormControl('', [Validators.required])
  @Input() type = 'channel'
  @Input() conversationId
  @Input() conversation
  @Input() threadCollection
  @Input() parentMessage
  @Input() openThreadConversation
  indexOfMention = []
  event: any;
  constructor(
    public fireService: FirestoreService,
    public userService: UserService,
    private cursorService: CursorPositionService,

  ) { }

  simulateMentionEvent(inputElement: HTMLInputElement) {
    const event = new KeyboardEvent("keydown", { key: "@", code: "Digit2" });
    inputElement.dispatchEvent(event);
  }
  /*   ngOnInit() {
      this.changesOfValueMessage()
    } */

  /*   filteredUsers = [] */
  /*  changesOfValueMessage() {
     this.sendMessageForm.valueChanges.subscribe((value: any) => {
       value = value.split('');
       let index = value.lastIndexOf('@')
       if (index !== -1) {
 
         this.mentionsOpen = true
  
       } else {
         this.mentionsOpen = false
       }
     });
 
   }
  */


  toggleEmoji() {
    this.emojiOpened = !this.emojiOpened
  }


  addEmoji(event, inputElement: HTMLInputElement) {
    const currentMessage = this.sendMessageForm.value || '';
    const cursorPosition = this.cursorService.getCursorPosition(inputElement);
    const messageArray = currentMessage.split('');
    messageArray.splice(cursorPosition, 0, event.emoji.native);
    const updatedMessage = messageArray.join('');
    this.sendMessageForm.patchValue(updatedMessage);
    this.toggleEmoji();
  }



  addMessageId() {
    let id: number;
    if (this.type === 'channel' && this.fireService.currentChannel.messages.length > 0) {
      id =
        this.fireService.currentChannel.messages[this.fireService.currentChannel.messages.length - 1].id + 1;

    } else if (this.type === 'pm' && this.conversation.messages.length > 0) {
      id =
        this.conversation.messages[this.conversation.messages.length - 1].id +
        1;
    } else if (this.type === 'thread' && this.parentMessage.thread.length > 0) {
      id =
        this.parentMessage.thread[this.parentMessage.thread.length - 1].id + 1;
    } else {
      id = 0;
    }
    return id;
  }



  async addMessageToChannel() {
    if (this.sendMessageForm.valid) {
      const docReference = this.fireService.getDocRef(
        'channels',
        this.fireService.currentChannel.id
      );
      this.fireService.currentChannel.messages.push(this.newMessage.toJSON());
      await updateDoc(docReference, {
        messages: this.fireService.currentChannel.messages,
      });
      this.sendMessageForm.patchValue('')
    }
  }


  createMessage() {
    this.newMessage = new Message()
    this.newMessage.sender = this.userService.user.name;
    this.newMessage.profileImg = this.userService.user.profileImg;
    this.newMessage.content = this.sendMessageForm.value;
    this.newMessage.thread = [];
    this.newMessage.reactions = [];
    this.newMessage.creationDate = this.fireService.getCurrentDate();
    this.newMessage.creationTime = this.fireService.getCurrentTime();
    this.newMessage.creationDay = this.fireService.getDaysName();
    this.newMessage.id = this.addMessageId();
    if (this.type === 'channel') {
      this.newMessage.collectionId = this.fireService.currentChannel.id,
        this.newMessage.messageType = 'channels'
      this.addMessageToChannel()
    } else if (this.type === 'pm') {
      this.newMessage.collectionId = this.conversationId,
        this.newMessage.messageType = 'pms'
      this.addMessageToPM()
    } else if (this.type === 'thread') {
      this.addMessageToThread()
    }
  }


  addMessageToThread() {
    this.parentMessage.thread.push(this.newMessage);

    this.fireService.updateConversation(
      this.threadCollection,
      this.parentMessage.collectionId,
      this.openThreadConversation.toJSON()
    );
    this.sendMessageForm.patchValue('')
  }


  addMessageToPM() {
    this.conversation.messages.push(this.newMessage);
    this.fireService.updateConversation(
      'pms',
      this.conversationId,
      this.conversation.toJSON()
    );
    this.sendMessageForm.patchValue('')
  }


  addTaggedUser(inputElement: HTMLInputElement) {
    this.simulateMentionEvent(inputElement)
    let currentMessage = this.sendMessageForm.value || '';
    let cursorPosition = this.cursorService.getCursorPosition(inputElement);
    let messageArray = currentMessage.split('');
    messageArray.splice(cursorPosition, 0, '@');
    let updatedMessage = messageArray.join('');
    this.sendMessageForm.patchValue(updatedMessage);
    let newCursorPosition = cursorPosition + 1;
    this.cursorService.setCursorPosition(inputElement, newCursorPosition);
    inputElement.focus();
  }

  toggleMention() {
    this.mentionsOpen = !this.mentionsOpen

  }
}
