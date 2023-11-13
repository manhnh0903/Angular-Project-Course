import { Component, ElementRef, OnInit, inject } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDocs, onSnapshot, query, where } from '@angular/fire/firestore';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { Channel } from 'src/app/classes/channel.class';

@Component({
  selector: 'app-people-to-channel',
  templateUrl: './people-to-channel.component.html',
  styleUrls: ['./people-to-channel.component.scss'],
  providers: [
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions }
  ]
})

export class PeopleToChannelComponent {
  firestore = inject(Firestore)
  allPeopleIsChecked = true;
  certainPeopleisChecked = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  currentChannel = new Channel()
  allUsers = []
  filteredUsers = []
  userFound = false
  usersName
  constructor(private router: Router, private el: ElementRef) { this.readAllUsers(); }

  checkAllPeople() {
    this.allPeopleIsChecked = true;
    this.certainPeopleisChecked = false;
  }


  checkCertainPeople() {
    this.certainPeopleisChecked = true;
    this.allPeopleIsChecked = false;
  }


  getUsersRef() {
    return collection(this.firestore, 'users')
  }


  getChannelsRef() {
    return collection(this.firestore, 'channels')
  }


  async addDocumentToCollection() {
    await this.addUsers()
    await addDoc(this.getChannelsRef(),
      this.currentChannel.toJSON()
      
    )
  }


  async readAllUsers() {

    const querySnapshot = await getDocs(collection(this.firestore, "users"));
    querySnapshot.forEach((user) => {
      this.allUsers.push(user.data())
    });
  }


  async addUsers() {
    if (this.allPeopleIsChecked) {
      this.currentChannel.users = this.allUsers

    } else {
      /*   this.showFilteredUsers() */
    }

  }


  async showFilteredUsers() {
    /*   this.filteredUsers = this.allUsers.filter(user => {
  
        user.name.toLowerCase().includes(this.usersName)
  
      })
      console.log(this.filteredUsers); */
  }

}


