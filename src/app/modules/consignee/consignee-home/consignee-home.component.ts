import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConsigneeService } from '../consignee.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-consignee-home',
  templateUrl: './consignee-home.component.html',
  styleUrls: ['./consignee-home.component.css']
})
export class ConsigneeHomeComponent implements OnInit {
  
  consigneeList:any | any[] = []
  sortList: any[] = [];
  sortCode:any = '';
  searchValue:any;
  pageNumber = 1
  length = 200; // Total items
  pageSize = 10; // Items per page
  currentPage = 1; // Default first page
  totalPages = Math.ceil(this.length / this.pageSize); // Total pages
  logedInUser:any
  permissions:any;

  constructor(public route:Router,public consigneeServ:ConsigneeService) { }

  ngOnInit(): void {
     let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
     let childmenu = parsedData.rootMenu[parsedData.rootMenu.length - 1];
    for (var i = 0; i < childmenu.subMenus.length; i++) {
      if (childmenu.subMenus[i].subMenuName.toLowerCase() == 'consignees') {
        this.permissions = childmenu.subMenus[i];
        this.consigneeServ.permissions = this.permissions;
      }
    }
    //console.log(this.permissions);
    this.getSortList();
    this.sortByValue("A to Z");
    // this.getConsigneesList();
    
  }
  clear(){
    this.searchValue = '';
    this.sortByValue("A to Z");
    // this.getConsigneesList();
  }
  getConsigneesList(){
    this.consigneeServ.getAllConsignees().then(res=>{
  //console.log(res);
  this.consigneeList = res;
    })
  }
  onPageChange(event: PageEvent) {
    //console.log(event);
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.consigneeServ.searchConsigneeBySort('',this.sortCode, this.pageNumber,this.pageSize).then((res: any) => {
      //console.log(res);
      this.consigneeList = res.data;
    });
  }
  getSortList() {
    this.consigneeServ.getSortLits().then(res=>{
      //console.log(res);
      this.sortList = res
        })
  }
  sortByValue(sortValue:any){
    //console.log(sortValue);
    this.sortCode = sortValue;
    this.consigneeServ.searchConsigneeBySort('', this.sortCode,this.pageNumber,this.pageSize).then(res=>{
      //console.log(res);
      this.consigneeList = res.data;
    })
    }
  filteredUsersList(event:any){
    //console.log(event.target.value);
    this.searchValue = event.target.value;

    if(event.target.value.length > 1){
      this.consigneeServ.searchConsigneeBySort(event.target.value, this.sortCode,this.pageNumber,this.pageSize).then(res=>{
        //console.log(res);
        this.consigneeList = res.data;
      })
    }else {
    this.sortByValue("A to Z");
      // this.getConsigneesList();
    }
  }

  addConsignee(){
    this.consigneeServ.editConsigneeRecord = null;
    this.route.navigateByUrl('/home/consignee/addConsignee')
  }
  viewConsignee(value:any, index:any){
    if(this.permissions?.viewAccess){
    //console.log(index);
    this.consigneeServ.viewConsigneeIndex = index;
    this.consigneeServ.viewConsigneeRecord = value;
    this.route.navigateByUrl('/home/consignee/viewConsignee')
  }
  }
}
