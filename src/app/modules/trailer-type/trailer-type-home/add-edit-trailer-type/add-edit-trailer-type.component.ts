import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TrailerTypeService } from '../../trailer-type.service';
import { Location } from '@angular/common';
import { TrailerTypeModel } from '../../trailerTypeModel/trailerTypeModel';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';

@Component({
  selector: 'app-add-edit-trailer-type',
  templateUrl: './add-edit-trailer-type.component.html',
  styleUrls: ['./add-edit-trailer-type.component.css']
})
export class AddEditTrailerTypeComponent implements OnInit {
  trailerTypeForm!: FormGroup
  trailerTypeStatus: any = 'Active';
  saveBtnText: any = 'Add'
  trailerTypeModel: TrailerTypeModel = new TrailerTypeModel();
  trailerTypeId: number = 0;
  trailerTypeExists: boolean = false;
  loggedInUserName: string = '';

  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    public TrailerTypeServ: TrailerTypeService,
    public location: Location,
    public utilSer: UtilityService
  ) { }

  ngOnInit(): void {
    this.trailerTypeForm = this.fb.group({
      trailerTypeName: ['', Validators.required],
      description: [''],
      capacity: ['', [Validators.required, Validators.min(0)]]
    });

    var loggedInUser: any = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      var parsedUser = JSON.parse(loggedInUser);
      this.loggedInUserName = parsedUser.userName || parsedUser.username || '';
    }

    if (this.TrailerTypeServ.editTrailerTypeRecord) {
      this.trailerTypeId = this.TrailerTypeServ.editTrailerTypeRecord.trailerTypeID;
      this.saveBtnText = 'Update';
      this.setTrailerTypeDetails()
    }
  }

  setTrailerTypeDetails() {
    const editData = this.TrailerTypeServ.editTrailerTypeRecord;
    this.trailerTypeStatus = editData.status || editData.Status || 'Active';
    this.trailerTypeForm.patchValue({
      trailerTypeName: editData.trailerTypeName,
      description: editData.description,
      capacity: editData.capacity
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
        this.TrailerTypeServ.editTrailerTypeRecord = null
        this.location.back()
      }
    });
  }

  checkTrailerTypeExists() {
    const enteredName = this.trailerTypeForm.get('trailerTypeName')?.value?.trim();
    
    if (!enteredName) {
      this.trailerTypeExists = false;
      return;
    }

    // Skip validation if editing and name hasn't changed
    if (this.TrailerTypeServ.editTrailerTypeRecord && 
        enteredName.toLowerCase() === this.TrailerTypeServ.editTrailerTypeRecord.trailerTypeName?.toLowerCase()) {
      this.trailerTypeExists = false;
      return;
    }

    this.TrailerTypeServ.validateTrailerTypeUniqueness(enteredName).then((res: any) => {
      if (!res.isUnique) {
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: res.message || 'Trailer type name already exists!' })
        this.trailerTypeExists = true;
      } else {
        this.trailerTypeExists = false;
      }
    }).catch((err: any) => {
      console.error('Error validating uniqueness:', err);
      this.trailerTypeExists = false;
    });
  }

  onSubmitandClose(): void {
    if (this.trailerTypeForm.valid && !this.trailerTypeExists) {
      this.trailerTypeModel.TrailerTypeId = this.trailerTypeId ? this.trailerTypeId : 0;
      this.trailerTypeModel.TrailerTypeName = this.trailerTypeForm.value.trailerTypeName;
      this.trailerTypeModel.Description = this.trailerTypeForm.value.description || '';
      this.trailerTypeModel.Capacity = this.trailerTypeForm.value.capacity;
      this.trailerTypeModel.Status = this.trailerTypeStatus;

      // Set created/modified by username
      if (this.trailerTypeId) {
        this.trailerTypeModel.ModifiedBy = this.loggedInUserName;
      } else {
        this.trailerTypeModel.CreatedBy = this.loggedInUserName;
      }

      let toastMessage = this.trailerTypeId ? 'Trailer type edited successfully.' : 'Trailer type added successfully.';

      this.TrailerTypeServ.addUpdateTrailerType(this.trailerTypeModel).then(res => {
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: toastMessage })
          this.location.back()
        }
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'A problem occured! Server error!' });
        }
      });
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.trailerTypeForm.markAllAsTouched();
      return
    }
  }

  onSubmitandAddAnother(): void {
    if (this.trailerTypeForm.valid && !this.trailerTypeExists) {
      this.trailerTypeModel.TrailerTypeId = 0;
      this.trailerTypeModel.TrailerTypeName = this.trailerTypeForm.value.trailerTypeName;
      this.trailerTypeModel.Description = this.trailerTypeForm.value.description || '';
      this.trailerTypeModel.Capacity = this.trailerTypeForm.value.capacity;
      this.trailerTypeModel.Status = this.trailerTypeStatus;
      this.trailerTypeModel.CreatedBy = this.loggedInUserName;

      this.TrailerTypeServ.addUpdateTrailerType(this.trailerTypeModel).then((res: any) => {
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Trailer type added successfully.' });
          this.trailerTypeForm.reset();
          this.trailerTypeStatus = 'Active';
        }
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'A problem occured! Server error!' });
        }
      });
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.trailerTypeForm.markAllAsTouched();
      return
    }
  }
}
