import { TestBed } from '@angular/core/testing';

import { CustomerProductTypeService } from './customer-product-type.service';

describe('CustomerProductTypeService', () => {
  let service: CustomerProductTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerProductTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
