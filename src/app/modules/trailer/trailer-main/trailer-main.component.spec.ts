import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerMainComponent } from './trailer-main.component';

describe('TrailerMainComponent', () => {
  let component: TrailerMainComponent;
  let fixture: ComponentFixture<TrailerMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailerMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
