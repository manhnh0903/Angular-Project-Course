import { Component, OnInit, inject } from '@angular/core';
import { Firestore, addDoc, doc, setDoc, updateDoc } from '@angular/fire/firestore';
import { FirestoreService } from 'src/app/services/firestore.service';
import { message } from 'src/app/classes/message.class';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-channels-chat',
  templateUrl: './channels-chat.component.html',
  styleUrls: ['./channels-chat.component.scss']
})
export class ChannelsChatComponent implements OnInit {
  firestore = inject(Firestore)
  constructor(public fireService: FirestoreService, public route: ActivatedRoute) {
    this.message = new message();
  }

  ngOnInit(): void {
    this.channelId = this.route.snapshot.paramMap.get('id');
    console.log(this.channelId);

  }
  message
  channelId



  async addMessageToChannel() {
    await updateDoc(this.fireService.getSingleReferenceForDocument('channels', this.fireService.currentChannel.id), {
      messages=this.message.content

    })

  }


}
