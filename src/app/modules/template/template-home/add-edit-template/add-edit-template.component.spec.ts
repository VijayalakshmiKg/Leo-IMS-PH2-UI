import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTemplateComponent } from './add-edit-template.component';

describe('AddEditTemplateComponent', () => {
  let component: AddEditTemplateComponent;
  let fixture: ComponentFixture<AddEditTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
