import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-authorized',
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.css']
})
export class NotAuthorizedComponent implements OnInit {

  constructor(public location:Location, public route:Router) { }

  ngOnInit(): void {
    
  }

  back(){
    this.route.navigateByUrl('/home/dashboard');
  }

}
