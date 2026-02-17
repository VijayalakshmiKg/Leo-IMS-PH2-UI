import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTrailerInHomeComponent } from './customer-trailer-in-home.component';

describe('CustomerTrailerInHomeComponent', () => {
  let component: CustomerTrailerInHomeComponent;
  let fixture: ComponentFixture<CustomerTrailerInHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerTrailerInHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTrailerInHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
