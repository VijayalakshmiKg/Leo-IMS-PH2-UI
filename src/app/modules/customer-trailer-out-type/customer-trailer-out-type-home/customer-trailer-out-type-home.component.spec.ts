import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTrailerOutTypeHomeComponent } from './customer-trailer-out-type-home.component';

describe('CustomerTrailerOutTypeHomeComponent', () => {
  let component: CustomerTrailerOutTypeHomeComponent;
  let fixture: ComponentFixture<CustomerTrailerOutTypeHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerTrailerOutTypeHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTrailerOutTypeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
