import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Emp3Component } from './emp3.component';

describe('Emp3Component', () => {
  let component: Emp3Component;
  let fixture: ComponentFixture<Emp3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Emp3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Emp3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
