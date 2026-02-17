import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CustomerTrailerInTypeService } from '../../customer-trailer-in-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { CustomerTrailerInTypeModel } from '../../customerTrailerInTypeModel/customerTrailerInTypeModel';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';

@Component({
  selector: 'app-add-edit-customer-trailer-in-type',
  templateUrl: './add-edit-customer-trailer-in-type.component.html',
  styleUrls: ['./add-edit-customer-trailer-in-type.component.css']
})
export class AddEditCustomerTrailerInTypeComponent implements OnInit {

  customerTrailerInTypeForm!: FormGroup
  customerTrailerInTypeStatus: any = 'Active'
  saveBtnText: any;
  ctitMappingId: number = 0;
  customerTrailerInTypeModel: CustomerTrailerInTypeModel = new CustomerTrailerInTypeModel();
  employeeId: any;
  mappingExists: boolean = false;
  clientList: any[] = [];
  trailerList: any[] = [];
  loggedInUserName: string = '';

  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    public customerTrailerInTypeServ: CustomerTrailerInTypeService,
    public location: Location,
    public utilSer: UtilityService
  ) { }

  ngOnInit(): void {
    this.customerTrailerInTypeForm = this.fb.group({
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

    if (this.customerTrailerInTypeServ.editCustomerTrailerInTypeRecord) {
      this.saveBtnText = 'Update';
      this.ctitMappingId = this.customerTrailerInTypeServ.editCustomerTrailerInTypeRecord.cTIT_Mapping_ID;
    } else {
      this.saveBtnText = 'Add';
    }

    // Load data first, then set form values
    this.loadClients();
    this.loadTrailerTypes();
  }

  loadClients() {
    this.customerTrailerInTypeServ.getAllClients().then((res: any) => {
      this.clientList = res.data || res;
      // Set form values after clients are loaded
      if (this.customerTrailerInTypeServ.editCustomerTrailerInTypeRecord && this.trailerList.length > 0) {
        this.setCustomerTrailerInTypeDetails();
      }
    }).catch((err: any) => {
      this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Failed to load clients!' });
    });
  }

  loadTrailerTypes() {
    this.customerTrailerInTypeServ.getAllTrailerTypes().then((res: any) => {
      this.trailerList = res.data || res;
      // Set form values after trailers are loaded
      if (this.customerTrailerInTypeServ.editCustomerTrailerInTypeRecord && this.clientList.length > 0) {
        this.setCustomerTrailerInTypeDetails();
      }
    }).catch((err: any) => {
      this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Failed to load trailers!' });
    });
  }

  setCustomerTrailerInTypeDetails() {
    const editData = this.customerTrailerInTypeServ.editCustomerTrailerInTypeRecord;
    this.customerTrailerInTypeStatus = editData.status || editData.Status || 'Active';
    
    // Use setTimeout to ensure change detection runs
    setTimeout(() => {
      this.customerTrailerInTypeForm.patchValue({
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
        this.customerTrailerInTypeServ.editCustomerTrailerInTypeRecord = null;
        this.location.back();
      }
    })
  }

  onSubmitandClose(): void {
    if (this.customerTrailerInTypeForm.valid && !this.mappingExists) {
      this.customerTrailerInTypeModel.CTIT_Mapping_ID = this.ctitMappingId ? Number(this.ctitMappingId) : 0;
      this.customerTrailerInTypeModel.CustomerID = this.customerTrailerInTypeForm.value.clientId;
      this.customerTrailerInTypeModel.TrailerTypeID = this.customerTrailerInTypeForm.value.trailerId;
      this.customerTrailerInTypeModel.Status = this.customerTrailerInTypeStatus;

      // Set created/modified by username
      if (this.ctitMappingId) {
        this.customerTrailerInTypeModel.ModifiedBy = this.loggedInUserName;
      } else {
        this.customerTrailerInTypeModel.CreatedBy = this.loggedInUserName;
      }

      let toastMessage = this.ctitMappingId ? 'Customer trailer in type mapping edited successfully.' : 'Customer trailer in type mapping added successfully.';

      this.customerTrailerInTypeServ.addUpdateCustomerTrailerInType(this.customerTrailerInTypeModel).then(res => {
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
      this.customerTrailerInTypeForm.markAllAsTouched();
      return;
    }
  }

  onSubmitandAddAnother(): void {
    if (this.customerTrailerInTypeForm.valid && !this.mappingExists) {
      this.customerTrailerInTypeModel.CTIT_Mapping_ID = 0;
      this.customerTrailerInTypeModel.CustomerID = this.customerTrailerInTypeForm.value.clientId;
      this.customerTrailerInTypeModel.TrailerTypeID = this.customerTrailerInTypeForm.value.trailerId;
      this.customerTrailerInTypeModel.Status = this.customerTrailerInTypeStatus;
      this.customerTrailerInTypeModel.CreatedBy = this.loggedInUserName;

      this.customerTrailerInTypeServ.addUpdateCustomerTrailerInType(this.customerTrailerInTypeModel).then((res: any) => {
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Customer trailer in type mapping added successfully.' });
          this.customerTrailerInTypeForm.reset();
          this.customerTrailerInTypeStatus = 'Active';
        }
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'A problem occured! Server error!' });
        }
      });
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.customerTrailerInTypeForm.markAllAsTouched();
      return;
    }
  }

  checkMappingExists() {
    const clientId = this.customerTrailerInTypeForm.value.clientId;
    const trailerId = this.customerTrailerInTypeForm.value.trailerId;

    if (this.customerTrailerInTypeServ.editCustomerTrailerInTypeRecord && 
        clientId == this.customerTrailerInTypeServ.editCustomerTrailerInTypeRecord.clientID &&
        trailerId == this.customerTrailerInTypeServ.editCustomerTrailerInTypeRecord.trailerID) {
      this.mappingExists = false;
      return;
    }
    
    if (clientId && trailerId && clientId !== null && trailerId !== null) {
      this.customerTrailerInTypeServ.validateCustomerTrailerInTypeUniqueness(clientId, trailerId).then((res: any) => {
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
