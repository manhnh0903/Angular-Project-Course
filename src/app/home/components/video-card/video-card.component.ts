import { Component, Input } from '@angular/core';
import { Video } from '../../../models/video.model';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [],
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.scss',
})
export class VideoCardComponent {
  @Input() video?: Video;
}
