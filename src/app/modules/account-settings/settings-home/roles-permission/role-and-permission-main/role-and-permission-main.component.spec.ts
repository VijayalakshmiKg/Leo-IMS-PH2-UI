import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleAndPermissionMainComponent } from './role-and-permission-main.component';

describe('RoleAndPermissionMainComponent', () => {
  let component: RoleAndPermissionMainComponent;
  let fixture: ComponentFixture<RoleAndPermissionMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleAndPermissionMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleAndPermissionMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
