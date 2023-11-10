import { Component } from '@angular/core';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  registrationForm: FormGroup;
  privacyHover: boolean;

  constructor(
    private authService: FirebaseAuthService,
    private fb: FormBuilder
  ) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      privacy: [false, Validators.requiredTrue],
    });
  }

  get name() {
    return this.registrationForm.get('name');
  }
  get email() {
    return this.registrationForm.get('email');
  }
  get password() {
    return this.registrationForm.get('password');
  }
  get privacy() {
    return this.registrationForm.get('privacy');
  }

  togglePrivacy() {
    this.privacy.setValue(!this.privacy.value);
    console.log(this.privacy.value);
  }

  async submitForm() {
    const email = this.email.value;
    const password = this.password.value;

    if (this.registrationForm.valid) {
      await this.authService.registerWithEmailAndPassword(email, password);
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }
}
