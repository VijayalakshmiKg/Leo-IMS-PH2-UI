import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountSettingsService } from 'src/app/modules/account-settings/account-settings.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { statusModel } from '../../masterModel/statusModel';
import { MasterService } from '../../master.service';

@Component({
  selector: 'app-add-status',
  templateUrl: './add-status.component.html',
  styleUrls: ['./add-status.component.css']
})
export class AddStatusComponent implements OnInit {
  statusForm!: FormGroup
  saveBtnText: any = 'Add';
  statusModel: statusModel = new statusModel();
  stausId: number = 0;
  statusName: string = 'New';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public fb: FormBuilder, public masterSer: MasterService, public settingServ: AccountSettingsService, public dialog: MatDialogRef<AddStatusComponent>, public utilServ: UtilityService) { }

  ngOnInit(): void {
    this.statusForm = this.fb.group({
      statusName: ['', Validators.required],
      description: []
    })
    //console.log(this.data);

    if (this.data && this.data.type == 'Edit') {
      this.setValues()
      this.saveBtnText = 'Update';
      this.statusName = 'Edit';
      this.stausId = this.data.data.statusId;
    }
    else if (this.data && this.data.type == 'Copy') {
      this.setValues()
      this.saveBtnText = 'Add';
      this.statusName = 'Copy';
      this.stausId = 0;
    }
    //console.log(this.settingServ.statusRecords);

  }

  setValues() {
    this.statusForm.get('statusName')?.setValue(this.data?.data?.statusName)
    this.statusForm.get('description')?.setValue(this.data?.data?.description)
  }

  savestatus() {
    // if (this.statusForm.valid) {
    //   let statusNameExists = false;

    //   if (this.data && this.data.type === 'Edit') {
    //     const originalStatusName = this.data.statusName; // Original value from data
    //     const newStatusName = this.statusForm.value.statusName; // Current value in the form control

    //     // Check if the `statusName` field is dirty and has a new value
    //     if (this.statusForm.controls['statusName'].dirty && originalStatusName !== newStatusName) {
    //       // Perform existence check only if the `statusName` has been changed
    //       statusNameExists = this.settingServ.statusRecords.some(
    //         (record: any) => record.statusName === newStatusName
    //       );

    //       if (statusNameExists) {
    //         this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Status name already exists' });
    //         return; // Exit the function
    //       }
    //     } else {
    //       // If `statusName` is unchanged or not modified, skip validation
    //       //console.log(this.statusForm.value);
    //       this.settingServ.statusRecords.splice(this.data.index, 1, this.statusForm.value);
    //       this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Status updated successfully' });
    //       this.close(true);
    //     }

    //     // Proceed with updating the status
    //     //console.log(this.statusForm.value);
    //     this.settingServ.statusRecords.splice(this.data.index, 1, this.statusForm.value);
    //     this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Status updated successfully' });
    //     this.close(true);
    //   } else if (this.data && this.data.type === 'Copy') {
    //     const newStatusName = this.statusForm.value.statusName;
    //     statusNameExists = this.settingServ.statusRecords.some(
    //       (record: any) => record.statusName === newStatusName
    //     );

    //     if (statusNameExists) {
    //       this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Status name already exists' });
    //       return;
    //     }

    //     //console.log(this.statusForm.value);
    //     this.settingServ.statusRecords.push(this.statusForm.value);
    //     this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Status copied successfully' });
    //     this.close(true);
    //   } else {
    //     const newStatusName = this.statusForm.value.statusName;
    //     statusNameExists = this.settingServ.statusRecords.some(
    //       (record: any) => record.statusName === newStatusName
    //     );

    //     if (statusNameExists) {
    //       this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Status name already exists' });
    //       return;
    //     }
    //     //console.log(this.statusForm.value);

    //   }
    // }

    if (this.statusForm.valid && this.statusName.toLowerCase() != 'copy') {
      this.statusModel.StatusId = this.stausId;
      this.statusModel.Description = this.statusForm.value.description;
      this.statusModel.StatusName = this.statusForm.value.statusName;
      //console.log(this.statusModel);
      this.masterSer.addUpdateStatus(this.statusModel).then((res: any) => {
        if (res) {
          // this.settingServ.statusRecords.push(this.statusForm.value);
          if (this.statusName.toLowerCase() == 'new') {
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Status created successfully' });
            this.close(true);
          } else if (this.statusName.toLowerCase() == 'edit') {
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Status updated successfully' });
            this.close(true);
          }
        }
      })
    } else if (this.statusForm.valid && this.statusName.toLowerCase() == 'copy') {
      if (this.data.data.statusName.toLowerCase() == this.statusForm.value.statusName) {
        this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Status name already exists' });
        return;
      } else {
        this.statusModel.StatusId = this.stausId;
        this.statusModel.Description = this.statusForm.value.description;
        this.statusModel.StatusName = this.statusForm.value.statusName;
        //console.log(this.statusModel);
        this.masterSer.addUpdateStatus(this.statusModel).then((res: any) => {
          if (res) {
            // this.settingServ.statusRecords.push(this.statusForm.value);
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Status copied successfully' });
            this.close(true);
          }
        })
      }
    }
  }



  close(value?: boolean) {
    this.dialog.close(value)
  }

}
