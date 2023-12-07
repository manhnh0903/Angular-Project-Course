import { Component } from '@angular/core';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { state } from '@angular/animations';
import { CustomValidators } from 'src/app/classes/custom-validators.class';

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
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, CustomValidators.emailValidator]],
      password: [
        '',
        [Validators.required, CustomValidators.passwordLengthValidator(6)],
      ],
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
  }

  getImageSource(): string {
    if (this.privacyHover) {
      return this.privacy.value
        ? './assets/img/checkbox-checked-hover.svg'
        : './assets/img/checkbox-hover.svg';
    } else {
      return this.privacy.value
        ? './assets/img/checkbox-checked.svg'
        : './assets/img/checkbox.svg';
    }
  }

  async submitForm() {
    const email = this.email.value;
    const password = this.password.value;
    const name = this.name.value;

    if (this.registrationForm.valid) {
      this.router.navigate(['/select-avatar'], {
        state: { email, password, name },
      });
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }
}
