import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversMainComponent } from './drivers-main.component';

describe('DriversMainComponent', () => {
  let component: DriversMainComponent;
  let fixture: ComponentFixture<DriversMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriversMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriversMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
