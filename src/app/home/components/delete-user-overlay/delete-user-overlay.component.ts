import { Component, inject } from '@angular/core';
import { ButtonWithoutIconComponent } from '../../../shared/components/button-without-icon/button-without-icon.component';
import { MenueStateService } from '../../services/menue-state.service';
import { AuthService } from '../../../auth/services/auth.service';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormInputWithErrorComponent } from '../../../shared/components/form-input-with-error/form-input-with-error.component';
import { CustomValidators } from '../../../auth/custom-validators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-user-overlay',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormInputWithErrorComponent,
    ButtonWithoutIconComponent,
  ],
  templateUrl: './delete-user-overlay.component.html',
  styleUrl: './delete-user-overlay.component.scss',
})
export class DeleteUserOverlayComponent {
  private menueService = inject(MenueStateService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  public password: FormControl;
  public sending: boolean = false;
  public httpError: boolean = false;

  constructor() {
    this.password = this.fb.control('', [
      Validators.required,
      CustomValidators.passwordLengthValidator(8),
    ]);
  }

  closeOverlay() {
    this.menueService.deleteUserOverlayOpen = false;
    this.menueService.userOverlayOpen = true;
  }

  async deleteAccount() {
    if (this.password.valid) {
      this.sending = true;
      this.httpError = false;
      try {
        const password = this.password.value;
        await this.authService.deleteUser(password);
        localStorage.clear();
        this.router.navigateByUrl('/login');
      } catch (err) {
        console.error(err);
        this.httpError = true;
      }
      this.sending = false;
      this.password.markAsTouched();
    }
  }
}
