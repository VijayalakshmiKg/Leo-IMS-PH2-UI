import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProductBinComponent } from './add-edit-product-bin.component';

describe('AddEditProductBinComponent', () => {
  let component: AddEditProductBinComponent;
  let fixture: ComponentFixture<AddEditProductBinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditProductBinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditProductBinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
