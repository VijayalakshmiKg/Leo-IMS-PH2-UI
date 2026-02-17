import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountSettingsService } from 'src/app/modules/account-settings/account-settings.service';
import { OrganizationInformationComponent } from 'src/app/modules/login/organization-information/organization-information.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { trailerModel } from '../../masterModel/trailerModel';
import { MasterService } from '../../master.service';

@Component({
  selector: 'app-add-trailer-type',
  templateUrl: './add-trailer-type.component.html',
  styleUrls: ['./add-trailer-type.component.css']
})
export class AddTrailerTypeComponent implements OnInit {
  trailerTypeForm!: FormGroup;
  saveBtnText: any = 'Add';
  trailerName: string = 'New';
  trailerModel: trailerModel = new trailerModel();
  trailerId: number = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public fb: FormBuilder, public masterSer: MasterService, public settingServ: AccountSettingsService, public dialog: MatDialogRef<AddTrailerTypeComponent>, public utilServ: UtilityService) { }

  ngOnInit(): void {
    this.trailerTypeForm = this.fb.group({
      trailerTypeName: ['', Validators.required],
      capacity: ['', Validators.required],
      description: []
    })
    //console.log(this.data);

    if (this.data && this.data.type == 'Edit') {
      this.setValues();
      this.trailerName = 'Edit';
      this.saveBtnText = 'Update';
      this.trailerId = this.data.data.id;
    }
    else if (this.data && this.data.type == 'Copy') {
      this.setValues()
      this.saveBtnText = 'Add';
      this.trailerName = 'Copy';
      this.trailerId = 0;
    }
    //console.log(this.settingServ.trailerTypeRecords);

  }

  setValues() {
    this.trailerTypeForm.get('trailerTypeName')?.setValue(this.data?.data?.trailertypename);
    this.trailerTypeForm.get('capacity')?.setValue(this.data?.data?.capacity);
    this.trailerTypeForm.get('description')?.setValue(this.data?.data?.description);
  }

  saveTrailerType() {
    // if (this.trailerTypeForm.valid) {
    //   let trailerTypeNameExists = false;

    //   if (this.data && this.data.type === 'Edit') {
    //     const originalTrailerTypeName = this.data.trailerTypeName; // Original value from data
    //     const newTrailerTypeName = this.trailerTypeForm.value.trailerTypeName; // Current value in the form control
    //     //console.log(OrganizationInformationComponent, newTrailerTypeName);


    //     // Check if the `TrailerTypeName` field is dirty and has a new value
    //     if (this.trailerTypeForm.controls['trailerTypeName'].dirty && originalTrailerTypeName !== newTrailerTypeName) {
    //       // Perform existence check only if the `TrailerTypeName` has been changed
    //       trailerTypeNameExists = this.settingServ.trailerTypeRecords.some(
    //         (record: any) => record.TrailerTypeName === newTrailerTypeName
    //       );

    //       if (trailerTypeNameExists) {
    //         this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Trailer type name already exists' });
    //         return; // Exit the function
    //       }
    //     } else {
    //       // If `TrailerTypeName` is unchanged or not modified, skip validation
    //       //console.log(this.trailerTypeForm.value);
    //       this.settingServ.trailerTypeRecords.splice(this.data.index, 1, this.trailerTypeForm.value);
    //       this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Trailer type updated successfully' });
    //       this.close(true);
    //     }

    //     // Proceed with updating the TrailerType
    //     //console.log(this.trailerTypeForm.value);
    //     this.settingServ.trailerTypeRecords.splice(this.data.index, 1, this.trailerTypeForm.value);
    //     this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Trailer type updated successfully' });
    //     this.close(true);
    //   } else if (this.data && this.data.type === 'Copy') {
    //     const newTrailerTypeName = this.trailerTypeForm.value.trailerTypeName;
    //     trailerTypeNameExists = this.settingServ.trailerTypeRecords.some(
    //       (record: any) => record.trailerTypeName === newTrailerTypeName
    //     );

    //     if (trailerTypeNameExists) {
    //       this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Trailer type name already exists' });
    //       return;
    //     }

    //     //console.log(this.trailerTypeForm.value);
    //     this.settingServ.trailerTypeRecords.push(this.trailerTypeForm.value);
    //     this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Trailer type copied successfully' });
    //     this.close(true);
    //   } else {
    //     const newTrailerTypeName = this.trailerTypeForm.value.trailerTypeName;
    //     trailerTypeNameExists = this.settingServ.trailerTypeRecords.some(
    //       (record: any) => record.trailerTypeName === newTrailerTypeName
    //     );

    //     if (trailerTypeNameExists) {
    //       this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Trailer type name already exists' });
    //       return;
    //     }

    //     //console.log(this.trailerTypeForm.value);
    //     this.settingServ.trailerTypeRecords.push(this.trailerTypeForm.value);
    //     this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Trailer type created successfully' });
    //     this.close(true);
    //   }
    // }

    if (this.trailerTypeForm.valid && this.trailerName.toLowerCase() != 'copy') {
      this.trailerModel.Id = this.trailerId;
      this.trailerModel.Capacity = this.trailerTypeForm.value.capacity;
      this.trailerModel.Description = this.trailerTypeForm.value.description;
      this.trailerModel.Trailertypename = this.trailerTypeForm.value.trailerTypeName;
      //console.log(this.trailerModel);
      
      this.masterSer.addUpdateTrailer(this.trailerModel).then((res: any) => {
        //console.log(res);
        if (res) {
          if (this.trailerName.toLowerCase() == 'new') {
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Trailer type created successfully' });
            this.close(true);
          }
          if (this.trailerName.toLowerCase() == 'edit') {
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Trailer type updated successfully' });
            this.close(true);
          }
        }
      })
    } else if (this.trailerTypeForm.valid && this.trailerName.toLowerCase() == 'copy') {
      if (this.data.data.trailertypename.toLowerCase() == this.trailerTypeForm.value.trailerTypeName.toLowerCase()) {
        this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Trailer type name already exists' });
        return; // Exit the function
      } else {
        this.trailerModel.Id = this.trailerId;
        this.trailerModel.Capacity = this.trailerTypeForm.value.capacity;
        this.trailerModel.Description = this.trailerTypeForm.value.description;
        this.trailerModel.Trailertypename = this.trailerTypeForm.value.trailerTypeName;
        //console.log(this.trailerModel);
        this.masterSer.addUpdateTrailer(this.trailerModel).then((res: any) => {
          //console.log(res);
          if (res) {
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Trailer type created successfully' });
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
