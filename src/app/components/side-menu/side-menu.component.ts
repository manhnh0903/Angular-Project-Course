import { AfterViewInit, Component, Input, NgZone, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateChannelComponent } from '../create-channel/create-channel.component';
import { FirestoreService } from 'src/app/services/firestore.service';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';
import { onSnapshot, query } from '@angular/fire/firestore';
import { UserService } from 'src/app/services/user.service';

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
    private userService: UserService
  ) {

  }
  async ngOnInit() {

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


}


