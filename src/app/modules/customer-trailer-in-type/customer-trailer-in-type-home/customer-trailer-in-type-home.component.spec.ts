import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTrailerInTypeHomeComponent } from './customer-trailer-in-type-home.component';

describe('CustomerTrailerInTypeHomeComponent', () => {
  let component: CustomerTrailerInTypeHomeComponent;
  let fixture: ComponentFixture<CustomerTrailerInTypeHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerTrailerInTypeHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTrailerInTypeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
