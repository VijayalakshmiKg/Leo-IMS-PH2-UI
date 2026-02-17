import { TestBed } from '@angular/core/testing';

import { CustomerTrailerInService } from './customer-trailer-in.service';

describe('CustomerTrailerInService', () => {
  let service: CustomerTrailerInService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerTrailerInService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
