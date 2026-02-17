import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProductTypeComponent } from './add-edit-product-type.component';

describe('AddEditProductTypeComponent', () => {
  let component: AddEditProductTypeComponent;
  let fixture: ComponentFixture<AddEditProductTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditProductTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditProductTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
