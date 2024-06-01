import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUserOverlayComponent } from './delete-user-overlay.component';

describe('DeleteUserOverlayComponent', () => {
  let component: DeleteUserOverlayComponent;
  let fixture: ComponentFixture<DeleteUserOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteUserOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteUserOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
