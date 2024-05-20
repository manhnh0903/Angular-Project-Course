import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-menue.component.html',
  styleUrl: './user-menue.component.scss',
})
export class UserMenueComponent {
  public menueOpen: boolean = true;

  private authService = inject(AuthService);
  private router = inject(Router);

  toggleMenue() {
    this.menueOpen = !this.menueOpen;
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
