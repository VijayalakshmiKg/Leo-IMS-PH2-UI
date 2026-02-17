import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AccountSettingsService } from 'src/app/modules/account-settings/account-settings.service';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { genderModel } from '../../masterModel/genderModel';
import { MasterService } from '../../master.service';

@Component({
  selector: 'app-add-genders',
  templateUrl: './add-genders.component.html',
  styleUrls: ['./add-genders.component.css']
})
export class AddGendersComponent implements OnInit {
  gendersForm!: FormGroup
  saveBtnText: any = 'Add'
  genderModel: genderModel = new genderModel();
  genderId: number = 0;
  genderName: string = 'New';
  gendersList: any = [];
  genderExits:boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public fb: FormBuilder,public utilSer: UtilityService, public masterSer: MasterService, public settingServ: AccountSettingsService, public dialog: MatDialogRef<AddGendersComponent>, public utilServ: UtilityService, public openDialog: MatDialog) { }

  ngOnInit(): void {
    //console.log(this.settingServ.genderData);
    this.gendersList = this.settingServ.genderData
    this.gendersForm = this.fb.group({
      genderName: ['', Validators.required],
      description: []
    })
    //console.log(this.data);

    if (this.data && this.data.type.toLowerCase() == 'edit') {
      this.setValues()
      this.saveBtnText = 'Update';
      this.genderName = 'Edit'
      this.genderId = this.data.data.genderID;
    }
    if (this.data && this.data.type.toLowerCase() == 'copy') {
      this.setValues()
      this.saveBtnText = 'Copy';
      this.genderName = 'Copy'
      this.genderId = 0;
    }
    this.getAllGender();
  }

  setValues() {
    this.gendersForm.get('genderName')?.setValue(this.data?.data?.genderCode)
    this.gendersForm.get('description')?.setValue(this.data?.data?.genderDesc)
  }

  getAllGender() {
    this.masterSer.getAllGender().then((res: any) => {
      //console.log(res);
      this.gendersList = res;
    })
  }

  dulpicateGender() {
    const enteredGender = this.gendersForm.get('genderName')?.value?.trim()?.toLowerCase();
    this.genderExits = this.gendersList.some((gender: any) =>
      gender.genderCode?.trim()?.toLowerCase() === enteredGender  // make sure field name matches API!
    );
    if (this.genderExits) {
      this.utilSer.toaster.next({ type: customToaster.infoToast, message: 'Gender name already exists!' })
    }
  }

  saveGenders() {
    // if (this.gendersForm.valid) {
    //   let genderNameExists = false;

    //   if (this.data && this.data.type === 'Edit') {
    //     const originalGenderName = this.data.genderName; // Original value from data
    //     const newGenderName = this.gendersForm.value.genderName; // Current value in the form control
    //     //console.log(originalGenderName,newGenderName);


    //     // Check if the `GenderName` field is dirty and has a new value
    //     if (this.gendersForm.controls['genderName'].dirty && originalGenderName !== newGenderName) {
    //       // Perform existence check only if the `GenderName` has been changed
    //       genderNameExists = this.settingServ.gendersRecords.some(
    //         (record: any) => record.GenderName === newGenderName
    //       );

    //       if (genderNameExists) {
    //         this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Gender name already exists' });
    //         return; // Exit the function
    //       }
    //     } else {
    //       // If `GenderName` is unchanged or not modified, skip validation
    //       //console.log(this.gendersForm.value);
    //       this.settingServ.gendersRecords.splice(this.data.index, 1, this.gendersForm.value);
    //       this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Gender updated successfully' });
    //       this.close(true);
    //     }

    //     // Proceed with updating the Gender
    //     //console.log(this.gendersForm.value);
    //     this.settingServ.gendersRecords.splice(this.data.index, 1, this.gendersForm.value);
    //     this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Gender updated successfully' });
    //     this.close(true);
    //   } else if (this.data && this.data.type === 'Copy') {
    //     const newGenderName = this.gendersForm.value.genderName;
    //     genderNameExists = this.settingServ.gendersRecords.some(
    //       (record: any) => record.genderName === newGenderName
    //     );

    //     if (genderNameExists) {
    //       this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Gender name already exists' });
    //       return;
    //     }

    //     //console.log(this.gendersForm.value);
    //     this.settingServ.gendersRecords.push(this.gendersForm.value);
    //     this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Gender copied successfully' });
    //     this.close(true);
    //   } else {
    //     const newGenderName = this.gendersForm.value.genderName;
    //     genderNameExists = this.settingServ.gendersRecords.some(
    //       (record: any) => record.genderName === newGenderName
    //     );

    //     if (genderNameExists) {
    //       this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Gender name already exists' });
    //       return;
    //     }

    //console.log(this.gendersForm.value);
    if (this.gendersForm.valid && this.genderName.toLowerCase() != 'copy') {
      this.genderModel.GenderID = this.genderId;
      this.genderModel.GenderDesc = this.gendersForm.value.description;
      this.genderModel.GenderCode = this.gendersForm.value.genderName;
      this.genderModel.OrderNo = 0;
      //console.log(this.genderModel);
      this.masterSer.addUpdateGender(this.genderModel).then((res: any) => {
        //console.log(res);
        if (res) {
          // this.settingServ.gendersRecords.push(this.gendersForm.value);
          if (this.genderName.toLowerCase() == 'new') {
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Gender created successfully' });
            this.close(true);
          }
          if (this.genderName.toLowerCase() == 'edit') {
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Gender updated successfully' });
            this.close(true);
          }
        }
      })
    } else if (this.gendersForm.valid && this.genderName.toLowerCase() == 'copy') {
      //console.log(this.data.data.genderCode.toLowerCase() == this.gendersForm.value.genderName.toLowerCase());

      if (this.data.data.genderCode.toLowerCase() == this.gendersForm.value.genderName.toLowerCase()) {
        this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Gender name already exists' });
        return; // Exit the function
      } else {
        this.genderModel.GenderID = this.genderId;
        this.genderModel.GenderDesc = this.gendersForm.value.description;
        this.genderModel.GenderCode = this.gendersForm.value.genderName;
        this.genderModel.OrderNo = 0;
        //console.log(this.genderModel);
        this.masterSer.addUpdateGender(this.genderModel).then((res: any) => {
          //console.log(res);
          if (res) {
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Gender copied successfully' });
            this.close(true);
          }
        })
      }
    }

  }
  // }
  // }


  close(value?: boolean) {
    this.dialog.close(value)
  }


  Cancle() {
    // let dialogRef = this.openDialog.open(CustomMessageBoxComponent, {
    //   width: '480px',
    //   height: 'auto',
    //   data: { type: messageBox.cancelMessageBox, message: 'Do you really want to cancle  ?', title: 'Cancle' },
    //   disableClose: true,
    //   autoFocus: false,
    //   panelClass: 'custom-msg-box'
    // })
    // dialogRef.afterClosed().subscribe((res:any) => {
    //   if (res) {
    this.close()
    //   }
    // })
  }
}
