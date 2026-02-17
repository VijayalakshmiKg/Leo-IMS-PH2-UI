import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CustomerProductTypeService } from '../../customer-product-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { CustomerProductTypeModel } from '../../customerProductTypeModel/customerProductTypeModel';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';

@Component({
  selector: 'app-add-edit-customer-product-type',
  templateUrl: './add-edit-customer-product-type.component.html',
  styleUrls: ['./add-edit-customer-product-type.component.css']
})
export class AddEditCustomerProductTypeComponent implements OnInit {

  customerProductTypeForm!: FormGroup
  customerProductTypeStatus: any = 'Active'
  saveBtnText: any;
  cptMappingId: number = 0;
  customerProductTypeModel: CustomerProductTypeModel = new CustomerProductTypeModel();
  employeeId: any;
  loggedInUserName: any;
  mappingExists: boolean = false;
  clientList: any[] = [];
  productTypeList: any[] = [];

  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    public customerProductTypeServ: CustomerProductTypeService,
    public location: Location,
    public utilSer: UtilityService
  ) { }

  ngOnInit(): void {
    this.customerProductTypeForm = this.fb.group({
      clientId: ['', [Validators.required]],
      productTypeId: ['', [Validators.required]]
    });

    var user: any = localStorage.getItem("userData");
    this.employeeId = JSON.parse(user);

    let loggedInUser: any = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      let parsedUser = JSON.parse(loggedInUser);
      this.loggedInUserName = parsedUser.userName || parsedUser.username || parsedUser.name;
    }

    this.loadClients();
    this.loadProductTypes();

    console.log('editCustomerProductTypeRecord in ngOnInit:', this.customerProductTypeServ.editCustomerProductTypeRecord);
    if (this.customerProductTypeServ.editCustomerProductTypeRecord) {
      this.saveBtnText = 'Update';
      this.cptMappingId = this.customerProductTypeServ.editCustomerProductTypeRecord.cpT_Mapping_ID;
      this.setCustomerProductTypeDetails();
    } else {
      this.saveBtnText = 'Add';
    }
  }

  loadClients() {
    this.customerProductTypeServ.getAllClients().then((res: any) => {
      this.clientList = res.data || res;
    }).catch((err: any) => {
      this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Failed to load clients!' });
    });
  }

  loadProductTypes() {
    this.customerProductTypeServ.getAllProductTypes().then((res: any) => {
      this.productTypeList = res.data || res;
    }).catch((err: any) => {
      this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Failed to load product types!' });
    });
  }

  setCustomerProductTypeDetails() {
    const editData = this.customerProductTypeServ.editCustomerProductTypeRecord;
    console.log('Setting customer product type details from:', editData);
    // Check if API returns 'deleted' boolean or 'status' string
    if (editData.hasOwnProperty('deleted')) {
      this.customerProductTypeStatus = editData.deleted ? 'Inactive' : 'Active';
    } else if (editData.hasOwnProperty('status')) {
      this.customerProductTypeStatus = editData.status;
    } else {
      this.customerProductTypeStatus = 'Active'; // default
    }
    this.customerProductTypeForm.patchValue({
      clientId: editData.customerID,
      productTypeId: editData.productTypeID
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
        this.customerProductTypeServ.editCustomerProductTypeRecord = null;
        this.location.back();
      }
    })
  }

  onSubmitandClose(): void {
    if (this.customerProductTypeForm.valid && !this.mappingExists) {
      this.customerProductTypeModel.CPT_Mapping_ID = this.cptMappingId ? Number(this.cptMappingId) : 0;
      this.customerProductTypeModel.CustomerID = this.customerProductTypeForm.value.clientId;
      this.customerProductTypeModel.ProductTypeID = this.customerProductTypeForm.value.productTypeId;
      this.customerProductTypeModel.Status = this.customerProductTypeStatus;
      
      if (this.cptMappingId) {
        this.customerProductTypeModel.ModifiedBy = this.loggedInUserName;
        this.customerProductTypeModel.ModifiedDate = new Date().toISOString();
      } else {
        this.customerProductTypeModel.CreatedBy = this.loggedInUserName;
        this.customerProductTypeModel.CreatedDate = new Date().toISOString();
      }

      let toastMessage = this.cptMappingId ? 'Customer product type mapping edited successfully.' : 'Customer product type mapping added successfully.';

      this.customerProductTypeServ.addUpdateCustomerProductType(this.customerProductTypeModel).then(res => {
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
      this.customerProductTypeForm.markAllAsTouched();
      return;
    }
  }

  onSubmitandAddAnother(): void {
    if (this.customerProductTypeForm.valid && !this.mappingExists) {
      this.customerProductTypeModel.CPT_Mapping_ID = 0;
      this.customerProductTypeModel.CustomerID = this.customerProductTypeForm.value.clientId;
      this.customerProductTypeModel.ProductTypeID = this.customerProductTypeForm.value.productTypeId;
      this.customerProductTypeModel.Status = this.customerProductTypeStatus;
      this.customerProductTypeModel.CreatedBy = this.loggedInUserName;
      this.customerProductTypeModel.CreatedDate = new Date().toISOString();

      this.customerProductTypeServ.addUpdateCustomerProductType(this.customerProductTypeModel).then((res: any) => {
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Customer product type mapping added successfully.' });
          this.customerProductTypeForm.reset();
          this.customerProductTypeStatus = 'Active';
        }
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'A problem occured! Server error!' });
        }
      });
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.customerProductTypeForm.markAllAsTouched();
      return;
    }
  }

  checkMappingExists() {
    const clientId = this.customerProductTypeForm.get('clientId')?.value;
    const productTypeId = this.customerProductTypeForm.get('productTypeId')?.value;

    console.log('Checking mapping - clientId:', clientId, 'productTypeId:', productTypeId);

    // Reset mapping exists flag if either field is empty
    if (!clientId || !productTypeId || clientId === null || productTypeId === null) {
      this.mappingExists = false;
      return;
    }

    // Skip validation if editing and values haven't changed
    if (this.customerProductTypeServ.editCustomerProductTypeRecord && 
        clientId == this.customerProductTypeServ.editCustomerProductTypeRecord.customerID &&
        productTypeId == this.customerProductTypeServ.editCustomerProductTypeRecord.productTypeID) {
      this.mappingExists = false;
      return;
    }
    
    // Validate uniqueness only when both fields have valid values
    console.log('Calling validateCustomerProductTypeUniqueness with:', { clientId, productTypeId });
    this.customerProductTypeServ.validateCustomerProductTypeUniqueness(clientId, productTypeId)
      .then((res: any) => {
        if (!res.isUnique) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: res.message })
          this.mappingExists = true
        } else {
          this.mappingExists = false
        }
      }).catch((err: any) => {
        console.error('Error validating customer product type uniqueness:', err);
        this.mappingExists = false;
      })
  }
}
