import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRolesPermissionComponent } from './add-edit-roles-permission.component';

describe('AddEditRolesPermissionComponent', () => {
  let component: AddEditRolesPermissionComponent;
  let fixture: ComponentFixture<AddEditRolesPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditRolesPermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditRolesPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
