import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CustomerTrailerOutService } from '../../customer-trailer-out.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';

@Component({
  selector: 'app-add-edit-customer-trailer-out',
  templateUrl: './add-edit-customer-trailer-out.component.html',
  styleUrls: ['./add-edit-customer-trailer-out.component.css']
})
export class AddEditCustomerTrailerOutComponent implements OnInit {

  customerTrailerOutForm!: FormGroup
  customerTrailerOutStatus: any = 'Active'
  saveBtnText: any;
  ctoMappingId: number = 0;
  customerTrailerOutModel: any = {};
  employeeId: any;
  mappingExists: boolean = false;
  clientList: any[] = [];
  trailerList: any[] = [];
  loggedInUserName: string = '';

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public customerTrailerOutServ: CustomerTrailerOutService,
    public location: Location,
    public utilSer: UtilityService
  ) { }

  ngOnInit(): void {
    this.customerTrailerOutForm = this.fb.group({
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

    if (this.customerTrailerOutServ.editCustomerTrailerOutRecord) {
      this.saveBtnText = 'Update';
      this.ctoMappingId = this.customerTrailerOutServ.editCustomerTrailerOutRecord.cTO_Mapping_ID;
    } else {
      this.saveBtnText = 'Add';
    }

    // Load data first, then set form values
    this.loadClients();
    this.loadTrailers();
  }

  loadClients() {
    this.customerTrailerOutServ.getAllClients().then((res: any) => {
      this.clientList = res.data || res;
      // Set form values after clients are loaded
      if (this.customerTrailerOutServ.editCustomerTrailerOutRecord && this.trailerList.length > 0) {
        this.setCustomerTrailerOutDetails();
      }
    }).catch((err: any) => {
      this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Failed to load clients!' });
    });
  }

  loadTrailers() {
    this.customerTrailerOutServ.getAllTrailers().then((res: any) => {
      this.trailerList = res.data || res;
      // Set form values after trailers are loaded
      if (this.customerTrailerOutServ.editCustomerTrailerOutRecord && this.clientList.length > 0) {
        this.setCustomerTrailerOutDetails();
      }
    }).catch((err: any) => {
      this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Failed to load trailers!' });
    });
  }

  checkMappingExists() {
    const clientId = this.customerTrailerOutForm.value.clientId;
    const trailerId = this.customerTrailerOutForm.value.trailerId;

    if (this.customerTrailerOutServ.editCustomerTrailerOutRecord && 
        clientId == this.customerTrailerOutServ.editCustomerTrailerOutRecord.clientID &&
        trailerId == this.customerTrailerOutServ.editCustomerTrailerOutRecord.trailerID) {
      this.mappingExists = false;
      return;
    }
    
    if (clientId && trailerId && clientId !== null && trailerId !== null) {
      this.customerTrailerOutServ.validateCustomerTrailerOutUniqueness(clientId, trailerId).then((res: any) => {
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

  setCustomerTrailerOutDetails() {
    const editData = this.customerTrailerOutServ.editCustomerTrailerOutRecord;
    this.customerTrailerOutStatus = editData.status || editData.Status || 'Active';
    
    // Use setTimeout to ensure change detection runs
    setTimeout(() => {
      this.customerTrailerOutForm.patchValue({
        clientId: editData.clientID || editData.ClientID || editData.customerID,
        trailerId: editData.trailerID || editData.TrailerID
      });
    }, 100);
  }

  onSubmitandClose(): void {
    if (this.customerTrailerOutForm.valid && !this.mappingExists) {
      this.customerTrailerOutModel.CTO_Mapping_ID = this.ctoMappingId ? Number(this.ctoMappingId) : 0;
      this.customerTrailerOutModel.CustomerID = this.customerTrailerOutForm.value.clientId;
      this.customerTrailerOutModel.TrailerID = this.customerTrailerOutForm.value.trailerId;
      this.customerTrailerOutModel.Status = this.customerTrailerOutStatus;

      // Set created/modified by username
      if (this.ctoMappingId) {
        this.customerTrailerOutModel.ModifiedBy = this.loggedInUserName;
      } else {
        this.customerTrailerOutModel.CreatedBy = this.loggedInUserName;
      }

      let toastMessage = this.ctoMappingId ? 'Customer trailer out mapping edited successfully.' : 'Customer trailer out mapping added successfully.';

      this.customerTrailerOutServ.addUpdateCustomerTrailerOut(this.customerTrailerOutModel).then(res => {
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
      this.customerTrailerOutForm.markAllAsTouched();
      return;
    }
  }

  onSubmitandAddAnother(): void {
    if (this.customerTrailerOutForm.valid && !this.mappingExists) {
      this.customerTrailerOutModel.CTO_Mapping_ID = 0;
      this.customerTrailerOutModel.CustomerID = this.customerTrailerOutForm.value.clientId;
      this.customerTrailerOutModel.TrailerID = this.customerTrailerOutForm.value.trailerId;
      this.customerTrailerOutModel.Status = this.customerTrailerOutStatus;
      this.customerTrailerOutModel.CreatedBy = this.loggedInUserName;

      this.customerTrailerOutServ.addUpdateCustomerTrailerOut(this.customerTrailerOutModel).then((res: any) => {
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Customer trailer out mapping added successfully.' });
          this.customerTrailerOutForm.reset();
          this.customerTrailerOutStatus = 'Active';
        }
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'A problem occured! Server error!' });
        }
      });
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.customerTrailerOutForm.markAllAsTouched();
      return;
    }
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
        this.customerTrailerOutServ.editCustomerTrailerOutRecord = null;
        this.location.back();
      }
    })
  }
}
