import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomerTrailerOutComponent } from './view-customer-trailer-out.component';

describe('ViewCustomerTrailerOutComponent', () => {
  let component: ViewCustomerTrailerOutComponent;
  let fixture: ComponentFixture<ViewCustomerTrailerOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCustomerTrailerOutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCustomerTrailerOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
