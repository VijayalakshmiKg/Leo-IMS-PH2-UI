import { TestBed } from '@angular/core/testing';

import { ShunterDriverService } from './shunter-driver.service';

describe('ShunterDriverService', () => {
  let service: ShunterDriverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShunterDriverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
