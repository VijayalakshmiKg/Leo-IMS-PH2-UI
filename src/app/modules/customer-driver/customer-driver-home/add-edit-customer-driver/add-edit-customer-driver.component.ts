import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CustomerDriverService } from '../../customer-driver.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { CustomerDriver } from '../../customerDriverModel/customerDriverModel';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';

@Component({
  selector: 'app-add-edit-customer-driver',
  templateUrl: './add-edit-customer-driver.component.html',
  styleUrls: ['./add-edit-customer-driver.component.css']
})
export class AddEditCustomerDriverComponent implements OnInit {

  customerDriverForm!: FormGroup
  customerDriverStatus: any = 'Active'
  saveBtnText: any;
  cpMappingId: number = 0;
  customerDriverModel: CustomerDriver = new CustomerDriver();
  employeeId: any;
  loggedInUserName: any;
  mappingExists: boolean = false;
  clientList: any[] = [];
  driverList: any[] = [];

  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    public customerDriverServ: CustomerDriverService,
    public location: Location,
    public utilSer: UtilityService
  ) { }

  ngOnInit(): void {
    this.customerDriverForm = this.fb.group({
      clientId: ['', [Validators.required]],
      driverId: ['', [Validators.required]]
    });

    var user: any = localStorage.getItem("userData");
    this.employeeId = JSON.parse(user);

    let loggedInUser: any = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      let parsedUser = JSON.parse(loggedInUser);
      this.loggedInUserName = parsedUser.userName || parsedUser.username || parsedUser.name;
    }

    this.loadClients();
    this.loadDrivers();

    console.log('editCustomerDriverRecord in ngOnInit:', this.customerDriverServ.editCustomerDriverRecord);
    if (this.customerDriverServ.editCustomerDriverRecord) {
      this.saveBtnText = 'Update';
      this.cpMappingId = this.customerDriverServ.editCustomerDriverRecord.cP_Mapping_ID;
      this.setCustomerDriverDetails();
    } else {
      this.saveBtnText = 'Add';
    }
  }

  loadClients() {
    this.customerDriverServ.getAllClients().then((res: any) => {
      this.clientList = res.data || res;
    }).catch((err: any) => {
      this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Failed to load clients!' });
    });
  }

  loadDrivers() {
    this.customerDriverServ.getAllDrivers().then((res: any) => {
      this.driverList = res.data || res;
    }).catch((err: any) => {
      this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Failed to load drivers!' });
    });
  }

  setCustomerDriverDetails() {
    const editData = this.customerDriverServ.editCustomerDriverRecord;
    console.log('Setting customer driver details from:', editData);
    this.customerDriverStatus = editData.deleted ? 'Inactive' : 'Active';
    this.customerDriverForm.patchValue({
      clientId: editData.customerID,
      driverId: editData.driverID
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
        this.customerDriverServ.editCustomerDriverRecord = null;
        this.location.back();
      }
    })
  }

  onSubmitandClose(): void {
    if (this.customerDriverForm.valid && !this.mappingExists) {
      let model = new CustomerDriver();
      model.cP_Mapping_ID = this.cpMappingId ? Number(this.cpMappingId) : 0;
      model.customerID = this.customerDriverForm.value.clientId;
      model.driverID = this.customerDriverForm.value.driverId;
      model.status = this.customerDriverStatus;
      
      if (this.cpMappingId) {
        model.modifiedBy = this.loggedInUserName;
        model.modifiedDate = new Date();
      } else {
        model.createdBy = this.loggedInUserName;
        model.createdDate = new Date();
      }

      let toastMessage = this.cpMappingId ? 'Customer driver mapping edited successfully.' : 'Customer driver mapping added successfully.';

      this.customerDriverServ.addUpdateCustomerDriver(model).then(res => {
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
      this.customerDriverForm.markAllAsTouched();
      return;
    }
  }

  onSubmitandAddAnother(): void {
    if (this.customerDriverForm.valid && !this.mappingExists) {
      let model = new CustomerDriver();
      model.cP_Mapping_ID = 0;
      model.customerID = this.customerDriverForm.value.clientId;
      model.driverID = this.customerDriverForm.value.driverId;
      model.status = this.customerDriverStatus;
      model.createdBy = this.loggedInUserName;
      model.createdDate = new Date();

      this.customerDriverServ.addUpdateCustomerDriver(model).then((res: any) => {
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Customer driver mapping added successfully.' });
          this.customerDriverForm.reset();
          this.customerDriverStatus = 'Active';
        }
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'A problem occured! Server error!' });
        }
      });
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.customerDriverForm.markAllAsTouched();
      return;
    }
  }

  checkMappingExists() {
    const clientId = this.customerDriverForm.get('clientId')?.value;
    const driverId = this.customerDriverForm.get('driverId')?.value;

    console.log('Checking mapping - clientId:', clientId, 'driverId:', driverId);

    // Reset mapping exists flag if either field is empty
    if (!clientId || !driverId || clientId === null || driverId === null) {
      this.mappingExists = false;
      return;
    }

    // Skip validation if editing and values haven't changed
    if (this.customerDriverServ.editCustomerDriverRecord && 
        clientId == this.customerDriverServ.editCustomerDriverRecord.clientID &&
        driverId == this.customerDriverServ.editCustomerDriverRecord.driverID) {
      this.mappingExists = false;
      return;
    }
    
    // Validate uniqueness only when both fields have valid values
    console.log('Calling validateCustomerDriverUniqueness with:', { clientId, driverId });
    this.customerDriverServ.validateCustomerDriverUniqueness(clientId, driverId)
      .then((res: any) => {
        if (!res.isUnique) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: res.message })
          this.mappingExists = true
        } else {
          this.mappingExists = false
        }
      }).catch((err: any) => {
        console.error('Error validating customer driver uniqueness:', err);
        this.mappingExists = false;
      })
  }
}
