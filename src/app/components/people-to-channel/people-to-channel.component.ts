import { Component, inject } from '@angular/core';
import { Firestore, addDoc, collection, doc, onSnapshot, query } from '@angular/fire/firestore';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions } from '@angular/material/checkbox';

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
  allPeopleIsChecked = false;
  certainPeopleisChecked = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  currentChannel
  currentChannelUsers = []




  checkAllPeople() {
    this.allPeopleIsChecked = true;
    this.certainPeopleisChecked = false;
    console.log('allPeopleIsChecked', this.allPeopleIsChecked, ' certainPeopleisChecked', this.certainPeopleisChecked);
  }



  checkCertainPeople() {
    this.certainPeopleisChecked = true;
    this.allPeopleIsChecked = false;
    console.log('allPeopleIsChecked', this.allPeopleIsChecked, ' certainPeopleisChecked', this.certainPeopleisChecked);
  }


  getCollectionRef() {
    return collection(this.firestore, 'users')
  }

  readUsers() {
    const q = query(this.getCollectionRef());
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
      })
    })
  }
}

