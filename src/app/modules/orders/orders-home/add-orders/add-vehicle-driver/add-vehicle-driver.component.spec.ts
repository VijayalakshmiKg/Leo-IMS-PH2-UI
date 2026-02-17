import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVehicleDriverComponent } from './add-vehicle-driver.component';

describe('AddVehicleDriverComponent', () => {
  let component: AddVehicleDriverComponent;
  let fixture: ComponentFixture<AddVehicleDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVehicleDriverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVehicleDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
