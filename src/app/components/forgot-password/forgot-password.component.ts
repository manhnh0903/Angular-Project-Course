import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  sendMailForm: FormGroup;

  constructor(
    private authService: FirebaseAuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.sendMailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email() {
    return this.sendMailForm.get('email');
  }

  async sendMail() {
    const email = this.email.value;
    this.sendMailForm.disable();
    await this.authService.sendForgotPasswordMail(email);
    // trigger animation
    this.router.navigate(['/login']);
  }
}
