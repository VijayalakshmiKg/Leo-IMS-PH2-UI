import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ProductBinService } from '../../product-bin.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { ProductBinModel } from '../../productBinModel/productBinModel';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';

@Component({
  selector: 'app-add-edit-product-bin',
  templateUrl: './add-edit-product-bin.component.html',
  styleUrls: ['./add-edit-product-bin.component.css']
})
export class AddEditProductBinComponent implements OnInit {

  productBinForm!: FormGroup
  productBinStatus: any = 'Active'
  saveBtnText: any;
  pbMappingId: number = 0;
  productBinModel: ProductBinModel = new ProductBinModel();
  employeeId: any;
  loggedInUserName: any;
  mappingExists: boolean = false;
  productList: any[] = [];
  binList: any[] = [];

  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    public productBinServ: ProductBinService,
    public location: Location,
    public utilSer: UtilityService
  ) { }

  ngOnInit(): void {
    this.productBinForm = this.fb.group({
      productId: ['', [Validators.required]],
      binId: ['', [Validators.required]]
    });

    var user: any = sessionStorage.getItem("userData");
    this.employeeId = JSON.parse(user);

    let loggedInUser: any = sessionStorage.getItem('loggedInUser');
    if (loggedInUser) {
      let parsedUser = JSON.parse(loggedInUser);
      this.loggedInUserName = parsedUser.userName || parsedUser.username || parsedUser.name;
    }

    this.loadProducts();
    this.loadBins();

    if (this.productBinServ.editProductBinRecord) {
      this.saveBtnText = 'Update';
      this.pbMappingId = this.productBinServ.editProductBinRecord.pB_Mapping_ID;
      this.setProductBinDetails();
    } else {
      this.saveBtnText = 'Add';
    }
  }

  loadProducts() {
    this.productBinServ.getAllProducts().then((res: any) => {
      this.productList = res.data || res;
    }).catch((err: any) => {
      this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Failed to load products!' });
    });
  }

  loadBins() {
    this.productBinServ.getAllBins().then((res: any) => {
      this.binList = res.data || res;
    }).catch((err: any) => {
      this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Failed to load bins!' });
    });
  }

  setProductBinDetails() {
    const editData = this.productBinServ.editProductBinRecord;
    this.productBinStatus = editData.deleted ? 'Inactive' : 'Active';
    this.productBinForm.patchValue({
      productId: editData.productID,
      binId: editData.binID
    });
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
        this.productBinServ.editProductBinRecord = null;
        this.location.back();
      }
    })
  }

  onSubmitandClose(): void {
    if (this.productBinForm.valid && !this.mappingExists) {
      let model = new ProductBinModel();
      model.PB_Mapping_ID = this.pbMappingId ? Number(this.pbMappingId) : 0;
      model.ProductID = this.productBinForm.value.productId;
      model.BinID = this.productBinForm.value.binId;
      model.Deleted = this.productBinStatus === 'Inactive' ? true : false;
      
      if (this.pbMappingId) {
        model.ModifiedBy = this.loggedInUserName;
        model.ModifiedDate = new Date();
      } else {
        model.CreatedBy = this.loggedInUserName;
        model.CreatedDate = new Date();
      }

      let toastMessage = this.pbMappingId ? 'Product bin mapping edited successfully.' : 'Product bin mapping added successfully.';

      this.productBinServ.addUpdateProductBin(model).then(res => {
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: toastMessage });
          this.location.back();
        }
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'A problem occured! Server error!' });
        }
      });
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' });
      this.productBinForm.markAllAsTouched();
      return;
    }
  }

  onSubmitandAddAnother(): void {
    if (this.productBinForm.valid && !this.mappingExists) {
      let model = new ProductBinModel();
      model.PB_Mapping_ID = 0;
      model.ProductID = this.productBinForm.value.productId;
      model.BinID = this.productBinForm.value.binId;
      model.Deleted = this.productBinStatus === 'Inactive' ? true : false;
      model.CreatedBy = this.loggedInUserName;
      model.CreatedDate = new Date();

      this.productBinServ.addUpdateProductBin(model).then((res: any) => {
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Product bin mapping added successfully.' });
          this.productBinForm.reset();
          this.productBinStatus = 'Active';
        }
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'A problem occured! Server error!' });
        }
      });
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.productBinForm.markAllAsTouched();
      return;
    }
  }

  checkMappingExists() {
    const productId = this.productBinForm.get('productId')?.value;
    const binId = this.productBinForm.get('binId')?.value;

    if (!productId || !binId || productId === null || binId === null) {
      this.mappingExists = false;
      return;
    }

    // Skip validation if editing and values haven't changed
    if (this.productBinServ.editProductBinRecord && 
        productId == this.productBinServ.editProductBinRecord.productID &&
        binId == this.productBinServ.editProductBinRecord.binID) {
      this.mappingExists = false;
      return;
    }

    // Fetch all existing product-bin mappings and check client-side
    this.productBinServ.getAllProductBins().then((res: any) => {
      const existingList = res.data || res;
      const duplicate = existingList.find((item: any) => 
        item.productID == productId && item.binID == binId
      );
      if (duplicate) {
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'This product and bin mapping already exists!' });
        this.mappingExists = true;
      } else {
        this.mappingExists = false;
      }
    }).catch((err: any) => {
      console.error('Error validating product bin uniqueness:', err);
      this.mappingExists = false;
    });
  }
}
