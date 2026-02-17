import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-update-new-password',
  templateUrl: './update-new-password.component.html',
  styleUrls: ['./update-new-password.component.css']
})
export class UpdateNewPasswordComponent implements OnInit {

  updatePasswordForm !: FormGroup;
  newPassword = true
  conformPassword = true
  hide1: boolean = true;
  hide2: boolean = true;
  hide3: boolean = true;
  invalid: boolean = true;
  oldPasswordError: any;
  newPasswordError: any;
  confirmPasswordError: any;
  currentPassword: any


  constructor(public fb: FormBuilder, public utliSer: UtilityService, public route: Router,public title:Title) { 
    this.title.setTitle("Leo Group Ltd | Create Password");
  }

  ngOnInit(): void {


    this.updatePasswordForm = this.fb.group({
      newPassword:['', Validators.required],
      conformPassword:['',[Validators.required,this.password.bind(this)]]
    })
  }

  // conformPasswordValidation
  password() {
    const password = this.updatePasswordForm?.get('newPassword')?.value;
    const confirmPassword = this.updatePasswordForm?.get('conformPassword')?.value;
    return password === confirmPassword ? null : { verifyPass: true };
  }
  
  oldPasswordCheck() {
    if (this.currentPassword != this.updatePasswordForm.value.currentPassword) {
      this.oldPasswordError = true;
    }
    else {
      this.oldPasswordError = false;
    }
  }
  newPasswordCheck() {
    if (this.updatePasswordForm.value.currentPassword == this.updatePasswordForm.value.newPassword) {
      this.newPasswordError = true;
    }
    else {
      this.newPasswordError = false;
    }
  }

  Proceed(){
    this.utliSer.toaster.next({type: customToaster.successToast, message:'Password is created successfully'})
    setTimeout(() => {
      this.route.navigateByUrl('/login/organizationInfo')
    }, 3000);
  }
   //get a password value
   get orgPassword() {
    return this.updatePasswordForm.get("newPassword")?.value;
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
    return !(this.orgPassword.length <= 7) && this.lowerCase && this.upperCase && this.digit && this.updatePasswordForm?.get('newPassword')?.value == this.updatePasswordForm?.get('conformPassword')?.value ? true : false
  }

}
