import { Component, OnInit } from '@angular/core';
import { AccountSettingsService } from '../../account-settings.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-home',
  templateUrl: './profile-home.component.html',
  styleUrls: ['./profile-home.component.css']
})
export class ProfileHomeComponent implements OnInit {

  imageUrl: any = null
  profileRecord: any | any[] = [];
  userProfile: any;
  constructor(public accServ: AccountSettingsService, public route: Router, public title: Title) {
    this.title.setTitle("Leo Group Ltd | Profile");
  }

  ngOnInit(): void {
    const data = localStorage.getItem("userData");
    this.userProfile = data ? JSON.parse(data) : null;
  
    if (this.userProfile) {
      this.getProfileData();
    } 
  
    this.accServ.userProfileChanges.subscribe((res: any) => {
      //console.log(res);
      this.getProfileData();
    });
  }

  getProfileData() {
    this.accServ.getProfile(this.userProfile.email).then(res => {
      //console.log(res);
      this.profileRecord = res[0];

    })
  }
  editProfile() {
    this.accServ.editProfile = this.profileRecord
    this.route.navigateByUrl("/home/settings/profile/editProfile")
  }

}
