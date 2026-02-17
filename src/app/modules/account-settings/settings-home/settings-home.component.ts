import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-home',
  templateUrl: './settings-home.component.html',
  styleUrls: ['./settings-home.component.css']
})
export class SettingsHomeComponent implements OnInit {


  headersList:any | any[] = [
    // {link:'/home/settings/profile' , name:'Profile'},
    // {link:'/home/settings/security' , name:'Security'},
    {
      "settingId": 106,
      "settingName": "Profile",
      "isVisible": true,
      "pageUrl": "/home/settings/profile",
      "roleId": 1
  },
  {
    "settingId": 107,
    "settingName": "Security",
    "isVisible": true,
    "pageUrl": "/home/settings/security",
    "roleId": 1
}
    // {link:'/home/settings/masters' , name:'Master'},
    // {link:'/home/settings/roles' , name:'Roles'},
  ]

  constructor(public title:Title,public location : Location, public route:Router) {  
    this.title.setTitle("Leo Group Ltd | Settings");}

  ngOnInit(): void {
    let menus:any = localStorage.getItem('loggedInUser')
    //console.log(menus);
   let parsedMenu = JSON.parse(menus)
   //console.log(parsedMenu.settings);
   parsedMenu.settings.map((res :any) => {
    //console.log(res);
   this.headersList.push(res)
    
   })
    
  }

  back(){
    // this.location.back()
    this.route.navigateByUrl('/home/dashboard')
  }
  

}
