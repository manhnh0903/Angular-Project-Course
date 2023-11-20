import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmChatComponent } from './pm-chat.component';

describe('PmChatComponent', () => {
  let component: PmChatComponent;
  let fixture: ComponentFixture<PmChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PmChatComponent]
    });
    fixture = TestBed.createComponent(PmChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
