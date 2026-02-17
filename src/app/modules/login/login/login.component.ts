import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/guards/auth.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MFAPopUpComponent } from './mfapop-up/mfapop-up.component';
import { AccountSettingsService } from '../../account-settings/account-settings.service';
import { userModel } from '../loginModel/userLoginmodel';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm !: FormGroup
  hide: boolean = true;
  userModel: userModel = new userModel();
  token: any;
  loginData: any;
  loading:boolean = false;

  constructor(private fb: FormBuilder, public route: Router, public utilServ: UtilityService, public title: Title, public authServ: AuthService, public dialog: MatDialog, public accServ: AccountSettingsService, public loginSer: LoginService) {
    // this.title.setTitle("Leo Group Ltd | Login");
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}$')]]
      // password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[0-50])(?=.*[!@#$%^&*_=+-]).{4,50}$')]]

    });
    
  }



  submit() {
    //console.log(this.loginForm.value);
    // //console.log(this.authServ.userDetails.UserName, this.authServ.userDetails.Password);

    if (this.loginForm.valid) {
      //console.log('valid');
      this.loading = true;
      this.userModel.Username = this.loginForm.value.username;
      this.userModel.Password = this.loginForm.value.password;
      //console.log(this.userModel);

      // this.loginSer.tenantLogin(this.userModel).then(res =>{
      //   //console.log(res);
      //   if(res.statusMessage === "Successful"){
      this.loginSer.userAuth(this.userModel).then(resp => {
        //console.log(resp);
        if (resp.statusMessage === "Successful") {
          //console.log(this.loginForm.value.username);
          //console.log(resp.result.email);
          localStorage.setItem('token', resp.result.token)
          localStorage.setItem('userDetails', JSON.stringify(resp.result));
          this.loginSer.userLogin(resp.result.email).then(res => {
            console.log('🔍 UserLogin API Response:', res);
            console.log('🔍 First user data:', res[0]);
            this.loginData = res
            
             
            localStorage.setItem('userData', JSON.stringify(res[0]));
            if (res.length > 0) {
              this.loading = false;
              this.getRolemenuData();
              // Find the matching role object
              this.loginSer.getRoleaccess(this.loginData[0]?.roleId).then(res=>{
                 console.log('🔍 Role Access API Response:', res);
                   this.authServ.loginStatus = true
                
                // Extract employeeId from loginData (user data from API)
                const employeeId = this.loginData[0]?.employeeId || 
                                   this.loginData[0]?.EmployeeId || 
                                   this.loginData[0]?.empId || 
                                   this.loginData[0]?.EmpId ||
                                   this.loginData[0]?.id || 
                                   this.loginData[0]?.Id ||
                                   this.loginData[0]?.employeeID ||
                                   this.loginData[0]?.EmployeeID;
                
                console.log('📋 Extracted Employee ID:', employeeId);
                
                // Add employeeId to the user object before storing
                const userDataWithEmployeeId = {
                  ...res,
                  employeeId: employeeId
                };
                
                console.log('💾 Storing user data with employeeId:', userDataWithEmployeeId);
                localStorage.setItem('loggedInUser', JSON.stringify(userDataWithEmployeeId));
                this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Login successful' });
                
                // Role-based routing logic
                let redirectUrl: string;
                if (res?.roleName === 'Planner' || res?.roleName === 'Planner Admin') {
                  // Redirect planner to planner dashboard
                  redirectUrl = '/home/dashboard';
                  console.log('Planner role detected, redirecting to dashboard');
                } else {
                  // Default behavior for other roles
                  redirectUrl = res?.rootMenu[0]?.pageUrl || res?.rootMenu[0]?.subMenus[0]?.pageUrl;
                }
                
                console.log('Redirecting to:', redirectUrl);
                this.route.navigateByUrl(redirectUrl);
              })
              //Viji
                

              // const matchedRole = this.authServ.rolesList.find((role: any) => {
              //   //console.log(role);
              //   const isMatch = role.roleName === res[0].roleType;
              //   //console.log(isMatch);
              //   return isMatch; // Ensure you return the result of the condition
              // });

              // if (matchedRole) {
              //   //console.log(matchedRole);
              //   //console.log(matchedRole.rootMenu[0].pageurl || matchedRole.rootMenu[0].subMenus[0].pageurl);
                
              //   // Store the matched role in localStorage
              //   this.authServ.loginStatus = true
              //   localStorage.setItem('loggedInUser', JSON.stringify(matchedRole));
              //   this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Login successful' });
              //   let firstPage: any = matchedRole.rootMenu[0].pageurl || matchedRole.rootMenu[0].subMenus[0].pageurl
              //   // //console.log(matchedRole.rootMenu[0].subMenus[0].pageurl);
              //   //console.log(firstPage);

              //   this.route.navigateByUrl(firstPage);


              // }
            }
          })
        } else {
          this.loading = false;
          this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Email or password is incorrect!' });
        }
      }).catch((err:any)=>{
        //console.log(err);
        if(err){
          this.loading = false;
          this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
        }

      })

      // }

      // })
      // if (this.loginForm.value.username == this.authServ.userDetails.UserName && this.loginForm.value.password == this.authServ.userDetails.Password) {
      // this.route.navigateByUrl("/login/updatePassword")  // For the !st time loggin in
      // this.openMFAmethod()
    } else {
      this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Please enter the username & password!' });
    }


  }

  getRolemenuData() {
    //console.log(this.loginData);
    this.loginSer.getRolemenu(this.loginData[0]?.roleId).then(res => {
      //console.log(res);

    })
  }

  openMFAmethod() {
    var dialogRef = this.dialog.open(MFAPopUpComponent, {
      width: '521px',
      height: 'auto',
      panelClass: 'MFApop-up',
      data: this.authServ.userDetails,
      disableClose: true
    })
    dialogRef.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        this.route.navigateByUrl("/home/dashboard")
      }
    })

  }

  forgotPassword() {
    this.route.navigateByUrl("/login/forgotPassword")
  }

}
