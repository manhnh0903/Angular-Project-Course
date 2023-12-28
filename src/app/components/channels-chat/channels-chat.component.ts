import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import {
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';
import { EditChannelComponent } from 'src/app/components/edit-channel/edit-channel.component';



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
  private selectedUsers: string[] = [];
  public usersName: string;
  public addPeople: boolean = false;
  public isButtonDisabled: boolean = true;
  public buttonColor: string = 'gray';
  public type: string = 'channel';

  @ViewChild('inputFooter') inputFooter: ElementRef<HTMLInputElement>;
  @ViewChild('sendIcon', { static: false }) sendIcon: ElementRef;
  @ViewChild('messagesOnChannel', { static: false }) messagesOnChannel: ElementRef;
  constructor(
    public fireService: FirestoreService,
    public navService: HomeNavigationService,
    public route: ActivatedRoute,
    public userService: UserService,
    private el: ElementRef,
    public dialog: MatDialog,

  ) {

  }





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
  }


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


  addToSelectedUsers(filteredUser) {
    if (!this.selectedUsers.includes(filteredUser)) {
      this.selectedUsers.push(filteredUser);
      if (this.selectedUsers.length > 0) {
        this.isButtonDisabled = false;
        this.buttonColor = 'blue';
      }
    }
  }


  openAddPeople() {
    this.buttonColor = this.isButtonDisabled ? 'gray' : 'blue';
    if (this.addPeople == false) {
      this.addPeople = true;
    } else {
      this.addPeople = true;
    }
  }


  closeAddPeople() {
    this.addPeople = false;
  }


  async ngAfterViewInit() {
    this.el.nativeElement.addEventListener('click', (event) => {
      if (event.target.classList.contains('addPeopleDialog')) {
        this.closeAddPeople();
        this.isButtonDisabled = true;
      }
    });

  }


  openEditChannelDialog(): void {
    const dialogRef = this.dialog.open(EditChannelComponent, {
      height: '420px',
      width: '540px',
      maxWidth: '100vw',
      panelClass: 'editChannelDialog',
    });
  }


}
