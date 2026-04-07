import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBinMainComponent } from './product-bin-main.component';

describe('ProductBinMainComponent', () => {
  let component: ProductBinMainComponent;
  let fixture: ComponentFixture<ProductBinMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductBinMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBinMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
