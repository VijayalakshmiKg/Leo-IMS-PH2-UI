import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { LocationService } from '../../location.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { LocationModel } from '../../locationModel/locationModel';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';

@Component({
  selector: 'app-add-edit-location',
  templateUrl: './add-edit-location.component.html',
  styleUrls: ['./add-edit-location.component.css']
})
export class AddEditLocationComponent implements OnInit {

  locationForm!: FormGroup
  locationStatus: any = 'Active'
  saveBtnText: any;
  locationId: number = 0;
  locationModel: LocationModel = new LocationModel();
  employeeId: any;
  locationNameExits: boolean = false;

  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    public locationServ: LocationService,
    public location: Location,
    public utilSer: UtilityService
  ) { }

  ngOnInit(): void {
    this.locationForm = this.fb.group({
      locationName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 \\-\']+')]],
      latitude: ['', [Validators.required, Validators.pattern('^-?([0-9]{1,2}|1[0-7][0-9]|180)(\\.[0-9]{1,10})?$')]],
      longitude: ['', [Validators.required, Validators.pattern('^-?([0-9]{1,2}|1[0-7][0-9]|180)(\\.[0-9]{1,10})?$')]],
      description: ['']
    });

    var user: any = localStorage.getItem("userData");
    this.employeeId = JSON.parse(user);

    if (this.locationServ.editLocationRecord) {
      this.saveBtnText = 'Update';
      this.locationId = this.locationServ.editLocationRecord.locationID;
      this.setLocationDetails();
    } else {
      this.saveBtnText = 'Add';
    }
  }

  setLocationDetails() {
    const editData = this.locationServ.editLocationRecord;
    this.locationStatus = editData.status
    this.locationForm.patchValue({
      locationName: editData.locationName,
      latitude: editData.latitude,
      longitude: editData.longitude,
      description: editData.description
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
        this.locationServ.editLocationRecord = null;
        this.location.back();
      }
    })
  }

  onSubmitandClose(): void {
    if (this.locationForm.valid && !this.locationNameExits) {
      this.locationModel.LocationID = this.locationId ? Number(this.locationId) : 0;
      this.locationModel.LocationName = this.locationForm.value.locationName;
      this.locationModel.Latitude = this.locationForm.value.latitude;
      this.locationModel.Longitude = this.locationForm.value.longitude;
      this.locationModel.Description = this.locationForm.value.description;
      this.locationModel.Status = this.locationStatus;

      let toastMessage = this.locationId ? 'Location edited successfully.' : 'Location added successfully.';

      this.locationServ.addUpdateLocation(this.locationModel).then(res => {
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
      this.locationForm.markAllAsTouched();
      return;
    }
  }

  onSubmitandAddAnother(): void {
    if (this.locationForm.valid && !this.locationNameExits) {
      this.locationModel.LocationID = 0;
      this.locationModel.LocationName = this.locationForm.value.locationName;
      this.locationModel.Latitude = this.locationForm.value.latitude;
      this.locationModel.Longitude = this.locationForm.value.longitude;
      this.locationModel.Description = this.locationForm.value.description;
      this.locationModel.Status = this.locationStatus;

      this.locationServ.addUpdateLocation(this.locationModel).then((res: any) => {
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Location added successfully.' });
          this.locationForm.reset();
          this.locationStatus = 'Active';
        }
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'A problem occured! Server error!' });
        }
      });
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.locationForm.markAllAsTouched();
      return;
    }
  }

  checkalreadyExitsForLocationName() {
    if (this.locationServ.editLocationRecord && this.locationForm.value.locationName == this.locationServ.editLocationRecord.locationName) {
      return;
    }
    this.locationServ.validateLocationUniqueness(this.locationForm.value.locationName).then((res: any) => {
      if (!res.isUnique) {
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: res.message })
        this.locationNameExits = true
      } else {
        this.locationNameExits = false
      }
    })
  }
}
