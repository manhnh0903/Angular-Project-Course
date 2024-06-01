import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { MenueStateService } from '../../services/menue-state.service';

@Component({
  selector: 'app-user-menue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-menue.component.html',
  styleUrl: './user-menue.component.scss',
})
export class UserMenueComponent {
  public menueOpen: boolean = false;

  private authService = inject(AuthService);
  private menueService = inject(MenueStateService);
  private router = inject(Router);

  toggleMenue() {
    this.menueOpen = !this.menueOpen;
  }

  toggleUploadOverlay() {
    this.menueService.uploadOverlayOpen = !this.menueService.uploadOverlayOpen;
  }

  toggleUserOverlay() {
    this.menueService.userOverlayOpen = !this.menueService.userOverlayOpen;
  }

  toggleDeleteuserOverlay() {
    this.menueService.deleteUserOverlayOpen =
      !this.menueService.deleteUserOverlayOpen;
  }

  async logout() {
    try {
      await this.authService.logoutWithTokenEndpoint();
      localStorage.removeItem('token');
      this.router.navigateByUrl('/login');
    } catch (err) {
      console.error(err);
    }
  }
}
