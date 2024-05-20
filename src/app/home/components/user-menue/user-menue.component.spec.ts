import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMenueComponent } from './user-menue.component';

describe('UserMenueComponent', () => {
  let component: UserMenueComponent;
  let fixture: ComponentFixture<UserMenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMenueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserMenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
