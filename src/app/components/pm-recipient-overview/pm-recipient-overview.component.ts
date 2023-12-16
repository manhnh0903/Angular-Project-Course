import { Component } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';

@Component({
  selector: 'app-pm-recipient-overview',
  templateUrl: './pm-recipient-overview.component.html',
  styleUrls: ['./pm-recipient-overview.component.scss'],
})
export class PmRecipientOverviewComponent {
  constructor(
    public homeNavService: HomeNavigationService,
    private fireService: FirestoreService
  ) {}

  openPmChat(userId: string) {
    this.homeNavService.pmRecipient = userId;
    this.homeNavService.setChatPath('pm');
    this.fireService.subscribeToPmRecipient(userId);
    this.homeNavService.pmRecipientOverlayOpen = false;
  }
}
