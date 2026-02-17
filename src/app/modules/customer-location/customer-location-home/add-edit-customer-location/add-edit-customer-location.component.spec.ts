import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditCustomerLocationComponent } from './add-edit-customer-location.component';

describe('AddEditCustomerLocationComponent', () => {
  let component: AddEditCustomerLocationComponent;
  let fixture: ComponentFixture<AddEditCustomerLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCustomerLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCustomerLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
