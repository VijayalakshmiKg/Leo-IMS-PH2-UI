import { TestBed } from '@angular/core/testing';

import { ProductBinService } from './product-bin.service';

describe('ProductBinService', () => {
  let service: ProductBinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductBinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
