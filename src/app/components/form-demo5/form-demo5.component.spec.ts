import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDemo5Component } from './form-demo5.component';

describe('FormDemo5Component', () => {
  let component: FormDemo5Component;
  let fixture: ComponentFixture<FormDemo5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDemo5Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDemo5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
