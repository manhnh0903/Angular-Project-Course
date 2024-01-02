import { Component, inject } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Firestore,
  addDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import {
  MAT_CHECKBOX_DEFAULT_OPTIONS,
  MatCheckboxDefaultOptions,
} from '@angular/material/checkbox';

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
  usersName: string;
  selectedUsers = [];
  usersToAddOpen = false;

  constructor(public fireService: FirestoreService) { }

  /**
   * Toggles the state of usersToAddOpen.
   */
  toggleUsersToAdd() {
    this.usersToAddOpen = !this.usersToAddOpen;
  }

  /**
   * Checks all people, unchecking certain people.
   */
  checkAllPeople() {
    this.allPeopleIsChecked = true;
    this.certainPeopleisChecked = false;
  }

  /**
   * Checks certain people, unchecking all people.
   */
  checkCertainPeople() {
    this.certainPeopleisChecked = true;
    this.allPeopleIsChecked = false;
  }

  /**
   * Returns a reference to the 'users' collection.
   *
   * @returns {CollectionReference} Reference to the 'users' collection.
   */
  getUsersRef(): CollectionReference {
    return this.fireService.getColRef('users');
  }

  /**
   * Returns a reference to the 'channels' collection.
   *
   * @returns {CollectionReference} Reference to the 'channels' collection.
   */
  getChannelsRef(): CollectionReference {
    return this.fireService.getColRef('channels');
  }

  /**
   * Adds the current channel to the Firestore collection.
   */
  async addChannelToCollection() {
    this.calculateNextChannelIndex();
    await this.addUsers();
    const createdChannel = await this.createChannelDocument();
    this.updateChannelId(createdChannel.id);
    this.fireService.readChannels();
  }

  /**
   * Calculates the index for the next channel based on existing channels.
   *
   * @returns {number} - The calculated index for the next channel.
   */
  calculateNextChannelIndex(): number {
    return this.fireService.channels.length === 0
      ? 0
      : this.currentChannel.index = this.fireService.channels[this.fireService.channels.length - 1].index +
      1;
  }

  /**
   * Creates a new document for the current channel in the 'channels' collection.
   *
   * @returns {DocumentReference} - The reference to the newly created channel document.
   */
  async createChannelDocument(): Promise<
    DocumentReference<DocumentData, DocumentData>
  > {
    const createdChannel = await addDoc(
      this.getChannelsRef(),
      this.currentChannel.toJSON()
    );
    return doc(this.firestore, 'channels', createdChannel.id);
  }

  /**
   * Updates the channel ID in the Firestore document.
   *
   * @param {string} channelId - The ID of the channel to update.
   */
  async updateChannelId(channelId: string) {
    const createdChannelRef = doc(this.firestore, 'channels', channelId);
    await updateDoc(createdChannelRef, { id: channelId });
  }

  /**
   * Adds users to the current channel based on the selected criteria.
   * If 'All People' is checked, adds all users from the 'allUsers' list.
   * Otherwise, adds users from the 'selectedUsers' list.
   */
  async addUsers() {
    if (this.allPeopleIsChecked) {
      // If 'All People' is checked, add all users from the 'allUsers' array
      this.currentChannel.users = this.fireService.allUsers;
    } else {
      // If 'Certain People' is checked, add users from the 'selectedUsers' array
      this.currentChannel.users = this.selectedUsers;
    }
  }

  /**
   * Displays filtered users based on the entered user name.
   * Opens the usersToAdd modal.
   */
  async showFilteredUsers() {
    this.usersToAddOpen = true;
    this.filteredUsers = this.fireService.allUsers.filter((user) => {
      return user.name.toLowerCase().includes(this.usersName.toLowerCase());
    });
  }

  /**
   * Adds a filtered user to the selected users array.
   *
   * @param {Object} filteredUser - The user to be added to the selected users list.
   */
  addToSelectedUsers(filteredUser: {}) {
    if (!this.selectedUsers.includes(filteredUser)) {
      this.selectedUsers.push(filteredUser);
    }
    this.usersToAddOpen = false;
  }
}
