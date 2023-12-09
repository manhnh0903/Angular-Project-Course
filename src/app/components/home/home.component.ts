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
import { HomeNavigationService } from 'src/app/services/home-navigation.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  currentDate
  today
  public showMenu = true;
  firestore = inject(Firestore);
  constructor(
    private authService: FirebaseAuthService,
    public fireService: FirestoreService,
    private userService: UserService,
    public navService: HomeNavigationService
  ) {
    this.fireService.readAllUsers();
    this.authService.checkAuth();
    this.fireService.getCurrentDate()
  }


  ngOnInit(): void {
    this.getLoggedUser();
   this.fireService.defaultChannel()  
    
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
    });
  }










  getDaysName() {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date();
    let day = weekday[d.getDay()];
    return day
  }


  getsMonthName() {
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date();
    let name = month[d.getMonth()];
    return name
  }
}
