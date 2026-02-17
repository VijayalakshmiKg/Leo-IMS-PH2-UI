import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingMainComponent } from './tracking-main.component';

describe('TrackingMainComponent', () => {
  let component: TrackingMainComponent;
  let fixture: ComponentFixture<TrackingMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
