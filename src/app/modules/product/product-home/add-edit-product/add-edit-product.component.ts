import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProductService } from '../../product.service';
import { Location } from '@angular/common';
import { ProductModel } from '../../productModel/productModel';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css']
})
export class AddEditProductComponent implements OnInit {
  productForm!: FormGroup
  productStatus: any = 'Active';
  saveBtnText: any = 'Add'
  productModel: ProductModel = new ProductModel();
  productData: any
  productTypes: any[] = [];
  productId: number = 0;
  productNameExists: boolean = false;

  constructor(
    public fb: FormBuilder, 
    public dialog: MatDialog, 
    public ProductServ: ProductService, 
    public location: Location, 
    public utilSer: UtilityService
  ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      productTypeID: ['', Validators.required],
      description: ['']
    });

    this.getProductTypes()

    if (this.ProductServ.editProductRecord) {
      this.productId = this.ProductServ.editProductRecord.productID;
      this.setProductDetails()
    }
    this.getAllProductsList();
  }

  setProductDetails() {
    this.productForm.patchValue({
      productName: this.ProductServ.editProductRecord.productName,
      productTypeID: this.ProductServ.editProductRecord.productTypeID
    });
    this.productStatus = this.ProductServ.editProductRecord.status;
  }

  getProductTypes() {
    this.ProductServ.getAllProductTypes().then(res => {
      this.productTypes = res;
    })
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
        this.ProductServ.editProductRecord = null
        this.location.back()
      }
    });
  }

  getAllProductsList() {
    this.ProductServ.getAllProduct().then((res: any) => {
      this.productData = res || [];
    });
  }

  checkProductName() {
    const enteredName = this.productForm.get('productName')?.value?.trim()?.toLowerCase();
    this.productNameExists = this.productData.some((product: any) =>
      product.productName?.trim()?.toLowerCase() === enteredName
    );
    if (this.productNameExists) {
      this.utilSer.toaster.next({ type: customToaster.infoToast, message: 'Product name already exists!' })
    }
  }

  onSubmitandClose(): void {
    this.productModel.ProductID = this.productId ? this.productId : 0;
    this.productModel.ProductName = this.productForm.value.productName;
    this.productModel.ProductTypeID = this.productForm.value.productTypeID;
    this.productModel.Description = this.productForm.value.description || '';
    this.productModel.Status = this.productStatus;
    this.productModel.CreatedDate = new Date();
    this.productModel.ModifiedDate = new Date();

    if (this.productForm.valid) {
      let toastMessage = this.ProductServ.editProductRecord ? 'Product edited successfully.' : 'Product added successfully.';
      this.ProductServ.addUpdateProduct(this.productModel).then(res => {
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: toastMessage })
          this.location.back()
        }
      })
    }
    else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.productForm.markAllAsTouched();
      return
    }
  }

  onSubmitandAddAnother(): void {
    if (this.productForm.valid) {
      this.productModel.ProductID = 0;
      this.productModel.ProductName = this.productForm.value.productName;
      this.productModel.ProductTypeID = this.productForm.value.productTypeID;
      this.productModel.Description = this.productForm.value.description || '';
      this.productModel.Status = this.productStatus;
      this.productModel.CreatedDate = new Date();
      this.productModel.ModifiedDate = new Date();

      this.ProductServ.addUpdateProduct(this.productModel).then((res: any) => {
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Product added successfully.' });
          this.productForm.reset();
          this.productStatus = 'Active';
        }
      })
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.productForm.markAllAsTouched();
      return
    }
  }

}
