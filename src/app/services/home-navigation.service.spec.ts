import { TestBed } from '@angular/core/testing';

import { HomeNavigationService } from './home-navigation.service';

describe('HomeNavigationService', () => {
  let service: HomeNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
