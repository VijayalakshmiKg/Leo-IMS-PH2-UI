import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProductTypeMainComponent } from './customer-product-type-main.component';

describe('CustomerProductTypeMainComponent', () => {
  let component: CustomerProductTypeMainComponent;
  let fixture: ComponentFixture<CustomerProductTypeMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerProductTypeMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerProductTypeMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
