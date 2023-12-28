import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CursorPositionService {
  constructor() {}

  /**
   * Gets the current cursor position within an HTML input element.
   * @param inputElement - The HTML input element from which to retrieve the cursor position.
   * @returns The current cursor position, or 0 if not available.
   */
  getCursorPosition(inputElement: HTMLInputElement) {
    const cursorPosition = inputElement?.selectionStart ?? 0;
    return cursorPosition;
  }

  /**
   * Sets the cursor position within an HTML input element.
   * @param inputElement - The HTML input element where the cursor position will be set.
   * @param position - The position to set the cursor to.
   */
  setCursorPosition(inputElement: HTMLInputElement, position: number) {
    inputElement.setSelectionRange(position, position);
  }

  /**
   * Inserts an emoji at the cursor position within the current message in an HTML input element.
   * @param currentMessage - The current message content.
   * @param inputElement - The HTML input element where the emoji will be inserted.
   * @param event - The event containing information about the inserted emoji.
   * @returns An array representing the modified message after inserting the emoji.
   */
  insertEmojiOnCursor(currentMessage, inputElement, event) {
    const cursorPosition = this.getCursorPosition(inputElement);
    const messageArray = currentMessage.split('');
    messageArray.splice(cursorPosition, 0, event.emoji.native);
    return messageArray;
  }
}
