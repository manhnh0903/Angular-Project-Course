import { Component, Input, OnInit, inject } from '@angular/core';
import { Firestore, addDoc, arrayUnion, doc, onSnapshot, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Message } from 'src/app/classes/message.class';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-channels-chat',
  templateUrl: './channels-chat.component.html',
  styleUrls: ['./channels-chat.component.scss']
})
export class ChannelsChatComponent {
  firestore = inject(Firestore)
  constructor(public fireService: FirestoreService, public route: ActivatedRoute) {
  }
  messages
  message
  channelId
  content


  async addMessageToChannel() {
    const docReference = this.fireService.getDocRef('channels', this.fireService.currentChannel.id);
    this.message = new Message({
      sender: this.fireService.currentChannel.users[0].name,
      profileImg: this.fireService.currentChannel.users[0].profileImg,
      content: this.content,
      thread: '',
    });
    this.fireService.messages.push(this.message.toJSON())
    await updateDoc(docReference, {
      messages: this.fireService.messages,
    });
  }

}





