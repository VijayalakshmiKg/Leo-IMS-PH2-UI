import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCustomerTrailerInComponent } from './add-edit-customer-trailer-in.component';

describe('AddEditCustomerTrailerInComponent', () => {
  let component: AddEditCustomerTrailerInComponent;
  let fixture: ComponentFixture<AddEditCustomerTrailerInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCustomerTrailerInComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCustomerTrailerInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
