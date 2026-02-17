import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewCustomerDriverComponent } from './view-customer-driver.component';

describe('ViewCustomerDriverComponent', () => {
  let component: ViewCustomerDriverComponent;
  let fixture: ComponentFixture<ViewCustomerDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCustomerDriverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCustomerDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
