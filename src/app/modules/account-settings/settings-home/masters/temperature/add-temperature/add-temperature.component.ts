import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountSettingsService } from 'src/app/modules/account-settings/account-settings.service';
import { OrganizationInformationComponent } from 'src/app/modules/login/organization-information/organization-information.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { temperatureModel } from '../../masterModel/temperatureModel';
import { MasterService } from '../../master.service';

@Component({
  selector: 'app-add-temperature',
  templateUrl: './add-temperature.component.html',
  styleUrls: ['./add-temperature.component.css']
})
export class AddTemperatureComponent implements OnInit {
  temperatureForm!: FormGroup;
  saveBtnText: any = 'Add';
  temperatureModel: temperatureModel = new temperatureModel();
  temperatureId: number = 0;
  temperatureName: string = 'New';
  temperatureExits: boolean = false;
  temperatureList: any[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public masterSer: MasterService, public fb: FormBuilder, public utilSer: UtilityService, public settingServ: AccountSettingsService, public dialog: MatDialogRef<AddTemperatureComponent>, public utilServ: UtilityService) { }

  ngOnInit(): void {
    this.temperatureForm = this.fb.group({
      temperatureName: ['', Validators.required],
      description: []
    })
    //console.log(this.data);

    if (this.data && this.data.type == 'Edit') {
      this.setValues()
      this.saveBtnText = 'Update';
      this.temperatureName = 'Edit';
      this.temperatureId = this.data.data.id;
    }
    else if (this.data && this.data.type == 'Copy') {
      this.setValues();
      this.temperatureId = 0;
      this.saveBtnText = 'Add';
      this.temperatureName = 'Copy';
    }
    //console.log(this.settingServ.temperatureRecords);
    this.getAllTemperature();
  }

  setValues() {
    this.temperatureForm.get('temperatureName')?.setValue(this.data?.data?.temperatureName)
    this.temperatureForm.get('description')?.setValue(this.data?.data?.description)
  }

  getAllTemperature() {
    this.masterSer.getAllTemperature().then((res: any) => {
      //console.log(res);
      this.temperatureList = res;
    })
  }
  dulpicateTemperature() {
    const enteredTemperature = this.temperatureForm.get('temperatureName')?.value?.trim()?.toLowerCase();
    this.temperatureExits = this.temperatureList.some((temp: any) =>
      temp.temperatureName?.trim()?.toLowerCase() === enteredTemperature  // make sure field name matches API!
    );
    if (this.temperatureExits) {
      this.utilSer.toaster.next({ type: customToaster.infoToast, message: 'Temperature name already exists!' })
    }
  }

  saveTemperature() {
    // if (this.temperatureForm.valid) {
    //   let temperatureNameExists = false;

    //   if (this.data && this.data.type === 'Edit') {
    //     const originalTemperatureName = this.data.temperatureName; // Original value from data
    //     const newTemperatureName = this.temperatureForm.value.temperatureName; // Current value in the form control
    //     //console.log(OrganizationInformationComponent,newTemperatureName);


    //     // Check if the `TemperatureName` field is dirty and has a new value
    //     if (this.temperatureForm.controls['temperatureName'].dirty && originalTemperatureName !== newTemperatureName) {
    //       // Perform existence check only if the `TemperatureName` has been changed
    //       temperatureNameExists = this.settingServ.temperatureRecords.some(
    //         (record: any) => record.TemperatureName === newTemperatureName
    //       );

    //       if (temperatureNameExists) {
    //         this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Temperature name already exists' });
    //         return; // Exit the function
    //       }
    //     } else {
    //       // If `TemperatureName` is unchanged or not modified, skip validation
    //       //console.log(this.temperatureForm.value);
    //       this.settingServ.temperatureRecords.splice(this.data.index, 1, this.temperatureForm.value);
    //       this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Temperature updated successfully' });
    //       this.close(true);
    //     }

    //     // Proceed with updating the Temperature
    //     //console.log(this.temperatureForm.value);
    //     this.settingServ.temperatureRecords.splice(this.data.index, 1, this.temperatureForm.value);
    //     this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Temperature updated successfully' });
    //     this.close(true);
    //   } else if (this.data && this.data.type === 'Copy') {
    //     const newTemperatureName = this.temperatureForm.value.temperatureName;
    //     temperatureNameExists = this.settingServ.temperatureRecords.some(
    //       (record: any) => record.temperatureName === newTemperatureName
    //     );

    //     if (temperatureNameExists) {
    //       this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Temperature name already exists' });
    //       return;
    //     }

    //     //console.log(this.temperatureForm.value);
    //     this.settingServ.temperatureRecords.push(this.temperatureForm.value);
    //     this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Temperature copied successfully' });
    //     this.close(true);
    //   } else {
    //     const newTemperatureName = this.temperatureForm.value.temperatureName;
    //     temperatureNameExists = this.settingServ.temperatureRecords.some(
    //       (record: any) => record.temperatureName === newTemperatureName
    //     );

    //     if (temperatureNameExists) {
    //       this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Temperature name already exists' });
    //       return;
    //     }

    //     //console.log(this.temperatureForm.value);
    //     this.settingServ.temperatureRecords.push(this.temperatureForm.value);
    //     this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Temperature created successfully' });
    //     this.close(true);
    //   }
    // }
    if (this.temperatureForm.valid && this.temperatureName.toLowerCase() != 'copy') {
      this.temperatureModel.Id = this.temperatureId;
      this.temperatureModel.Description = this.temperatureForm.value.description;
      this.temperatureModel.TemperatureName = this.temperatureForm.value.temperatureName;
      //console.log(this.temperatureModel);
      this.masterSer.addUpdateTemperature(this.temperatureModel).then((res: any) => {
        //console.log(res);
        if (res) {
          if (this.temperatureName.toLowerCase() == 'new') {
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Temperature created successfully' });
            this.close(true);
          }
          if (this.temperatureName.toLowerCase() == 'edit') {
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Temperature updated successfully' });
            this.close(true);
          }
        }
      })
    } else if (this.temperatureForm.valid && this.temperatureName.toLowerCase() == 'copy') {
      if (this.data.data.temperatureName.toLowerCase() == this.temperatureForm.value.temperatureName.toLowerCase()) {
        this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Temperature name already exists' });
        return;
      } else {
        this.temperatureModel.Id = this.temperatureId;
        this.temperatureModel.Description = this.temperatureForm.value.description;
        this.temperatureModel.TemperatureName = this.temperatureForm.value.temperatureName;
        //console.log(this.temperatureModel);
        this.masterSer.addUpdateTemperature(this.temperatureModel).then((res: any) => {
          //console.log(res);
          if (res) {
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Temperature copied successfully' });
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
