import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Animations } from 'src/app/classes/animations.class';
import { CustomValidators } from 'src/app/classes/custom-validators.class';
import { DabubbleUser } from 'src/app/classes/user.class';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [Animations.slideInOutAnimation, Animations.landingPageAnimation],
})
export class LoginComponent {
  loginForm: FormGroup;
  noDabubbleUser: boolean;
  wrongPassword: boolean;
  loading: boolean = false;
  user = new DabubbleUser();

  animationFinished: boolean = false;

  public loginSuccessful: boolean = false;

  constructor(
    private authService: FirebaseAuthService,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private firestoreService: FirestoreService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, CustomValidators.emailValidator]],
      password: ['', Validators.required],
    });
    setTimeout(() => {
      this.animationFinished = true;
    }, 3000);
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  async submitFomrEmailAndPassword() {
    this.resetErrors();
    const email = this.email.value;
    const password = this.password.value;

    if (this.loginForm.valid) {
      this.loginForm.disable();
      try {
        await this.login(email, password);
      } catch (err) {
        this.handleError(err);
      }
    } else this.loginForm.markAllAsTouched();
    this.loginForm.enable();
  }

  async login(email: string, password: string) {
    try {
      await this.authService.loginWithEmailAndPassword(email, password);
      this.animateAndRoute();
      setTimeout(() => {
        this.updateOnlineStatus();
      }, 2000);
    } catch (err) {
      throw new Error('Anmeldung fehlgeschlagen: ' + err);
    }
  }

  handleError(err: any) {
    if (err.message) {
      const errorMessage = err.message;

      if (errorMessage.includes('auth/wrong-password')) {
        this.wrongPassword = true;
      } else if (errorMessage.includes('auth/user-not-found')) {
        this.noDabubbleUser = true;
      } else {
      }
    }
  }

  resetErrors() {
    this.noDabubbleUser = false;
    this.wrongPassword = false;
  }

  async loginWithGoogle() {
    await this.authService.loginWithGoogle();
    this.animateAndRoute();
    setTimeout(() => {
      this.updateOnlineStatus();
    }, 2000);
  }

  async guestLogin() {
    await this.authService.loginWithEmailAndPassword(
      'testuser@test.com',
      'test123'
    );
    this.animateAndRoute();
    setTimeout(() => {
      this.updateOnlineStatus();
    }, 2000);
  }

  animateAndRoute() {
    this.loginSuccessful = true;
    setTimeout(() => {
      this.loginSuccessful = false;
      this.router.navigate(['/home']);
    }, 800);
  }

  async updateOnlineStatus() {
    this.userService.user.onlineStatus = true;

    await this.firestoreService.newUser(
      this.userService.user.toJson(),
      this.userService.user.userId
    );
  }
}
