import { Component, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss'],
})
export class ProfileDialogComponent {
  constructor(
    private router: Router,
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

  closeDialog() {
    this.homeNavService.profileOverlay = false;
  }

  openEditDialog() {
    console.log('open edit');
    this.homeNavService.editProfileOpen = true;
  }
}
