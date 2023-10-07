import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileOverlayComponent } from './mobile-overlay.component';

describe('MobileOverlayComponent', () => {
  let component: MobileOverlayComponent;
  let fixture: ComponentFixture<MobileOverlayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MobileOverlayComponent]
    });
    fixture = TestBed.createComponent(MobileOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
