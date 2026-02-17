import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerLocationMainComponent } from './customer-location-main.component';

describe('CustomerLocationMainComponent', () => {
  let component: CustomerLocationMainComponent;
  let fixture: ComponentFixture<CustomerLocationMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerLocationMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerLocationMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
