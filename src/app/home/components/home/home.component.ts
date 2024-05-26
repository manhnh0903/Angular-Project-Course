import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { DataManagerService } from '../../services/data-manager.service';
import { CommonModule } from '@angular/common';
import { MenueStateService } from '../../services/menue-state.service';
import { VideoUploadOverlayComponent } from '../video-upload-overlay/video-upload-overlay.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule, VideoUploadOverlayComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public dataManager = inject(DataManagerService);
  public menueService = inject(MenueStateService);

  constructor() {}

  async ngOnInit() {
    await this.dataManager.getPublicVideos();
    await this.dataManager.getPrivateVideos();
  }
}
