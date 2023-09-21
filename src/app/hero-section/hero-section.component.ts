import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
})
export class HeroSectionComponent {
  urls: string[] = [
    'https://github.com/BayerTobias',
    'mailto:tbayer2@gmx.de',
    'https://www.linkedin.com/in/tobias-bayer-a01612292/',
  ];
  imgs: string[] = [
    './assets/img/icons/github-icon.svg',
    './assets/img/icons/mail-icon.svg',
    './assets/img/icons/linkedin-icon.svg',
  ];
}
