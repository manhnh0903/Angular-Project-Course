import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private authService: FirebaseAuthService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  async submitFomrEmailAndPassword() {
    const email = this.email.value;
    const password = this.password.value;

    console.log(this.loginForm);

    if (this.loginForm.valid) {
      await this.authService.loginWithEmailAndPassword(email, password);
      // play animation
      // redirect
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  async loginWithGoogle() {
    await this.authService.loginWithGoogle();
    // play animation
    // redirect
  }

  async guestLogin() {
    await this.authService.loginWithEmailAndPassword(
      'testuser@test.com',
      'test123'
    );
    // play animation
    // redirect
  }
}
