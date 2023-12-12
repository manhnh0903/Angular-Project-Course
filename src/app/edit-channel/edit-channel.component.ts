import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FirestoreService } from '../services/firestore.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
@Component({
  selector: 'app-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.scss']
})
export class EditChannelComponent {
  nameExists = false
  public editName = false
  public editDescript = false
  channelsName = new FormControl('', Validators.required);
  channelsDescription = new FormControl('');
  firestore = inject(Firestore);
  constructor(public fireService: FirestoreService, public dialog: MatDialog,) { }



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
    this.fireService.readChannels()
    this.editName = false
  }



  async updateDescript() {
    await this.updateChannel('description', this.channelsDescription.value)
    this.fireService.readChannels()
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
}
