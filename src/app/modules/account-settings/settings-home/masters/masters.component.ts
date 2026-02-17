import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-masters',
  templateUrl: './masters.component.html',
  styleUrls: ['./masters.component.css']
})
export class MastersComponent implements OnInit {

  mastersList:any | any[] = [
    {link:'/home/settings/masters/vendors' , name:'Hauliers'},
    // {link:'/home/settings/masters/roles' , name:'Roles'},
    {link:'/home/settings/masters/status' , name:'Status'},
    {link:'/home/settings/masters/vehicleType' , name:'Vehicle type'},
    {link:'/home/settings/masters/trailerType' , name:'Trailer type'},
    // {link:'/home/settings/masters/vehicle' , name:'Vehicle'},
    // {link:'/home/settings/masters/material' , name:'Material'},
    {link:'/home/settings/masters/materialType' , name:'Product type'},
    {link:'/home/settings/masters/category' , name:'Category type'},
    {link:'/home/settings/masters/units' , name:'Units'},
    {link:'/home/settings/masters/genders' , name:'Genders'},
    {link:'/home/settings/masters/temperature' , name:'Temperature'},
    {link:'/home/settings/masters/bin' , name:'Bin'},
    // {link:'/home/settings/masters/trailers' , name:'Trailers'},
  ]

  constructor(public title:Title) {
    title.setTitle("Leo Group Ltd | Masters");
   }

  ngOnInit(): void {
  }

}
