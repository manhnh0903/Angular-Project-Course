import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CursorPositionService {

  constructor() { }
  getCursorPosition(inputElement: HTMLInputElement) {
    const cursorPosition = inputElement?.selectionStart ?? 0;
    return cursorPosition;
  }

  setCursorPosition(inputElement: HTMLInputElement, position: number) {
    inputElement.setSelectionRange(position, position);
}


  insertEmojiOnCursor(currentMessage, inputElement, event) {
    const cursorPosition = this.getCursorPosition(inputElement);
    const messageArray = currentMessage.split('');
    messageArray.splice(cursorPosition, 0, event.emoji.native);
    return messageArray
  }
}
