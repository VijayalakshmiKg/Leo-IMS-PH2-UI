import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTrailerOutHomeComponent } from './customer-trailer-out-home.component';

describe('CustomerTrailerOutHomeComponent', () => {
  let component: CustomerTrailerOutHomeComponent;
  let fixture: ComponentFixture<CustomerTrailerOutHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerTrailerOutHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTrailerOutHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
