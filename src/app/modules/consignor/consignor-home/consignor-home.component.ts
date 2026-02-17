import { Component, OnInit } from '@angular/core';
import { ConsignorService } from '../consignor.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';

@Component({
  selector: 'app-consignor-home',
  templateUrl: './consignor-home.component.html',
  styleUrls: ['./consignor-home.component.css']
})
export class ConsignorHomeComponent implements OnInit {

  consignorList:any | any[] = []
  sortList: any[] = [];
  sortCode:any = '';
  searchValue:any;
  pageNumber = 1
  length = 200; // Total items
  pageSize = 10; // Items per page
  currentPage = 1; // Default first page
  totalPages = Math.ceil(this.length / this.pageSize); // Total pages
  loggedInUser:any;
  permissions:any;
  

  constructor(public route:Router,public consignorerv:ConsignorService, public utilServ:UtilityService) { }
  
  ngOnInit(): void {
    let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.loggedInUser = parsedData.roleName
    //console.log(parsedData);
     let childmenu = parsedData.rootMenu[parsedData.rootMenu.length - 1];
    for (var i = 0; i < childmenu.subMenus.length; i++) {
      if (childmenu.subMenus[i].subMenuName.toLowerCase() == 'suppliers') {
        this.permissions = childmenu.subMenus[i];
        this.consignorerv.permissions = this.permissions;
      }
    }
    //console.log(this.permissions);
    this.getSortList();
    this.sortByValue("A to Z");
    // this.getConsignorsList();
  }
  clear(){
    this.searchValue = '';
    this.sortByValue("A to Z");
    // this.getConsignorsList();
  }
    onPageChange(event: PageEvent) {
            //console.log(event);
            this.pageNumber = Number(event.pageIndex) + 1
            this.pageSize = event.pageSize
            this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
            this.totalPages = Math.ceil(event.length / event.pageSize);
            this.consignorerv.searchConsignorBySort('',this.sortCode,this.pageNumber,this.pageSize).then((res: any) => {
              //console.log(res);
              this.consignorList = res.data;
            }).catch((err:any)=>{
              //console.log(err);
              if(err){
                this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
              }
            });
          }
  getConsignorsList(){
    this.consignorerv.getAllConsignors().then(res=>{
  //console.log(res);
  this.consignorList = res;
    })
  }
  getSortList() {
    this.consignorerv.getSortLits().then(res=>{
      //console.log(res);
      this.sortList = res
        })
  }
  sortByValue(sortValue:any){
    //console.log(sortValue);
    this.sortCode = sortValue;
    this.consignorerv.searchConsignorBySort('', this.sortCode,this.pageNumber,this.pageSize).then(res=>{
      //console.log(res);
      this.consignorList =  res.data;
    }).catch((err:any)=>{
            //console.log(err);
            if(err){
              this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
            }
    
          })
    }
  filteredUsersList(event:any){
    //console.log(event.target.value);
    this.searchValue = event.target.value;
    if(event.target.value.length > 1){
      this.consignorerv.searchConsignorBySort(event.target.value, this.sortCode,this.pageNumber,this.pageSize).then(res=>{
        //console.log(res);
        this.consignorList = res.data;
      }).catch((err:any)=>{
        //console.log(err);
        if(err){
          this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
        }

      })
    } else {
    this.sortByValue("A to Z");
      // this.getConsignorsList();
    }
  }

  addConsignor(){
    this.consignorerv.editConsignorRecord = null;
    this.route.navigateByUrl('/home/consignor/addConsignor')
  }
  viewConsignor(value:any, index:any){
    if(this.permissions?.viewAccess){
    //console.log(index);
    this.consignorerv.viewConsignorIndex = index;
    this.consignorerv.viewConsignorRecord = value;
    this.route.navigateByUrl('/home/consignor/viewConsignor')
  }
}

}
