import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DabubbleUser } from 'src/app/classes/user.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-pm-chat',
  templateUrl: './pm-chat.component.html',
  styleUrls: ['./pm-chat.component.scss'],
})
export class PmChatComponent {
  sendMessageForm: FormGroup;
  public recipient: DabubbleUser;
  unsubRecipient;

  constructor(
    private fb: FormBuilder,
    public firestoreService: FirestoreService,
    private navService: HomeNavigationService,
    private userService: UserService
  ) {
    this.sendMessageForm = this.fb.group({
      message: ['', [Validators.required]],
    });
  }

  ngOnDestroy() {}

  get message() {
    return this.sendMessageForm.get('message');
  }

  openUserDetails() {
    console.log('Test Log', this.navService.pmRecipient);
  }

  sendPm() {
    console.log(this.sendMessageForm.value.message);
  }
}
