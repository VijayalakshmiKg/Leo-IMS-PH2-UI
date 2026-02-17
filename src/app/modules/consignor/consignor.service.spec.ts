import { TestBed } from '@angular/core/testing';

import { ConsignorService } from './consignor.service';

describe('ConsignorService', () => {
  let service: ConsignorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsignorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
