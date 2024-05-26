import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { DataManagerService } from '../../services/data-manager.service';
import { CommonModule } from '@angular/common';
import { MenueStateService } from '../../services/menue-state.service';
import { VideoUploadOverlayComponent } from '../video-upload-overlay/video-upload-overlay.component';
import { VideoCardComponent } from '../video-card/video-card.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    VideoUploadOverlayComponent,
    VideoCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public dataManager = inject(DataManagerService);
  public menueService = inject(MenueStateService);
  public homeRoute: boolean = false;
  public privateRoute: boolean = false;

  private route = inject(ActivatedRoute);

  constructor() {}

  async ngOnInit() {
    this.setRoute();
    await this.dataManager.getPublicVideos();
    await this.dataManager.getPrivateVideos();
  }

  setRoute() {
    this.route.queryParams.subscribe((params) => {
      const visibility = params['visibility'];

      if (visibility === 'public') {
        this.homeRoute = true;
        this.privateRoute = false;
      } else if (visibility === 'private') {
        this.homeRoute = false;
        this.privateRoute = true;
      }
    });
  }
}
