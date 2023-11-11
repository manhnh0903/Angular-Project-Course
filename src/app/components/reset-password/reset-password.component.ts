import { Component } from '@angular/core';
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
    private fb: FormBuilder
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', Validators.required],
      passwordRepeat: ['', [Validators.required]],
    });
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

  get password() {
    return this.resetPasswordForm.get('password');
  }

  get passwordRepeat() {
    return this.resetPasswordForm.get('passwordRepeat');
  }

  passwordMatchValidator() {
    const password = this.password.value;
    const passwordRepeat = this.passwordRepeat.value;

    return password === passwordRepeat ? null : { passwordMismath: true };
  }

  async resetPassword() {
    console.log(this.resetPasswordForm);
  }
}
