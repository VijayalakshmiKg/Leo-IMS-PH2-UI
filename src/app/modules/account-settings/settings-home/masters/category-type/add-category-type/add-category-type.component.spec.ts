import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCategoryTypeComponent } from './add-category-type.component';

describe('AddCategoryTypeComponent', () => {
  let component: AddCategoryTypeComponent;
  let fixture: ComponentFixture<AddCategoryTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCategoryTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCategoryTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
