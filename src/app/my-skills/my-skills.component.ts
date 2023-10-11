import { Component } from '@angular/core';

@Component({
  selector: 'app-my-skills',
  templateUrl: './my-skills.component.html',
  styleUrls: ['./my-skills.component.scss'],
})
export class MySkillsComponent {
  scrolledBy: boolean = false;

  icons: string[] = [
    'angular',
    'typescript',
    'javascript',
    'html',
    'firebase',
    'git',
    'css',
    'api',
    'scrum',
    'material-design',
  ];
  descriptions: string[] = [
    'Angular',
    'TypeScript',
    'JavaScript',
    'HTML',
    'Firebase',
    'GIT',
    'CSS',
    'Rest-Api',
    'Scrum',
    ' Material Design',
  ];

  inVision() {
    this.scrolledBy = true;
  }
}
