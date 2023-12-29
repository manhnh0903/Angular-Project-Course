import { Component, ElementRef, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import {
  MAT_CHECKBOX_DEFAULT_OPTIONS,
  MatCheckboxDefaultOptions,
} from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { Channel } from 'src/app/classes/channel.class';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-people-to-channel',
  templateUrl: './people-to-channel.component.html',
  styleUrls: ['./people-to-channel.component.scss'],
  providers: [
    {
      provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
      useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions,
    },
  ],
})
export class PeopleToChannelComponent {
  firestore = inject(Firestore);
  allPeopleIsChecked = true;
  certainPeopleisChecked = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  currentChannel = new Channel();
  filteredUsers = [];
  usersName;
  selectedUsers = [];
  usersToAddOpen = false;
  constructor(
    private router: Router,
    private el: ElementRef,
    public fireService: FirestoreService
  ) {}

  toggleUsersToAdd() {
    this.usersToAddOpen = !this.usersToAddOpen;
  }

  checkAllPeople() {
    this.allPeopleIsChecked = true;
    this.certainPeopleisChecked = false;
  }

  checkCertainPeople() {
    this.certainPeopleisChecked = true;
    this.allPeopleIsChecked = false;
  }

  getUsersRef() {
    return collection(this.firestore, 'users');
  }

  getChannelsRef() {
    return collection(this.firestore, 'channels');
  }

  async addChannelToCollection() {
    if (this.fireService.channels.length === 0) {
      this.currentChannel.index = 0;
    } else {
      this.currentChannel.index =
        this.fireService.channels[this.fireService.channels.length - 1].index +
        1;
    }

    await this.addUsers();
    let createdChannel = await addDoc(
      this.getChannelsRef(),
      this.currentChannel.toJSON()
    );
    const createdChannelRef = doc(
      this.firestore,
      'channels',
      createdChannel.id
    );
    await updateDoc(createdChannelRef, {
      id: createdChannel.id,
    });
    this.fireService.readChannels();
  }

  async addUsers() {
    if (this.allPeopleIsChecked) {
      this.currentChannel.users = this.fireService.allUsers;
    } else {
      this.currentChannel.users = this.selectedUsers;
    }
  }

  async showFilteredUsers() {
    this.usersToAddOpen = true;
    this.filteredUsers = this.fireService.allUsers.filter((user) => {
      return user.name.toLowerCase().includes(this.usersName.toLowerCase());
    });
  }

  addToSelectedUsers(filteredUser) {
    if (!this.selectedUsers.includes(filteredUser)) {
      this.selectedUsers.push(filteredUser);
    }
    this.usersToAddOpen = false;
  }
}
