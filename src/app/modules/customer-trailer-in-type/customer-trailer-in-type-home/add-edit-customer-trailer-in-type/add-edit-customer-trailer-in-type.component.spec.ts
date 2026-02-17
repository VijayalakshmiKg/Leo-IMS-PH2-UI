import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCustomerTrailerInTypeComponent } from './add-edit-customer-trailer-in-type.component';

describe('AddEditCustomerTrailerInTypeComponent', () => {
  let component: AddEditCustomerTrailerInTypeComponent;
  let fixture: ComponentFixture<AddEditCustomerTrailerInTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCustomerTrailerInTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCustomerTrailerInTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
