import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomerTrailerOutTypeComponent } from './view-customer-trailer-out-type.component';

describe('ViewCustomerTrailerOutTypeComponent', () => {
  let component: ViewCustomerTrailerOutTypeComponent;
  let fixture: ComponentFixture<ViewCustomerTrailerOutTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCustomerTrailerOutTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCustomerTrailerOutTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
