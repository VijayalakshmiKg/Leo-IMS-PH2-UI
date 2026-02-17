import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsigneeMainComponent } from './consignee-main.component';

describe('ConsigneeMainComponent', () => {
  let component: ConsigneeMainComponent;
  let fixture: ComponentFixture<ConsigneeMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsigneeMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsigneeMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
