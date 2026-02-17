import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCustomerTrailerOutComponent } from './add-edit-customer-trailer-out.component';

describe('AddEditCustomerTrailerOutComponent', () => {
  let component: AddEditCustomerTrailerOutComponent;
  let fixture: ComponentFixture<AddEditCustomerTrailerOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCustomerTrailerOutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCustomerTrailerOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
