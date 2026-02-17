import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTrailerOutMainComponent } from './customer-trailer-out-main.component';

describe('CustomerTrailerOutMainComponent', () => {
  let component: CustomerTrailerOutMainComponent;
  let fixture: ComponentFixture<CustomerTrailerOutMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerTrailerOutMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTrailerOutMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
