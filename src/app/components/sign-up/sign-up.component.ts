import { Component } from '@angular/core';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  nameError: boolean = false;

  constructor(private authService: FirebaseAuthService) {}

  registerUserWithEmailAndPassword() {
    this.authService.registerWithEmailAndPassword('tbayer2@gmx.de', 'Test123');
  }
}
