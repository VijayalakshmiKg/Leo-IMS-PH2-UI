import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsigneeHomeComponent } from './consignee-home.component';

describe('ConsigneeHomeComponent', () => {
  let component: ConsigneeHomeComponent;
  let fixture: ComponentFixture<ConsigneeHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsigneeHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsigneeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
