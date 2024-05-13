import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonWithoutIconComponent } from '../button-without-icon/button-without-icon.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonWithoutIconComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  public signUpPage: boolean = false;
  private router = inject(Router);

  ngOnInit() {
    this.signUpPage = this.router.url.includes('/sign-up');
  }
}
