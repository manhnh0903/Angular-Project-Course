import { Component, Input, inject } from '@angular/core';
import { Reaction } from 'src/app/classes/reaction.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  constructor(public fireService: FirestoreService, private userService: UserService) {

  }
  firestore = inject(Firestore)
  @Input() sender: string;
  @Input() profileImg: string;
  @Input() content: string;
  @Input() thread: [];
  @Input() reactions: Reaction[];
  @Input() creationDate: string;
  @Input() creationDay: string;
  @Input() creationTime: number;
  @Input() id: number;
  @Input() index: number;
  @Input() currentMessage: {};
  @Input() collectionId;
  @Input() conversation;
  @Input() type: 'channel' | 'pm'
  public onRightSide: boolean
  public editMessage = false
  private openEdit = false



  openEditMessageDiv(event: { editMessage: boolean, openEdit: boolean }) {
    if (this.editMessage && this.openEdit) {
      this.editMessage = false;
      this.openEdit = false;
    } else {
      this.editMessage = true;
      this.openEdit = true;
    }
  }


  getSide(index: number): boolean {
    let isEven = index % 2 === 0;
    this.onRightSide = !isEven;
    return !isEven;
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
    this.editMessage = !this.editMessage
  }


  getNewContent(newContent: string) {
    this.content = newContent;
  }


  async updateMessageContent() {
    let messageToUpdate
    let docRef
    ({ messageToUpdate, docRef } = this.checkForChannels(messageToUpdate, docRef));
    ({ messageToUpdate, docRef } = this.checkForPMs(messageToUpdate, docRef));
    messageToUpdate.content = this.content
    this.saveUpdatedInFirestore(docRef, messageToUpdate)
  }


  checkForChannels(messageToUpdate, docRef) {
    if (this.type === 'channel') {
      messageToUpdate = this.fireService.currentChannel.messages[this.index]
      docRef = doc(this.firestore, 'channels', this.fireService.currentChannel.id);
    }
    return { messageToUpdate, docRef };
  }


  checkForPMs(messageToUpdate, docRef) {
    if (this.type === 'pm') {
      messageToUpdate = this.conversation.messages[this.index]
      docRef = doc(this.firestore, 'pms', this.collectionId)
    }
    return { messageToUpdate, docRef };
  }


  async saveUpdatedInFirestore(docRef, messageToUpdate) {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const messages = docSnap.data()['messages'] || [];
      const indexOfMessageToUpdate = messages.findIndex(message => message.id === messageToUpdate.id);
      messages[indexOfMessageToUpdate].content = messageToUpdate.content;
      await updateDoc(docRef, { messages });
      this.closeEdit()
    }
  }


  getReactionsPeople(emoji) {
    let names = []
    emoji.userIDs.forEach(id => {
      let index = this.fireService.allUsers.findIndex(user => user.userId === id)
      if (index !== -1) {
        if (id === this.userService.user.userId) {
          names.push('Du')
        } else {
          names.push(this.fireService.allUsers[index].name)
        }
      }
    })

    return names
  }

  isDifferentDate(creationDate, i: number, type): boolean {
    
    if (type === 'channel')
      if (creationDate && i >=0) {
        console.log(this.fireService.currentChannel.messages);
        if (i === this.fireService.currentChannel.messages.length - 1) { return true }
        return creationDate !== this.fireService.currentChannel.messages[i + 1].creationDate;
      }
    if (type === 'pm') {
      if (creationDate && i >= 0) {
        console.log(this.conversation.messages);
        if (i === this.conversation.messages.length - 1) { return true }
        return creationDate !== this.conversation.messages[i + 1].creationDate;
      }
    }
    return true;
  }

}
