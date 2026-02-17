import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveHomeComponent } from './executive-home.component';

describe('ExecutiveHomeComponent', () => {
  let component: ExecutiveHomeComponent;
  let fixture: ComponentFixture<ExecutiveHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutiveHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutiveHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
