import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTrailersComponent } from './view-trailers.component';

describe('ViewTrailersComponent', () => {
  let component: ViewTrailersComponent;
  let fixture: ComponentFixture<ViewTrailersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTrailersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTrailersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
