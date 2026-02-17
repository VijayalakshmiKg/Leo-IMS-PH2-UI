import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShunterDriverHomeComponent } from './shunter-driver-home.component';

describe('ShunterDriverHomeComponent', () => {
  let component: ShunterDriverHomeComponent;
  let fixture: ComponentFixture<ShunterDriverHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShunterDriverHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShunterDriverHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
