import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomerProductComponent } from './view-customer-product.component';

describe('ViewCustomerProductComponent', () => {
  let component: ViewCustomerProductComponent;
  let fixture: ComponentFixture<ViewCustomerProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCustomerProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCustomerProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
