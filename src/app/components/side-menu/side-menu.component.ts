import { Component, Input, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateChannelComponent } from '../create-channel/create-channel.component';
import { Firestore, collection, onSnapshot, query } from '@angular/fire/firestore';
import { FirestoreService } from 'src/app/services/firestore.service';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {
  constructor(public dialog: MatDialog, public fireService: FirestoreService) {

  }
  firestore = inject(Firestore)

  channelsClicked = true
  PMclicked = true
  @Input() channels



  openChannels() {
    if (this.channelsClicked == false) {
      this.channelsClicked = true
    } else {
      this.channelsClicked = false
    }
  }


  openPM() {
    if (this.PMclicked == false) {
      this.PMclicked = true
    } else {
      this.PMclicked = false
    }
  }


  openCreateChannelDialog(): void {
    const dialogRef = this.dialog.open(CreateChannelComponent, {
      height: '400px',
      width: '600px',
      panelClass: 'createChannelDialog'
    });
  }


}
