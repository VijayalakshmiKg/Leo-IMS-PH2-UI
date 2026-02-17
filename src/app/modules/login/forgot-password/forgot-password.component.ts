import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { Title } from '@angular/platform-browser';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPassword!: FormGroup

  constructor(public fb: FormBuilder, public route: Router, public loginSer: LoginService,public title:Title, public utilServ: UtilityService) { 
    this.title.setTitle("Leo Group Ltd | Forgot Password");
  }

  ngOnInit(): void {
    this.forgotPassword = this.fb.group({
      email: ['', [Validators.required,Validators.email]]
    })
  }


  recoverPassword(){
   if(this.forgotPassword.valid){
    //console.log(this.forgotPassword.value.email);
    this.loginSer.getMail(this.forgotPassword.value.email).then(res=>{
      //console.log(res);
      if(res.statusMessage == "Email sent successfully."){
        //console.log('check', this.forgotPassword.value.email);
        // this.loginSer.userLogin(this.forgotPassword.value.email).then(res => {
        //   //console.log(res);
        
         if(res){
          // this.loginSer.empolyeePassword(res[0].employeeId,this.forgotPassword.value.email).then((res:any) => {
          //   //console.log(res,"emp");
            this.loginSer.verifyMail = this.forgotPassword.value.email;
            this.route.navigateByUrl('/login/sentVerifymail');
          // });
         }
        // })
      }
      else{
        this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Your email could not be found.' });
        
      }
    })
   }
  }
}
