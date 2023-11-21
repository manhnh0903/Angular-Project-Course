import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-pm-chat',
  templateUrl: './pm-chat.component.html',
  styleUrls: ['./pm-chat.component.scss'],
})
export class PmChatComponent {
  sendMessageForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public firestoreService: FirestoreService,
    private userService: UserService
  ) {
    this.sendMessageForm = this.fb.group({
      message: ['', [Validators.required]],
    });
  }

  get message() {
    return this.sendMessageForm.get('message');
  }

  openUserDetails() {
    console.log('Test Log');
  }

  sendPm() {
    console.log(this.sendMessageForm.value.message);
  }
}
