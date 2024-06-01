import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergemapDemoComponent } from './mergemap-demo.component';

describe('MergemapDemoComponent', () => {
  let component: MergemapDemoComponent;
  let fixture: ComponentFixture<MergemapDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergemapDemoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MergemapDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
