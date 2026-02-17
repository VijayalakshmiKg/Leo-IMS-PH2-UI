import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeighbridgeDashboardComponent } from './weighbridge-dashboard.component';

describe('WeighbridgeDashboardComponent', () => {
  let component: WeighbridgeDashboardComponent;
  let fixture: ComponentFixture<WeighbridgeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeighbridgeDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeighbridgeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
