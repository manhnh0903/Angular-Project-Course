import { Component, ElementRef, HostListener, Input, inject } from '@angular/core';
import { Firestore, loadBundle, updateDoc } from '@angular/fire/firestore';
import { FirestoreService } from '../../services/firestore.service';
import { Reaction } from '../../classes/reaction.class';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.scss']
})
export class ReactionsComponent {
  firestore = inject(Firestore)
  constructor(public fireService: FirestoreService, public userService: UserService, private el: ElementRef) { }
  emojiOpened = false
  @Input() currentMessage
  @Input() index
  emoji


  openEmoji() {

    if (this.emojiOpened === false) {
      this.emojiOpened = true
    } else {
      this.emojiOpened = false
    }
    this.heightCounter()

  }


  async addEmoji(event) {
    let indexOfCurrentMessage = this.fireService.currentChannel.messages.findIndex(message => message.id === this.currentMessage.id);//to find the message to change
    const docReference = this.fireService.getDocRef('channels', this.fireService.currentChannel.id);
    this.createEmoji(event)
    let indexOfEmoji = this.currentMessage.reactions.findIndex(reaction => reaction.id === this.emoji.id);//I check if the selected emoji already exists on the message
    this.checkForEmoji(indexOfEmoji)
    this.fireService.currentChannel.messages[indexOfCurrentMessage] = this.currentMessage;//I change the selected message
    await updateDoc(docReference, {
      messages: this.fireService.currentChannel.messages
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


  checkForEmoji(indexOfEmoji) {
    if (indexOfEmoji === -1) {
      this.ifEmojiIsNotOnMessage(indexOfEmoji)
    } else if (this.currentMessage.reactions[indexOfEmoji].counter !== 0) {
      this.ifEmojiIsOnMessage(indexOfEmoji)
    }
  }


  ifEmojiIsNotOnMessage(indexOfEmoji) {
    this.currentMessage.reactions.push(this.emoji.toJSON());
    indexOfEmoji = this.currentMessage.reactions.findIndex(reaction => reaction.id === this.emoji.id)
    this.currentMessage.reactions[indexOfEmoji].userIDs.push(this.userService.user.userId)
  }


  ifEmojiIsOnMessage(indexOfEmoji) {
    if (this.checkForUsersIdForEmoji(indexOfEmoji) === -1) {
      this.increaseCounterOfExistingEmoji(indexOfEmoji)
      this.currentMessage.reactions[indexOfEmoji].userIDs.push(this.userService.user.userId)
    } else {
      this.currentMessage.reactions[indexOfEmoji].userIDs.splice(this.checkForUsersIdForEmoji(indexOfEmoji), 1)
      this.decreaseCounterOfExistingEmoji(indexOfEmoji)
      if (this.currentMessage.reactions[indexOfEmoji].counter === 0)
        this.removeEmojiIfCounter0(indexOfEmoji)
    }
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
    return this.currentMessage.reactions[indexOfEmoji].userIDs.findIndex(id => id === this.userService.user.userId)
  }


  heightCounter() {
    const innerHeight = window.innerHeight;
    const boundingBox = this.el.nativeElement.getBoundingClientRect();
    const distanceToTop = boundingBox.top;
    const distanceToBottom = innerHeight - boundingBox.bottom;

    console.log("Space from top to window top:", distanceToTop);
    console.log("Space from bottom to window bottom:", distanceToBottom);

    // Return the distances or any other condition you want to check
    return distanceToTop < distanceToBottom
  }


  /* getEmojiStyle() {

    const topValue = '500'; // Replace with the actual value for 'top'
    const bottomValue = '500'
    if (this.heightCounter()) {
      return {
        position: 'absolute',
        'top': 0,
        'z-index': 99999
      }
    } else {
      return {
        position: 'absolute',
        'bottom': 0,
        'z-index': 99999
      }
    }
  } */


}





