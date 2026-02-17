import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCustomerProductTypeComponent } from './add-edit-customer-product-type.component';

describe('AddEditCustomerProductTypeComponent', () => {
  let component: AddEditCustomerProductTypeComponent;
  let fixture: ComponentFixture<AddEditCustomerProductTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCustomerProductTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCustomerProductTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
