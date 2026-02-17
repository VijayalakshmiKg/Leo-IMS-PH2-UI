import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewConsigneeComponent } from './view-consignee.component';

describe('ViewConsigneeComponent', () => {
  let component: ViewConsigneeComponent;
  let fixture: ComponentFixture<ViewConsigneeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewConsigneeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewConsigneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
