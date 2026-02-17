import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
// import { UtilService } from 'src/app/core/util.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-create-new-password',
  templateUrl: './create-new-password.component.html',
  styleUrls: ['./create-new-password.component.css']
})
export class CreateNewPasswordComponent implements OnInit {

  createPasswordForm !: FormGroup;
  newPassword = true
  conformPassword = true;
  verifyEmail: any;
  userData:any;


  constructor(public fb: FormBuilder, public utliSer: UtilityService, public route: Router, public title: Title, public loginSer: LoginService) {
    this.title.setTitle("Leo Group Ltd | Login");
  }

  ngOnInit(): void {

    let Data: any = localStorage.getItem("userData");
    this.userData = JSON.parse(Data);
    //console.log(this.userData);
    this.verifyEmail = this.loginSer.verifyMail

    this.createPasswordForm = this.fb.group({
      newPassword: ['', Validators.required],
      conformPassword: ['', [Validators.required, this.password.bind(this)]]
    })
  }

  // conformPasswordValidation
  password() {
    const password = this.createPasswordForm?.get('newPassword')?.value;
    const confirmPassword = this.createPasswordForm?.get('conformPassword')?.value;
    return password === confirmPassword ? null : { verifyPass: true };
  }


  Proceed() {
    this.loginSer.createPassword(encodeURIComponent(this.verifyEmail), encodeURIComponent(this.createPasswordForm.value.newPassword)).then(res => {
      //console.log(res)
      if (res) {
        this.utliSer.toaster.next({ type: customToaster.successToast, message: 'You password is changed successfully' });
        this.route.navigateByUrl('/login')
        // this.loginSer.empolyeePassword( encodeURIComponent(this.createPasswordForm.value.newPassword))

      }
    })
  }
  //get a password value
  get orgPassword() {
    return this.createPasswordForm.get("newPassword")?.value;
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
    return !(this.orgPassword.length <= 7) && this.lowerCase && this.upperCase && this.digit && this.createPasswordForm?.get('newPassword')?.value == this.createPasswordForm?.get('conformPassword')?.value ? true : false
  }

  // -----------------------------------------------------------------------

}
