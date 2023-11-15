import { Component, inject } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, onSnapshot, query, where } from '@angular/fire/firestore';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private fireService: FirebaseAuthService) {
    console.log(this.channels);
  }
  showMenu = true
  channels = []
  firestore = inject(Firestore)
  /*  loggedUser = */

  ngOnInit(): void {
    this.readChannels()

  }


  hideMenu() {
    if (this.showMenu == true) {
      this.showMenu = false
    } else {
      this.showMenu = true
    }
  }

  getChannelsRef() {
    return collection(this.firestore, 'channels')
  }

  readChannels() {
    const q = query(this.getChannelsRef())
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          this.channels.push(change.doc.data());
        }
        if (change.type === "removed") {
          this.ifChannelRemoved(change)
        }
      });
    });
  }


  getUsersRef() {
    return collection(this.firestore, 'users')
  }


  ifChannelRemoved(change) {
    let indexOfRemoved = this.channels.findIndex(channel => channel.name === change.doc.data()['name'])
    this.channels.splice(indexOfRemoved, 1)
  }
}



