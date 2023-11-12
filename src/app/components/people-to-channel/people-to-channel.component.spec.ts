import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleToChannelComponent } from './people-to-channel.component';

describe('PeopleToChannelComponent', () => {
  let component: PeopleToChannelComponent;
  let fixture: ComponentFixture<PeopleToChannelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PeopleToChannelComponent]
    });
    fixture = TestBed.createComponent(PeopleToChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
