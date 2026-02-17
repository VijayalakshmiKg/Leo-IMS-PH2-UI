import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTypeMainComponent } from './product-type-main.component';

describe('ProductTypeMainComponent', () => {
  let component: ProductTypeMainComponent;
  let fixture: ComponentFixture<ProductTypeMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductTypeMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTypeMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
