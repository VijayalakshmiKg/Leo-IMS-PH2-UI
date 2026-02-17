import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTrailerWasherComponent } from './view-trailer-washer.component';

describe('ViewTrailerWasherComponent', () => {
  let component: ViewTrailerWasherComponent;
  let fixture: ComponentFixture<ViewTrailerWasherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTrailerWasherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTrailerWasherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
