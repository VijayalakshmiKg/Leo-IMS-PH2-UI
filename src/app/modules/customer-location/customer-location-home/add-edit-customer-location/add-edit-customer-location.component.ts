import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CustomerLocationService } from '../../customer-location.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { CustomerLocation } from '../../customerLocationModel/customerLocationModel';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';

@Component({
  selector: 'app-add-edit-customer-location',
  templateUrl: './add-edit-customer-location.component.html',
  styleUrls: ['./add-edit-customer-location.component.css']
})
export class AddEditCustomerLocationComponent implements OnInit {

  customerLocationForm!: FormGroup
  customerLocationStatus: any = 'Active'
  saveBtnText: any;
  cpMappingId: number = 0;
  customerLocationModel: CustomerLocation = new CustomerLocation();
  employeeId: any;
  loggedInUserName: any;
  mappingExists: boolean = false;
  clientList: any[] = [];
  locationList: any[] = [];

  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    public customerLocationServ: CustomerLocationService,
    public location: Location,
    public utilSer: UtilityService
  ) { }

  ngOnInit(): void {
    this.customerLocationForm = this.fb.group({
      clientId: ['', [Validators.required]],
      locationId: ['', [Validators.required]]
    });

    var user: any = localStorage.getItem("userData");
    this.employeeId = JSON.parse(user);

    let loggedInUser: any = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      let parsedUser = JSON.parse(loggedInUser);
      this.loggedInUserName = parsedUser.userName || parsedUser.username || parsedUser.name;
    }

    this.loadClients();
    this.loadLocations();

    console.log('editCustomerLocationRecord in ngOnInit:', this.customerLocationServ.editCustomerLocationRecord);
    if (this.customerLocationServ.editCustomerLocationRecord) {
      this.saveBtnText = 'Update';
      this.cpMappingId = this.customerLocationServ.editCustomerLocationRecord.cP_Mapping_ID;
      this.setCustomerLocationDetails();
    } else {
      this.saveBtnText = 'Add';
    }
  }

  loadClients() {
    this.customerLocationServ.getAllClients().then((res: any) => {
      this.clientList = res.data || res;
    }).catch((err: any) => {
      this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Failed to load clients!' });
    });
  }

  loadLocations() {
    this.customerLocationServ.getAllLocations().then((res: any) => {
      this.locationList = res.data || res;
    }).catch((err: any) => {
      this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Failed to load locations!' });
    });
  }

  setCustomerLocationDetails() {
    const editData = this.customerLocationServ.editCustomerLocationRecord;
    console.log('Setting customer location details from:', editData);
    this.customerLocationStatus = editData.deleted ? 'Inactive' : 'Active';
    this.customerLocationForm.patchValue({
      clientId: editData.customerID,
      locationId: editData.locationID
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
        this.customerLocationServ.editCustomerLocationRecord = null;
        this.location.back();
      }
    })
  }

  onSubmitandClose(): void {
    if (this.customerLocationForm.valid && !this.mappingExists) {
      let model = new CustomerLocation();
      model.cP_Mapping_ID = this.cpMappingId ? Number(this.cpMappingId) : 0;
      model.customerID = this.customerLocationForm.value.clientId;
      model.locationID = this.customerLocationForm.value.locationId;
      model.status = this.customerLocationStatus;
      
      if (this.cpMappingId) {
        model.modifiedBy = this.loggedInUserName;
        model.modifiedDate = new Date();
      } else {
        model.createdBy = this.loggedInUserName;
        model.createdDate = new Date();
      }

      let toastMessage = this.cpMappingId ? 'Customer location mapping edited successfully.' : 'Customer location mapping added successfully.';

      this.customerLocationServ.addUpdateCustomerLocation(model).then(res => {
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
      this.customerLocationForm.markAllAsTouched();
      return;
    }
  }

  onSubmitandAddAnother(): void {
    if (this.customerLocationForm.valid && !this.mappingExists) {
      let model = new CustomerLocation();
      model.cP_Mapping_ID = 0;
      model.customerID = this.customerLocationForm.value.clientId;
      model.locationID = this.customerLocationForm.value.locationId;
      model.status = this.customerLocationStatus;
      model.createdBy = this.loggedInUserName;
      model.createdDate = new Date();

      this.customerLocationServ.addUpdateCustomerLocation(model).then((res: any) => {
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Customer location mapping added successfully.' });
          this.customerLocationForm.reset();
          this.customerLocationStatus = 'Active';
        }
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'A problem occured! Server error!' });
        }
      });
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.customerLocationForm.markAllAsTouched();
      return;
    }
  }

  checkMappingExists() {
    const clientId = this.customerLocationForm.get('clientId')?.value;
    const locationId = this.customerLocationForm.get('locationId')?.value;

    console.log('Checking mapping - clientId:', clientId, 'locationId:', locationId);

    // Reset mapping exists flag if either field is empty
    if (!clientId || !locationId || clientId === null || locationId === null) {
      this.mappingExists = false;
      return;
    }

    // Skip validation if editing and values haven't changed
    if (this.customerLocationServ.editCustomerLocationRecord && 
        clientId == this.customerLocationServ.editCustomerLocationRecord.clientID &&
        locationId == this.customerLocationServ.editCustomerLocationRecord.locationID) {
      this.mappingExists = false;
      return;
    }
    
    // Validate uniqueness only when both fields have valid values
    console.log('Calling validateCustomerLocationUniqueness with:', { clientId, locationId });
    this.customerLocationServ.validateCustomerLocationUniqueness(clientId, locationId)
      .then((res: any) => {
        if (!res.isUnique) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: res.message })
          this.mappingExists = true
        } else {
          this.mappingExists = false
        }
      }).catch((err: any) => {
        console.error('Error validating customer location uniqueness:', err);
        this.mappingExists = false;
      })
  }
}
