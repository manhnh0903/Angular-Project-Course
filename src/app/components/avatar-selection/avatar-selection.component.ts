import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DabubbleUser } from 'src/app/classes/user.class';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';

@Component({
  selector: 'app-avatar-selection',
  templateUrl: './avatar-selection.component.html',
  styleUrls: ['./avatar-selection.component.scss'],
})
export class AvatarSelectionComponent {
  user = new DabubbleUser();

  email: string;
  password: string;
  name: string;
  profileImg: string;

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
    private router: Router
  ) {
    this.user.email = this.router.getCurrentNavigation().extras.state['email'];
    this.user.password =
      this.router.getCurrentNavigation().extras.state['password'];
    this.user.name = this.router.getCurrentNavigation().extras.state['name'];
  }

  async setProfileImg(img: string) {
    this.user.profileImg = img;
    console.log(this.user);

    await this.authService.registerWithEmailAndPassword(this.user);
    // neue collection im firestore mit allen infos
  }
}
