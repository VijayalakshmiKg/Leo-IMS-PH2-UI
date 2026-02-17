import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountSettingsService } from 'src/app/modules/account-settings/account-settings.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { unitModel } from '../../masterModel/unitModel';
import { MasterService } from '../../master.service';

@Component({
  selector: 'app-add-units',
  templateUrl: './add-units.component.html',
  styleUrls: ['./add-units.component.css']
})
export class AddUnitsComponent implements OnInit {
  unitesForm!: FormGroup;
  saveBtnText: any = 'Add';
  unitModel: unitModel = new unitModel();
  unitName: string = 'New';
  unitId: number = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public masterSer: MasterService, public fb: FormBuilder, public settingServ: AccountSettingsService, public dialog: MatDialogRef<AddUnitsComponent>, public utilServ: UtilityService) { }

  ngOnInit(): void {
    this.unitesForm = this.fb.group({
      unitesName: ['', Validators.required],
      description: []
    })
    //console.log(this.data);

    if (this.data && this.data?.type.toLowerCase() == 'edit') {
      this.setValues();
      this.unitName = 'Edit';
      this.saveBtnText = 'Update';
      this.unitId = this.data.data.unitID;
    } else if (this.data && this.data?.type.toLowerCase() == 'copy') {
      this.setValues();
      this.unitName = 'Copy';
      this.saveBtnText = 'Add';
      this.unitId = 0;
    }
  }

  setValues() {
    this.unitesForm.get('unitesName')?.setValue(this.data?.data?.unitName)
    this.unitesForm.get('description')?.setValue(this.data?.data?.unitsDesc)
  }

  saveunites() {
    // if (this.unitesForm.valid) {
    //   let unitesNameExists = false;

    //   if (this.data && this.data.type === 'Edit') {
    //     const originalBinName = this.data.unitesName; // Original value from data
    //     const newBinName = this.unitesForm.value.unitesName; // Current value in the form control
    //     //console.log(originalBinName, newBinName);


    //     // Check if the `unitesName` field is dirty and has a new value
    //     if (this.unitesForm.controls['unitesName'].dirty && originalBinName !== newBinName) {
    //       // Perform existence check only if the `unitesName` has been changed
    //       unitesNameExists = this.settingServ.unitesRecords.some(
    //         (record: any) => record.unitesName === newBinName
    //       );

    //       if (unitesNameExists) {
    //         this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Unite name already exists' });
    //         return; // Exit the function
    //       }
    //     } else {
    //       // If `unitesName` is unchanged or not modified, skip validation
    //       //console.log(this.unitesForm.value);
    //       this.settingServ.unitesRecords.splice(this.data.index, 1, this.unitesForm.value);
    //       this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Unit updated successfully' });
    //       this.close(true);
    //     }

    //     // Proceed with updating the Unite
    //     //console.log(this.unitesForm.value);
    //     this.settingServ.unitesRecords.splice(this.data.index, 1, this.unitesForm.value);
    //     this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Unit updated successfully' });
    //     this.close(true);
    //   } else if (this.data && this.data.type === 'Copy') {
    //     const newBinName = this.unitesForm.value.unitesName;
    //     unitesNameExists = this.settingServ.unitesRecords.some(
    //       (record: any) => record.unitesName === newBinName
    //     );

    //     if (unitesNameExists) {
    //       this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Unit name already exists' });
    //       return;
    //     }

    //     //console.log(this.unitesForm.value);
    //     this.settingServ.unitesRecords.push(this.unitesForm.value);
    //     this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Unit copied successfully' });
    //     this.close(true);
    //   } else {
    //     const newBinName = this.unitesForm.value.unitesName;
    //     unitesNameExists = this.settingServ.unitesRecords.some(
    //       (record: any) => record.unitesName === newBinName
    //     );

    //     if (unitesNameExists) {
    //       this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Unit name already exists' });
    //       return;
    //     }

    //     //console.log(this.unitesForm.value);


    //   }
    // }
    if (this.unitesForm.valid && this.unitName.toLowerCase() != 'copy') {
      this.unitModel.UnitID = this.unitId;
      this.unitModel.UnitsDesc = this.unitesForm.value.description;
      this.unitModel.UnitName = this.unitesForm.value.unitesName;
      this.unitModel.OrderNo = 0;
      //console.log(this.unitModel);
      
      this.masterSer.addUpdateUnit(this.unitModel).then((res: any) => {
        //console.log(res);
        if (res) {
          if (this.unitName.toLowerCase() == 'new') {
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Unit created successfully' });
            this.close(true);
          }
          if (this.unitName.toLowerCase() == 'edit') {
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Unit updated successfully' });
            this.close(true);
          }
        }
      })
    } else if(this.unitesForm.valid && this.unitName.toLowerCase() == 'copy'){
      if(this.data.data.unitName.toLowerCase() == this.unitesForm.value.unitesName.toLowerCase()){
        this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Unit name already exists' });
              return; // Exit the function
      } else{
        this.unitModel.UnitID = this.unitId;
        this.unitModel.UnitsDesc = this.unitesForm.value.description;
        this.unitModel.UnitName = this.unitesForm.value.unitesName;
        this.unitModel.OrderNo = 0;
        //console.log(this.unitModel);
        
        this.masterSer.addUpdateUnit(this.unitModel).then((res: any) => {
          //console.log(res);
          if (res) {
              this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Unit copied successfully' });
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
