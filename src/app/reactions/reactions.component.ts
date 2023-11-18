import { Component, Input, inject } from '@angular/core';
import { Firestore, updateDoc } from '@angular/fire/firestore';
import { FirestoreService } from '../services/firestore.service';
import { Reaction } from '../classes/reaction.class';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.scss']
})
export class ReactionsComponent {
  firestore = inject(Firestore)
  constructor(public fireService: FirestoreService) { }
  emojiOpened = false
  @Input() currentMessage
  reactions = []
  emoji


  openEmoji() {
    if (this.emojiOpened === false) {
      this.emojiOpened = true
    } else {
      this.emojiOpened = false
    }
  }


  async addEmoji(event) {

    const docReference = this.fireService.getDocRef('channels', this.fireService.currentChannel.id);
    this.emoji = new Reaction({
      id: event.emoji.id,
      name: event.emoji.name,
      colons: event.emoji.colons,
      text: event.emoji.text,
      emoticons: event.emoji.emoticons,
      skin: event.emoji.skin,
      native: event.emoji.native
    })
    this.reactions.push(this.emoji.toJSON())
    this.currentMessage.reactions = this.reactions

    await updateDoc(docReference, {
      messages: this.fireService.messages
    });
  }
}
