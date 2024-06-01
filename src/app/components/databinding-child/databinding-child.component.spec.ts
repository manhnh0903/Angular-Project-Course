import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabindingChildComponent } from './databinding-child.component';

describe('DatabindingChildComponent', () => {
  let component: DatabindingChildComponent;
  let fixture: ComponentFixture<DatabindingChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabindingChildComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabindingChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
