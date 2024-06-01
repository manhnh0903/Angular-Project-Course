import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForkJoinDemoComponent } from './fork-join-demo.component';

describe('ForkJoinDemoComponent', () => {
  let component: ForkJoinDemoComponent;
  let fixture: ComponentFixture<ForkJoinDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForkJoinDemoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForkJoinDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
