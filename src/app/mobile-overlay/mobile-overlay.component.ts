import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-mobile-overlay',
  templateUrl: './mobile-overlay.component.html',
  styleUrls: ['./mobile-overlay.component.scss'],
})
export class MobileOverlayComponent {
  @Output() closeOverlayEvent = new EventEmitter<void>();

  closeOverlay() {
    this.closeOverlayEvent.emit();
  }
}
