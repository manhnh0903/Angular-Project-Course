import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CursorPositionService {

  constructor() { }
  getCursorPosition(inputElement: HTMLInputElement) {
    const cursorPosition = inputElement?.selectionStart ?? 0;
    console.log(cursorPosition);
    return cursorPosition;
  }


  insertEmojiOnCursor(currentMessage,inputElement,event) {
    const cursorPosition = this.getCursorPosition(inputElement);
    const messageArray = currentMessage.split('');
    messageArray.splice(cursorPosition, 0, event.emoji.native);
    const updatedMessage = messageArray.join('');
  }
}
