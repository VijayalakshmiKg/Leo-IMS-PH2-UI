import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTrailerOutTypeMainComponent } from './customer-trailer-out-type-main.component';

describe('CustomerTrailerOutTypeMainComponent', () => {
  let component: CustomerTrailerOutTypeMainComponent;
  let fixture: ComponentFixture<CustomerTrailerOutTypeMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerTrailerOutTypeMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTrailerOutTypeMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
