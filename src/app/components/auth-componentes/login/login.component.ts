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
  animations: [
    Animations.slideInOutAnimation,
    Animations.landingPageAnimationDesktop,
    Animations.landingPageAnimationMobile,
  ],
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

  /**
   * Getter method for the 'email' form control.
   *
   * @returns The 'email' form control.
   */
  get email() {
    return this.loginForm.get('email');
  }

  /**
   * Getter method for the 'password' form control.
   *
   * @returns The 'password' form control.
   */
  get password() {
    return this.loginForm.get('password');
  }

  /**
   * Submits the form with provided email and password for login.
   * - Resets any previous errors.
   * - Disables the login form during the submission process.
   * - Attempts to log in with the provided email and password.
   * - Handles errors if encountered during the login process.
   * - Marks all form controls as touched if the form is invalid.
   * - Enables the login form after the submission process.
   */
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

  /**
   * Attempts to log in with the provided email and password using the authentication service.
   * - If successful, triggers animation and routes to the next page.
   * - Updates the user's online status after a delay of 2000 milliseconds.
   * - Throws an error if the login attempt fails.
   *
   * @param email - The email used for login.
   * @param password - The password used for login.
   * @throws An error with a message indicating the login failure if unsuccessful.
   */
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

  /**
   * Handles authentication errors by updating relevant error flags based on the error message.
   *
   * @param err - The authentication error object.
   */
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

  /**
   * Resets error flags related to authentication.
   */
  resetErrors() {
    this.noDabubbleUser = false;
    this.wrongPassword = false;
  }

  /**
   * Initiates the Google login process using the authentication service.
   * After successful login, it performs additional actions such as animation,
   * routing, and updating online status.
   */
  async loginWithGoogle() {
    await this.authService.loginWithGoogle();
    this.animateAndRoute();
    setTimeout(() => {
      this.updateOnlineStatus();
    }, 2000);
  }

  /**
   * Initiates a guest login process using predefined guest credentials
   * with the authentication service. After successful login, it performs
   * additional actions such as animation, routing, and updating online status.
   */
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

  /**
   * Animates the login success state and navigates to the home page.
   */
  animateAndRoute() {
    this.loginSuccessful = true;
    setTimeout(() => {
      this.loginSuccessful = false;
      this.router.navigate(['/home']);
    }, 800);
  }

  /**
   * Updates the online status of the current user.
   */
  async updateOnlineStatus() {
    this.userService.user.onlineStatus = true;

    await this.firestoreService.newUser(
      this.userService.user.toJson(),
      this.userService.user.userId
    );
  }
}
