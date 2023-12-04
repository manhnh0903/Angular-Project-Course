import { Component, Input, ViewChild, inject } from '@angular/core';
import { Reaction } from 'src/app/classes/reaction.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ReactionsComponent } from '../reactions/reactions.component';
import { Firestore, doc, getDoc, onSnapshot, updateDoc } from '@angular/fire/firestore';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  constructor(public fireService: FirestoreService,) {

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
  onRightSide: boolean
  editMessage = false
  openEdit = false

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
    console.log('this.editMessage:', this.editMessage);
  }


  getNewContent(newContent: string) {
    this.content = newContent;
  }


  async updateMessageContent() {

    let messageToUpdate = this.fireService.sorted[this.index]
    messageToUpdate.content = this.content
    const docRef = doc(this.firestore, 'channels', this.fireService.currentChannel.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const messages = docSnap.data()['messages'] || [];
      const indexOfMessageToUpdate = messages.findIndex(message => message.id === messageToUpdate.id);
      messages[indexOfMessageToUpdate].content = messageToUpdate.content;
      await updateDoc(docRef, { messages });
    }
  }


}

