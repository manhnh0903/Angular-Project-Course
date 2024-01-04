import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import {
  DocumentReference,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { FirestoreService } from '../../../services/firestore.service';
import { Reaction } from '../../../classes/reaction.class';
import { UserService } from '../../../services/user.service';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.scss'],
})
export class ReactionsComponent {
  [x: string]: any;
  firestore = inject(Firestore);

  emojiOpened = false;
  @Input() currentMessage;
  @Input() index;
  @Input() public type: string;
  @Input() conversation;
  @Input() collectionId;
  @Input() isYou;
  @Input() parentMessage;
  @Input() emojiFunction: () => void;
  emoji;
  openEdit = false;
  editMessage = true;

  constructor(
    public fireService: FirestoreService,
    public userService: UserService,
    private el: ElementRef,
    private homeNav: HomeNavigationService
  ) {}

  @Output() openEditMessageDivEvent = new EventEmitter<{
    editMessage: boolean;
    openEdit: boolean;
  }>();
  @Output() addEmojiEvent = new EventEmitter<{ emoji }>();

  /**
   * Toggles the visibility of the edit message div.
   */
  openEditMessageDiv() {
    this.editMessage = !this.editMessage;
    this.openEdit = !this.openEdit;
    this.openEditMessageDivEvent.emit({
      editMessage: this.editMessage,
      openEdit: this.openEdit,
    });
  }

  /**
   * Toggles the state of the emojiOpened property.
   */
  openEmoji() {
    if (this.emojiOpened === false) {
      this.emojiOpened = true;
    } else {
      this.emojiOpened = false;
    }
  }

  async addEmoji(event) {
    let docReference;
    if (
      this.type === 'channel' ||
      this.type === 'thread' ||
      this.type === 'thread-parent'
    ) {
      docReference = this.fireService.getDocRef(
        'channels',
        this.fireService.currentChannel.id
      );
    }
    if (this.type === 'pm') {
      docReference = this.fireService.getDocRef('pms', this.collectionId);
      /*       this.conversation.messages[this.index] = this.currentMessage; */
      await updateDoc(docReference, {
        messages: this.conversation.toJSON().messages,
      });
    }

    this.createEmoji(event);
    let indexOfEmoji = this.currentMessage.reactions.findIndex(
      (reaction) => reaction.id === this.emoji.id
    ); //I check if the selected emoji already exists on the message

    this.checkForEmoji(indexOfEmoji)


    //I change the selected message
    if (this.type === 'channel') {
      this.fireService.currentChannel.messages[this.index] =
        this.currentMessage;
      this.updateDoc(docReference, this.fireService.currentChannel.messages);
    }
    if (this.type === 'thread') {
      this.fireService.currentChannel.messages[this.indexParentMessage()].thread[this.indexMessageOnThread()] =
        this.currentMessage;
      this.updateDoc(docReference, this.fireService.currentChannel.messages);
    }
    if (this.type === 'thread-parent') {
      this.fireService.currentChannel.messages[this.indexParentMessage()] =
        this.currentMessage;
      this.updateDoc(docReference, this.fireService.currentChannel.messages);
    }
    if (this.type === 'pm') {
      this.conversation.messages[this.index] = this.currentMessage;
      this.updateDoc(docReference, this.conversation.toJSON().messages);
    }
    this.openEmoji();
  }

  /**
   * Creates a new Emoji Reaction based on the provided event.
   * @param {object} event - The event containing emoji information.
   *
   */
  createEmoji(event) {
    this.emoji = new Reaction({
      id: event.emoji.id,
      name: event.emoji.name,
      colons: event.emoji.colons,
      text: event.emoji.text,
      emoticons: event.emoji.emoticons,
      skin: event.emoji.skin,
      native: event.emoji.native,
      counter: 1,
    });
  }

  /**
   * Checks for the presence of an emoji in the current message's reactions.
   * Calls different methods based on whether the emoji is present or not.
   * @param {number} indexOfEmoji - The index of the emoji in the reactions array.
   *  If -1, the emoji is not present in the message.
   */
  checkForEmoji(indexOfEmoji: number) {
    if (indexOfEmoji === -1) {
      this.ifEmojiIsNotOnMessage(indexOfEmoji);
    } else if (this.currentMessage.reactions[indexOfEmoji].counter !== 0) {
      this.ifEmojiIsOnMessage(indexOfEmoji);
    }
  }




  /**
   * Handles the scenario when the emoji is not present in the current message's reactions.
   * Adds the emoji to the reactions array and updates user-related information.
   * @param {number} indexOfEmoji - The index of the emoji in the reactions array.
   * Should be -1 when calling this function.
   */
  ifEmojiIsNotOnMessage(indexOfEmoji: number) {
    this.currentMessage.reactions.push(this.emoji.toJSON());
    indexOfEmoji = this.currentMessage.reactions.findIndex(
      (reaction) => reaction.id === this.emoji.id
    );
    this.currentMessage.reactions[indexOfEmoji].userIDs.push(
      this.userService.user.userId
    );
  }

  /**
   * Handles the scenario when the emoji is already present in the current message's reactions.
   * Increases or decreases the counter and updates user-related information accordingly.
   * @param {number} indexOfEmoji - The index of the emoji in the reactions array.
   */
  ifEmojiIsOnMessage(indexOfEmoji: number) {
    if (this.checkForUsersIdForEmoji(indexOfEmoji) === -1) {
      this.increaseCounterOfExistingEmoji(indexOfEmoji);
      this.currentMessage.reactions[indexOfEmoji].userIDs.push(
        this.userService.user.userId
      );
    } else {
      this.currentMessage.reactions[indexOfEmoji].userIDs.splice(
        this.checkForUsersIdForEmoji(indexOfEmoji),
        1
      );
      this.decreaseCounterOfExistingEmoji(indexOfEmoji);
      if (this.currentMessage.reactions[indexOfEmoji].counter === 0)
        this.removeEmojiIfCounter0(indexOfEmoji);
    }
  }

  /**
   * Increases the counter of an existing emoji in the current message's reactions.
   * @param {number} indexOfEmoji - The index of the emoji in the reactions array.
   * @return {number} - The updated counter value of the emoji.
   */
  increaseCounterOfExistingEmoji(indexOfEmoji: number) {
    return this.currentMessage.reactions[indexOfEmoji].counter++;
  }

  /**
   * Decreases the counter of an existing emoji in the current message's reactions.
   * @param {number} indexOfEmoji - The index of the emoji in the reactions array.
   * @return {number} - The updated counter value of the emoji.
   */
  decreaseCounterOfExistingEmoji(indexOfEmoji: number) {
    return this.currentMessage.reactions[indexOfEmoji].counter--;
  }

  /**
   * Removes an emoji from the current message's reactions if its counter becomes 0.
   * @param {number} indexOfEmoji - The index of the emoji in the reactions array.
   */
  removeEmojiIfCounter0(indexOfEmoji: number) {
    this.currentMessage.reactions.splice(indexOfEmoji, 1);
  }

  /**
   * Checks for the presence of the current user's ID in the userIDs array of an emoji.
   * @param {number} indexOfEmoji - The index of the emoji in the reactions array.
   * @return {number} - The index of the user's ID in the userIDs array.
   */
  checkForUsersIdForEmoji(indexOfEmoji: number) {
    return this.currentMessage.reactions[indexOfEmoji].userIDs.findIndex(
      (id) => id === this.userService.user.userId
    );
  }

  /**
   * Indexes the position of the parent message in the current channel's messages array.
   * @return {number} - The index of the parent message in the messages array.
   */
  indexParentMessage(): number {
 /*    this.parentMessage = this.currentMessage; */
    if (this.type === 'thread-parent') {
      this.parentMessage = this.currentMessage;
    }
    let index = this.fireService.currentChannel.messages.findIndex(
      (message) => message.id === this.parentMessage.id);
    return index
  }

  indexMessageOnThread() {
    let index = this.fireService.currentChannel.messages[
      this.indexParentMessage()].thread.findIndex((message) => message.id === this.currentMessage.id);
    return index
  }

  /**
   * Asynchronously updates a document using the provided Firestore document reference and object.
   * @param {DocumentReference} docReference - The reference to the Firestore document.
   * @param {object} obj - The object containing data to update the document.
   * @return {Promise<void>} - A promise that resolves when the document is successfully updated.
   */
  async updateDoc(docReference: DocumentReference, obj: {}) {
    await updateDoc(docReference, {
      messages: obj,
    });
  }

  /**
   * Toggles the state of the openEdit property.
   */
  openEditMessage() {
    this.openEdit = !this.openEdit;
  }

  /**
   * Initiates the thread by selecting the current message.
   */
  startThread() {
    this.homeNav.selectMessage(this.currentMessage);
  }
}