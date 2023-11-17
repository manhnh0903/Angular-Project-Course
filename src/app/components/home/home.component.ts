import { Component, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from '@angular/fire/firestore';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(
    private authService: FirebaseAuthService,
    public fireService: FirestoreService,
    private userService: UserService
  ) {

    this.fireService.readAllUsers();
    this.authService.checkAuth();
    /*   this.fireService.ifChangesOnChannels(); */
  }
  showMenu = true;

  firestore = inject(Firestore);

  ngOnInit(): void {
    this.getLoggedUser();
  }

  hideMenu() {
    if (this.showMenu == true) {
      this.showMenu = false;
    } else {
      this.showMenu = true;
    }
  }

  getChannelsRef() {
    return collection(this.firestore, 'channels');
  }

  getUsersRef() {
    return collection(this.firestore, 'users');
  }

  async getLoggedUser() {
    const q = query(
      collection(this.firestore, 'users'),
      where('email', '==', 'katrin@test.de')
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      /*     console.log(doc.id, " => ", doc.data()); */
    });
  }
}
