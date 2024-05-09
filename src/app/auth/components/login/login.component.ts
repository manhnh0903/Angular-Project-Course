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
import { LoginResponse } from '../../interfaces/login-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public loginForm: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  /**
   * Getter method for the 'username' form control.
   *
   * @returns The 'username' form control.
   */
  get username() {
    return this.loginForm.get('username');
  }

  /**
   * Getter method for the 'password' form control.
   *
   * @returns The 'password' form control.
   */
  get password() {
    return this.loginForm.get('password');
  }

  async login() {
    if (this.loginForm.valid) {
      try {
        const resp: LoginResponse =
          (await this.authService.loginWithUsernameAndPassword(
            this.username?.value,
            this.password?.value
          )) as LoginResponse;
        this.handleSuccessfullLogin(resp);
      } catch (err) {
        console.error('Login error:', err);
      }
    } else this.loginForm.markAllAsTouched();
  }

  async guestLogin() {
    try {
      const resp: LoginResponse =
        (await this.authService.loginWithUsernameAndPassword(
          'guestuser',
          'guestPassword123'
        )) as LoginResponse;
      this.handleSuccessfullLogin(resp);
    } catch (err) {
      console.error('Login error:', err);
    }
  }

  handleSuccessfullLogin(resp: LoginResponse) {
    localStorage.setItem('token', resp.auth_token);
    this.router.navigateByUrl('/home');
  }
}
