import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { Reaction } from 'src/app/classes/reaction.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { UserService } from 'src/app/services/user.service';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';
import { ReactionsComponent } from '../reactions/reactions.component';
import { CursorPositionService } from 'src/app/services/cursor-position.service';
import { Message } from 'src/app/classes/message.class';
import { MessageService } from 'src/app/message.service';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  @Input() sender: string;
  @Input() profileImg: string;
  @Input() content: string;
  @Input() thread;
  @Input() reactions: Reaction[];
  @Input() creationDate: string;
  @Input() creationDay: string;
  @Input() creationTime: string;
  @Input() id: number;
  @Input() index: number;
  @Input() currentMessage: {};
  @Input() collectionId;
  @Input() conversation;
  @Input() parentMessage;
  @Input() typeOfThread;
  @Input() opendThreadConversation;
  @Input() conversationID;
  @Input() type: 'channel' | 'pm' | 'thread' | 'thread-parent';
  @ViewChild('inputEditMessage') inputEditMessage: ElementRef<HTMLInputElement>;
  @ViewChild('contentContainer') contentContainer: ElementRef;
  @ViewChild(ReactionsComponent, { static: false })
  reactionsComponent: ReactionsComponent;
  public onRightSide: boolean;
  public editMessage = false;
  private openEdit = false;
  public emojiOpenedOnEdit = false;
  public isYou = false;
  public isMobile: boolean;
  firestore = inject(Firestore);

  constructor(
    public fireService: FirestoreService, private userService: UserService, private homeNav: HomeNavigationService, public cursorService: CursorPositionService, public messageService: MessageService
  ) { this.messageService.observeIfMobile() }

  ngAfterViewInit() {
    this.mentions();
  }


  /**
 * Toggles the edit message state and open edit state.
 * @param {Object} event - An object with properties 'editMessage' and 'openEdit'.
 */
openEditMessageDiv(event: { editMessage: boolean; openEdit: boolean }) {
  this.editMessage = this.openEdit = !this.editMessage && !this.openEdit;
}

/**
 * Determines if the message sender is the current user.
 * @returns {boolean} - A boolean indicating whether the sender is the current user or not.
 */
  getSide(sender: string): boolean {
    this.isYou = sender === this.userService.user.name;
    return this.isYou;
  }

/**
 * Retrieves the creation time of the last reply in the thread.
 * @returns {string} - The creation time of the last reply, or an empty string if no replies exist.
 */
  getLastReplyTime(): string {
    const lastReply = this.thread[this.thread.length - 1];
    return lastReply?.creationTime || '';
  }


  toggleEdit() {
    this.editMessage = !this.editMessage;
  }


  getNewContent(newContent: string) {
    this.content = newContent;
  }

  /**
   * Asynchronously updates the content of a message in Firestore based on the message type.
   */
  async updateMessageContent() {
    let messageToUpdate: Message;
    let docRef;
    if (this.isChannelMessage()) {
      ({ messageToUpdate, docRef } = this.checkForChannels());
    } else {
      ({ messageToUpdate, docRef } = this.checkForPMs());
    }
    messageToUpdate.content = this.content;
    await this.saveUpdatedInFirestore(docRef, messageToUpdate);
  }

  /**
   * Checks if the message type is a channel-related message.
   * @returns {boolean} - True if the message type is channel-related.
   */
  isChannelMessage() {
    return (this.type === 'channel' || (this.type === 'thread' && this.homeNav.typeOfThread === 'channels') ||
      (this.type === 'thread-parent' && this.homeNav.typeOfThread === 'channels'));
  }

  /**
   * Checks for channels, determines the message to update, and returns the message and document reference.
   * @returns {Object} - Object containing the updated message and document reference.
   */
  checkForChannels() {
    let messageToUpdate: Message;
    let docRef;
    if (this.type === 'channel') {
      messageToUpdate = this.fireService.currentChannel.messages[this.index];
    } else if (
      this.type === 'thread-parent' && this.homeNav.typeOfThread === 'channels') {
      messageToUpdate = this.fireService.currentChannel.messages[this.reactionsComponent.indexParentMessage()];
    } else if (this.type === 'thread' && this.homeNav.typeOfThread === 'channels') {
      messageToUpdate = this.fireService.currentChannel.messages[this.reactionsComponent.indexParentMessage()].thread[this.reactionsComponent.indexMessageOnThread()];
    }
    docRef = doc(this.firestore, 'channels', this.fireService.currentChannel.id);
    return { messageToUpdate, docRef };
  }

  /**
   * Asynchronously saves the updated message content in Firestore.
   * @param {any} docRef - Document reference.
   */
  async saveUpdatedInFirestore(docRef, messageToUpdate) {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const messages = docSnap.data()['messages'] || [];
      const updatedMessages = this.updateContentInMessagesArray(messages, messageToUpdate);
      await updateDoc(docRef, { messages: updatedMessages });
      this.toggleEdit();
    }
  }

  /**
   * Updates the content of a message in the messages array.
   * @returns {Array} - Updated array of messages.
   */
  updateContentInMessagesArray(messages, messageToUpdate) {
    const indexOfMessageToUpdate = messages.findIndex((message) => message.id === messageToUpdate.id);
    this.type === 'pm' ? messages[indexOfMessageToUpdate].content = messageToUpdate.content
      : this.type === 'thread' ? messages[this.reactionsComponent.indexParentMessage()].thread[this.reactionsComponent.indexMessageOnThread()].content = messageToUpdate.content
        : this.type === 'thread-parent' ? messages[this.reactionsComponent.indexParentMessage()].content = messageToUpdate.content
          : messages[indexOfMessageToUpdate].content = messageToUpdate.content;
    return [...messages];
  }

  /**
   * Checks for private messages, determines the message to update, and returns the message and document reference.
   * @returns {Object} - Object containing the updated message and document reference.
   */
  checkForPMs() {
    let messageToUpdate: Message;
    let docRef;
    if (this.type === 'pm') {
      messageToUpdate = this.conversation.messages[this.index];
      docRef = doc(this.firestore, 'pms', this.collectionId);
    } else if (this.type === 'thread' && this.typeOfThread === 'pms') {
      messageToUpdate = this.opendThreadConversation.messages[this.reactionsComponent.indexParentMessage()].thread[this.reactionsComponent.indexMessageOnThread()];
      docRef = doc(this.firestore, 'pms', this.homeNav.pmCollectionId);
    } else if (this.type === 'thread-parent' && this.typeOfThread === 'pms') {
      messageToUpdate = this.opendThreadConversation.messages[this.reactionsComponent.indexParentMessage()];
      docRef = doc(this.firestore, 'pms', this.homeNav.pmCollectionId);
    }
    return { messageToUpdate, docRef };
  }

  /**
   * Retrieves the names of users who reacted with a specific emoji.
   * @param {Object} emoji - The emoji object containing userIDs of users who reacted.
   * @returns {Array} - An array of user names corresponding to the provided userIDs.
   */
  getReactionsPeople(emoji) {
    let names = [];
    emoji.userIDs.forEach((id) => {
      let index = this.fireService.allUsers.findIndex((user) => user.userId === id);
      if (index !== -1) {
        if (id === this.userService.user.userId) {
          names.push('Du');
        } else { names.push(this.fireService.allUsers[index].name) }
      }
    });
    return names;
  }

  /**
   * Checks if the current user has reacted with a specific emoji.
   * @param {Object} emoji - The emoji object containing userIDs of users who reacted.
   * @returns {boolean} - True if the current user has reacted, false otherwise.
   */
  ifYouReacted(emoji) {
    return emoji.userIDs.some((id) => {
      const index = this.fireService.allUsers.findIndex(
        (user) => user.userId === id
      );
      return index !== -1 && id === this.userService.user.userId;
    });
  }

  /**
   * Checks if the creation date at the given index is different from the previous message's creation date.
   * @param {string} creationDate - The creation date of the current message.
   * @param {number} i - The index of the current message in the messages array.
   * @param {string} type - The type of message (e.g., 'channel', 'pm', 'thread').
   */
  isDifferentDate(creationDate, i: number, type): boolean {
    if (i === 0) { return true; }
    if ((creationDate && i > 0) || type === 'thread') {
      return this.compareCreationDate(creationDate, i, type);
    } return false;
  }


  /**
   * Compares the creation date with the previous message's creation date based on the message type.
   * @param {number} i - The index of the current message in the messages array.
   * @param {string} type - The type of message (e.g., 'channel', 'pm', 'thread').
   */
  compareCreationDate = (creationDate, i: number, type): boolean =>
    type === 'channel' ? this.compareChannelCreationDate(creationDate, i) :
      type === 'pm' ? this.comparePMCreationDate(creationDate, i) :
        type === 'thread' ? this.compareThreadCreationDate(creationDate, i) :
          false;

  /**
   * Compares the creation date with the previous message's creation date in a channel.
   */
  compareChannelCreationDate(creationDate, i: number): boolean {
    return (creationDate !== this.fireService.currentChannel.messages[i - 1].creationDate);
  }

  /**
   * Compares the creation date with the previous message's creation date in a private message.
   */
  comparePMCreationDate(creationDate, i: number): boolean {
    return creationDate !== this.conversation.messages[i - 1].creationDate;
  }

  /**
   * Compares the creation date with the previous message's creation date in a thread.
   */
  compareThreadCreationDate(creationDate, i: number): boolean {
    return i === 0 || creationDate !== this.thread[i - 1].creationDate;
  }

  async openThread() {
    this.homeNav.typeOfThread = this.typeOfThread;
    await this.homeNav.selectMessage(this.currentMessage);
  }

  openEmojiOnEdit() {
    this.emojiOpenedOnEdit = !this.emojiOpenedOnEdit;
  }

  /**
   * Adds an emoji to the content at the current cursor position when editing a message.
   * @param {Event} event - The event containing the selected emoji.
   * @param {HTMLInputElement} inputElement - The input element representing the message editor.
   */
  addEmojiOnEdit(event, inputElement: HTMLInputElement) {
    const currentMessage = this.content || '';
    const cursorPosition = this.cursorService.getCursorPosition(inputElement);
    const messageArray = currentMessage.split('');
    messageArray.splice(cursorPosition, 0, event.emoji.native);
    const updatedMessage = messageArray.join('');
    this.content = updatedMessage;
    this.openEmojiOnEdit();
  }


  getEmojiPickerStyle() {
    return { position: 'absolute', left: '26px', bottom: '35px', 'z-index': '9999', };
  }

/**
 * Asynchronously handles existing emojis based on the index of the emoji.
 * Determines whether the emoji is from the current user and invokes corresponding methods.
 */
  async handleExistingEmoji(indexOfEmoji) {
    let docReference;
    this.reactionsComponent.checkForUsersIdForEmoji(indexOfEmoji) === -1 ? this.ifNoEmojiFromUser(indexOfEmoji)
      : this.ifEmojiFromUserExists(indexOfEmoji);
    this.conditionsForHandlingExistingEmojis(docReference);
  }


  ifNoEmojiFromUser(indexOfEmoji) {
    this.reactionsComponent.increaseCounterOfExistingEmoji(indexOfEmoji);
    this.reactionsComponent.currentMessage.reactions[indexOfEmoji].userIDs.push(
      this.userService.user.userId
    );
  }

  /**
   * Checks if an emoji from the current user exists in the reactions of the current message.
   * If it exists, removes the user's ID from the emoji's userIDs, decreases the counter,
   * and removes the emoji if the counter becomes zero.
   */
  ifEmojiFromUserExists(indexOfEmoji) {
    this.reactionsComponent.currentMessage.reactions[indexOfEmoji].userIDs.splice(
      this.reactionsComponent.checkForUsersIdForEmoji(indexOfEmoji), 1);
    this.reactionsComponent.decreaseCounterOfExistingEmoji(indexOfEmoji);
    if (this.reactionsComponent.currentMessage.reactions[indexOfEmoji].counter === 0)
      this.reactionsComponent.removeEmojiIfCounter0(indexOfEmoji);
  }

  /**
   * Determines the conditions for handling existing emojis based on the message type.
   * Calls specific functions for handling existing emojis in threads, channels, or private messages.
   */
  conditionsForHandlingExistingEmojis(docReference) {
    this.type === 'thread' || this.type === 'thread-parent' ? this.existingEmojiOnThread(docReference)
      : this.type === 'channel' ? this.existingEmojiOnChannel(docReference)
        : this.type === 'pm' ? this.existingEmojiOnPM(docReference)
          : null;
  }

  /**
   * Handles existing emojis for thread messages.
   */
  async existingEmojiOnThread(docReference) {
    docReference = this.getDeterminedDocReference();
    this.type === 'thread' ? this.updateThreadMessage(docReference) : this.type === 'thread-parent' && this.updateThreadParentMessage(docReference);
  }

  /**
   * Determines the document reference based on the type of thread.
   */
  getDeterminedDocReference() {
    return this.homeNav.typeOfThread === 'channels'
      ? this.fireService.getDocRef('channels', this.fireService.currentChannel.id)
      : doc(this.firestore, 'pms', this.homeNav.pmCollectionId);
  }

  /**
   * Updates the current message in a thread and updates the Firestore document.
   * @param {any} docReference - The document reference for the Firestore database.
   */
  updateThreadMessage(docReference) {
    const messages = this.homeNav.typeOfThread === 'channels' ? this.fireService.currentChannel.messages : this.opendThreadConversation.messages;
    const threadIndex = this.reactionsComponent.indexMessageOnThread();
    const parentIndex = this.reactionsComponent.indexParentMessage();
    messages[parentIndex].thread[threadIndex] = this.currentMessage;
    this.reactionsComponent.updateDoc(docReference, this.homeNav.typeOfThread === 'channels' ? messages : this.pmMessagesToJson());
  }

  /**
   * Updates the current message in a thread-parent and updates the Firestore document.
   * @param {any} docReference - The document reference for the Firestore database.
   */
  updateThreadParentMessage(docReference) {
    if (this.homeNav.typeOfThread === 'channels') {
      const channelMessages = this.fireService.currentChannel.messages;
      const parentIndex = this.reactionsComponent.indexParentMessage();
      channelMessages[parentIndex] = this.currentMessage;
      this.reactionsComponent.updateDoc(docReference, channelMessages);
    } else {
      const pmMessages = this.opendThreadConversation.messages;
      const parentIndex = this.reactionsComponent.indexParentMessage();
      pmMessages[parentIndex] = this.currentMessage;
      this.reactionsComponent.updateDoc(docReference, this.pmMessagesToJson());
    }
  }

  /**
   * Checks for existing emojis on the current channel and updates the Firestore document accordingly.
   * The method updates the current message in the channel's messages array and triggers an update in the Firestore document.
   */
  async existingEmojiOnChannel(docReference) {
    docReference = this.fireService.getDocRef('channels', this.fireService.currentChannel.id);
    this.fireService.currentChannel.messages[this.index] = this.currentMessage;
    await this.reactionsComponent.updateDoc(docReference, this.fireService.currentChannel.messages);
  }

  /**
   * Asynchronously updates the current message in a private message (PM) conversation and updates the Firestore document.
    */
  async existingEmojiOnPM(docReference) {
    docReference = this.fireService.getDocRef('pms', this.collectionId);
    this.conversation.messages[this.index] = this.currentMessage;
    await updateDoc(docReference, { messages: this.conversation.toJSON().messages });
  }

  /**
   * Checks for mentions in the content of a message and updates the message service accordingly.
   * It splits the message content into words and iterates through each word to check for mentions.
   * @returns {void} - No explicit return value; the method updates the message service based on detected mentions.
   */
  mentions() {
    let splitted = this.content.split(' ');
    for (let i = 0; i < this.fireService.allUsers.length; i++) {
      let user = this.fireService.allUsers[i];
      this.messageService.contentContainer = this.contentContainer
      this.messageService.checkMentions(splitted, user)
    }
  }


  pmMessagesToJson() {
    return this.opendThreadConversation.messages.map((message) =>
      this.messageService.pmMessageToJson(message)
    );
  }
}