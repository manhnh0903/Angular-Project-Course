import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  activeLink: string | null = null;

  constructor(public translate: TranslateService) {
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('de');
  }

  setActiveLink(link: string) {
    this.activeLink = link;
    console.log(this.translate.store.currentLang);
  }
}
