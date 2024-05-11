import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInputWithErrorComponent } from './form-input-with-error.component';

describe('FormInputWithErrorComponent', () => {
  let component: FormInputWithErrorComponent;
  let fixture: ComponentFixture<FormInputWithErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInputWithErrorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormInputWithErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
