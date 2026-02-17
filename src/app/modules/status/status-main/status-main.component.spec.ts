import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusMainComponent } from './status-main.component';

describe('StatusMainComponent', () => {
  let component: StatusMainComponent;
  let fixture: ComponentFixture<StatusMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
