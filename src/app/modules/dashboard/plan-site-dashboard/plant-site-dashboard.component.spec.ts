import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanSiteDashboardComponent } from './plant-site-dashboard.component';

describe('PlanSiteDashboardComponent', () => {
  let component: PlanSiteDashboardComponent;
  let fixture: ComponentFixture<PlanSiteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanSiteDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanSiteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
