import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomValidators } from 'src/app/classes/custom-validators.class';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  registrationForm: FormGroup;
  privacyHover: boolean;
  subscription: Subscription;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, CustomValidators.emailValidator]],
      password: [
        '',
        [Validators.required, CustomValidators.passwordLengthValidator(6)],
      ],
      privacy: [false, Validators.requiredTrue],
    });

    if (router.getCurrentNavigation().extras.state) {
      this.registrationForm.setValue({
        name: this.router.getCurrentNavigation().extras.state['name'],
        email: this.router.getCurrentNavigation().extras.state['email'],
        password: this.router.getCurrentNavigation().extras.state['password'],
        privacy: false,
      });
    }
  }

  /**
   * Getter method for the 'name' form control.
   *
   * @returns The 'name' form control.
   */
  get name() {
    return this.registrationForm.get('name');
  }

  /**
   * Getter method for the 'email' form control.
   *
   * @returns The 'email' form control.
   */
  get email() {
    return this.registrationForm.get('email');
  }

  /**
   * Getter method for the 'password' form control.
   *
   * @returns The 'password' form control.
   */
  get password() {
    return this.registrationForm.get('password');
  }

  /**
   * Getter method for the 'privacy' form control.
   *
   * @returns The 'privacy' form control.
   */
  get privacy() {
    return this.registrationForm.get('privacy');
  }

  /**
   * Toggles the value of the privacy form control.
   * If the current value is true, it sets it to false, and vice versa.
   */
  togglePrivacy() {
    this.privacy.setValue(!this.privacy.value);
  }

  /**
   * Gets the image source based on the current state of privacy and hover.
   *
   * @returns {string} The image source URL.
   */
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

  /**
   * Submits the registration form. If the form is valid, navigates to the 'select-avatar' route
   * with the user's email, password, and name as state parameters. If the form is invalid,
   * marks all form controls as touched.
   */
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
