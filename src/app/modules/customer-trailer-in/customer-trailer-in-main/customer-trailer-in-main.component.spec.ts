import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTrailerInMainComponent } from './customer-trailer-in-main.component';

describe('CustomerTrailerInMainComponent', () => {
  let component: CustomerTrailerInMainComponent;
  let fixture: ComponentFixture<CustomerTrailerInMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerTrailerInMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTrailerInMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
