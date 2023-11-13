import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PeopleToChannelComponent } from '../people-to-channel/people-to-channel.component';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Channel } from 'src/app/classes/channel.class';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss'],
  styles: [`
  :host {
    border-radius: 50%;
  }
`]
})
export class CreateChannelComponent {
  constructor(public dialog: MatDialog) { }
  firestore = inject(Firestore)
  channel = new Channel()




  getCollectionRef() {
    return collection(this.firestore, 'channels')
  }


  openPeopleToChannelDialog(): void {
    const dialog = this.dialog.open(PeopleToChannelComponent, {
      height: '400px',
      width: '600px',
      panelClass: 'createChannelDialog'
    });
    dialog.componentInstance.currentChannel = new Channel(this.channel.toJSON())

  }




}
