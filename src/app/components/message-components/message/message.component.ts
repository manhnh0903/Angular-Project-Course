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
  @Input() creationTime: number;
  @Input() id: number;
  @Input() index: number;
  @Input() currentMessage: {};
  @Input() collectionId;
  @Input() conversation;
  @Input() parentMessage;
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

  async updateMessageContent() {
    let messageToUpdate: Message;
    let docRef;
    if (
      this.type === 'channel' ||
      this.type === 'thread' ||
      this.type === 'thread-parent'
    ) {
      console.log(this.type);

      ({ messageToUpdate, docRef } = this.checkForChannels(
        messageToUpdate,
        docRef
      ));
    } else {
      ({ messageToUpdate, docRef } = this.checkForPMs(messageToUpdate, docRef));
    }
    console.log(messageToUpdate);
    messageToUpdate.content = this.content;
    this.saveUpdatedInFirestore(docRef, messageToUpdate);
  }

  checkForChannels(messageToUpdate, docRef) {
    if (this.type === 'channel') {
      messageToUpdate = this.fireService.currentChannel.messages[this.index];
    }
    if (this.type === 'thread' || this.type === 'thread-parent') {
      messageToUpdate =
        this.fireService.currentChannel.messages[
          this.reactionsComponent.indexParentMessage()
        ].thread[this.reactionsComponent.indexMessageOnThread()];
    }
    docRef = doc(
      this.firestore,
      'channels',
      this.fireService.currentChannel.id
    );
    return { messageToUpdate, docRef };
  }

  async saveUpdatedInFirestore(docRef, messageToUpdate) {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const messages = docSnap.data()['messages'] || [];
      const indexOfMessageToUpdate = messages.findIndex(
        (message) => message.id === messageToUpdate.id
      );
      if (this.type === 'pm') {
        messages[indexOfMessageToUpdate].content = messageToUpdate.content;
      } else if (this.type === 'thread' || this.type === 'thread-parent') {
        messages[this.reactionsComponent.indexParentMessage()].thread[
          this.reactionsComponent.indexMessageOnThread()
        ].content = messageToUpdate.content;
      } else {
        messages[indexOfMessageToUpdate].content = messageToUpdate.content;
      }
      await updateDoc(docRef, { messages });
      this.closeEdit();
    }
  }

  checkForPMs(messageToUpdate, docRef) {
    if (this.type === 'pm') {
      messageToUpdate = this.conversation.messages[this.index];
      docRef = doc(this.firestore, 'pms', this.collectionId);
    }
    return { messageToUpdate, docRef };
  }

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

  ifYouReacted(emoji) {
    return emoji.userIDs.some((id) => {
      const index = this.fireService.allUsers.findIndex(
        (user) => user.userId === id
      );
      return index !== -1 && id === this.userService.user.userId;
    });
  }

  isDifferentDate(creationDate, i: number, type): boolean {
    if (i === 0) {
      return true;
    }
    if ((creationDate && i > 0) || type === 'thread') {
      if (type === 'channel') {
        return (
          creationDate !==
          this.fireService.currentChannel.messages[i - 1].creationDate
        );
      }
      if (type === 'pm') {
        return creationDate !== this.conversation.messages[i - 1].creationDate;
      }
      if (type === 'thread') {
        if (i === 0) {
          return true;
        }
        return creationDate !== this.thread[i - 1].creationDate;
      }
    }
    return false;
  }

  async openThread() {
    await this.homeNav.selectMessage(this.currentMessage);
  }

  openEmojiOnEdit() {
    this.emojiOpenedOnEdit = !this.emojiOpenedOnEdit;
  }

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

  existingEmojiOnThread(docReference) {
    docReference = this.fireService.getDocRef(
      'channels',
      this.fireService.currentChannel.id
    );
    this.fireService.currentChannel.messages[
      this.reactionsComponent.indexParentMessage()
    ].thread[this.reactionsComponent.indexMessageOnThread()] =
      this.currentMessage;
    this.reactionsComponent.updateDoc(
      docReference,
      this.fireService.currentChannel.messages
    );
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

  ifMentionExists(word, j, splitted) {
    let firstName;
    let lastName;
    let index;
    firstName = word;
    index = j;
    lastName = splitted[j + 1];

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
}
