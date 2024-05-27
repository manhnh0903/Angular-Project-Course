import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPlayerOverlayComponent } from './video-player-overlay.component';

describe('VideoPlayerOverlayComponent', () => {
  let component: VideoPlayerOverlayComponent;
  let fixture: ComponentFixture<VideoPlayerOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoPlayerOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideoPlayerOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
