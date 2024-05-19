import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormInputWithErrorComponent } from '../../../shared/components/form-input-with-error/form-input-with-error.component';
import { ButtonWithoutIconComponent } from '../../../shared/components/button-without-icon/button-without-icon.component';
import { CustomValidators } from '../../custom-validators';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    HeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FormInputWithErrorComponent,
    ButtonWithoutIconComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  public resetPasswordForm: FormGroup;
  private uid: string = '';
  private token: string = '';
  public sending: boolean = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    this.resetPasswordForm = this.fb.group(
      {
        password: [
          '',
          [Validators.required, CustomValidators.passwordLengthValidator(8)],
        ],
        passwordRepeat: ['', [Validators.required]],
      },
      { validators: [CustomValidators.passwordMatchValidator] }
    );
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('uid');
    const token = this.route.snapshot.paramMap.get('token');

    if (id && token) {
      this.uid = id;
      this.token = token;
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

  async setNewPassword() {
    console.log(this.resetPasswordForm);

    if (this.resetPasswordForm.valid) {
      this.sending = true;
      try {
        await this.authService.setNewPassword(
          this.uid,
          this.token,
          this.password?.value
        );
        this.sending = false;
      } catch (err) {
        console.error();
        this.sending = false;
      }
    } else this.resetPasswordForm.markAllAsTouched();
  }
}
