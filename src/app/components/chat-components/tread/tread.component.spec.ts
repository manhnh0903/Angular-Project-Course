import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreadComponent } from './tread.component';

describe('TreadComponent', () => {
  let component: TreadComponent;
  let fixture: ComponentFixture<TreadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TreadComponent]
    });
    fixture = TestBed.createComponent(TreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
