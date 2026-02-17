import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerWasherMainComponent } from './trailer-washer-main.component';

describe('TrailerWasherMainComponent', () => {
  let component: TrailerWasherMainComponent;
  let fixture: ComponentFixture<TrailerWasherMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailerWasherMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailerWasherMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
