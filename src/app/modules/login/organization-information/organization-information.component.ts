import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { LoginService } from '../login.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-organization-information',
  templateUrl: './organization-information.component.html',
  styleUrls: ['./organization-information.component.css']
})
export class OrganizationInformationComponent implements OnInit {

  organizationInformation !: FormGroup;
  userProfile:any;

  constructor(public fb: FormBuilder, public utliSer: UtilityService, public route: Router, public loginServ:LoginService,public title:Title) { 
    this.title.setTitle("Leo Group Ltd | Organization Information");
  }

  ngOnInit(): void {

    this.organizationInformation = this.fb.group({
      companyName:['', Validators.required],
      displayName:['', Validators.required],
      email:['', Validators.required],
      mobile:['', Validators.required],
      telephone:[''],
   
    })
    this.userProfile = this.loginServ.userProfile;
    //console.log(this.userProfile);
    
    this.setValue(this.userProfile);
  }

  Proceed(){
    if(this.organizationInformation.valid){
      this.utliSer.toaster.next({type: customToaster.successToast, message:'Organization Information is created successfully'})
    setTimeout(() => {
      this.route.navigateByUrl('/login/primaryContactInfo')
    }, 3000);
    }
  }
  setValue(data:any){
    this.organizationInformation.get('companyName')?.setValue(data.companyName);
    this.organizationInformation.get('email')?.setValue(data.email);
    this.organizationInformation.get('mobile')?.setValue(data.mobile);
    this.organizationInformation.get('companyName')?.disable();
    this.organizationInformation.get('email')?.disable();
    this.organizationInformation.get('mobile')?.disable();

  }

  allowNumber(event: any) {
    if (event.keyCode > 47 && event.keyCode < 58) {
      if (this.organizationInformation.value.mobile.length < 10) {
        return true
      }
    }
    return false
  }
  allowWorkNumber(event: any) {
    if (event.keyCode > 47 && event.keyCode < 58) {
      if (this.organizationInformation.value.telephone.length < 10) {
        return true
      }
    }
    return false
  }
}
