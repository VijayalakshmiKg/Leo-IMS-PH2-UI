import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerLocationHomeComponent } from './customer-location-home.component';

describe('CustomerLocationHomeComponent', () => {
  let component: CustomerLocationHomeComponent;
  let fixture: ComponentFixture<CustomerLocationHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerLocationHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerLocationHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
