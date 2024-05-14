import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormInputWithErrorComponent } from '../../../shared/components/form-input-with-error/form-input-with-error.component';
import { ButtonWithoutIconComponent } from '../../../shared/components/button-without-icon/button-without-icon.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    HeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    FormInputWithErrorComponent,
    ButtonWithoutIconComponent,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  public signupForm: FormGroup;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      passwordRepeat: ['', Validators.required],
    });
  }

  /**
   * Getter method for the 'username' form control.
   *
   * @returns The 'username' form control.
   */
  get username() {
    return this.signupForm.get('username');
  }

  /**
   * Getter method for the 'email' form control.
   *
   * @returns The 'email' form control.
   */
  get email() {
    return this.signupForm.get('email');
  }

  /**
   * Getter method for the 'password' form control.
   *
   * @returns The 'password' form control.
   */
  get password() {
    return this.signupForm.get('password');
  }

  /**
   * Getter method for the 'passwordRepeat' form control.
   *
   * @returns The 'passwordRepeat' form control.
   */
  get passwordRepeat() {
    return this.signupForm.get('passwordRepeat');
  }

  async signup() {
    if (this.signupForm.valid) {
      try {
        this.authService.registerUser(
          this.username?.value,
          this.email?.value,
          this.password?.value,
          this.passwordRepeat?.value
        );
        // anzeige sign up erfogreich bitte email klick für aktivierung zum login Link
      } catch (err) {
        console.error(err);
      }
    } else this.signupForm.markAllAsTouched;
  }
}
