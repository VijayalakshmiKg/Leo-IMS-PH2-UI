import { TestBed } from '@angular/core/testing';
import { CustomerLocationService } from './customer-location.service';

describe('CustomerLocationService', () => {
  let service: CustomerLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
