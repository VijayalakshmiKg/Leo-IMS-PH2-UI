import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomerProductTypeComponent } from './view-customer-product-type.component';

describe('ViewCustomerProductTypeComponent', () => {
  let component: ViewCustomerProductTypeComponent;
  let fixture: ComponentFixture<ViewCustomerProductTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCustomerProductTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCustomerProductTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
