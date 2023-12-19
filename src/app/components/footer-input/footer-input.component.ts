import { Component, Input, OnInit, inject } from '@angular/core';
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
export class FooterInputComponent implements OnInit {
  firestore = inject(Firestore);
  public emojiOpened = false
  private newMessage;
  sendMessageForm = new FormControl('', [Validators.required])
  @Input() type = 'channel'
  @Input() conversationId
  @Input() conversation
  @Input() threadCollection
  @Input() parentMessage
  @Input() openThreadConversation
  constructor(
    public fireService: FirestoreService,
    public userService: UserService,
    private cursorService: CursorPositionService
  ) {
  }


  toggleEmoji() {
    this.emojiOpened = !this.emojiOpened
  }


  ngOnInit() {
    console.log(this.type);
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
      {
        this.newMessage.collectionId = this.fireService.currentChannel.id,
          this.newMessage.messageType = 'channels'
        this.addMessageToChannel()

      }
    } else if (this.type === 'pm') {
      this.newMessage.collectionId = this.conversationId,
        this.newMessage.messageType = 'pms'
      this.addMessageToPM()
    } else if (this.type === 'thread') {
      this.addMessageToThread()
    }
    ;
  }


  sendForm() {
    /*     const msg = new Message();
    
        msg.content = this.sendMessageForm.value.message;
        msg.profileImg = this.userService.user.profileImg;
        msg.sender = this.userService.user.name;
        msg.creationDate = this.firestoreService.getCurrentDate();
        msg.creationTime = this.firestoreService.getCurrentTime();
        msg.creationDay = this.firestoreService.getDaysName();

    msg.id = this.addMessageId(); */


  }

  /*sendPm() {
   const msg = new Message();
   
    msg.content = this.sendMessageForm.value.message;
    msg.profileImg = this.userService.user.profileImg;
    msg.sender = this.userService.user.name; 
    msg.creationDate = this.firestoreService.getCurrentDate();
    msg.creationTime = this.firestoreService.getCurrentTime();
    msg.id = this.addMessageId();
      msg.creationDay = this.firestoreService.getDaysName();*/
  /*     msg.collectionId = this.conversationId;
   
      msg.messageType = 'pms'; */

  /*  this.conversation.messages.push(msg);
   
    console.log(this.conversation.toJSON());
  
  this.firestoreService.updateConversation(
    'pms',
    this.conversationId,
    this.conversation.toJSON()
  );
  } */


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
}
