import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountSettingsService } from 'src/app/modules/account-settings/account-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AddStatusComponent } from '../../status/add-status/add-status.component';
import { masterVehicleModel } from '../../masterModel/masterVehicleModel';
import { MasterService } from '../../master.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';

@Component({
  selector: 'app-add-vehicle-type',
  templateUrl: './add-vehicle-type.component.html',
  styleUrls: ['./add-vehicle-type.component.css']
})
export class AddVehicleTypeComponent implements OnInit {
  vehicleTypeForm!: FormGroup
  saveBtnText: any = 'Add';
  vehicleId: number = 0;
  vehicleName:string = 'New';
  vehicleModel: masterVehicleModel = new masterVehicleModel();
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public fb: FormBuilder, public masterSer: MasterService, public settingServ: AccountSettingsService, public dialog: MatDialogRef<AddStatusComponent>, public utilServ: UtilityService) { }

  ngOnInit(): void {
    this.vehicleTypeForm = this.fb.group({
      vehicleTypeName: ['', Validators.required],
      description: []
    })
    //console.log(this.data);

    if (this.data && this.data?.type.toLowerCase() == 'edit') {
      this.setValues();
      this.vehicleName = 'Edit';
      this.saveBtnText = 'Update';
      this.vehicleId = this.data.data.id;
    } else if(this.data && this.data?.type.toLowerCase() == 'copy'){
      this.setValues();
      this.vehicleName = 'Copy';
      this.saveBtnText = 'Add';
      this.vehicleId = 0;
    }
  }

  setValues() {
    this.vehicleTypeForm.get('vehicleTypeName')?.setValue(this.data?.data?.vehicleTypeName)
    this.vehicleTypeForm.get('description')?.setValue(this.data?.data?.description)
  }

  saveVehicleType() {

    // if (this.vehicleTypeForm.valid) {
    //   let vehicleTypeNameExists = false;

    //   if (this.data && this.data.type === 'Edit') {
    //     const originalBinName = this.data.vehicleTypeName; // Original value from data
    //     const newBinName = this.vehicleTypeForm.value.vehicleTypeName; // Current value in the form control
    //     //console.log(originalBinName, newBinName);


    //     // Check if the `VehicleTypeName` field is dirty and has a new value
    //     if (this.vehicleTypeForm.controls['vehicleTypeName'].dirty && originalBinName !== newBinName) {
    //       // Perform existence check only if the `VehicleTypeName` has been changed
    //       vehicleTypeNameExists = this.settingServ.vehicleTypeRecords.some(
    //         (record: any) => record.VehicleTypeName === newBinName
    //       );

    //       if (vehicleTypeNameExists) {
    //         this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Vehicle type name already exists' });
    //         return; // Exit the function
    //       }
    //     } else {
    //       // If `VehicleTypeName` is unchanged or not modified, skip validation
    //       //console.log(this.vehicleTypeForm.value);
    //       this.settingServ.vehicleTypeRecords.splice(this.data.index, 1, this.vehicleTypeForm.value);
    //       this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Vehicle type updated successfully' });
    //       this.close(true);
    //     }

    //     // Proceed with updating the Vehicle type
    //     //console.log(this.vehicleTypeForm.value);
    //     this.settingServ.vehicleTypeRecords.splice(this.data.index, 1, this.vehicleTypeForm.value);
    //     this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Vehicle type updated successfully' });
    //     this.close(true);
    //   } else if (this.data && this.data.type === 'Copy') {
    //     const newBinName = this.vehicleTypeForm.value.vehicleTypeName;
    //     vehicleTypeNameExists = this.settingServ.vehicleTypeRecords.some(
    //       (record: any) => record.vehicleTypeName === newBinName
    //     );

    //     if (vehicleTypeNameExists) {
    //       this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Vehicle type name already exists' });
    //       return;
    //     }

    //     //console.log(this.vehicleTypeForm.value);
    //     this.settingServ.vehicleTypeRecords.push(this.vehicleTypeForm.value);
    //     this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Vehicle type copied successfully' });
    //     this.close(true);
    //   } else {
    //     const newBinName = this.vehicleTypeForm.value.vehicleTypeName;
    //     vehicleTypeNameExists = this.settingServ.vehicleTypeRecords.some(
    //       (record: any) => record.vehicleTypeName === newBinName
    //     );

    //     if (vehicleTypeNameExists) {
    //       this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Vehicle type name already exists' });
    //       return;
    //     }

    //     //console.log(this.vehicleTypeForm.value);
    //     this.settingServ.vehicleTypeRecords.push(this.vehicleTypeForm.value);
    //     this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Vehicle type created successfully' });
    //     this.close(true);
    //   }
    // }
    if (this.vehicleTypeForm.valid && this.data?.type.toLowerCase() != 'copy') {
      this.vehicleModel.Id = this.vehicleId;
      this.vehicleModel.VehicleTypeName = this.vehicleTypeForm.value.vehicleTypeName;
      this.vehicleModel.Description = this.vehicleTypeForm.value.description;
      this.masterSer.addUpdateVehicleType(this.vehicleModel).then((res: any) => {
        //console.log(res);
        if (res) {
        if(this.vehicleName.toLowerCase() == 'new'){
          this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Vehicle type created successfully' });
          this.close(true);
        }
        if(this.vehicleName.toLowerCase() == 'edit'){
          this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Vehicle type updated successfully' });
          this.close(true);
        }
        }
      })
    } else if(this.vehicleTypeForm.valid && this.data.type.toLowerCase() == 'copy'){
            if (this.data.data.vehicleTypeName.toLowerCase() == this.vehicleTypeForm.value.vehicleTypeName.toLowerCase()) {
            this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Vehicle type name already exists' });
            return; // Exit the function
          } else {
            this.vehicleModel.Id = this.vehicleId;
            this.vehicleModel.VehicleTypeName = this.vehicleTypeForm.value.vehicleTypeName;
            this.vehicleModel.Description = this.vehicleTypeForm.value.description;
            this.masterSer.addUpdateVehicleType(this.vehicleModel).then((res: any) => {
              //console.log(res);
              if (res) {
                this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Vehicle type copied successfully' });
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
