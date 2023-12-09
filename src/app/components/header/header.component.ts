import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  menuOpen = false;
  constructor(
    private el: ElementRef,
    public userService: UserService,
    private authService: FirebaseAuthService,
    private router: Router,
    private firestoreService: FirestoreService
  ) {
    this.authService.checkAuth();
  }

  openMenu() {
    this.menuOpen = true;
  }

  ngAfterViewInit() {
    this.el.nativeElement.addEventListener('click', (event) => {
      if (event.target.classList.contains('menuProfileContainer')) {
        this.closeMenu();
      }
    });
  }

  closeMenu() {
    this.menuOpen = false;
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
      await this.updateOnlineStatus();
      this.closeMenu();
    } catch (err) {
      console.error(err);
    }
  }

  async updateOnlineStatus() {
    this.userService.user.onlineStatus = false;

    await this.firestoreService.newUser(
      this.userService.user.toJson(),
      this.userService.user.userId
    );
  }
}
