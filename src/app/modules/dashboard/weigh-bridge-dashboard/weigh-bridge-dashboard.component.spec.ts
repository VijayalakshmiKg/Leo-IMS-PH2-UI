import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeighBridgeDashboardComponent } from './weigh-bridge-dashboard.component';

describe('WeighBridgeDashboardComponent', () => {
  let component: WeighBridgeDashboardComponent;
  let fixture: ComponentFixture<WeighBridgeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeighBridgeDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeighBridgeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
