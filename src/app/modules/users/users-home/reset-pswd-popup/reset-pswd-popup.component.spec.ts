import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPswdPopupComponent } from './reset-pswd-popup.component';

describe('ResetPswdPopupComponent', () => {
  let component: ResetPswdPopupComponent;
  let fixture: ComponentFixture<ResetPswdPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetPswdPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPswdPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
