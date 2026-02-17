import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountVerifyComponent } from './user-account-verify.component';

describe('UserAccountVerifyComponent', () => {
  let component: UserAccountVerifyComponent;
  let fixture: ComponentFixture<UserAccountVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccountVerifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
