import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-message-add',
  templateUrl: './message-add.component.html',
  styleUrls: ['./message-add.component.css'],
})
export class MessageAddComponent implements OnInit {
  constructor(private messageService: MessageService) {}

  ngOnInit(): void {}
  
  addMsg(newMsg: string) {
    this.messageService.sendMessage(newMsg);
  }
}
