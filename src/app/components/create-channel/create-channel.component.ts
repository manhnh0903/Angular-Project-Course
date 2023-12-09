import { Component, ElementRef, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PeopleToChannelComponent } from '../people-to-channel/people-to-channel.component';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Channel } from 'src/app/classes/channel.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
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
  constructor(public dialog: MatDialog,
    public fireService: FirestoreService,
    public dialogRef: MatDialogRef<CreateChannelComponent>,
    private formBuilder: FormBuilder) {

  }
  firestore = inject(Firestore)
  channel = new Channel()
  nameExists = false

  channelsForm = this.formBuilder.group({
    channelsName: ['', Validators.required],
    channelsDescription: [''],
  });



  getCollectionRef() {
    return collection(this.firestore, 'channels')
  }


  openPeopleToChannelDialog(): void {
    this.channel.name = this.channelsForm.get('channelsName').value;
    this.channel.description = this.channelsForm.get('channelsDescription').value;
    let channelToModifyIndex = this.fireService.channels.findIndex(channel => channel.name === this.channel.name)
    if (channelToModifyIndex === -1) {
      const dialog = this.dialog.open(PeopleToChannelComponent, {
        height: '400px',
        width: '600px',
        panelClass: 'createChannelDialog'
      });
      dialog.componentInstance.currentChannel = new Channel(this.channel.toJSON())
      this.dialogRef.close()
    } else {
      this.nameExists = true
    }
  }

  checkIfNameExists() {
    let channelToModifyIndex = this.fireService.channels.findIndex(channel => channel.name.toLowerCase() === this.channelsForm.get('channelsName').value.toLowerCase());
    if (channelToModifyIndex !== -1) {
      this.nameExists = true
    } else {
      this.nameExists = false
    }
  }


  onSubmit() {

    this.openPeopleToChannelDialog();

  }
}
