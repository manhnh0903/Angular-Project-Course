import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [HeaderComponent, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  public email: FormControl;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  constructor() {
    this.email = this.fb.control('', Validators.required);
  }

  async requestPasswordResetEmail() {
    if (this.email.valid) {
      try {
        await this.authService.requestPasswordReset(this.email.value);
      } catch (err) {
        console.error(err);
      }
    }
    this.email.markAsTouched();
  }
}
