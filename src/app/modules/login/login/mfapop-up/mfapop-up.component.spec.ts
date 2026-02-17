import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MFAPopUpComponent } from './mfapop-up.component';

describe('MFAPopUpComponent', () => {
  let component: MFAPopUpComponent;
  let fixture: ComponentFixture<MFAPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MFAPopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MFAPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
