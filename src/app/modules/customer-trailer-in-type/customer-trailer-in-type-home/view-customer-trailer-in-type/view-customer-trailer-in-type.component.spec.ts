import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomerTrailerInTypeComponent } from './view-customer-trailer-in-type.component';

describe('ViewCustomerTrailerInTypeComponent', () => {
  let component: ViewCustomerTrailerInTypeComponent;
  let fixture: ComponentFixture<ViewCustomerTrailerInTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCustomerTrailerInTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCustomerTrailerInTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
