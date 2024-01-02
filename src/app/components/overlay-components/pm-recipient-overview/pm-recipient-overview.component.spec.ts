import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmRecipientOverviewComponent } from './pm-recipient-overview.component';

describe('PmRecipientOverviewComponent', () => {
  let component: PmRecipientOverviewComponent;
  let fixture: ComponentFixture<PmRecipientOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PmRecipientOverviewComponent]
    });
    fixture = TestBed.createComponent(PmRecipientOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
