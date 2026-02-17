import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityTaskComponent } from './quality-task.component';

describe('QualityTaskComponent', () => {
  let component: QualityTaskComponent;
  let fixture: ComponentFixture<QualityTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualityTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
