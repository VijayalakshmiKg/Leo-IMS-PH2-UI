import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountSettingsService } from 'src/app/modules/account-settings/account-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { categoryModel } from '../../masterModel/categoryModel';
import { MasterService } from '../../master.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';

@Component({
  selector: 'app-add-category-type',
  templateUrl: './add-category-type.component.html',
  styleUrls: ['./add-category-type.component.css']
})
export class AddCategoryTypeComponent implements OnInit {
  categoryTypeForm!: FormGroup;
  saveBtnText: any = 'Add';
  categoryName: string = 'New';
  categoryModel:categoryModel = new categoryModel();
  categoryId:number = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public fb: FormBuilder,public masterSer:MasterService, public settingServ: AccountSettingsService, public dialog: MatDialogRef<AddCategoryTypeComponent>, public utilServ: UtilityService) { }

  ngOnInit(): void {
    this.categoryTypeForm = this.fb.group({
      categoryTypeName: ['', Validators.required],
      description: []
    })
    //console.log(this.data);

    if (this.data && this.data.type == 'Edit') {
      this.setValues()
      this.saveBtnText = 'Update';
      this.categoryName = 'Edit';
      this.categoryId = this.data.data.id;
    }
    else if (this.data && this.data.type == 'Copy') {
      this.setValues()
      this.saveBtnText = 'Add';
      this.categoryName = 'Copy';
      this.categoryId =  0;
    }
    //console.log(this.settingServ.categoryTypeRecords);

  }

  setValues() {
    this.categoryTypeForm.get('categoryTypeName')?.setValue(this.data?.data?.categoryTypeName)
    this.categoryTypeForm.get('description')?.setValue(this.data?.data?.description)
  }

  saveCategoryType() {
    // if (this.categoryTypeForm.valid) {
    //   let categoryTypeNameExists = false;

    //   if (this.data && this.data.type === 'Edit') {
    //     const originalCategoryTypeName = this.data.categoryTypeName; // Original value from data
    //     const newCategoryTypeName = this.categoryTypeForm.value.categoryTypeName; // Current value in the form control

    //     // Check if the `categoryTypeName` field is dirty and has a new value
    //     if (this.categoryTypeForm.controls['categoryTypeName'].dirty && originalCategoryTypeName !== newCategoryTypeName) {
    //       // Perform existence check only if the `categoryTypeName` has been changed
    //       categoryTypeNameExists = this.settingServ.categoryTypeRecords.some(
    //         (record: any) => record.categoryTypeName === newCategoryTypeName
    //       );

    //       if (categoryTypeNameExists) {
    //         this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Category type name already exists' });
    //         return; // Exit the function
    //       }
    //     } else {
    //       // If `categoryTypeName` is unchanged or not modified, skip validation
    //       //console.log(this.categoryTypeForm.value);
    //       this.settingServ.categoryTypeRecords.splice(this.data.index, 1, this.categoryTypeForm.value);
    //       this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Category type updated successfully' });
    //       this.close(true);
    //     }

    //     // Proceed with updating the categoryType
    //     //console.log(this.categoryTypeForm.value);
    //     this.settingServ.categoryTypeRecords.splice(this.data.index, 1, this.categoryTypeForm.value);
    //     this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Category type updated successfully' });
    //     this.close(true);
    //   } else if (this.data && this.data.type === 'Copy') {
    //     const newCategoryTypeName = this.categoryTypeForm.value.categoryTypeName;
    //     categoryTypeNameExists = this.settingServ.categoryTypeRecords.some(
    //       (record: any) => record.categoryTypeName === newCategoryTypeName
    //     );

    //     if (categoryTypeNameExists) {
    //       this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Category type name already exists' });
    //       return;
    //     }

    //     //console.log(this.categoryTypeForm.value);
    //     this.settingServ.categoryTypeRecords.push(this.categoryTypeForm.value);
    //     this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Category type copied successfully' });
    //     this.close(true);
    //   } else {
    //     const newCategoryTypeName = this.categoryTypeForm.value.categoryTypeName;
    //     categoryTypeNameExists = this.settingServ.categoryTypeRecords.some(
    //       (record: any) => record.categoryTypeName === newCategoryTypeName
    //     );

    //     if (categoryTypeNameExists) {
    //       this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Category type name already exists' });
    //       return;
    //     }

    //     //console.log(this.categoryTypeForm.value);
    //     // this.settingServ.categoryTypeRecords.push(this.categoryTypeForm.value);

    
       
    //   }
    // }
    if(this.categoryTypeForm.valid && this.categoryName.toLowerCase() != 'copy'){
      this.categoryModel.Id = this.categoryId;
      this.categoryModel.Description = this.categoryTypeForm.value.description;
      this.categoryModel.CategoryTypeName = this.categoryTypeForm.value.categoryTypeName;
      //console.log(this.categoryModel);
      this.masterSer.addUpdateCategory(this.categoryModel).then((res:any) => {
        //console.log(res);
        if(res){
         if(this.categoryName.toLowerCase() == 'new'){
          this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Category type created successfully' });
          this.close(true);
         }
         if(this.categoryName.toLowerCase() == 'edit'){
          this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Category type updated successfully' });
          this.close(true);
         }
        }
      })
    } else if(this.categoryTypeForm.valid && this.categoryName.toLowerCase() == 'copy'){
      if(this.data.data.categoryTypeName.toLowerCase() == this.categoryTypeForm.value.categoryTypeName.toLowerCase()){
        this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Category type name already exists' });
                return; // Exit the function
      }else{
        this.categoryModel.Id = this.categoryId;
        this.categoryModel.Description = this.categoryTypeForm.value.description;
        this.categoryModel.CategoryTypeName = this.categoryTypeForm.value.categoryTypeName;
        //console.log(this.categoryModel);
        this.masterSer.addUpdateCategory(this.categoryModel).then((res:any) => {
          //console.log(res);
          if(res){
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Category type copied successfully' });
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
