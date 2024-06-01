import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
})
export class MessageListComponent implements OnInit {
  messages: any[] = [];
  subscription: Subscription;

  constructor(private messageService: MessageService) {
    this.subscription = new Subscription();
  }
  ngOnInit() {
    // subscribe to messages subject-observable
    this.subscription = this.messageService
      .getMessage()
      .subscribe((message) => {
        if (message) {
          this.messages.push(message);
        } else {
          // clear messages when empty message received
          this.messages = [];
        }
      });
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
