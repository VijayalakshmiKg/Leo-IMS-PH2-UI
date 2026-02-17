import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountSettingsService } from 'src/app/modules/account-settings/account-settings.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { binModel } from '../../masterModel/binModel';
import { MasterService } from '../../master.service';

@Component({
  selector: 'app-add-bin',
  templateUrl: './add-bin.component.html',
  styleUrls: ['./add-bin.component.css']
})
export class AddBinComponent implements OnInit {
  binForm!: FormGroup
  saveBtnText: any = 'Add';
  binModel: binModel = new binModel();
  binId: number = 0;
  binName: string = 'New';
  materialTypeList:any[]=[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public fb: FormBuilder, public masterSer: MasterService, public settingServ: AccountSettingsService, public dialog: MatDialogRef<AddBinComponent>, public utilServ: UtilityService) { }

  ngOnInit(): void {
    this.getAllMaterial();
    this.binForm = this.fb.group({
      binName: ['', Validators.required],
      binNumber: ['', Validators.required],
      materialType:['', Validators.required],
      description: []
    })
    //console.log(this.data);

    if (this.data && this.data.type == 'Edit') {
      this.setValues()
      this.saveBtnText = 'Update';
      this.binName = 'Edit';
      this.binId = this.data?.data?.binID;
    }
    else if (this.data && this.data.type == 'Copy') {
      this.setValues()
      this.saveBtnText = 'Add';
      this.binName = 'Copy';
      this.binId = 0;
    }
    //console.log(this.settingServ.binRecords);

  }
  getAllMaterial(){
    this.masterSer.getAllMaterial().then((res:any) => {
      //console.log(res);
      this.materialTypeList = res;
    })
  }
  setValues() {
    //console.log(this.data);
    
    this.binForm.get('binName')?.setValue(this.data?.data?.binName);
    this.binForm.get('materialType')?.setValue(this.data?.data?.materialType);
    this.binForm.get('binNumber')?.setValue(this.data?.data?.binNumber);
    this.binForm.get('description')?.setValue(this.data?.data?.description);
  }

  saveBin() {
    //console.log(this.binForm.value);
    
    if (this.binForm.valid) {
     //console.log(this.binName);
     

      // if (this.data && this.data.type === 'Edit') {
      // //   const originalBinName = this.data.binName; // Original value from data
      // //   const newBinName = this.binForm.value.binName; // Current value in the form control
      // //   //console.log(originalBinName, newBinName);


      // //   // Check if the `BinName` field is dirty and has a new value
      // //   if (this.binForm.controls['binName'].dirty && originalBinName !== newBinName) {
      // //     // Perform existence check only if the `BinName` has been changed
      // //     binNameExists = this.settingServ.binRecords.some(
      // //       (record: any) => record.BinName === newBinName
      // //     );

      // //     if (binNameExists) {
      // //       this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Bin name already exists' });
      // //       return; // Exit the function
      // //     }
      // //   } else {
      // //     // If `BinName` is unchanged or not modified, skip validation
      // //     //console.log(this.binForm.value);
      // //     this.settingServ.binRecords.splice(this.data.index, 1, this.binForm.value);
      // //     this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Bin updated successfully' });
      // //     this.close(true);
      // //   }

      // //   // Proceed with updating the Bin
      // //   // //console.log(this.binForm.value);
      // //   // this.settingServ.binRecords.splice(this.data.index, 1, this.binForm.value);
      // //   // this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Bin updated successfully' });
      // //   // this.close(true);
      // // } else if (this.data && this.data.type === 'Copy') {
      // //   const newBinName = this.binForm.value.binName;
      // //   binNameExists = this.settingServ.binRecords.some(
      // //     (record: any) => record.binName === newBinName
      // //   );

      //   if (binNameExists) {
      //     this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Bin name already exists' });
      //     return;
      //   }

      //   //console.log(this.binForm.value);
      //   this.settingServ.binRecords.push(this.binForm.value);
      //   this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Bin copied successfully' });
      //   this.close(true);
      // } 

      // else {
      //   const newBinName = this.binForm.value.binName;
      //   binNameExists = this.settingServ.binRecords.some(
      //     (record: any) => record.binName === newBinName
      //   );

      //   if (binNameExists) {
      //     this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Bin name already exists' });
      //     return;
      //   }

      //   //console.log(this.binForm.value);
      if (this.binForm.valid && this.binName.toLowerCase() != 'copy') {
        this.binModel.BinID = this.binId;
        this.binModel.BinName = this.binForm.value.binName;
        this.binModel.Capacity = 0;
        this.binModel.Description = this.binForm.value.description;
        this.binModel.Status = "";
        this.binModel.MaterialType = this.binForm.value.materialType;
        this.binModel.BinNumber = this.binForm.value.binNumber;
        //console.log(this.binModel);
        this.masterSer.addUpdateBin(this.binModel).then((res: any) => {
          //console.log(res);
          if (res) {
            // this.settingServ.binRecords.push(this.binForm.value);
            if(this.binName.toLowerCase() == 'new'){
              this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Bin created successfully' });
              this.close(true);
            }
           if(this.binName.toLowerCase() == 'edit'){
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Bin updated successfully' });
             this.close(true);
           }
          }
        })
      } else if (this.binForm.valid && this.binName.toLowerCase() == 'copy') {
        if (this.data?.data?.binName == this.binForm.value.binName && this.data?.data?.binNumber == this.binForm.value.binNumber) {
          this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Bin name already exists' });
          return;
        } else {
          this.binModel.BinID = this.binId;
          this.binModel.BinName = this.binForm.value.binName;
          this.binModel.Capacity = 0;
          this.binModel.Description = this.binForm.value.description;
          this.binModel.Status = "";
          this.binModel.MaterialType = this.binForm.value.materialType;
          this.binModel.BinNumber = this.binForm.value.binNumber;
          //console.log(this.binModel);
          this.masterSer.addUpdateBin(this.binModel).then((res: any) => {
            //console.log(res);
            if (res) {
              this.settingServ.binRecords.push(this.binForm.value);
              this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Bin copied successfully' });
              this.close(true);
            }
          })
        }
      }

      // }
    }
  }



  close(value?: boolean) {
    this.dialog.close(value)
  }


}
