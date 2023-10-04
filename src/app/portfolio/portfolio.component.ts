import { Component } from '@angular/core';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent {
  headlines: string[] = ['Join', 'Space-Shooter', 'Ring-of-Fire'];
  technologies: string[] = [
    'JavaScript | HTML | CSS',
    'JavaScript | HTML | CSS',
    'Angular | TypeScript | HTML | CSS | Firebase',
  ];
  descriptions: string[] = [
    'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories.',
    'A side-scrolling space shooter game based on an object-oriented approach. Navigate your spacecraft through the vast expanse of outer space, confronting space pirates and ultimately vanquishing their leader at the end of your galactic journey.',
    'The popular drinking game has been developed using Angular and seamlessly integrated with a Google Firebase database, allowing for online multiplayer functionality.',
  ];
  projectLinks: string[] = [
    'https://join.tobias-bayer.dev/',
    'https://space-shooter.tobias-bayer.dev/',
    'https://ring-of-fire.tobias-bayer.dev/',
  ];
  githubLinks: string[] = [
    'https://github.com/BayerTobias/join',
    'https://github.com/BayerTobias/SpaceGame',
    'https://github.com/BayerTobias/Ring-of-Fire',
  ];
  images: string[] = [
    './assets/img/joinphoto.png',
    './assets/img/sharkiephoto.png',
    './assets/img/joinphoto.png',
  ];
}
