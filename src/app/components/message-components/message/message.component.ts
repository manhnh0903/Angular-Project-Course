import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { Reaction } from 'src/app/classes/reaction.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { UserService } from 'src/app/services/user.service';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';
import { ReactionsComponent } from '../reactions/reactions.component';
import { CursorPositionService } from 'src/app/services/cursor-position.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Message } from 'src/app/classes/message.class';

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
  z: any;
  isMobile: boolean;
  firestore = inject(Firestore);

  constructor(
    public fireService: FirestoreService,
    private userService: UserService,
    private homeNav: HomeNavigationService,
    public cursorService: CursorPositionService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe(['(max-width:900px)'])
      .subscribe((result: BreakpointState) => {
        if (result.matches) {
          this.isMobile = true;
        } else {
          this.isMobile = false;
        }
      });
  }

  ngAfterViewInit() {
    this.mentions();
  }

  openEditMessageDiv(event: { editMessage: boolean; openEdit: boolean }) {
    if (this.editMessage && this.openEdit) {
      this.editMessage = false;
      this.openEdit = false;
    } else {
      this.editMessage = true;
      this.openEdit = true;
    }
  }

  getSide(sender: string): boolean {
    if (sender === this.userService.user.name) {
      this.isYou = true;
      return true;
    } else {
      return false;
    }
  }

  getLastReplyTime(): string {
    if (this.thread.length > 0) {
      const lastReply = this.thread[this.thread.length - 1];
      const lastReplyTime = lastReply['creationTime'];
      return lastReplyTime;
    } else {
      return '';
    }
  }

  closeEdit() {
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
    return (
      this.type === 'channel' ||
      (this.type === 'thread' && this.homeNav.typeOfThread === 'channels') ||
      (this.type === 'thread-parent' && this.homeNav.typeOfThread === 'channels')
    );
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
    } else if (this.type === 'thread-parent' && this.homeNav.typeOfThread === 'channels') {
      messageToUpdate = this.fireService.currentChannel.messages[
        this.reactionsComponent.indexParentMessage()
      ];
    } else if (this.type === 'thread' && this.homeNav.typeOfThread === 'channels') {
      messageToUpdate = this.fireService.currentChannel.messages[
        this.reactionsComponent.indexParentMessage()
      ].thread[this.reactionsComponent.indexMessageOnThread()];
    }

    docRef = doc(this.firestore, 'channels', this.fireService.currentChannel.id);
    return { messageToUpdate, docRef };
  }

  /**
   * Asynchronously saves the updated message content in Firestore.
   * @param {any} docRef - Document reference.
   * @param {Message} messageToUpdate - Message to update.
   */
  async saveUpdatedInFirestore(docRef, messageToUpdate) {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const messages = docSnap.data()['messages'] || [];
      const updatedMessages = this.updateContentInMessagesArray(messages, messageToUpdate);
      await updateDoc(docRef, { messages: updatedMessages });
      this.closeEdit();
    }
  }

  /**
   * Updates the content of a message in the messages array.
   * @param {Array} messages - Array of messages.
   * @param {Message} messageToUpdate - Message to update.
   * @returns {Array} - Updated array of messages.
   */
  updateContentInMessagesArray(messages, messageToUpdate) {
    const indexOfMessageToUpdate = messages.findIndex((message) => message.id === messageToUpdate.id);

    if (this.type === 'pm') {
      messages[indexOfMessageToUpdate].content = messageToUpdate.content;
    } else if (this.type === 'thread') {
      messages[this.reactionsComponent.indexParentMessage()].thread[
        this.reactionsComponent.indexMessageOnThread()
      ].content = messageToUpdate.content;
    } else if (this.type === 'thread-parent') {
      messages[this.reactionsComponent.indexParentMessage()].content = messageToUpdate.content;
    } else {
      messages[indexOfMessageToUpdate].content = messageToUpdate.content;
    }

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
      messageToUpdate = this.opendThreadConversation.messages[
        this.reactionsComponent.indexParentMessage()
      ].thread[this.reactionsComponent.indexMessageOnThread()];
    } else if (this.type === 'thread-parent' && this.typeOfThread === 'pms') {
      messageToUpdate = this.opendThreadConversation.messages[
        this.reactionsComponent.indexParentMessage()
      ];
    }

    docRef = doc(this.firestore, 'pms', this.homeNav.pmCollectionId);
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
      let index = this.fireService.allUsers.findIndex(
        (user) => user.userId === id
      );
      if (index !== -1) {
        if (id === this.userService.user.userId) {
          names.push('Du');
        } else {
          names.push(this.fireService.allUsers[index].name);
        }
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
  * @returns {boolean} - True if the creation date is different, false otherwise.
  */
  isDifferentDate(creationDate, i: number, type): boolean {
    // Check if the current message is the first message.
    if (i === 0) {
      return true;
    }

    // Check if there is a creation date, and if it's not the first message or a thread type.
    if ((creationDate && i > 0) || type === 'thread') {
      return this.compareCreationDate(creationDate, i, type);
    }

    // Return false if conditions are not met.
    return false;
  }

  /**
   * Compares the creation date with the previous message's creation date based on the message type.
   * @param {string} creationDate - The creation date of the current message.
   * @param {number} i - The index of the current message in the messages array.
   * @param {string} type - The type of message (e.g., 'channel', 'pm', 'thread').
   * @returns {boolean} - True if the creation date is different, false otherwise.
   */
  compareCreationDate(creationDate, i: number, type): boolean {
    switch (type) {
      case 'channel':
        return this.compareChannelCreationDate(creationDate, i);

      case 'pm':
        return this.comparePMCreationDate(creationDate, i);

      case 'thread':
        return this.compareThreadCreationDate(creationDate, i);

      default:
        return false;
    }
  }

  /**
   * Compares the creation date with the previous message's creation date in a channel.
   * @param {string} creationDate - The creation date of the current message.
   * @param {number} i - The index of the current message in the messages array.
   * @returns {boolean} - True if the creation date is different, false otherwise.
   */
  compareChannelCreationDate(creationDate, i: number): boolean {
    return creationDate !== this.fireService.currentChannel.messages[i - 1].creationDate;
  }

  /**
   * Compares the creation date with the previous message's creation date in a private message.
   * @param {string} creationDate - The creation date of the current message.
   * @param {number} i - The index of the current message in the messages array.
   * @returns {boolean} - True if the creation date is different, false otherwise.
   */
  comparePMCreationDate(creationDate, i: number): boolean {
    return creationDate !== this.conversation.messages[i - 1].creationDate;
  }

  /**
   * Compares the creation date with the previous message's creation date in a thread.
   * @param {string} creationDate - The creation date of the current message.
   * @param {number} i - The index of the current message in the messages array.
   * @returns {boolean} - True if the creation date is different, false otherwise.
   */

  compareThreadCreationDate(creationDate, i: number): boolean {
    // Check if the current message is the first message in a thread.
    if (i === 0) {
      return true;
    }
    return creationDate !== this.thread[i - 1].creationDate;
  }


  async openThread() {
    this.homeNav.typeOfThread = this.typeOfThread
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
    // Get the current message content and cursor position.
    const currentMessage = this.content || '';
    const cursorPosition = this.cursorService.getCursorPosition(inputElement);
    // Split the current message into an array of characters.
    const messageArray = currentMessage.split('');
    // Insert the emoji at the cursor position in the array.
    messageArray.splice(cursorPosition, 0, event.emoji.native);
    // Join the array back into a string to update the content.
    const updatedMessage = messageArray.join('');
    // Update the content with the message containing the added emoji.
    this.content = updatedMessage;
    // Open the emoji picker after adding the emoji.
    this.openEmojiOnEdit();
  }


  getEmojiPickerStyle() {
    return {
      position: 'absolute',
      left: '26px',
      bottom: '35px',
      'z-index': '9999',
    };
  }

  async handleExistingEmoji(indexOfEmoji) {
    let docReference;
    if (this.reactionsComponent.checkForUsersIdForEmoji(indexOfEmoji) === -1) {
      this.ifNoEmojiFromUser(indexOfEmoji);
    } else {
      this.ifEmojiFromUserExists(indexOfEmoji);
    }
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
   * @param {number} indexOfEmoji - The index of the emoji in the reactions array.
   */
  ifEmojiFromUserExists(indexOfEmoji) {
    this.reactionsComponent.currentMessage.reactions[
      indexOfEmoji
    ].userIDs.splice(
      this.reactionsComponent.checkForUsersIdForEmoji(indexOfEmoji),
      1
    );
    this.reactionsComponent.decreaseCounterOfExistingEmoji(indexOfEmoji);
    if (
      this.reactionsComponent.currentMessage.reactions[indexOfEmoji].counter ===
      0
    )
      this.reactionsComponent.removeEmojiIfCounter0(indexOfEmoji);
  }

  /**
   * Determines the conditions for handling existing emojis based on the message type.
   * Calls specific functions for handling existing emojis in threads, channels, or private messages.
   * @param {any} docReference - The document reference for the Firestore database.
   */
  conditionsForHandlingExistingEmojis(docReference) {
    if (this.type === 'thread' || this.type === 'thread-parent') {
      this.existingEmojiOnThread(docReference);
    }
    if (this.type === 'channel') {
      this.existingEmojiOnChannel(docReference);
    }
    if (this.type === 'pm') {
      this.existingEmojiOnPM(docReference);
    }
  }

  /**
   * Handles existing emojis for thread messages.
   * @param {any} docReference - The document reference for the Firestore database.
   */
  async existingEmojiOnThread(docReference) {
    // Determine the document reference based on the type of thread.
    docReference = this.getDeterminedDocReference();

    // Check the message type and update the current message in the thread accordingly.
    if (this.type === 'thread') {
      this.updateThreadMessage(docReference);
    } else if (this.type === 'thread-parent') {
      this.updateThreadParentMessage(docReference);
    }
  }

  /**
   * Determines the document reference based on the type of thread.
   * @returns {any} - The determined document reference.
   */
  getDeterminedDocReference() {
    if (this.homeNav.typeOfThread === 'channels') {
      return this.fireService.getDocRef('channels', this.fireService.currentChannel.id);
    } else {
      return doc(this.firestore, 'pms', this.homeNav.pmCollectionId);
    }
  }

  /**
   * Updates the current message in a thread and updates the Firestore document.
   * @param {any} docReference - The document reference for the Firestore database.
   */
  updateThreadMessage(docReference) {
    if (this.homeNav.typeOfThread === 'channels') {
      const channelMessages = this.fireService.currentChannel.messages;
      const threadIndex = this.reactionsComponent.indexMessageOnThread();
      const parentIndex = this.reactionsComponent.indexParentMessage();
      channelMessages[parentIndex].thread[threadIndex] = this.currentMessage;
      this.reactionsComponent.updateDoc(docReference, channelMessages);
    } else {
      const pmMessages = this.opendThreadConversation.messages;
      const threadIndex = this.reactionsComponent.indexMessageOnThread();
      const parentIndex = this.reactionsComponent.indexParentMessage();

      pmMessages[parentIndex].thread[threadIndex] = this.currentMessage;
      this.reactionsComponent.updateDoc(docReference, this.pmMessagesToJson());
    }
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


  existingEmojiOnChannel(docReference) {
    docReference = this.fireService.getDocRef(
      'channels',
      this.fireService.currentChannel.id
    );
    this.fireService.currentChannel.messages[this.index] = this.currentMessage;
    this.reactionsComponent.updateDoc(
      docReference,
      this.fireService.currentChannel.messages
    );
  }

  async existingEmojiOnPM(docReference) {
    docReference = this.fireService.getDocRef('pms', this.collectionId);
    this.conversation.messages[this.index] = this.currentMessage;
    await updateDoc(docReference, {
      messages: this.conversation.toJSON().messages,
    });
  }

  mentions() {
    let splitted = this.content.split(' ');
    for (let i = 0; i < this.fireService.allUsers.length; i++) {
      let user = this.fireService.allUsers[i];
      for (let j = 0; j < splitted.length; j++) {
        let word = splitted[j];
        let wordWithoutMention = word.substring(1);
        if (this.checkIfMentionExists(wordWithoutMention, splitted, j, user)) {
          this.ifMentionExists(word, j, splitted);
        }
      }
    }
    this.assignToHTML(splitted);
  }

  /**
 * Checks if a mention exists in the given word at the specified index by comparing with user details.
 * @param {string} wordWithoutMention - The word without the mention symbol.
 * @param {Array<string>} splitted - The array of words being processed.
 * @param {number} j - The index of the current word in the array.
 * @param {User} user - The user details to compare with.
 * @returns {boolean} - True if the mention exists, false otherwise.
 */
  checkIfMentionExists(wordWithoutMention, splitted, j, user) {
    return (
      wordWithoutMention
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') ===
      user.name.toLowerCase().split(' ')[0] &&
      splitted[j + 1]
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') ===
      user.name.toLowerCase().split(' ')[1]
    );
  }

  /**
  * Checks if a mention exists in the given word at the specified index.
  * If a mention is found, it is replaced with HTML styling.
  * @param {string} word - The word being checked for a mention.
  * @param {number} j - The index of the current word in the array.
  * @param {Array<string>} splitted - The array of words being processed.
  */
  ifMentionExists(word, j, splitted) {
    // Initialize variables for first name, last name, and index.
    let firstName;
    let lastName;
    let index;

    // Assign values for first name, last name, and index.
    firstName = word;
    index = j;
    lastName = splitted[j + 1];

    // Replace the mention with HTML styling in the array of words.
    splitted.splice(
      index,
      2,
      `<span style="color: blue;">${firstName} ${lastName}</span>`
    );
  }


  assignToHTML(splitted) {
    let result = splitted.join(' ');
    this.contentContainer.nativeElement.innerHTML = result;
  }

  pmMessagesToJson() {
    return this.opendThreadConversation.messages.map(message => this.pmMessageToJson(message))
  }

  pmMessageToJson(message: Message): any {
    return {
      sender: message.sender,
      profileImg: message.profileImg,
      content: message.content,
      reactions: message.reactions,
      creationDate: message.creationDate,
      creationTime: message.creationTime,
      creationDay: message.creationDay,
      id: message.id,
      collectionId: message.collectionId,
      messageType: message.messageType,
      thread: message.thread
    };
  }
}