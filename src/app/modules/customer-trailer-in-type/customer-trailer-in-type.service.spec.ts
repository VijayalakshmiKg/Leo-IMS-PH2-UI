import { TestBed } from '@angular/core/testing';

import { CustomerTrailerInTypeService } from './customer-trailer-in-type.service';

describe('CustomerTrailerInTypeService', () => {
  let service: CustomerTrailerInTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerTrailerInTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
