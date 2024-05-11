import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticateEmailComponent } from './authenticate-email.component';

describe('AuthenticateEmailComponent', () => {
  let component: AuthenticateEmailComponent;
  let fixture: ComponentFixture<AuthenticateEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticateEmailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthenticateEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
