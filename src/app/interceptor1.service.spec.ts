import { TestBed } from '@angular/core/testing';

import { Interceptor1Service } from './interceptor1.service';

describe('Interceptor1Service', () => {
  let service: Interceptor1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Interceptor1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
