import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShunterDriverMainComponent } from './shunter-driver-main.component';

describe('ShunterDriverMainComponent', () => {
  let component: ShunterDriverMainComponent;
  let fixture: ComponentFixture<ShunterDriverMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShunterDriverMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShunterDriverMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
