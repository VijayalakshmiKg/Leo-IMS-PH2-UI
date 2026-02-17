import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCustomerTrailerOutTypeComponent } from './add-edit-customer-trailer-out-type.component';

describe('AddEditCustomerTrailerOutTypeComponent', () => {
  let component: AddEditCustomerTrailerOutTypeComponent;
  let fixture: ComponentFixture<AddEditCustomerTrailerOutTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCustomerTrailerOutTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCustomerTrailerOutTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
