import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupplierService } from '../supplier.service';

@Component({
  selector: 'app-supplier-home',
  templateUrl: './supplier-home.component.html',
  styleUrls: ['./supplier-home.component.css']
})
export class SupplierHomeComponent implements OnInit {
  supplierList:any | any[] = []
  sortList: any[] = [{name:'Oldest to Latest',element:'oldest first'}, {name:'Latest to Oldest',element:'newest first'},{name:'z-a',element:'z-a'},{name:'a-z',element:'a-z'}];

  logedInUser:any
  permissions: any;

  constructor(public route:Router,public suppliererv:SupplierService) { }

  ngOnInit(): void {
     let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
    for(var i=0;i<parsedData.rootMenu.length;i++){
if(parsedData.rootMenu[i].rootMenuName.toLowerCase() == 'suppliers'){
  this.permissions = parsedData.rootMenu[i];
  this.suppliererv.permissions = this.permissions
}
}
//console.log(this.permissions);
    //console.log(this.suppliererv.supplierList);
    this.supplierList = this.suppliererv.supplierList
  }

  filteredUsersList(event:any){

  }

  sortByValue(event:any){

  }

  addSupplier(){
    this.route.navigateByUrl('/home/supplier/addEditSupplier')
  }
  viewSupplier(index:any){
    if(this.permissions?.viewAccess){
    //console.log(index);
    this.suppliererv.viewSupplierIndex = index
    this.route.navigateByUrl('/home/supplier/viewSupplier')
  }
  }
}
