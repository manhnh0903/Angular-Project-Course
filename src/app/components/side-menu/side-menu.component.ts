import { AfterViewInit, Component, Input, NgZone, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateChannelComponent } from '../create-channel/create-channel.component';
import { FirestoreService } from 'src/app/services/firestore.service';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';
import { onSnapshot, query } from '@angular/fire/firestore';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public fireService: FirestoreService,
    private navService: HomeNavigationService,
  ) {

  }
  async ngOnInit() {
    await this.ifChangesOnChannels();
  }

  channelsClicked = true;
  PMclicked = true;



  openChannels() {
    if (this.channelsClicked == false) {
      this.channelsClicked = true;
    } else {
      this.channelsClicked = false;
    }
  }

  async openChanelChat(id: string) {
    await this.fireService.getCurrentChannel('channels', id);
    this.fireService.getCurrentDate();
    this.navService.setChatPath('chanel');
  }

  openPM() {
    if (this.PMclicked == false) {
      this.PMclicked = true;
    } else {
      this.PMclicked = false;
    }
  }

  openCreateChannelDialog(): void {
    const dialogRef = this.dialog.open(CreateChannelComponent, {
      height: '400px',
      width: '600px',
      panelClass: 'createChannelDialog',
    });
  }

  openPmChat(userId: string) {
    this.navService.pmRecipient = userId;
    this.navService.setChatPath('pm');
    this.fireService.subscribeToPmRecipient(userId);
  }


  async ifChangesOnChannels() {
    const q = query(this.fireService.getColRef('channels'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const channelData = change.doc.data();
        let channelToModifyIndex = this.fireService.channels.findIndex(
          (channel) => channel.name === channelData['name']
        );

        if (change.type === 'added') {
          if (channelToModifyIndex === -1) {
            this.fireService.channels.push(channelData);
          }
        }

        if (change.type === 'modified') {
          if (channelToModifyIndex !== -1) {
            this.fireService.channels[channelToModifyIndex] = channelData;
          }
        }

        if (change.type === 'removed') {
          if (channelToModifyIndex !== -1) {
            this.fireService.channels.splice(channelToModifyIndex, 1);
          }
        }
      });
      this.fireService.defaultChannel();

    })
  }

}
