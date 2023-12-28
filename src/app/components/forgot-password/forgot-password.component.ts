import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { Router } from '@angular/router';
import { CustomValidators } from 'src/app/classes/custom-validators.class';
import { Animations } from 'src/app/classes/animations.class';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [Animations.slideInOutAnimation],
})
export class ForgotPasswordComponent {
  sendMailForm: FormGroup;
  mailSend: boolean = false;

  constructor(
    private authService: FirebaseAuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.sendMailForm = this.fb.group({
      email: ['', [Validators.required, CustomValidators.emailValidator]],
    });
  }

  /**
   * Getter method for the 'email' form control.
   *
   * @returns The 'email' form control.
   */
  get email() {
    return this.sendMailForm.get('email');
  }

  /**
   * Sends a password reset email to the provided email address.
   * Disables the sendMailForm during the operation and triggers
   * animations before routing to the next view.
   */
  async sendMail() {
    const email = this.email.value;
    this.sendMailForm.disable();
    await this.authService.sendForgotPasswordMail(email);
    this.animateAndRoute();
  }

  /**
   * Animates the mailSend property to true, triggers a timeout to reset
   */
  animateAndRoute() {
    this.mailSend = true;
    setTimeout(() => {
      this.mailSend = false;
      this.router.navigate(['/login']);
    }, 800);
  }
}
