import { TestBed } from '@angular/core/testing';

import { CustomerProductService } from './customer-product.service';

describe('CustomerProductService', () => {
  let service: CustomerProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
