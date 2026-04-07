import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProductBinComponent } from './view-product-bin.component';

describe('ViewProductBinComponent', () => {
  let component: ViewProductBinComponent;
  let fixture: ComponentFixture<ViewProductBinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProductBinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProductBinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
