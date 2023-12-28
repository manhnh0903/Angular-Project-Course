import { Component, ElementRef } from '@angular/core';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss'],
})
export class ProfileDialogComponent {
  constructor(
    private el: ElementRef,
    public userService: UserService,
    private homeNavService: HomeNavigationService
  ) {}

  ngAfterViewInit() {
    this.el.nativeElement.addEventListener('click', (event) => {
      if (event.target.classList.contains('profileContainer')) {
        this.closeDialog();
      }
    });
  }

  /**
   * Closes the profile dialog by updating the 'profileOverlay' property in the HomeNavService.
   */
  closeDialog() {
    this.homeNavService.profileOverlay = false;
  }

  /**
   * Opens the edit profile dialog by updating the 'editProfileOpen' property in the HomeNavService.
   */
  openEditDialog() {
    this.homeNavService.editProfileOpen = true;
  }
}
