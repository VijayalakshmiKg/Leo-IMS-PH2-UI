import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgOtpInputComponent } from 'ng-otp-input';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-mfapop-up',
  templateUrl: './mfapop-up.component.html',
  styleUrls: ['./mfapop-up.component.css']
})
export class MFAPopUpComponent implements OnInit {
  @ViewChild(NgOtpInputComponent, { static: false }) ngOtpInput: NgOtpInputComponent | any;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: true,
    disableAutoFocus: false,
    placeholder: '',
  };
  otpclass: boolean = false;
  otpinput: boolean = false;
  factorAuth: boolean = true
  mobileOtpform !: FormGroup;
  tabButton = '';
  otpType: any = '';

  constructor(public dialogRef: MatDialogRef<MFAPopUpComponent>, public utilServ: UtilityService, public route: Router, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    //console.log(this.data);

  }



  close() {
    this.dialogRef.close();
  }

  continueBtn() {
    this.otpinput = true
    this.factorAuth = false
  }

  activeBox(data: any) {
    //console.log(data);
    this.tabButton = data;
    if (data === 'Mobile') {
      this.otpType = this.data.Mobile;
    } else if (data === 'Email') {
      this.otpType = this.data.Email;
    } else if (data === 'QR') {
      this.otpType = 'authenticator app';
    }
  }
  OtpcontinueBtn() {
    //console.log(this.ngOtpInput.currentVal);

    if (this.ngOtpInput.currentVal?.length < 6 || this.ngOtpInput.currentVal == undefined) {
      this.otpclass = true;
      return;
    }  else if(this.ngOtpInput.currentVal?.length >= 6) {
      this.otpclass = false;
      //console.log(this.ngOtpInput.currentVal);
      this.dialogRef.close(true);

    }
    
  }
  doOTPValid() {
    //console.log(this.ngOtpInput);
    if (this.ngOtpInput.currentVal?.length == 6) {
      this.otpclass = false
    } else {
      this.otpclass = true
    }
  }
  resendOTP() {
    this.utilServ.toaster.next({ type: customToaster.successToast, message: 'OTP sent successfully' });
  }
}
