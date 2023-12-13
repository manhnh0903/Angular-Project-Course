import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Message } from 'src/app/classes/message.class';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';
import {
  FormControl,
  Validators,
} from '@angular/forms';
import { EditChannelComponent } from 'src/app/components/edit-channel/edit-channel.component';

@Component({
  selector: 'app-channels-chat',
  templateUrl: './channels-chat.component.html',
  styleUrls: ['./channels-chat.component.scss'],
})
export class ChannelsChatComponent implements AfterViewInit {
  firestore = inject(Firestore);
  public emojiOpened = false
  private newMessage;
  public content;
  public filteredUsers = [];
  private selectedUsers = [];
  public usersName;
  public addPeople = false;
  public isButtonDisabled = true;
  public buttonColor = 'gray';
  public onRightSide;
  public type = 'channel';
  sendMessageForm = new FormControl('', [Validators.required])
  @ViewChild('sendIcon', { static: false }) sendIcon: ElementRef;

  constructor(
    public fireService: FirestoreService,
    public navService: HomeNavigationService,
    public route: ActivatedRoute,
    public userService: UserService,
    private el: ElementRef,
    public dialog: MatDialog,
  ) { }



  async addMessageToChannel() {
    if (this.sendMessageForm.valid) {
      const docReference = this.fireService.getDocRef(
        'channels',
        this.fireService.currentChannel.id
      );
      this.createMessage();
      this.fireService.currentChannel.messages.unshift(this.newMessage.toJSON());
      await updateDoc(docReference, {
        messages: this.fireService.currentChannel.messages,
      });
      this.sendMessageForm.patchValue('')
    }
  }


  createMessage() {
    this.newMessage = new Message({
      sender: this.userService.user.name,
      profileImg: this.userService.user.profileImg,
      content: this.sendMessageForm.value,
      thread: [],
      reactions: [],
      creationDate: this.fireService.getCurrentDate(),
      creationTime: this.fireService.getCurrentTime(),
      creationDay: this.fireService.getDaysName(),
      id: this.addMessageId(),
      collectionId: this.fireService.currentChannel.id,
      messageType: 'channels',
    });
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
    await this.fireService.readChannels()
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

  ngAfterViewInit() {

    this.el.nativeElement.addEventListener('click', (event) => {
      if (event.target.classList.contains('addPeopleDialog')) {
        this.closeAddPeople();
        this.isButtonDisabled = true;
      }
    });
  }

  addMessageId() {
    let id;
    if (this.fireService.currentChannel.messages.length > 0) {
      id =
        this.fireService.currentChannel.messages[0].id + 1;
    } else {
      id = 0;
    }
    return id;
  }


  openEditChannelDialog(): void {
    const dialogRef = this.dialog.open(EditChannelComponent, {
      height: '420px',
      width: '540px',
      panelClass: 'editChannelDialog',
    });
  }

  toggleEmoji() {
    this.emojiOpened = !this.emojiOpened
  }

  addEmoji(event) {
    const currentMessage = this.sendMessageForm.value || '';
    const cursorPosition = this.getCursorPosition();
    const messageArray = currentMessage.split('');
    messageArray.splice(cursorPosition, 0, event.emoji.native);
    const updatedMessage = messageArray.join('');
    this.sendMessageForm.patchValue(updatedMessage);
    this.toggleEmoji();
    
  }

  @ViewChild('input') input: ElementRef;
  getCursorPosition() {
    const inputElement = this.input?.nativeElement;
    const cursorPosition = inputElement.selectionStart;
    return cursorPosition
  }

}
