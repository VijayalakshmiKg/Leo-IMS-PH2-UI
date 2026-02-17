import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignorHomeComponent } from './consignor-home.component';

describe('ConsignorHomeComponent', () => {
  let component: ConsignorHomeComponent;
  let fixture: ComponentFixture<ConsignorHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsignorHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignorHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
