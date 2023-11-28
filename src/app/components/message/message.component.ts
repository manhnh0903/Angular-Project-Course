import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  @Input() sender: string;
  @Input() profileImg: string;
  @Input() content: string;
  @Input() thread: string;
  @Input() reactions: [];
  @Input() creationDate: number;
  @Input() id: number;
}
