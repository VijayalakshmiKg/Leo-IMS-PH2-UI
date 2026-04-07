import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBinHomeComponent } from './product-bin-home.component';

describe('ProductBinHomeComponent', () => {
  let component: ProductBinHomeComponent;
  let fixture: ComponentFixture<ProductBinHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductBinHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBinHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
