import { Component, OnInit } from '@angular/core';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { Title } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { UserAccountVerifyComponent } from './user-account-verify/user-account-verify.component';
import { QRVerificationComponent } from './qrverification/qrverification.component';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
  Enabled: FormControl = new FormControl()

  constructor(public utilServ:UtilityService, public route:Router,public matDailog:MatDialog,public title:Title) { 
    this.title.setTitle("Leo Group Ltd | Security");
  }

  ngOnInit(): void {
  }

  changePassword(){
    var dialog = this.matDailog.open(ChangePasswordComponent,{
      width:'587px',
      height:'100vh',
      disableClose : true,
      autoFocus:false,
      position:{right:'0px'},
      panelClass:'changePswdCls'
     })
     dialog.afterClosed().subscribe(res=>{
      if(res){
        //console.log(res);
        this.utilServ.toaster.next({type: customToaster.successToast, message:'Your password has been changed successfully.'})
      }
     })
  }
  toggle(data:any){
    //console.log(data);
    if(data.checked == true){
      this.userVerifyPopup()
    }
  }
  QRtoggle(data:any){
    //console.log(data);
    if(data.checked == true){
      this. QRverifyPopup();
    }
  }

  userVerifyPopup(){
    var dialog = this.matDailog.open(UserAccountVerifyComponent,{
      width:'521px',
      height:'auto',
      panelClass:'user-popup',
      disableClose: true
    })
  }
  QRverifyPopup(){
    var dialog = this.matDailog.open(QRVerificationComponent,{
      width:'521px',
      height:'auto',
      panelClass:'user-popup',
      disableClose: true
    })
  }
}
