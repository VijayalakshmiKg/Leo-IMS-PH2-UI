import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/guards/auth.service';
import { changePasswordModel } from '../../../accountModel/changePasswordModel';
import { AccountSettingsService } from '../../../account-settings.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePswdForm!: FormGroup;
  hide1: boolean = true;
  hide2: boolean = true;
  hide3: boolean = true;
  invalid: boolean = true;
  oldPasswordError: boolean = true;
  newPasswordError: any;
  confirmPasswordError: any;
  currentPassword: any
  userData: any;
  changePassword: changePasswordModel = new changePasswordModel();

  constructor(public route: Router, public fb: FormBuilder, public accSer: AccountSettingsService, public authServ: AuthService, public dialogRef: MatDialogRef<ChangePasswordComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    let Data: any = localStorage.getItem("userData");
    this.userData = JSON.parse(Data);
    //console.log(this.userData);

    this.changePswdForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required, , Validators.minLength(8)],
      confirmPassword: ['', Validators.required],
    })
    // this.currentPassword = this.authServ.userDetails.Password;
  }


  close() {
    this.dialogRef.close();
  }
  oldPasswordCheck(event: any) {
    //console.log(event.target.value);
    let password = event.target.value
    this.accSer.verifyPassword(this.userData.email, password).then(res => {
      //console.log(res);

      if (res.statusMessage.toLowerCase() == 'the password is correct.') {
        this.oldPasswordError = true;
      }
      else if (res.statusMessage.toLowerCase() == 'the password is incorrect.') {
        this.oldPasswordError = false;
      }
    })

  }
  newPasswordCheck() {
    if (this.changePswdForm.value.currentPassword == this.changePswdForm.value.newPassword) {
      this.newPasswordError = true;
    }
    else {
      this.newPasswordError = false;
    }
  }
  confirmPasswordCheck() {
    if (this.changePswdForm.value.confirmPassword != this.changePswdForm.value.newPassword) {
      this.confirmPasswordError = true;
    }
    else {
      this.confirmPasswordError = false;
    }
  }

  // check the old password and new password both are same 
  checkIfOldPasswordMatches(control: FormControl): { [key: string]: boolean } | null {
    const oldPassword = this.changePswdForm?.get('currentPassword')?.value;
    const newPassword = control.value;

    if (oldPassword && newPassword === oldPassword) {
      return { sameAsOldPassword: true };  // Error: passwords match
    }
    return null;
  }
  // Check new password and confirm password both are match
  passwordMatchValidator(control: FormControl): { [key: string]: boolean } | null {
    const newPassword = this.changePswdForm?.get('newPassword')?.value;
    const confirmPassword = control.value;

    return newPassword === confirmPassword ? null : { passwordsMismatch: true };  // Error if passwords don't match
  }
  get f() {
    return this.changePswdForm.controls;
  }

  submit() {
    if (this.changePswdForm.valid) {
      this.changePassword.UserName = this.userData.email;
      this.changePassword.ConfirmPassword = this.changePswdForm.value.confirmPassword;
      this.changePassword.NewPassword = this.changePswdForm.value.newPassword;
      this.changePassword.OldPassword = this.changePswdForm.value.currentPassword;
      //console.log(this.changePswdForm.value);
      this.accSer.changePassword(this.changePassword).then(res => {
        //console.log(res);
        if (res) {
          this.dialogRef.close(true);
        }

        // this.accSer.empolyeePassword(this.userData.employeeId, this.userData.email).then((res:any) => {
        //   //console.log(res,"emp");

        // });
      });



    }
  }
  //get a password value
  get orgPassword() {
    return this.changePswdForm.get("newPassword")?.value;
  }

  //check wheather password have lowercase
  get lowerCase() {
    return /(?=.*[a-z])/.test(this.orgPassword)
  }

  //check wheather password have uppercase
  get upperCase() {
    return /(?=.*[A-Z])/.test(this.orgPassword)
  }

  //check wheather password have digit
  get digit() {
    return /(?=.*\d)/.test(this.orgPassword)
  }

  //check wheather all fields are statisfied
  get validate() {
    // return null
    return !(this.orgPassword.length <= 7) && this.lowerCase && this.upperCase && this.digit && this.changePswdForm?.get('newPassword')?.value == this.changePswdForm?.get('confirmPassword')?.value ? true : false
  }

}
