import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerDriverMainComponent } from './customer-driver-main.component';

describe('CustomerDriverMainComponent', () => {
  let component: CustomerDriverMainComponent;
  let fixture: ComponentFixture<CustomerDriverMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerDriverMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDriverMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
