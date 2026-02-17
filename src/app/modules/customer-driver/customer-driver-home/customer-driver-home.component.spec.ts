import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerDriverHomeComponent } from './customer-driver-home.component';

describe('CustomerDriverHomeComponent', () => {
  let component: CustomerDriverHomeComponent;
  let fixture: ComponentFixture<CustomerDriverHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerDriverHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDriverHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
