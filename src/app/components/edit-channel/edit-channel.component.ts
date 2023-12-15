import { ChangeDetectionStrategy,  Component, inject } from '@angular/core';
import {  FormControl, Validators } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';
import { MatDialog } from '@angular/material/dialog';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class EditChannelComponent {
  nameExists = false
  public editName = false
  public editDescript = false
  channelsName = new FormControl('', Validators.required);
  channelsDescription = new FormControl('');
  firestore = inject(Firestore);
  constructor(public fireService: FirestoreService, public dialog: MatDialog, private userService: UserService) { }


/*   async ngOnInit() {
    await this.fireService.readChannels()
  } */
  checkIfNameExists() {
    let channelToModifyIndex = this.fireService.channels.findIndex(channel => channel.name.toLowerCase() === this.channelsName.value.toLowerCase());
    if (channelToModifyIndex !== -1) {
      this.nameExists = true
    } else {
      this.nameExists = false
    }
  }

  async updateName() {
    await this.updateChannel('name', this.channelsName.value)
    this.editName = false

  }



  async updateDescript() {
    await this.updateChannel('description', this.channelsDescription.value)
    this.editDescript = false

  }


  openEditName() {
    this.editName = true
  }


  openEditDescript() {
    this.editDescript = true
  }


  async updateChannel(key, value) {
    const channelsRef = doc(this.firestore, 'channels', this.fireService.currentChannel.id);
    await updateDoc(channelsRef, {
      [key]: value
    });

  }


  async leaveChannel() {
    let usersIndex = this.fireService.currentChannel.users.findIndex(user => user.userId === this.userService.user.userId)
    this.fireService.currentChannel.users.splice(usersIndex, 1)
    await this.updateChannel('users', this.fireService.currentChannel.users)
    /*  this.fireService.readChannels() */
  }
}
