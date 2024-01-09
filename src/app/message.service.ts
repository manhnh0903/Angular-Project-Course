import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Message } from './classes/message.class';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  isMobile: boolean;
  public contentContainer
  constructor(private breakpointObserver: BreakpointObserver) {
  }


  observeIfMobile() {
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
      thread: message.thread,
    };
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


  checkMentions(splitted, user) {
    for (let j = 0; j < splitted.length; j++) {
      let word = splitted[j];
      let wordWithoutMention = word.substring(1);
      if (this.checkIfMentionExists(wordWithoutMention, splitted, j, user)) {
        this.ifMentionExists(word, j, splitted);
        this.assignToHTML(splitted);
      }
    }
  }


  assignToHTML(splitted) {
    let result = splitted.join(' ');
    this.contentContainer.nativeElement.innerHTML = result;
  }
  
}
