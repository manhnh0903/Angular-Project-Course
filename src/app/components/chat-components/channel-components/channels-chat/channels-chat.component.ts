import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { Firestore, updateDoc } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';
import { EditChannelComponent } from 'src/app/components/chat-components/channel-components/edit-channel/edit-channel.component';
import { DabubbleUser } from 'src/app/classes/user.class';

@Component({
  selector: 'app-channels-chat',
  templateUrl: './channels-chat.component.html',
  styleUrls: ['./channels-chat.component.scss'],
})
export class ChannelsChatComponent implements AfterViewInit {
  firestore = inject(Firestore);
  public emojiOpened: boolean = false;
  public content: string;
  public filteredUsers: any[] = [];
  public selectedUsers: DabubbleUser[] = [];
  public selectedUser: DabubbleUser;
  public usersName: string;
  public addPeople: boolean = false;
  public isButtonDisabled: boolean = true;
  public buttonColor: string = 'gray';
  public type: string = 'channel';

  @ViewChild('inputFooter') inputFooter: ElementRef<HTMLInputElement>;
  @ViewChild('sendIcon', { static: false }) sendIcon: ElementRef;
  @ViewChild('messagesOnChannel', { static: false })
  messagesOnChannel: ElementRef;
  constructor(
    public fireService: FirestoreService,
    public navService: HomeNavigationService,
    public route: ActivatedRoute,
    public userService: UserService,
    private el: ElementRef,
    public dialog: MatDialog
  ) {}

  ngAfterViewInit() {
    this.el.nativeElement.addEventListener('click', (event) => {
      if (event.target.classList.contains('addPeopleDialog')) {
        this.closeAddPeople();
        this.isButtonDisabled = true;
      }
    });
  }

  /**
   * Adds selected users to the current channel and updates the channel in Firestore.
   */
  async addUsersToCurrentChannel() {
    const docReference = this.fireService.getDocRef(
      'channels',
      this.fireService.currentChannel.id
    );
    this.fireService.currentChannel.users =
      this.fireService.currentChannel.users.concat(this.selectedUser);
    await updateDoc(docReference, {
      users: this.fireService.currentChannel.users,
    });
    this.closeAddPeople();
  }

  /**
   * Filters users based on the user's name and whether they are already part of the current channel.
   * Updates the 'filteredUsers' array with the matching users.
   */
  async showFilteredUsers() {
    this.filteredUsers = this.fireService.allUsers.filter((filteredUser) => {
      let indexOfUser = this.fireService.currentChannel.users.findIndex(
        (user) => user.email === filteredUser.email
      );
      if (indexOfUser === -1) {
        return filteredUser.name
          .toLowerCase()
          .includes(this.usersName.toLowerCase());
      }
    });
  }

  /**
   * Sets the selected user to the specified filtered user.
   * Clears the search input and filtered users.
   *
   * @param {DabubbleUser} filteredUser - The user to be set as the selected user.
   */
  addToSelectedUsers(filteredUser: DabubbleUser) {
    this.selectedUser = filteredUser;
    this.usersName = '';
    this.filteredUsers = [];
  }

  /**
   * Toggles the 'addPeople' flag.
   */
  openAddPeople() {
    this.addPeople = true;
  }

  /**
   * Closes the 'Add People' feature.
   * Resets the search input, filtered users, and selected user.
   */
  closeAddPeople() {
    this.addPeople = false;
    this.usersName = '';
    this.filteredUsers = [];
    this.selectedUser = null;
  }

  /**
   * Opens the 'Edit Channel' dialog using Angular Material Dialog.
   */
  openEditChannelDialog(): void {
    const dialogRef = this.dialog.open(EditChannelComponent, {
      height: '420px',
      width: '540px',
      maxWidth: '100vw',
      panelClass: 'editChannelDialog',
    });
  }
}
