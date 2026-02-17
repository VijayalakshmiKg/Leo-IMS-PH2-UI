import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditConsigneeComponent } from './add-edit-consignee.component';

describe('AddEditConsigneeComponent', () => {
  let component: AddEditConsigneeComponent;
  let fixture: ComponentFixture<AddEditConsigneeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditConsigneeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditConsigneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
