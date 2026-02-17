import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrailerTypeComponent } from './add-trailer-type.component';

describe('AddTrailerTypeComponent', () => {
  let component: AddTrailerTypeComponent;
  let fixture: ComponentFixture<AddTrailerTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTrailerTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTrailerTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
