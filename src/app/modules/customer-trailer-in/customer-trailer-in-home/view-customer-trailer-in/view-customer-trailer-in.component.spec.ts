import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomerTrailerInComponent } from './view-customer-trailer-in.component';

describe('ViewCustomerTrailerInComponent', () => {
  let component: ViewCustomerTrailerInComponent;
  let fixture: ComponentFixture<ViewCustomerTrailerInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCustomerTrailerInComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCustomerTrailerInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
