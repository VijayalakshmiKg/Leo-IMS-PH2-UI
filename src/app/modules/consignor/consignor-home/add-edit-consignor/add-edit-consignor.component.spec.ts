import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditConsignorComponent } from './add-edit-consignor.component';

describe('AddEditConsignorComponent', () => {
  let component: AddEditConsignorComponent;
  let fixture: ComponentFixture<AddEditConsignorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditConsignorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditConsignorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
