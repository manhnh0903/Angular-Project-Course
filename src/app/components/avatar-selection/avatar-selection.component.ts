import { Component } from '@angular/core';

@Component({
  selector: 'app-avatar-selection',
  templateUrl: './avatar-selection.component.html',
  styleUrls: ['./avatar-selection.component.scss'],
})
export class AvatarSelectionComponent {
  profilePictures: string[] = [
    '0character.png',
    '1character.png',
    '2character.png',
    '3character.png',
    '4character.png',
    '5character.png',
  ];
}
