import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CustomerProductService } from '../../customer-product.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { CustomerProductModel } from '../../customerProductModel/customerProductModel';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';

@Component({
  selector: 'app-add-edit-customer-product',
  templateUrl: './add-edit-customer-product.component.html',
  styleUrls: ['./add-edit-customer-product.component.css']
})
export class AddEditCustomerProductComponent implements OnInit {

  customerProductForm!: FormGroup
  customerProductStatus: any = 'Active'
  saveBtnText: any;
  cpMappingId: number = 0;
  customerProductModel: CustomerProductModel = new CustomerProductModel();
  employeeId: any;
  loggedInUserName: any;
  mappingExists: boolean = false;
  clientList: any[] = [];
  productList: any[] = [];

  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    public customerProductServ: CustomerProductService,
    public location: Location,
    public utilSer: UtilityService
  ) { }

  ngOnInit(): void {
    this.customerProductForm = this.fb.group({
      clientId: ['', [Validators.required]],
      productId: ['', [Validators.required]]
    });

    var user: any = localStorage.getItem("userData");
    this.employeeId = JSON.parse(user);

    let loggedInUser: any = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      let parsedUser = JSON.parse(loggedInUser);
      this.loggedInUserName = parsedUser.userName || parsedUser.username || parsedUser.name;
    }

    this.loadClients();
    this.loadProducts();

    console.log('editCustomerProductRecord in ngOnInit:', this.customerProductServ.editCustomerProductRecord);
    if (this.customerProductServ.editCustomerProductRecord) {
      this.saveBtnText = 'Update';
      this.cpMappingId = this.customerProductServ.editCustomerProductRecord.cP_Mapping_ID;
      this.setCustomerProductDetails();
    } else {
      this.saveBtnText = 'Add';
    }
  }

  loadClients() {
    this.customerProductServ.getAllClients().then((res: any) => {
      this.clientList = res.data || res;
    }).catch((err: any) => {
      this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Failed to load clients!' });
    });
  }

  loadProducts() {
    this.customerProductServ.getAllProducts().then((res: any) => {
      this.productList = res.data || res;
    }).catch((err: any) => {
      this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Failed to load products!' });
    });
  }

  setCustomerProductDetails() {
    const editData = this.customerProductServ.editCustomerProductRecord;
    console.log('Setting customer product details from:', editData);
    this.customerProductStatus = editData.deleted ? 'Inactive' : 'Active';
    this.customerProductForm.patchValue({
      clientId: editData.customerID,
      productId: editData.productID
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
        this.customerProductServ.editCustomerProductRecord = null;
        this.location.back();
      }
    })
  }

  onSubmitandClose(): void {
    if (this.customerProductForm.valid && !this.mappingExists) {
      let model = new CustomerProductModel();
      model.CP_Mapping_ID = this.cpMappingId ? Number(this.cpMappingId) : 0;
      model.CustomerID = this.customerProductForm.value.clientId;
      model.ProductID = this.customerProductForm.value.productId;
      model.Deleted = this.customerProductStatus === 'Inactive' ? true : false;
      
      if (this.cpMappingId) {
        model.ModifiedBy = this.loggedInUserName;
        model.ModifiedDate = new Date();
      } else {
        model.CreatedBy = this.loggedInUserName;
        model.CreatedDate = new Date();
      }

      let toastMessage = this.cpMappingId ? 'Customer product mapping edited successfully.' : 'Customer product mapping added successfully.';

      this.customerProductServ.addUpdateCustomerProduct(model).then(res => {
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
      this.customerProductForm.markAllAsTouched();
      return;
    }
  }

  onSubmitandAddAnother(): void {
    if (this.customerProductForm.valid && !this.mappingExists) {
      let model = new CustomerProductModel();
      model.CP_Mapping_ID = 0;
      model.CustomerID = this.customerProductForm.value.clientId;
      model.ProductID = this.customerProductForm.value.productId;
      model.Deleted = this.customerProductStatus === 'Inactive' ? true : false;
      model.CreatedBy = this.loggedInUserName;
      model.CreatedDate = new Date();

      this.customerProductServ.addUpdateCustomerProduct(model).then((res: any) => {
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Customer product mapping added successfully.' });
          this.customerProductForm.reset();
          this.customerProductStatus = 'Active';
        }
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'A problem occured! Server error!' });
        }
      });
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.customerProductForm.markAllAsTouched();
      return;
    }
  }

  checkMappingExists() {
    const clientId = this.customerProductForm.get('clientId')?.value;
    const productId = this.customerProductForm.get('productId')?.value;

    console.log('Checking mapping - clientId:', clientId, 'productId:', productId);

    // Reset mapping exists flag if either field is empty
    if (!clientId || !productId || clientId === null || productId === null) {
      this.mappingExists = false;
      return;
    }

    // Skip validation if editing and values haven't changed
    if (this.customerProductServ.editCustomerProductRecord && 
        clientId == this.customerProductServ.editCustomerProductRecord.clientID &&
        productId == this.customerProductServ.editCustomerProductRecord.productID) {
      this.mappingExists = false;
      return;
    }
    
    // Validate uniqueness only when both fields have valid values
    console.log('Calling validateCustomerProductUniqueness with:', { clientId, productId });
    this.customerProductServ.validateCustomerProductUniqueness(clientId, productId)
      .then((res: any) => {
        if (!res.isUnique) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: res.message })
          this.mappingExists = true
        } else {
          this.mappingExists = false
        }
      }).catch((err: any) => {
        console.error('Error validating customer product uniqueness:', err);
        this.mappingExists = false;
      })
  }
}
