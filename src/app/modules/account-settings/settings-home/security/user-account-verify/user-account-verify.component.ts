import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AccountSettingsService } from '../../../account-settings.service';

@Component({
  selector: 'app-user-account-verify',
  templateUrl: './user-account-verify.component.html',
  styleUrls: ['./user-account-verify.component.css']
})
export class UserAccountVerifyComponent implements OnInit {

  verifyAccountForm !: FormGroup;
  userData:any;
  constructor(public dialogRef: MatDialogRef<UserAccountVerifyComponent>, public utilServ: UtilityService, public fb: FormBuilder, public accountSer: AccountSettingsService) { }

  ngOnInit(): void {
    this.verifyAccountForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required]]
    })

   this.userData = this.accountSer.userVerify;
   //console.log(this.userData);
   
   this.verifyAccountForm.get('username')?.setValue(this.userData[0].username);
   this.verifyAccountForm.get('username')?.disable();
   this.verifyAccountForm.get('mobile')?.setValue(this.userData[0].mobile)
   this.verifyAccountForm.get('mobile')?.disable();


  }
  close() {
    this.dialogRef.close()
  }
  enableBtn() {
    this.utilServ.toaster.next({ type: customToaster.successToast, message: '2-step verification enabled' })
    this.close()
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode <= 46 || (charCode > 31 && (charCode < 48 || charCode > 57))) {
      if (this.verifyAccountForm.value.mobile?.length < 8) {
        // this.proper = true;
      }
      return false;
    }
    return true;
  }
  

}
