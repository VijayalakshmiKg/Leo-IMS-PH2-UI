import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewShunterDriversComponent } from './view-shunter-drivers.component';

describe('ViewShunterDriversComponent', () => {
  let component: ViewShunterDriversComponent;
  let fixture: ComponentFixture<ViewShunterDriversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewShunterDriversComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewShunterDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
