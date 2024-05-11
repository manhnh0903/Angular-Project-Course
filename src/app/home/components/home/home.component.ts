import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { DataManagerService } from '../../services/data-manager.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public dataManager = inject(DataManagerService);

  constructor() {}

  async ngOnInit() {
    await this.dataManager.getVideos();
  }
}
