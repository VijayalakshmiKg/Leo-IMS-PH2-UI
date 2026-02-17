import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CustomerTrailerInService } from '../../customer-trailer-in.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { CustomerTrailerInModel } from '../../customerTrailerInModel/customerTrailerInModel';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';

@Component({
  selector: 'app-add-edit-customer-trailer-in',
  templateUrl: './add-edit-customer-trailer-in.component.html',
  styleUrls: ['./add-edit-customer-trailer-in.component.css']
})
export class AddEditCustomerTrailerInComponent implements OnInit {

  customerTrailerInForm!: FormGroup
  customerTrailerInStatus: any = 'Active'
  saveBtnText: any;
  ctiMappingId: number = 0;
  customerTrailerInModel: CustomerTrailerInModel = new CustomerTrailerInModel();
  employeeId: any;
  mappingExists: boolean = false;
  clientList: any[] = [];
  trailerList: any[] = [];
  loggedInUserName: string = '';

  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    public customerTrailerInServ: CustomerTrailerInService,
    public location: Location,
    public utilSer: UtilityService
  ) { }

  ngOnInit(): void {
    this.customerTrailerInForm = this.fb.group({
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

    if (this.customerTrailerInServ.editCustomerTrailerInRecord) {
      this.saveBtnText = 'Update';
      this.ctiMappingId = this.customerTrailerInServ.editCustomerTrailerInRecord.cTI_Mapping_ID;
    } else {
      this.saveBtnText = 'Add';
    }

    // Load data first, then set form values
    this.loadClients();
    this.loadTrailers();
  }

  loadClients() {
    this.customerTrailerInServ.getAllClients().then((res: any) => {
      this.clientList = res.data || res;
      // Set form values after clients are loaded
      if (this.customerTrailerInServ.editCustomerTrailerInRecord && this.trailerList.length > 0) {
        this.setCustomerTrailerInDetails();
      }
    }).catch((err: any) => {
      this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Failed to load clients!' });
    });
  }

  loadTrailers() {
    this.customerTrailerInServ.getAllTrailers().then((res: any) => {
      this.trailerList = res.data || res;
      // Set form values after trailers are loaded
      if (this.customerTrailerInServ.editCustomerTrailerInRecord && this.clientList.length > 0) {
        this.setCustomerTrailerInDetails();
      }
    }).catch((err: any) => {
      this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Failed to load trailers!' });
    });
  }

  setCustomerTrailerInDetails() {
    const editData = this.customerTrailerInServ.editCustomerTrailerInRecord;
    this.customerTrailerInStatus = editData.status || editData.Status || 'Active';
    
    // Use setTimeout to ensure change detection runs
    setTimeout(() => {
      this.customerTrailerInForm.patchValue({
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
        this.customerTrailerInServ.editCustomerTrailerInRecord = null;
        this.location.back();
      }
    })
  }

  onSubmitandClose(): void {
    if (this.customerTrailerInForm.valid && !this.mappingExists) {
      this.customerTrailerInModel.CTI_Mapping_ID = this.ctiMappingId ? Number(this.ctiMappingId) : 0;
      this.customerTrailerInModel.CustomerID = this.customerTrailerInForm.value.clientId;
      this.customerTrailerInModel.TrailerID = this.customerTrailerInForm.value.trailerId;
      this.customerTrailerInModel.Status = this.customerTrailerInStatus;

      // Set created/modified by username
      if (this.ctiMappingId) {
        this.customerTrailerInModel.ModifiedBy = this.loggedInUserName;
      } else {
        this.customerTrailerInModel.CreatedBy = this.loggedInUserName;
      }

      let toastMessage = this.ctiMappingId ? 'Customer trailer in mapping edited successfully.' : 'Customer trailer in mapping added successfully.';

      this.customerTrailerInServ.addUpdateCustomerTrailerIn(this.customerTrailerInModel).then(res => {
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
      this.customerTrailerInForm.markAllAsTouched();
      return;
    }
  }

  onSubmitandAddAnother(): void {
    if (this.customerTrailerInForm.valid && !this.mappingExists) {
      this.customerTrailerInModel.CTI_Mapping_ID = 0;
      this.customerTrailerInModel.CustomerID = this.customerTrailerInForm.value.clientId;
      this.customerTrailerInModel.TrailerID = this.customerTrailerInForm.value.trailerId;
      this.customerTrailerInModel.Status = this.customerTrailerInStatus;
      this.customerTrailerInModel.CreatedBy = this.loggedInUserName;

      this.customerTrailerInServ.addUpdateCustomerTrailerIn(this.customerTrailerInModel).then((res: any) => {
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Customer trailer in mapping added successfully.' });
          this.customerTrailerInForm.reset();
          this.customerTrailerInStatus = 'Active';
        }
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'A problem occured! Server error!' });
        }
      });
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.customerTrailerInForm.markAllAsTouched();
      return;
    }
  }

  checkMappingExists() {
    const clientId = this.customerTrailerInForm.value.clientId;
    const trailerId = this.customerTrailerInForm.value.trailerId;

    if (this.customerTrailerInServ.editCustomerTrailerInRecord && 
        clientId == this.customerTrailerInServ.editCustomerTrailerInRecord.clientID &&
        trailerId == this.customerTrailerInServ.editCustomerTrailerInRecord.trailerID) {
      this.mappingExists = false;
      return;
    }
    
    if (clientId && trailerId && clientId !== null && trailerId !== null) {
      this.customerTrailerInServ.validateCustomerTrailerInUniqueness(clientId, trailerId).then((res: any) => {
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
