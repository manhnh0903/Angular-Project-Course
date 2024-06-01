import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormInputWithErrorComponent } from '../../../shared/components/form-input-with-error/form-input-with-error.component';
import { ButtonWithoutIconComponent } from '../../../shared/components/button-without-icon/button-without-icon.component';
import { CustomValidators } from '../../../auth/custom-validators';
import { AuthService } from '../../../auth/services/auth.service';
import { MenueStateService } from '../../services/menue-state.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-overlay',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormInputWithErrorComponent,
    ButtonWithoutIconComponent,
  ],
  templateUrl: './user-overlay.component.html',
  styleUrl: './user-overlay.component.scss',
})
export class UserOverlayComponent {
  private authService = inject(AuthService);
  private menueService = inject(MenueStateService);
  private fb = inject(FormBuilder);

  public updateUserForm: FormGroup;
  public sending: boolean = false;
  public success: boolean = false;
  public noChanges: boolean = false;

  constructor() {
    this.updateUserForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, CustomValidators.emailValidator]],
      first_name: [''],
      last_name: [''],
    });
  }

  ngOnInit() {
    if (this.authService.user) {
      this.updateUserForm.patchValue({
        username: this.authService.user.username,
        email: this.authService.user.email,
        first_name: this.authService.user.first_name,
        last_name: this.authService.user.last_name,
      });
    }
  }

  /**
   * Getter method for the 'username' form control.
   *
   * @returns The 'username' form control.
   */
  get username() {
    return this.updateUserForm.get('username');
  }

  /**
   * Getter method for the 'email' form control.
   *
   * @returns The 'email' form control.
   */
  get email() {
    return this.updateUserForm.get('email');
  }

  /**
   * Getter method for the 'first_name' form control.
   *
   * @returns The 'first_name' form control.
   */
  get first_name() {
    return this.updateUserForm.get('first_name');
  }

  /**
   * Getter method for the 'last_name' form control.
   *
   * @returns The 'last_name' form control.
   */
  get last_name() {
    return this.updateUserForm.get('last_name');
  }

  async updateUser() {
    if (this.updateUserForm.valid) {
      this.sending = true;
      this.noChanges = false;

      if (this.noFormChanges()) {
        this.noChanges = true;
      } else {
        try {
          const user = this.getUser();
          await this.authService.updateUser(user);
          await this.authService.checkAuth();
          this.success = true;
        } catch (err) {
          console.error(err);
        }
      }
      this.sending = false;
    } else {
      this.updateUserForm.markAllAsTouched();
    }
  }

  getUser() {
    const user = new User();
    user.id = this.authService.user!.id;
    user.username = this.username?.value;
    user.email = this.email?.value;
    user.first_name = this.first_name?.value;
    user.last_name = this.last_name?.value;

    return user;
  }

  noFormChanges() {
    const user = this.getUser();
    const authUser = this.authService.user;

    return JSON.stringify(user) === JSON.stringify(authUser);
  }

  openDeleteUserOverlay() {
    this.menueService.deleteUserOverlayOpen = true;
    this.closeOverlay();
  }

  closeOverlay() {
    this.menueService.userOverlayOpen = false;
  }
}
