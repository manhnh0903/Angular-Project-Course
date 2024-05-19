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
import { Router, RouterModule } from '@angular/router';
import { FormInputWithErrorComponent } from '../../../shared/components/form-input-with-error/form-input-with-error.component';
import { ButtonWithoutIconComponent } from '../../../shared/components/button-without-icon/button-without-icon.component';
import { CustomValidators } from '../../custom-validators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FormInputWithErrorComponent,
    ButtonWithoutIconComponent,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public loginForm: FormGroup;
  public loginError: boolean = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  ngOnInit() {
    this.checkLocalStorage();
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

  /**
   * Getter method for the 'rememberMe' form control.
   *
   * @returns The 'rememberMe' form control.
   */
  get rememberMe() {
    return this.loginForm.get('rememberMe');
  }

  async login() {
    if (this.loginForm.valid) {
      this.loginError = false;
      this.setLocalStorage();
      try {
        const resp: LoginResponse =
          (await this.authService.loginWithUsernameAndPassword(
            this.username?.value,
            this.password?.value
          )) as LoginResponse;
        this.handleSuccessfullLogin(resp);
      } catch (err) {
        this.loginError = true;
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

  setLocalStorage() {
    if (this.rememberMe?.value === true) {
      localStorage.setItem('username', this.username?.value);
      localStorage.setItem('password', this.password?.value);
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('password');
    }
  }

  checkLocalStorage() {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    if (username && password) {
      this.loginForm.patchValue({
        username: username,
        password: password,
        rememberMe: true,
      });
    }
  }

  handleSuccessfullLogin(resp: LoginResponse) {
    localStorage.setItem('token', resp.auth_token);
    this.router.navigateByUrl('/home');
  }
}
