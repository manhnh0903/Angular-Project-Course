import { Component } from '@angular/core';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent {
  headlines: string[] = ['Join', 'Sharkie'];
  technologies: string[] = [
    'Angular | TypeScript | HTML | CSS | Firebase',
    'JavaScript | HTML | CSS',
  ];
  descriptions: string[] = [
    'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories. ',
    'A simple Jump-and-Run game based on an object-oriented approach. Help sharkie to find coins and poison bottles to fight against the killer whale.',
  ];
  projectLinks: string[] = [
    'https://www.google.com/',
    'https://www.google.com/',
  ];
  githubLinks: string[] = [
    'https://www.google.com/',
    'https://www.google.com/',
  ];
  images: string[] = [
    './assets/img/joinphoto.png',
    './assets/img/sharkiephoto.png',
  ];
}
