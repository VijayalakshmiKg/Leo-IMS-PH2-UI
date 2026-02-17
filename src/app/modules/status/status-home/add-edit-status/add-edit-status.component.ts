import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { StatusService } from '../../status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { StatusModel } from '../../statusModel/statusModel';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';

@Component({
  selector: 'app-add-edit-status',
  templateUrl: './add-edit-status.component.html',
  styleUrls: ['./add-edit-status.component.css']
})
export class AddEditStatusComponent implements OnInit {

  statusForm!: FormGroup
  statusStatus: any = 'Active'
  saveBtnText: any;
  statusId: number = 0;
  statusModel: StatusModel = new StatusModel();
  employeeId: any;
  statusNameExits: boolean = false;

  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    public statusServ: StatusService,
    public location: Location,
    public utilSer: UtilityService
  ) { }

  ngOnInit(): void {
    this.statusForm = this.fb.group({
      statusName: ['', [Validators.required, Validators.pattern('^[a-zA-Z \\-\']+')]],
      description: ['']
    });

    var user: any = localStorage.getItem("userData");
    this.employeeId = JSON.parse(user);

    if (this.statusServ.editStatusRecord) {
      this.saveBtnText = 'Update';
      this.statusId = this.statusServ.editStatusRecord.statusID;
      this.setStatusDetails();
    } else {
      this.saveBtnText = 'Add';
    }
  }

  setStatusDetails() {
    const editData = this.statusServ.editStatusRecord;
    this.statusStatus = editData.status
    this.statusForm.patchValue({
      statusName: editData.statusName,
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
        this.statusServ.editStatusRecord = null;
        this.location.back();
      }
    })
  }

  onSubmitandClose(): void {
    if (this.statusForm.valid && !this.statusNameExits) {
      this.statusModel.StatusID = this.statusId ? Number(this.statusId) : 0;
      this.statusModel.StatusName = this.statusForm.value.statusName;
      this.statusModel.Description = this.statusForm.value.description;
      this.statusModel.Status = this.statusStatus;

      let toastMessage = this.statusId ? 'Status edited successfully.' : 'Status added successfully.';

      this.statusServ.addUpdateStatus(this.statusModel).then(res => {
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
      this.statusForm.markAllAsTouched();
      return;
    }
  }

  onSubmitandAddAnother(): void {
    if (this.statusForm.valid && !this.statusNameExits) {
      this.statusModel.StatusID = 0;
      this.statusModel.StatusName = this.statusForm.value.statusName;
      this.statusModel.Description = this.statusForm.value.description;
      this.statusModel.Status = this.statusStatus;

      this.statusServ.addUpdateStatus(this.statusModel).then((res: any) => {
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Status added successfully.' });
          this.statusForm.reset();
          this.statusStatus = 'Active';
        }
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'A problem occured! Server error!' });
        }
      });
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.statusForm.markAllAsTouched();
      return;
    }
  }

  checkalreadyExitsForStatusName() {
    if (this.statusServ.editStatusRecord && this.statusForm.value.statusName == this.statusServ.editStatusRecord.statusName) {
      return;
    }
    this.statusServ.validateStatusUniqueness(this.statusForm.value.statusName).then((res: any) => {
      if (!res.isUnique) {
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: res.message })
        this.statusNameExits = true
      } else {
        this.statusNameExits = false
      }
    }) 
  }
}
