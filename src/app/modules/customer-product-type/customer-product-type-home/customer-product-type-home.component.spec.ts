import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProductTypeHomeComponent } from './customer-product-type-home.component';

describe('CustomerProductTypeHomeComponent', () => {
  let component: CustomerProductTypeHomeComponent;
  let fixture: ComponentFixture<CustomerProductTypeHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerProductTypeHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerProductTypeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
