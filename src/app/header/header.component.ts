import { Component, Input, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  activeLink: string | null = null;
  mobileOverlay: boolean = false;
  @Input() navMenue!: boolean;

  constructor(public translate: TranslateService, private renderer: Renderer2) {
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('de');
  }

  /**
   * Sets the active link for navigation.
   * It updates the 'activeLink' property to the specified 'link' parameter,
   * indicating which link in the navigation is currently active.
   *
   * @param {string} link - The link to be set as the active link.
   */
  setActiveLink(link: string) {
    this.activeLink = link;
  }

  /**
   * Toggles a mobile menu overlay and adjusts the page's scroll behavior.
   * It toggles the 'mobileOverlay' property to show or hide a mobile menu overlay.
   * If 'mobileOverlay' is true, it prevents scrolling on the page by setting 'overflow-y' to 'hidden'.
   * If 'mobileOverlay' is false, it allows scrolling by removing the 'overflow-y' styles.
   */
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

  /**
   * Closes the mobile menu overlay and restores normal scroll behavior.
   * It sets the 'mobileOverlay' property to false, hiding the mobile menu overlay.
   * Additionally, it removes the 'overflow-y' styles from the 'body' and 'document.documentElement'
   * to allow normal scrolling.
   */
  closeOverlay() {
    this.mobileOverlay = false;
    this.renderer.removeStyle(document.body, 'overflow-y');
    this.renderer.removeStyle(document.documentElement, 'overflow-y');
  }

  /**
   * Selects the desired language for the application.
   * It sets the application's language using the 'translate' service by calling 'use()' with the specified 'language'.
   * This function allows users to switch between different language options in the application.
   *
   * @param {string} language - The language code to be set (e.g., 'en' for English, 'de' for German).
   */
  selectLanguage(language: string) {
    this.translate.use(language);
  }
}
