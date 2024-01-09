import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { Firestore, updateDoc } from '@angular/fire/firestore';
import { FormControl, Validators } from '@angular/forms';
import { CursorPositionService } from 'src/app/services/cursor-position.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UserService } from 'src/app/services/user.service';
import { Message } from 'src/app/classes/message.class';
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from 'firebase/storage';
import { Conversation } from 'src/app/classes/conversation.class';

@Component({
  selector: 'app-footer-input',
  templateUrl: './footer-input.component.html',
  styleUrls: ['./footer-input.component.scss'],
})
export class FooterInputComponent {
  firestore = inject(Firestore);
  public emojiOpened = false;
  private newMessage: Message;
  public mentionsOpen = false;
  sendMessageForm = new FormControl('', [Validators.required]);
  @Input() type = 'channel';
  @Input() conversationId: string;
  @Input() conversation: Conversation;
  @Input() pmRecipient: string;
  @Input() threadCollection;
  @Input() parentMessage: Message;
  @Input() openThreadConversation;
  files;
  indexOfMention = [];
  event: any;
  constructor(
    public fireService: FirestoreService,
    public userService: UserService,
    private cursorService: CursorPositionService
  ) { }
  fileName = '';
  @ViewChild('contentContainer') contentContainer: ElementRef;
  @ViewChild('inputFooter', { static: true }) inputFooter: ElementRef;
  private storageRef;
  public linkContent: string;

  async onFileSelected(event, input) {
    const metadata = {
      contentType: 'image/jpeg',
    };
    let inputElement = event.target.files as HTMLInputElement;
    const storage = getStorage();
    this.storageRef = ref(storage, 'images/' + inputElement[0].name);
    const uploadTask = uploadBytesResumable(
      this.storageRef,
      inputElement[0],
      metadata
    );
    this.readImage(uploadTask, input);
  }

  readImage(uploadTask, input) {
    uploadTask.then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        this.linkContent = `<a target="_blank" href="${downloadURL}">Open file</a>`;
      });
    });
  }

  /**
   * Simulates a mention event by dispatching a keyboard event with the '@' key.
   * @param {HTMLInputElement} inputElement - The HTML input element for the message.
   */
  simulateMentionEvent(inputElement: HTMLInputElement) {
    const event = new KeyboardEvent('keydown', { key: '@', code: 'Digit2' });
    inputElement.dispatchEvent(event);
  }

  /**
   * Toggles the state of the emojiOpened property.
   */
  toggleEmoji() {
    this.emojiOpened = !this.emojiOpened;
  }

  /**
   * Adds an emoji to the current message at the cursor position in the input element.
   * @param {object} event - The event containing emoji information.
   * @param {HTMLInputElement} inputElement - The HTML input element for the message.
   */
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

  /**
   *  adds a new message to the current channel if the message form is valid.
   * @return {Promise<void>} - A promise that resolves when the message is successfully added.
   */
  async addMessageToChannel(): Promise<void> {
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

  /**
   * Deletes the file associated with the current storage reference and clears the link content.
   */
  deleteFile() {
    deleteObject(this.storageRef);
    this.linkContent = '';
  }

  /**
   * Adds the link content (image) to the current message in the message form.
   */
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
    if (this.newMessage.content !== "") {
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
  }

  /**
   * Adds a new message to the thread associated with the parent message.
   * Updates the conversation in the Firestore database.
   */
  addMessageToThread() {
    this.parentMessage.thread.push(this.newMessage);

    this.fireService.updateConversation(
      this.threadCollection,
      this.parentMessage.collectionId,
      this.openThreadConversation.toJSON()
    );
    this.sendMessageForm.patchValue('');
  }

  /**
   * Adds a new message to the private message (PM) conversation.
   * Updates the conversation in the Firestore database.
   */
  addMessageToPM() {
    this.conversation.messages.push(this.newMessage);
    this.fireService.updateConversation(
      'pms',
      this.conversationId,
      this.conversation.toJSON()
    );
    this.sendMessageForm.patchValue('');
  }

  /**
   * Adds a mention tag to the current message in the message form.
   * @param {HTMLInputElement} inputElement - The HTML input element for the message.
   */
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

  /**
   * Toggles the state of the mentionsOpen property.
   */
  toggleMention() {
    this.mentionsOpen = !this.mentionsOpen;
  }
}
