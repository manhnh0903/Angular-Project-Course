import { Component } from '@angular/core';
import { user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { DabubbleUser } from 'src/app/classes/user.class';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-avatar-selection',
  templateUrl: './avatar-selection.component.html',
  styleUrls: ['./avatar-selection.component.scss'],
})
export class AvatarSelectionComponent {
  user = new DabubbleUser();

  profilePictures: string[] = [
    '0character.png',
    '1character.png',
    '2character.png',
    '3character.png',
    '4character.png',
    '5character.png',
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
    console.log(this.user);
  }

  async createUser() {
    const userCredential = await this.authService.registerWithEmailAndPassword(
      this.user
    );
    const userId = userCredential.user.uid;
    this.user.userId = userId;

    await this.firestoreService.newUser(this.user.toJson(), userId);

    //animation triggern
    console.log('Ende');
    this.router.navigate(['/Home']);
  }
}
