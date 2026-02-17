import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CustomerTrailerOutTypeService } from '../../customer-trailer-out-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { CustomerTrailerOutTypeModel } from '../../customerTrailerOutTypeModel/customerTrailerOutTypeModel';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';

@Component({
  selector: 'app-add-edit-customer-trailer-out-type',
  templateUrl: './add-edit-customer-trailer-out-type.component.html',
  styleUrls: ['./add-edit-customer-trailer-out-type.component.css']
})
export class AddEditCustomerTrailerOutTypeComponent implements OnInit {

  customerTrailerOutTypeForm!: FormGroup
  customerTrailerOutTypeStatus: any = 'Active'
  saveBtnText: any;
  ctotMappingId: number = 0;
  customerTrailerOutTypeModel: CustomerTrailerOutTypeModel = new CustomerTrailerOutTypeModel();
  employeeId: any;
  mappingExists: boolean = false;
  clientList: any[] = [];
  trailerList: any[] = [];
  loggedInUserName: string = '';

  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    public customerTrailerOutTypeServ: CustomerTrailerOutTypeService,
    public location: Location,
    public utilSer: UtilityService
  ) { }

  ngOnInit(): void {
    this.customerTrailerOutTypeForm = this.fb.group({
      clientId: ['', [Validators.required]],
      trailerId: ['', [Validators.required]]
    });

    var user: any = localStorage.getItem("userData");
    this.employeeId = JSON.parse(user);

    var loggedInUser: any = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      var parsedUser = JSON.parse(loggedInUser);
      this.loggedInUserName = parsedUser.userName || parsedUser.username || '';
    }

    if (this.customerTrailerOutTypeServ.editCustomerTrailerOutTypeRecord) {
      this.saveBtnText = 'Update';
      this.ctotMappingId = this.customerTrailerOutTypeServ.editCustomerTrailerOutTypeRecord.cTOT_Mapping_ID;
    } else {
      this.saveBtnText = 'Add';
    }

    // Load data first, then set form values
    this.loadClients();
    this.loadTrailerTypes();
  }

  loadClients() {
    this.customerTrailerOutTypeServ.getAllClients().then((res: any) => {
      this.clientList = res.data || res;
      // Set form values after clients are loaded
      if (this.customerTrailerOutTypeServ.editCustomerTrailerOutTypeRecord && this.trailerList.length > 0) {
        this.setCustomerTrailerOutTypeDetails();
      }
    }).catch((err: any) => {
      this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Failed to load clients!' });
    });
  }

  loadTrailerTypes() {
    this.customerTrailerOutTypeServ.getAllTrailerTypes().then((res: any) => {
      this.trailerList = res.data || res;
      // Set form values after trailers are loaded
      if (this.customerTrailerOutTypeServ.editCustomerTrailerOutTypeRecord && this.clientList.length > 0) {
        this.setCustomerTrailerOutTypeDetails();
      }
    }).catch((err: any) => {
      this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Failed to load trailers!' });
    });
  }

  setCustomerTrailerOutTypeDetails() {
    const editData = this.customerTrailerOutTypeServ.editCustomerTrailerOutTypeRecord;
    this.customerTrailerOutTypeStatus = editData.status || editData.Status || 'Active';
    
    // Use setTimeout to ensure change detection runs
    setTimeout(() => {
      this.customerTrailerOutTypeForm.patchValue({
        clientId: editData.clientID || editData.ClientID || editData.customerID,
        trailerId: editData.trailerID || editData.TrailerID
      });
    }, 100);
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
        this.customerTrailerOutTypeServ.editCustomerTrailerOutTypeRecord = null;
        this.location.back();
      }
    })
  }

  onSubmitandClose(): void {
    if (this.customerTrailerOutTypeForm.valid && !this.mappingExists) {
      this.customerTrailerOutTypeModel.CTOT_Mapping_ID = this.ctotMappingId ? Number(this.ctotMappingId) : 0;
      this.customerTrailerOutTypeModel.CustomerID = this.customerTrailerOutTypeForm.value.clientId;
      this.customerTrailerOutTypeModel.TrailerTypeID = this.customerTrailerOutTypeForm.value.trailerId;
      this.customerTrailerOutTypeModel.Status = this.customerTrailerOutTypeStatus;

      // Set created/modified by username
      if (this.ctotMappingId) {
        this.customerTrailerOutTypeModel.ModifiedBy = this.loggedInUserName;
      } else {
        this.customerTrailerOutTypeModel.CreatedBy = this.loggedInUserName;
      }

      let toastMessage = this.ctotMappingId ? 'Customer trailer out type mapping edited successfully.' : 'Customer trailer out type mapping added successfully.';

      this.customerTrailerOutTypeServ.addUpdateCustomerTrailerOutType(this.customerTrailerOutTypeModel).then(res => {
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
      this.customerTrailerOutTypeForm.markAllAsTouched();
      return;
    }
  }

  onSubmitandAddAnother(): void {
    if (this.customerTrailerOutTypeForm.valid && !this.mappingExists) {
      this.customerTrailerOutTypeModel.CTOT_Mapping_ID = 0;
      this.customerTrailerOutTypeModel.CustomerID = this.customerTrailerOutTypeForm.value.clientId;
      this.customerTrailerOutTypeModel.TrailerTypeID = this.customerTrailerOutTypeForm.value.trailerId;
      this.customerTrailerOutTypeModel.Status = this.customerTrailerOutTypeStatus;
      this.customerTrailerOutTypeModel.CreatedBy = this.loggedInUserName;

      this.customerTrailerOutTypeServ.addUpdateCustomerTrailerOutType(this.customerTrailerOutTypeModel).then((res: any) => {
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Customer trailer out type mapping added successfully.' });
          this.customerTrailerOutTypeForm.reset();
          this.customerTrailerOutTypeStatus = 'Active';
        }
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'A problem occured! Server error!' });
        }
      });
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.customerTrailerOutTypeForm.markAllAsTouched();
      return;
    }
  }

  checkMappingExists() {
    const clientId = this.customerTrailerOutTypeForm.value.clientId;
    const trailerId = this.customerTrailerOutTypeForm.value.trailerId;

    if (this.customerTrailerOutTypeServ.editCustomerTrailerOutTypeRecord && 
        clientId == this.customerTrailerOutTypeServ.editCustomerTrailerOutTypeRecord.clientID &&
        trailerId == this.customerTrailerOutTypeServ.editCustomerTrailerOutTypeRecord.trailerID) {
      this.mappingExists = false;
      return;
    }
    
    if (clientId && trailerId && clientId !== null && trailerId !== null) {
      this.customerTrailerOutTypeServ.validateCustomerTrailerOutTypeUniqueness(clientId, trailerId).then((res: any) => {
        if (!res.isUnique) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: res.message })
          this.mappingExists = true
        } else {
          this.mappingExists = false
        }
      }).catch((err: any) => {
        console.error('Error validating uniqueness:', err);
        this.mappingExists = false;
      })
    } else {
      this.mappingExists = false;
    }
  }
}
