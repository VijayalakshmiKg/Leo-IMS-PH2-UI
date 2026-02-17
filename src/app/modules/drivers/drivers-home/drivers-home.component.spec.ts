import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversHomeComponent } from './drivers-home.component';

describe('DriversHomeComponent', () => {
  let component: DriversHomeComponent;
  let fixture: ComponentFixture<DriversHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriversHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriversHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
