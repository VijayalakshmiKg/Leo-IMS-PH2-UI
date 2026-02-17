import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationMainComponent } from './location-main.component';

describe('LocationMainComponent', () => {
  let component: LocationMainComponent;
  let fixture: ComponentFixture<LocationMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
