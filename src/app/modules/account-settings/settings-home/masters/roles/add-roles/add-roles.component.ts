import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountSettingsService } from 'src/app/modules/account-settings/account-settings.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-add-roles',
  templateUrl: './add-roles.component.html',
  styleUrls: ['./add-roles.component.css']
})
export class AddRolesComponent implements OnInit {

  rolesForm!: FormGroup
  saveBtnText: any = 'Add'

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public fb: FormBuilder, public settingServ: AccountSettingsService, public dialog: MatDialogRef<AddRolesComponent>, public utilServ: UtilityService) { }

  ngOnInit(): void {
    this.rolesForm = this.fb.group({
      roleName: ['', Validators.required],
      description: []
    })
    //console.log(this.data);

    if (this.data) {
      this.setValues()
      this.saveBtnText = 'Update'
    }
  }

  setValues() {
    this.rolesForm.get('roleName')?.setValue(this.data?.data?.roleName)
    this.rolesForm.get('description')?.setValue(this.data?.data?.description)
  }

  saveRoles() {
    if (this.rolesForm.valid) {
      if (this.data == null) {
        //console.log(this.rolesForm.value);
        this.settingServ.rolesRecords.push(this.rolesForm.value)
        this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Role created successfully' });
        this.close(true)
      }
      else {
        //console.log(this.rolesForm.value);
        this.settingServ.rolesRecords.splice(this.data.index, 1, this.rolesForm.value)
        this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Role updated successfully' });
        this.close(true)
      }
    }
  }

  close(value?: boolean) {
    this.dialog.close(value)
  }

}
