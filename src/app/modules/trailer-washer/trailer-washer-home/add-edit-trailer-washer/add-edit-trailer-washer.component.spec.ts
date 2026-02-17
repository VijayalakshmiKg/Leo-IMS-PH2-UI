import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTrailerWasherComponent } from './add-edit-trailer-washer.component';

describe('AddEditTrailerWasherComponent', () => {
  let component: AddEditTrailerWasherComponent;
  let fixture: ComponentFixture<AddEditTrailerWasherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditTrailerWasherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditTrailerWasherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
