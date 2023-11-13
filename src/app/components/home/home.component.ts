import { Component, inject } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, onSnapshot, query, where } from '@angular/fire/firestore';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private authService: FirebaseAuthService) { }
  showMenu = true
  channels = []
  firestore = inject(Firestore)
  /*  loggedUser = */

  ngOnInit(): void {
    this.readChannels()
    this.getLoggedUser()
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
      });
    });
  }


  getUsersRef() {
    return collection(this.firestore, 'users')
  }


  async getLoggedUser() {
    const q = query(collection(this.firestore, "users"), where("email", "==", "katrin@test.de"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      /*     console.log(doc.id, " => ", doc.data()); */
    });

  }
}
