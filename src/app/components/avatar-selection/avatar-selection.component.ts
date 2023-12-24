import { Component } from '@angular/core';
import { user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Animations } from 'src/app/classes/animations.class';
import { DabubbleUser } from 'src/app/classes/user.class';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-avatar-selection',
  templateUrl: './avatar-selection.component.html',
  styleUrls: ['./avatar-selection.component.scss'],
  animations: [Animations.slideInOutAnimation],
})
export class AvatarSelectionComponent {
  public user = new DabubbleUser();
  public userCreated: boolean = false;

  profilePictures: string[] = [
    './assets/img/0character.png',
    './assets/img/1character.png',
    './assets/img/2character.png',
    './assets/img/3character.png',
    './assets/img/4character.png',
    './assets/img/5character.png',
  ];

  constructor(
    private authService: FirebaseAuthService,
    private router: Router,
    private firestoreService: FirestoreService
  ) {
    this.user.email = this.router.getCurrentNavigation().extras.state['email'];
    this.user.password =
      this.router.getCurrentNavigation().extras.state['password'];
    this.user.name = this.router.getCurrentNavigation().extras.state['name'];
  }

  setProfileImg(img: string) {
    this.user.profileImg = img;
  }

  async createUser() {
    const userCredential = await this.authService.registerWithEmailAndPassword(
      this.user
    );
    const userId = userCredential.user.uid;
    this.user.userId = userId;

    await this.firestoreService.newUser(this.user.toJson(), userId);
    this.animateAndRoute();
  }

  animateAndRoute() {
    this.userCreated = true;
    setTimeout(() => {
      this.userCreated = false;
      this.router.navigate(['/home']);
    }, 800);
  }
}
