import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  currentDate;
  today;
  public showMenu = true;
  isMobile: boolean = false;
  clickedOnMobile: boolean;

  handleBooleanChange(value: boolean) {
    this.clickedOnMobile = value;
    console.log(this.clickedOnMobile);
  }

  constructor(
    private authService: FirebaseAuthService,
    public fireService: FirestoreService,
    public navService: HomeNavigationService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.fireService.readAllUsers();
    this.authService.checkAuth();
    this.fireService.getCurrentDate();
    this.breakpointObserver
      .observe(['(max-width: 900px)'])
      .subscribe((result: BreakpointState) => {
        if (result.matches) {
          this.isMobile = true;
        } else {
          this.isMobile = false;
        }
      });
  }

  async ngOnInit() {
    this.fireService.checkIfUserOnChannel();
    await this.fireService.readChannels();
  }

  /**
   * Closes the mobile menu when navigating back.
   */
  backToMenu() {
    this.clickedOnMobile = false;
  }

  /**
   * Toggles the visibility of the menu.
   */
  hideMenu() {
    if (this.showMenu == true) {
      this.showMenu = false;
    } else {
      this.showMenu = true;
    }
  }
}
