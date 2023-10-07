import { Component, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  activeLink: string | null = null;
  mobileOverlay: boolean = false;

  constructor(public translate: TranslateService, private renderer: Renderer2) {
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('de');
  }

  setActiveLink(link: string) {
    this.activeLink = link;
    console.log(this.translate.store.currentLang);
  }

  toggleMenue() {
    this.mobileOverlay = !this.mobileOverlay;
    if (this.mobileOverlay) {
      this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
      this.renderer.setStyle(document.documentElement, 'overflow-y', 'hidden');
    } else {
      this.renderer.removeStyle(document.body, 'overflow-y');
      this.renderer.removeStyle(document.documentElement, 'overflow-y');
    }
  }

  closeOverlay() {
    this.mobileOverlay = false;
    this.renderer.removeStyle(document.body, 'overflow-y');
    this.renderer.removeStyle(document.documentElement, 'overflow-y');
  }
}
