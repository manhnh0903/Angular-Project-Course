import { Component, Input,  ViewChild } from '@angular/core';
import { Reaction } from 'src/app/classes/reaction.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ReactionsComponent } from '../reactions/reactions.component';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  constructor(public fireService: FirestoreService) { }
  
  @Input() sender: string;
  @Input() profileImg: string;
  @Input() content: string;
  @Input() thread: [];
  @Input() reactions: Reaction[];
  @Input() creationDate: string;
  @Input() creationDay: string;
  @Input() creationTime: number;
  @Input() id: number;

  @Input() index: number;
  @Input() currentMessage: {};
  onRightSide: boolean
  @ViewChild(ReactionsComponent) reactionsComponent: ReactionsComponent;

  getSide(index: number): boolean {
    let isEven = index % 2 === 0;
    this.onRightSide = !isEven;

    return !isEven;
  }

  getLastReplyTime(): string {
    if (this.thread.length > 0) {
      const lastReply = this.thread[this.thread.length - 1];

      const lastReplyTime = lastReply['creationTime'];

      return lastReplyTime;
    } else {
      return '';
    }
  }


  closeEdit() {
    this.reactionsComponent.editMessage = false
    this.reactionsComponent.openEdit = false
  }

  
}



