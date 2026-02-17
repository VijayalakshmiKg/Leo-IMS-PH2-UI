import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProductMainComponent } from './customer-product-main.component';

describe('CustomerProductMainComponent', () => {
  let component: CustomerProductMainComponent;
  let fixture: ComponentFixture<CustomerProductMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerProductMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerProductMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
