import { Component, Input } from '@angular/core';
import { Reaction } from 'src/app/classes/reaction.class';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  constructor(public fireService: FirestoreService) {

  }
  @Input() sender: string;
  @Input() profileImg: string;
  @Input() content: string;
  @Input() thread: string;
  @Input() reactions: Reaction[];
  @Input() creationDate: string;
  @Input() creationTime: number;
  @Input() id: number;
  @Input() type: 'private' | 'channel' = 'private';
  @Input() index: number
  @Input() currentMessage: {};
  onRightSide


  getSide(index: number): boolean {
    let isEven = index % 2 === 0;
    this.onRightSide = !isEven;

    return !isEven;
  }
}
