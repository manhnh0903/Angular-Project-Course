import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-mobile-overlay',
  templateUrl: './mobile-overlay.component.html',
  styleUrls: ['./mobile-overlay.component.scss'],
})
export class MobileOverlayComponent {
  @Output() closeOverlayEvent = new EventEmitter<void>();

  /**
   * Emits an event to request the closure of an overlay.
   * It triggers the 'closeOverlayEvent' EventEmitter to signal that an overlay should be closed.
   */
  closeOverlay() {
    this.closeOverlayEvent.emit();
  }
}
