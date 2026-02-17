import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewConsignorComponent } from './view-consignor.component';

describe('ViewConsignorComponent', () => {
  let component: ViewConsignorComponent;
  let fixture: ComponentFixture<ViewConsignorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewConsignorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewConsignorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
