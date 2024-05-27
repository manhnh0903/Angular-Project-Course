import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Video } from '../../../models/video.model';

@Component({
  selector: 'app-video-player-overlay',
  standalone: true,
  imports: [],
  templateUrl: './video-player-overlay.component.html',
  styleUrl: './video-player-overlay.component.scss',
})
export class VideoPlayerOverlayComponent {
  @Input() video!: Video;
  @Output() close = new EventEmitter<void>();

  closeOverlay() {
    this.close.emit();
  }
}
