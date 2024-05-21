import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoUploadOverlayComponent } from './video-upload-overlay.component';

describe('VideoUploadOverlayComponent', () => {
  let component: VideoUploadOverlayComponent;
  let fixture: ComponentFixture<VideoUploadOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoUploadOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideoUploadOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
