import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Firestore, updateDoc } from '@angular/fire/firestore';
import { FormControl, Validators } from '@angular/forms';
import { CursorPositionService } from 'src/app/services/cursor-position.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UserService } from 'src/app/services/user.service';
import { Message } from 'src/app/classes/message.class';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";

@Component({
  selector: 'app-footer-input',
  templateUrl: './footer-input.component.html',
  styleUrls: ['./footer-input.component.scss'],
})
export class FooterInputComponent {
  firestore = inject(Firestore);
  public emojiOpened = false;
  private newMessage;
  public mentionsOpen = false;
  sendMessageForm = new FormControl('', [Validators.required]);
  @Input() type = 'channel';
  @Input() conversationId;
  @Input() conversation;
  @Input() pmRecipient: string;
  @Input() threadCollection;
  @Input() parentMessage;
  @Input() openThreadConversation;
  files
  indexOfMention = [];
  event: any;
  constructor(
    public fireService: FirestoreService,
    public userService: UserService,
    private cursorService: CursorPositionService,

  ) { }
  fileName = '';
  @ViewChild('contentContainer') contentContainer: ElementRef;
  @ViewChild('inputFooter', { static: true }) inputFooter: ElementRef;
  private storageRef
  public linkContent: string


  async onFileSelected(event, input) {
    const metadata = {
      contentType: 'image/jpeg'
    };
    let inputElement = event.target.files as HTMLInputElement
    const storage = getStorage();
    this.storageRef = ref(storage, 'images/' + inputElement[0].name);
    const uploadTask = uploadBytesResumable(this.storageRef, inputElement[0], metadata);
    this.readImage(uploadTask, input)
  }


  readImage(uploadTask, input) {
    uploadTask.then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        this.linkContent = `<a target="_blank" href="${downloadURL}">Open file</a>`
      })
    });
  }


  simulateMentionEvent(inputElement: HTMLInputElement) {
    const event = new KeyboardEvent('keydown', { key: '@', code: 'Digit2' });
    inputElement.dispatchEvent(event);
  }


  toggleEmoji() {
    this.emojiOpened = !this.emojiOpened;
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
    if (
      this.type === 'channel' &&
      this.fireService.currentChannel.messages.length > 0
    ) {
      id =
        this.fireService.currentChannel.messages[
          this.fireService.currentChannel.messages.length - 1
        ].id + 1;
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
      this.sendMessageForm.patchValue('');
    }
  }


  deleteFile() {
    deleteObject(this.storageRef)
    this.linkContent = ''
  }

  addImageToMessage() {
    const currentMessage = this.sendMessageForm.value || '';
    const updatedMessage = this.linkContent + currentMessage;
    this.sendMessageForm.patchValue(updatedMessage);
  }

  createMessage() {

    this.newMessage = new Message();
    this.newMessage.sender = this.userService.user.name;
    this.newMessage.profileImg = this.userService.user.profileImg;
    if (this.linkContent) {
      this.newMessage.content = this.linkContent + this.sendMessageForm.value;
    } else {
      this.newMessage.content = this.sendMessageForm.value;
    }
    this.newMessage.thread = [];
    this.newMessage.reactions = [];
    this.newMessage.creationDate = this.fireService.getCurrentDate();
    this.newMessage.creationTime = this.fireService.getCurrentTime();
    this.newMessage.creationDay = this.fireService.getDaysName();
    this.newMessage.id = this.addMessageId();

    if (this.type === 'channel') {
      this.newMessage.collectionId = this.fireService.currentChannel.id;
      this.newMessage.messageType = 'channels';
      this.addMessageToChannel();
    } else if (this.type === 'pm') {
      this.newMessage.collectionId = this.conversationId;
      this.newMessage.messageType = 'pms';
      this.newMessage.senderId = this.userService.user.userId;
      this.newMessage.recipientId = this.pmRecipient;
      this.addMessageToPM();
    } else if (this.type === 'thread') {
      this.addMessageToThread();
    }
  }

  addMessageToThread() {
    this.parentMessage.thread.push(this.newMessage);

    this.fireService.updateConversation(
      this.threadCollection,
      this.parentMessage.collectionId,
      this.openThreadConversation.toJSON()
    );
    this.sendMessageForm.patchValue('');
  }

  addMessageToPM() {
    this.conversation.messages.push(this.newMessage);
    this.fireService.updateConversation(
      'pms',
      this.conversationId,
      this.conversation.toJSON()
    );
    this.sendMessageForm.patchValue('');
  }

  addTaggedUser(inputElement: HTMLInputElement) {
    this.simulateMentionEvent(inputElement);
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
    this.mentionsOpen = !this.mentionsOpen;
  }
}
