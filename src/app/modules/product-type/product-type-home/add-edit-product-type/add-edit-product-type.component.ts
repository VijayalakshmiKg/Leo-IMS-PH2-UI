import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProductTypeService } from '../../product-type.service';
import { Location } from '@angular/common';
import { ProductTypeModel } from '../../productTypeModel/productTypeModel';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';

@Component({
  selector: 'app-add-edit-product-type',
  templateUrl: './add-edit-product-type.component.html',
  styleUrls: ['./add-edit-product-type.component.css']
})
export class AddEditProductTypeComponent implements OnInit {
  productTypeForm!: FormGroup
  productTypeStatus: any = 'Active';
  saveBtnText: any = 'Add'
  productTypeModel: ProductTypeModel = new ProductTypeModel();
  productTypeData: any
  productTypeId: number = 0;
  productTypeNameExists: boolean = false;

  constructor(
    public fb: FormBuilder, 
    public dialog: MatDialog, 
    public ProductTypeServ: ProductTypeService, 
    public location: Location, 
    public utilSer: UtilityService
  ) { }

  ngOnInit(): void {
    this.productTypeForm = this.fb.group({
      productTypeName: ['', Validators.required],
      description: ['']
    });

    if (this.ProductTypeServ.editProductTypeRecord) {
      this.productTypeId = this.ProductTypeServ.editProductTypeRecord.productTypeID;
      this.setProductTypeDetails()
    }
    this.getAllProductTypesList();
  }

  setProductTypeDetails() {
    this.productTypeForm.patchValue(this.ProductTypeServ.editProductTypeRecord);
    this.productTypeStatus = this.ProductTypeServ.editProductTypeRecord.status;
  }

  back() {
    let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
      width: '480px',
      height: 'auto',
      data: { 
        type: messageBox.cancelMessageBox, 
        message: 'Are you sure want to skip? If you leave, your unsaved changes will be discarded', 
        title: 'Leave this page?' 
      },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.ProductTypeServ.editProductTypeRecord = null
        this.location.back()
      }
    });
  }

  getAllProductTypesList() {
    this.ProductTypeServ.getAllProductType().then((res: any) => {
      this.productTypeData = res || [];
    });
  }

  checkProductTypeName() {
    const enteredName = this.productTypeForm.get('productTypeName')?.value?.trim()?.toLowerCase();
    this.productTypeNameExists = this.productTypeData.some((productType: any) =>
      productType.productTypeName?.trim()?.toLowerCase() === enteredName
    );
    if (this.productTypeNameExists) {
      this.utilSer.toaster.next({ type: customToaster.infoToast, message: 'Product type name already exists!' })
    }
  }

  onSubmitandClose(): void {
    this.productTypeModel.ProductTypeID = this.productTypeId ? this.productTypeId : 0;
    this.productTypeModel.ProductTypeName = this.productTypeForm.value.productTypeName;
    this.productTypeModel.Description = this.productTypeForm.value.description || '';
    this.productTypeModel.Status = this.productTypeStatus;
    this.productTypeModel.CreatedDate = new Date();
    this.productTypeModel.ModifiedDate = new Date();

    if (this.productTypeForm.valid) {
      let toastMessage = this.ProductTypeServ.editProductTypeRecord ? 'Product type edited successfully.' : 'Product type added successfully.';
      this.ProductTypeServ.addUpdateProductType(this.productTypeModel).then(res => {
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: toastMessage })
          this.location.back()
        }
      })
    }
    else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.productTypeForm.markAllAsTouched();
      return
    }
  }

  onSubmitandAddAnother(): void {
    if (this.productTypeForm.valid) {
      this.productTypeModel.ProductTypeID = 0;
      this.productTypeModel.ProductTypeName = this.productTypeForm.value.productTypeName;
      this.productTypeModel.Description = this.productTypeForm.value.description || '';
      this.productTypeModel.Status = this.productTypeStatus;
      this.productTypeModel.CreatedDate = new Date();
      this.productTypeModel.ModifiedDate = new Date();

      this.ProductTypeServ.addUpdateProductType(this.productTypeModel).then((res: any) => {
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Product type added successfully.' });
          this.productTypeForm.reset();
          this.productTypeStatus = 'Active';
        }
      })
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.productTypeForm.markAllAsTouched();
      return
    }
  }

}
