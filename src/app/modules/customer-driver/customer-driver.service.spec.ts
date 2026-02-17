import { TestBed } from '@angular/core/testing';
import { CustomerDriverService } from './customer-driver.service';

describe('CustomerDriverService', () => {
  let service: CustomerDriverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerDriverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
