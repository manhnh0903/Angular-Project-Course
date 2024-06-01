import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { DataManagerService } from '../../services/data-manager.service';
import { CommonModule } from '@angular/common';
import { MenueStateService } from '../../services/menue-state.service';
import { VideoUploadOverlayComponent } from '../video-upload-overlay/video-upload-overlay.component';
import { VideoCardComponent } from '../video-card/video-card.component';
import { ActivatedRoute } from '@angular/router';
import { VideoPlayerOverlayComponent } from '../video-player-overlay/video-player-overlay.component';
import { Video } from '../../../models/video.model';
import { UserOverlayComponent } from '../user-overlay/user-overlay.component';
import { DeleteUserOverlayComponent } from '../delete-user-overlay/delete-user-overlay.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    VideoUploadOverlayComponent,
    VideoCardComponent,
    VideoPlayerOverlayComponent,
    UserOverlayComponent,
    DeleteUserOverlayComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public homeRoute: boolean = false;
  public privateRoute: boolean = false;
  public videoPlayerOpen: boolean = true;
  public selectedVideo?: Video;
  public genre: string[] = ['Fitness', 'Animals', 'Landscapes'];

  private route = inject(ActivatedRoute);
  public dataManager = inject(DataManagerService);
  public menueService = inject(MenueStateService);

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

  openVideoPlayer(video: Video) {
    this.selectedVideo = video;
    this.videoPlayerOpen = true;
  }

  closeVideoPlayer() {
    this.videoPlayerOpen = false;
  }
}
