import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProductHomeComponent } from './customer-product-home.component';

describe('CustomerProductHomeComponent', () => {
  let component: CustomerProductHomeComponent;
  let fixture: ComponentFixture<CustomerProductHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerProductHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerProductHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
