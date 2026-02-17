import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesPermissionHomeComponent } from './roles-permission-home.component';

describe('RolesPermissionHomeComponent', () => {
  let component: RolesPermissionHomeComponent;
  let fixture: ComponentFixture<RolesPermissionHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesPermissionHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesPermissionHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
