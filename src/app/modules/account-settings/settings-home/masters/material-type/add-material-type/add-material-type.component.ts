import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AccountSettingsService } from 'src/app/modules/account-settings/account-settings.service';
import { MaterialService } from 'src/app/modules/material/material.service';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { materialModel } from '../../masterModel/materialModel';
import { MasterService } from '../../master.service';

@Component({
  selector: 'app-add-material-type',
  templateUrl: './add-material-type.component.html',
  styleUrls: ['./add-material-type.component.css']
})
export class AddMaterialTypeComponent implements OnInit {
  materialTypeForm!: FormGroup
  saveBtnText: any = 'Add'
  materialName: string = 'New';
  materialModel: materialModel = new materialModel();
  materialId: number = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public masterSer: MasterService, public materialSer: MaterialService, public fb: FormBuilder, public settingServ: AccountSettingsService, public dialog: MatDialogRef<AddMaterialTypeComponent>, public utilServ: UtilityService, public openDialog: MatDialog) { }

  ngOnInit(): void {
    this.materialTypeForm = this.fb.group({
      materialTypeName: ['', Validators.required],
      description: []
    })
    //console.log(this.data);

    if (this.data && this.data.type.toLowerCase() == 'edit') {
      this.setValues()
      this.saveBtnText = 'Update';
      this.materialName = 'Edit';
      this.materialId = this.data.data.id;
    }
    if (this.data && this.data.type.toLowerCase() == 'copy') {
      this.setValues()
      this.saveBtnText = 'Add';
      this.materialName = 'Copy';
      this.materialId = 0;
    }
  }

  setValues() {
    this.materialTypeForm.get('materialTypeName')?.setValue(this.data?.data?.materialTypeName)
    this.materialTypeForm.get('description')?.setValue(this.data?.data?.description)
  }

  savematerialType() {

    // if (this.materialTypeForm.valid) {
    //   let materialTypeNameExists = false;

    //   if (this.data && this.data.type === 'Edit') {
    //     const originalMaterialTypeName = this.data.materialTypeName; // Original value from data
    //     const newMaterialTypeName = this.materialTypeForm.value.materialTypeName; // Current value in the form control
    //     //console.log(originalMaterialTypeName, newMaterialTypeName);


    //     // Check if the `MaterialTypeName` field is dirty and has a new value
    //     if (this.materialTypeForm.controls['materialTypeName'].dirty && originalMaterialTypeName !== newMaterialTypeName) {
    //       // Perform existence check only if the `MaterialTypeName` has been changed
    //       materialTypeNameExists = this.settingServ.materialTypeRecords.some(
    //         (record: any) => record.MaterialTypeName === newMaterialTypeName
    //       );

    //       if (materialTypeNameExists) {
    //         this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Material type name already exists' });
    //         return; // Exit the function
    //       }
    //     } else {
    //       // If `MaterialTypeName` is unchanged or not modified, skip validation
    //       //console.log(this.materialTypeForm.value);
    //       this.settingServ.materialTypeRecords.splice(this.data.index, 1, this.materialTypeForm.value);
    //       this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Material type updated successfully' });
    //       this.close(true);
    //     }

    //     // Proceed with updating the Material type
    //     //console.log(this.materialTypeForm.value);
    //     this.settingServ.materialTypeRecords.splice(this.data.index, 1, this.materialTypeForm.value);
    //     this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Material type updated successfully' });
    //     this.close(true);
    //   } else if (this.data && this.data.type === 'Copy') {
    //     const newMaterialTypeName = this.materialTypeForm.value.materialTypeName;
    //     materialTypeNameExists = this.settingServ.materialTypeRecords.some(
    //       (record: any) => record.materialTypeName === newMaterialTypeName
    //     );

    //     if (materialTypeNameExists) {
    //       this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Material type name already exists' });
    //       return;
    //     }

    //     //console.log(this.materialTypeForm.value);
    //     this.settingServ.materialTypeRecords.push(this.materialTypeForm.value);
    //     this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Material type copied successfully' });
    //     this.close(true);
    //   } else {
    //     const newMaterialTypeName = this.materialTypeForm.value.materialTypeName;
    //     materialTypeNameExists = this.settingServ.materialTypeRecords.some(
    //       (record: any) => record.materialTypeName === newMaterialTypeName
    //     );

    //     if (materialTypeNameExists) {
    //       this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Material type name already exists' });
    //       return;
    //     }

    //     //console.log(this.materialTypeForm.value);
    //     this.settingServ.materialTypeRecords.push(this.materialTypeForm.value);
    //     this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Material type created successfully' });
    //     this.close(true);
    //   }
    // }
    if (this.materialTypeForm.valid && (this.materialName.toLowerCase() != 'copy' && this.materialName.toLowerCase() != 'edit')) {
      this.materialModel.Id = this.materialId;
      this.materialModel.Description = this.materialTypeForm.value.description;
      this.materialModel.MaterialTypeName = this.materialTypeForm.value.materialTypeName;
      //console.log(this.materialModel);
      this.masterSer.addUpdateMaterial(this.materialModel).then((res: any) => {
        //console.log(res);
        if (res) {
          this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Material type created successfully' });
          this.close(true);
        }
      })
      
    } else if (this.materialTypeForm.valid && this.materialName.toLowerCase() == 'copy') {
      if (this.data.data.materialTypeName.toLowerCase() == this.materialTypeForm.value.materialTypeName.toLowerCase()) {
        this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Material type name already exists' });
        return;
      } else {
        this.materialModel.Id = this.materialId;
        this.materialModel.Description = this.materialTypeForm.value.description;
        this.materialModel.MaterialTypeName = this.materialTypeForm.value.materialTypeName;
        //console.log(this.materialModel);
        this.masterSer.addUpdateMaterial(this.materialModel).then((res: any) => {
          //console.log(res);
          if (res) {
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Material type copied successfully' });
            this.close(true);
          }
        })
      }
    }else if (this.materialTypeForm.valid && this.materialName.toLowerCase() == 'edit') {
     
        this.materialModel.Id = this.materialId;
        this.materialModel.Description = this.materialTypeForm.value.description;
        this.materialModel.MaterialTypeName = this.materialTypeForm.value.materialTypeName;
        //console.log(this.materialModel);
        this.masterSer.addUpdateMaterial(this.materialModel).then((res: any) => {
          //console.log(res);
          if (res) {
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Material type updated successfully' });
            this.close(true);
          }
        })
    }

  }

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
