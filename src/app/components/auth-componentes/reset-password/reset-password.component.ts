import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;

  constructor(
    private authService: FirebaseAuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', Validators.required],
      passwordRepeat: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.authService.oobCode = params['oobCode'];
    });

    console.log(this.authService.oobCode);
  }

  ngAfterViewInit() {
    const passwordRepeatControl = this.resetPasswordForm.get('passwordRepeat');
    if (passwordRepeatControl) {
      passwordRepeatControl.setValidators([
        Validators.required,
        this.passwordMatchValidator.bind(this),
      ]);
      passwordRepeatControl.updateValueAndValidity();
    }
  }

  /**
   * Getter method for the 'password' form control.
   *
   * @returns The 'password' form control.
   */
  get password() {
    return this.resetPasswordForm.get('password');
  }

  /**
   * Getter method for the 'passwordRepeat' form control.
   *
   * @returns The 'passwordRepeat' form control.
   */
  get passwordRepeat() {
    return this.resetPasswordForm.get('passwordRepeat');
  }

  /**
   * Custom validator function to check if the entered password and repeated password match.
   * Returns `null` if they match, and an object with the key `passwordMismatch` if they don't.
   */
  passwordMatchValidator() {
    const password = this.password.value;
    const passwordRepeat = this.passwordRepeat.value;

    return password === passwordRepeat ? null : { passwordMismath: true };
  }

  /**
   * Handles the submission of the reset password form.
   * Calls the AuthService's resetPassword method with the entered password.
   * Navigates to the login page after the password is successfully reset.
   */
  async sendResetPasswordForm() {
    await this.authService.resetPassword(this.password.value);
    this.router.navigate(['/login']);
  }
}
