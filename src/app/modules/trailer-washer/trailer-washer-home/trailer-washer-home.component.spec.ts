import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerWasherHomeComponent } from './trailer-washer-home.component';

describe('TrailerWasherHomeComponent', () => {
  let component: TrailerWasherHomeComponent;
  let fixture: ComponentFixture<TrailerWasherHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailerWasherHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailerWasherHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
