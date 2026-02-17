import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTrailerInTypeMainComponent } from './customer-trailer-in-type-main.component';

describe('CustomerTrailerInTypeMainComponent', () => {
  let component: CustomerTrailerInTypeMainComponent;
  let fixture: ComponentFixture<CustomerTrailerInTypeMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerTrailerInTypeMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTrailerInTypeMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
