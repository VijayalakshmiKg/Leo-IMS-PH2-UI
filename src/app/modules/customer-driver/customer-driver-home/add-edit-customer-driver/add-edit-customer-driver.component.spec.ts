import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditCustomerDriverComponent } from './add-edit-customer-driver.component';

describe('AddEditCustomerDriverComponent', () => {
  let component: AddEditCustomerDriverComponent;
  let fixture: ComponentFixture<AddEditCustomerDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCustomerDriverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCustomerDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
