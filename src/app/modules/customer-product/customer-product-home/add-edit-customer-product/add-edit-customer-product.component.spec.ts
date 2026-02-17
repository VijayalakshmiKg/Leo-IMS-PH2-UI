import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCustomerProductComponent } from './add-edit-customer-product.component';

describe('AddEditCustomerProductComponent', () => {
  let component: AddEditCustomerProductComponent;
  let fixture: ComponentFixture<AddEditCustomerProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCustomerProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCustomerProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
