import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MaterialService } from '../../material.service';
import { Location } from '@angular/common';
import { addMaterialModel } from '../../materialModel/addMaterialModel';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';

@Component({
  selector: 'app-add-material',
  templateUrl: './add-material.component.html',
  styleUrls: ['./add-material.component.css']
})
export class AddMaterialComponent implements OnInit {

  materialForm!: FormGroup

  saveBtnText: any = 'Add'
  imageUrl: any
  selectedFile: any
  imageUrlProfile: any
  selectedFileProfile: any;
  materialModel: addMaterialModel = new addMaterialModel();
  materialTypeList: any[] = [];
  categoryTypeList: any[] = [];



  constructor(public dialog: MatDialog, public fb: FormBuilder, public sanitizer: DomSanitizer, public materialServ: MaterialService, public location: Location, public utilSer: UtilityService) { }

  ngOnInit(): void {
    this.getAllMaterialType()
    this.getAllCategoryType()
    this.materialForm = this.fb.group({
      materialName: ['', Validators.required],
      materialType: ['', Validators.required],
      categoryType: ['', Validators.required],
      description: ['']
    });

    //console.log(this.materialServ.viewMaterialIndex);


    if (this.materialServ.editMaterialRecord) {
      //console.log(this.materialServ.editMaterialRecord);

      this.setmaterialDetails()
    }
  }
  getAllMaterialType() {
    this.materialServ.getAllMaterial().then(res => {
      //console.log(res);
      this.materialTypeList = res;
    })
  }
  getAllCategoryType() {
    this.materialServ.getAllCategory().then(res => {
      //console.log(res);
      this.categoryTypeList = res;
    })
  }


  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode <= 46 || (charCode > 31 && (charCode < 48 || charCode > 57))) {
      if (this.materialForm.value.netWeight?.length < 8) {
        // this.proper = true;
      }
      return false;
    }
    return true;
  }

  setmaterialDetails() {
    this.imageUrl = this.materialServ?.editMaterialRecord?.materialLicensePhoto
    this.imageUrlProfile = this.materialServ?.editMaterialRecord?.profileImage
    this.selectedFile = this.materialServ?.editMaterialRecord?.selectedFilematerialLicense
    this.materialForm.patchValue(this.materialServ.editMaterialRecord)
  }


  // onFileSelected(event: Event) {
  //   const fileInput = event.target as HTMLInputElement;
  //   if (fileInput.files && fileInput.files.length > 0) {
  //     this.selectedFile = fileInput.files[0].name;
  //     this.materialForm.get('selectedFilematerialLicense')?.setValue(this.selectedFile.name)
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const imageDataUrl = reader.result as string;
  //       // Set the raw data URL in the form control
  //       this.materialForm.get('materialLicensePhoto')?.setValue(imageDataUrl);
  //       // Set the sanitized URL for display only
  //       this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(imageDataUrl) as SafeUrl;
  //     };
  //     reader.readAsDataURL(this.selectedFile);
  //   }
  // }

  // onFileSelectedProfile(event: Event) {
  //   const fileInput = event.target as HTMLInputElement;
  //   if (fileInput.files && fileInput.files.length > 0) {
  //     this.selectedFileProfile = fileInput.files[0];
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const imageDataUrlProfile = reader.result as string;
  //       // Set the raw data URL in the form control
  //       this.materialForm.get('profileImage')?.setValue(imageDataUrlProfile);
  //       // Set the sanitized URL for display only
  //       this.imageUrlProfile = this.sanitizer.bypassSecurityTrustUrl(imageDataUrlProfile) as SafeUrl;
  //     };
  //     reader.readAsDataURL(this.selectedFileProfile);
  //   }
  // }



  deleteProfile() {
    this.selectedFileProfile = null
    this.imageUrlProfile = null
  }



  back() {
    let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
      width: '480px',
      height: 'auto',
      data: { type: messageBox.cancelMessageBox, message: 'Are you sure want to skip? If you leave, your unsaved changes will be discarded', title: 'Leave this page?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.materialServ.editMaterialRecord = null;
        this.location.back()
      }
    })
  }

  onSubmitandClose(): void {
    //console.log(this.materialForm.value);
    this.materialModel.MaterialID = this.materialServ.editMaterialRecord ? this.materialServ.editMaterialRecord.materialID : 0;
    this.materialModel.MaterialName = this.materialForm.value.materialName;
    this.materialModel.MaterialType = this.materialForm.value.materialType;
    this.materialModel.CategoryType = this.materialForm.value.categoryType;
    this.materialModel.Description = this.materialForm.value.description;
    if (this.materialForm.valid) {
      //console.log(this.materialModel);
      let toastMessage = this.materialServ.editMaterialRecord ? 'Product edited successfully.' : 'Product added successfully.';
      this.materialServ.addUpdateMaterial(this.materialModel).then(res => {
        //console.log(res);
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: toastMessage })
          this.location.back()
        }
      })
    }
    else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.materialForm.markAllAsTouched();
      return
    }
  }
  onSubmitandAddAnother(): void {
    //console.log(this.materialForm.value);
    if (this.materialForm.valid) {
      //console.log(this.materialForm.value);
      this.materialModel.MaterialID = 0;
      this.materialModel.MaterialName = this.materialForm.value.materialName;
      this.materialModel.MaterialType = this.materialForm.value.materialType;
      this.materialModel.CategoryType = this.materialForm.value.categoryType;
      this.materialModel.Description = this.materialForm.value.description;
      //console.log(this.materialModel);
      this.materialServ.addUpdateMaterial(this.materialModel).then(res => {
        //console.log(res);
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Product added successfully.' })
          this.materialForm.reset();
        }
      })
      // Process the form submission here
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.materialForm.markAllAsTouched();
      return
    }
  }

  deleteLicensePhoto() {
    this.selectedFile = null
    this.imageUrl = null
  }


}
