import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewCustomerLocationComponent } from './view-customer-location.component';

describe('ViewCustomerLocationComponent', () => {
  let component: ViewCustomerLocationComponent;
  let fixture: ComponentFixture<ViewCustomerLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCustomerLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCustomerLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
