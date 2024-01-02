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
  public selectedUsers= [];
  public usersName: string;
  public addPeople: boolean = false;
  public isButtonDisabled: boolean = true;
  public buttonColor: string = 'gray';
  public type: string = 'channel';
  usersToAddOpen = false;
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
  ) { }

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
      this.fireService.currentChannel.users.concat(this.selectedUsers);
    await updateDoc(docReference, {
      users: this.fireService.currentChannel.users,
    });
    this.addPeople = false
  }

  /**
   * Filters users based on the user's name and whether they are already part of the current channel.
   * Updates the 'filteredUsers' array with the matching users.
   */
  async showFilteredUsers() {
    this.usersToAddOpen = true;
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
   * Adds a filtered user to the 'selectedUsers' array if not already included.
   * Updates the button state based on the number of selected users.
   * @param filteredUser - The user to be added to the selected users.
   */
  addToSelectedUsers(filteredUser) {
    if (!this.selectedUsers.includes(filteredUser)) {
      this.selectedUsers.push(filteredUser);
      if (this.selectedUsers.length > 0) {
        this.isButtonDisabled = false;
        this.buttonColor = 'blue';
      }
    }
    this.usersToAddOpen = false
  }

  /**
   * Toggles the 'addPeople' flag and updates the button color based on its state.
   */
  openAddPeople() {
    this.buttonColor = this.isButtonDisabled ? 'gray' : 'blue';
    if (this.addPeople == false) {
      this.addPeople = true;
    } else {
      this.addPeople = true;
    }
  }

  /**
   * Closes the 'Add People' feature by setting the 'addPeople' flag to false.
   */
  closeAddPeople() {
    this.addPeople = false;
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
