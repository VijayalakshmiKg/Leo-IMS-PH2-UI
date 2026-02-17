import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateNewPasswordComponent } from './update-new-password.component';

describe('UpdateNewPasswordComponent', () => {
  let component: UpdateNewPasswordComponent;
  let fixture: ComponentFixture<UpdateNewPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateNewPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateNewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
