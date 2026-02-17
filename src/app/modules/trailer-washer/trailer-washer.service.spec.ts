import { TestBed } from '@angular/core/testing';

import { TrailerWasherService } from './trailer-washer.service';

describe('TrailerWasherService', () => {
  let service: TrailerWasherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrailerWasherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
