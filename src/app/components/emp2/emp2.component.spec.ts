import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Emp2Component } from './emp2.component';

describe('Emp2Component', () => {
  let component: Emp2Component;
  let fixture: ComponentFixture<Emp2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Emp2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Emp2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
