import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignorMainComponent } from './consignor-main.component';

describe('ConsignorMainComponent', () => {
  let component: ConsignorMainComponent;
  let fixture: ComponentFixture<ConsignorMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsignorMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignorMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
