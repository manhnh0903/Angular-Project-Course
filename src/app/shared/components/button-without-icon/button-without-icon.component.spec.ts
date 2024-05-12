import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonWithoutIconComponent } from './button-without-icon.component';

describe('ButtonWithoutIconComponent', () => {
  let component: ButtonWithoutIconComponent;
  let fixture: ComponentFixture<ButtonWithoutIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonWithoutIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ButtonWithoutIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
