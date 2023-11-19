import { Component, Input, inject } from '@angular/core';
import { Firestore, loadBundle, updateDoc } from '@angular/fire/firestore';
import { FirestoreService } from '../services/firestore.service';
import { Reaction } from '../classes/reaction.class';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.scss']
})
export class ReactionsComponent {
  firestore = inject(Firestore)
  constructor(public fireService: FirestoreService, public userService: UserService) { }
  emojiOpened = false
  @Input() currentMessage
  emoji
  emojiAlreadyGiven = {}

  openEmoji() {
    if (this.emojiOpened === false) {
      this.emojiOpened = true
    } else {
      this.emojiOpened = false
    }
  }


  async addEmoji(event) {
    const docReference = this.fireService.getDocRef('channels', this.fireService.currentChannel.id);
    this.createEmoji(event)
    let indexOfEmoji = this.currentMessage.reactions.findIndex(reaction => reaction.id === this.emoji.id);//I check if the selected emoji already exists on the message
    let indexOfCurrentMessage = this.fireService.messages.indexOf(this.currentMessage);//to find the message to change
    let newIndexOfEmoji//to find the index of freshly added emoji
    this.checkForEmoji(indexOfEmoji, newIndexOfEmoji)
    this.fireService.messages[indexOfCurrentMessage] = this.currentMessage;//I change the selected message
    await updateDoc(docReference, {
      messages: this.fireService.messages
    });
  }


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

    })
  }


  checkForEmoji(indexOfEmoji, newIndexOfEmoji) {
    if (indexOfEmoji === -1) {
      this.ifEmojiIsNotOnMessage(newIndexOfEmoji)
      this.currentMessage.reactions[indexOfEmoji].userIDs.push(this.userService.user.userId)
    } else if (this.currentMessage.reactions[indexOfEmoji].counter !== 0) {

      if (this.checkForUsersIdForEmoji(indexOfEmoji))
        this.currentMessage.reactions[indexOfEmoji].userIDs.push(this.userService.user.userId)
      if (this.currentMessage.reactions[indexOfEmoji].userId !== this.userService.user.userId) {
        this.increaseCounterOfExistingEmoji(indexOfEmoji)
      } else {
        this.decreaseCounterOfExistingEmoji(indexOfEmoji)
        if (this.currentMessage.reactions[indexOfEmoji].counter === 0)
          this.removeEmojiIfCounter0(indexOfEmoji)
      }
    }
  }


  ifEmojiIsNotOnMessage(newIndexOfEmoji) {
    this.currentMessage.reactions.push(this.emoji.toJSON());
    newIndexOfEmoji = this.currentMessage.reactions.findIndex(reaction => reaction.id === this.emoji.id)
  }


  increaseCounterOfExistingEmoji(indexOfEmoji) {
    return this.currentMessage.reactions[indexOfEmoji].counter++;
  }


  decreaseCounterOfExistingEmoji(indexOfEmoji) {
    return this.currentMessage.reactions[indexOfEmoji].counter--;
  }


  removeEmojiIfCounter0(indexOfEmoji) {
    this.currentMessage.reactions.splice(indexOfEmoji, 1)
  }


  checkForUsersIdForEmoji(indexOfEmoji) {
    return this.currentMessage.reactions[indexOfEmoji].userIDs.findIndex(userID => userID === this.userService.user.userId)
  }


}


