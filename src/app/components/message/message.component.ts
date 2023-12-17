import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { Reaction } from 'src/app/classes/reaction.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { UserService } from 'src/app/services/user.service';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';
import { ReactionsComponent } from '../reactions/reactions.component';
import { CursorPositionService } from 'src/app/services/cursor-position.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  z: any;
  constructor(
    public fireService: FirestoreService,
    private userService: UserService,
    private homeNav: HomeNavigationService,
    public cursorService: CursorPositionService
  ) { }
  firestore = inject(Firestore);
  @Input() sender: string;
  @Input() profileImg: string;
  @Input() content: string;
  @Input() thread
  @Input() reactions: Reaction[];
  @Input() creationDate: string;
  @Input() creationDay: string;
  @Input() creationTime: number;
  @Input() id: number;
  @Input() index: number;
  @Input() currentMessage: {};
  @Input() collectionId;
  @Input() conversation;
  @Input() type: 'channel' | 'pm' | 'thread';
  @ViewChild('inputEditMessage') inputEditMessage: ElementRef<HTMLInputElement>;

  public onRightSide: boolean;
  public editMessage = false;
  private openEdit = false;
  public emojiOpenedOnEdit = false;

  openEditMessageDiv(event: { editMessage: boolean; openEdit: boolean }) {
    if (this.editMessage && this.openEdit) {
      this.editMessage = false;
      this.openEdit = false;
    } else {
      this.editMessage = true;
      this.openEdit = true;
    }
  }

  isYou = false
  getSide(sender: string): boolean {
    if (sender === this.userService.user.name) {
      this.isYou = true
      return true
    } else {
      return false
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
    let messageToUpdate;
    let docRef;
    ({ messageToUpdate, docRef } = this.checkForChannels(
      messageToUpdate,
      docRef
    ));
    ({ messageToUpdate, docRef } = this.checkForPMs(messageToUpdate, docRef));
    messageToUpdate.content = this.content;
    this.saveUpdatedInFirestore(docRef, messageToUpdate);
  }

  checkForChannels(messageToUpdate, docRef) {
    if (this.type === 'channel') {
      messageToUpdate = this.fireService.currentChannel.messages[this.index];
      docRef = doc(
        this.firestore,
        'channels',
        this.fireService.currentChannel.id
      );
    }
    return { messageToUpdate, docRef };
  }

  checkForPMs(messageToUpdate, docRef) {
    if (this.type === 'pm') {
      messageToUpdate = this.conversation.messages[this.index];
      docRef = doc(this.firestore, 'pms', this.collectionId);
    }
    return { messageToUpdate, docRef };
  }

  async saveUpdatedInFirestore(docRef, messageToUpdate) {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const messages = docSnap.data()['messages'] || [];
      const indexOfMessageToUpdate = messages.findIndex(
        (message) => message.id === messageToUpdate.id
      );
      messages[indexOfMessageToUpdate].content = messageToUpdate.content;
      await updateDoc(docRef, { messages });
      this.closeEdit();
    }
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
   console.log(i) 
    if (i === 0) { return true }
    if ((creationDate && i > 0) || type === 'thread') {
      if (type === 'channel') {
        return creationDate !== this.fireService.currentChannel.messages[i - 1].creationDate
      }
      if (type === 'pm') {
        return creationDate !== this.conversation.messages[i - 1].creationDate
      }
      if (type === 'thread') {
   if (i === 0) { return true }


        return creationDate !== this.thread[i - 1].creationDate
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
    this.content = updatedMessage
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

  @ViewChild(ReactionsComponent, { static: false }) reactionsComponent: ReactionsComponent;
  async addEmoji(indexOfEmoji, event) {
    let docReference;
    if (this.checkForUsersIdForEmoji(indexOfEmoji) === -1) {
      this.increaseCounterOfExistingEmoji(indexOfEmoji);
      this.reactionsComponent.currentMessage.reactions[indexOfEmoji].userIDs.push(
        this.userService.user.userId
      );
    } else {
      this.reactionsComponent.currentMessage.reactions[indexOfEmoji].userIDs.splice(
        this.checkForUsersIdForEmoji(indexOfEmoji),
        1
      );
      this.decreaseCounterOfExistingEmoji(indexOfEmoji);
      if (this.reactionsComponent.currentMessage.reactions[indexOfEmoji].counter === 0)
        this.removeEmojiIfCounter0(indexOfEmoji);
    }
    docReference = this.fireService.getDocRef(
      'channels',
      this.fireService.currentChannel.id
    );
    await updateDoc(docReference, {
      messages: this.fireService.currentChannel.messages,
    });
  }


  increaseCounterOfExistingEmoji(indexOfEmoji) {
    return this.reactionsComponent.currentMessage.reactions[indexOfEmoji].counter++;
  }


  decreaseCounterOfExistingEmoji(indexOfEmoji) {
    return this.reactionsComponent.currentMessage.reactions[indexOfEmoji].counter--;
  }

  removeEmojiIfCounter0(indexOfEmoji) {
    this.reactionsComponent.currentMessage.reactions.splice(indexOfEmoji, 1);
  }

  checkForUsersIdForEmoji(indexOfEmoji) {
    return this.reactionsComponent.currentMessage.reactions[indexOfEmoji].userIDs.findIndex(
      (id) => id === this.userService.user.userId
    );
  }


}
