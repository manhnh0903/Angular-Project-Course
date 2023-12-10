import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FirestoreService } from '../services/firestore.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.scss']
})
export class EditChannelComponent {
  nameExists = false
  public editName = false
  public editDescript = false
  constructor(private formBuilder: FormBuilder, public fireService: FirestoreService, public dialog: MatDialog,) { }
  channelsForm = this.formBuilder.group({
    channelsName: ['', Validators.required],
    channelsDescription: [''],
  });


  checkIfNameExists() {
    let channelToModifyIndex = this.fireService.channels.findIndex(channel => channel.name.toLowerCase() === this.channelsForm.get('channelsName').value.toLowerCase());
    if (channelToModifyIndex !== -1) {
      this.nameExists = true
    } else {
      this.nameExists = false
    }
  }


  onSubmit() {

  }

  openEditName() {
    this.editName = true
  }


  openEditDescript() {
    this.editDescript = true
  }
}
