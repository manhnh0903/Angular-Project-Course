import { TestBed } from '@angular/core/testing';

import { MenueStateService } from './menue-state.service';

describe('MenueStateService', () => {
  let service: MenueStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenueStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
