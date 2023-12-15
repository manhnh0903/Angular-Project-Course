import { Component } from '@angular/core';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';

@Component({
  selector: 'app-pm-recipient-overview',
  templateUrl: './pm-recipient-overview.component.html',
  styleUrls: ['./pm-recipient-overview.component.scss'],
})
export class PmRecipientOverviewComponent {
  constructor(public homeNavService: HomeNavigationService) {}
}
