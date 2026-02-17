import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditShunterDriversComponent } from './add-edit-shunter-drivers.component';

describe('AddEditShunterDriversComponent', () => {
  let component: AddEditShunterDriversComponent;
  let fixture: ComponentFixture<AddEditShunterDriversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditShunterDriversComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditShunterDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
