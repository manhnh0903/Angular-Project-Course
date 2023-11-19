import { Component, ElementRef, Input, OnInit, inject } from '@angular/core';
import { Firestore, addDoc, arrayUnion, doc, onSnapshot, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Message } from 'src/app/classes/message.class';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-channels-chat',
  templateUrl: './channels-chat.component.html',
  styleUrls: ['./channels-chat.component.scss']
})
export class ChannelsChatComponent {
  firestore = inject(Firestore)
  constructor(public fireService: FirestoreService, public route: ActivatedRoute, public userService: UserService, private el: ElementRef,) {

  }

  newMessage
  channelId
  content
  filteredUsers = []
  selectedUsers = []
  usersName
  addPeople = false
  isButtonDisabled = true;
  buttonColor = 'gray';



  async addMessageToChannel() {
    const docReference = this.fireService.getDocRef('channels', this.fireService.currentChannel.id);
    this.newMessage = new Message({
      sender: this.userService.user.name,
      profileImg: this.userService.user.profileImg,
      content: this.content,
      thread: '',
      reactions: []
    });
    this.fireService.messages.push(this.newMessage.toJSON())
    await updateDoc(docReference, {
      messages: this.fireService.messages,
    });
  }



  async addUsersToCurrentChannel() {
    const docReference = this.fireService.getDocRef('channels', this.fireService.currentChannel.id);
    this.fireService.currentChannel.users = this.fireService.currentChannel.users.concat(this.selectedUsers);
    await updateDoc(docReference, {
      users: this.fireService.currentChannel.users
    });
  }


  async showFilteredUsers() {
    this.filteredUsers = this.fireService.allUsers.filter(filteredUser => {
      let indexOfUser = this.fireService.currentChannel.users.findIndex(user => user.email === filteredUser.email)
      if (indexOfUser === -1) {
        return filteredUser.name.toLowerCase().includes(this.usersName.toLowerCase())
      }
    })
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
      this.addPeople = true
    } else { this.addPeople = true }
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



}





