import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountSettingsService } from 'src/app/modules/account-settings/account-settings.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AddStatusComponent } from '../../status/add-status/add-status.component';

@Component({
  selector: 'app-add-trailers',
  templateUrl: './add-trailers.component.html',
  styleUrls: ['./add-trailers.component.css']
})
export class AddTrailersComponent implements OnInit {
  trailersForm!:FormGroup
  saveBtnText:any = 'Add'

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public fb:FormBuilder,public settingServ:AccountSettingsService,public dialog:MatDialogRef<AddStatusComponent>,public utilServ: UtilityService) { }

  ngOnInit(): void {
    this.trailersForm = this.fb.group({
      trailersName:['',Validators.required],
      licensePlate:['',Validators.required],
      usageType:['',Validators.required],
      axleCount:['',Validators.required],
    
    })
//console.log(this.data);

    if(this.data){
      this.setValues()
      this.saveBtnText = 'Update'
    }
  }

 setValues(){
this.trailersForm.get('trailersName')?.setValue(this.data?.data?.trailersName)
this.trailersForm.get('licensePlate')?.setValue(this.data?.data?.licensePlate)
this.trailersForm.get('usageType')?.setValue(this.data?.data?.usageType)
this.trailersForm.get('axleCount')?.setValue(this.data?.data?.axleCount)

  }

  savetrailers(){
  if(this.trailersForm.valid){
    if(this.data == null){
      //console.log(this.trailersForm.value);
      this.settingServ.trailersRecords.push(this.trailersForm.value)
      this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Status created successfully' });
      this.close(true)
     }
     else{
      //console.log(this.trailersForm.value);
      this.settingServ.trailersRecords.splice(this.data.index,1,this.trailersForm.value)
      this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Status updated successfully' });
      this.close(true)
     }
  }
  }

  close(value?:boolean){
    this.dialog.close(value)
  }
}
