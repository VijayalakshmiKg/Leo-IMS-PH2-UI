import { Component, OnInit } from '@angular/core';
import { TrailerWasherService } from '../trailer-washer.service';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-trailer-washer-home',
  templateUrl: './trailer-washer-home.component.html',
  styleUrls: ['./trailer-washer-home.component.css']
})
export class TrailerWasherHomeComponent implements OnInit {

 trailerWasherList: any | any[] = []
   sortList: any[] = [];
   sortCode: any = 'A to Z';
   searchValue:any;
   logedInUser:any;
   pageNumber = 1
  length = 200; // Total items
  pageSize = 10; // Items per page
  currentPage = 1; // Default first page
  totalPages = Math.ceil(this.length / this.pageSize); // Total pages;
  permissions:any;
   constructor(public route: Router, public trailerWashererv: TrailerWasherService, public utilSer: UtilityService) { }
 
   ngOnInit(): void {
     let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
    let childmenu = parsedData.rootMenu[parsedData.rootMenu.length - 1];
    for (var i = 0; i < childmenu.subMenus.length; i++) {
      if (childmenu.subMenus[i].subMenuName.toLowerCase() == 'trailer washers') {
        this.permissions = childmenu.subMenus[i];
        this.trailerWashererv.permissions = this.permissions;
      }
    }
    //console.log(this.permissions);
     this.getSortList();
     this.getAllWasherList();
   }
   getSortList() {
     this.utilSer.getSortLits().then((res: any) => {
       //console.log(res);
       this.sortList = res;
     })
   }
   clear(){
     this.searchValue = '';
     this.getAllWasherList();
   }
   onPageChange(event: PageEvent) {
    //console.log(event);
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.trailerWashererv.searchAndSortbyWasher('',this.sortCode,this.pageNumber,this.pageSize).then((res: any) => {
      //console.log(res);
      this.trailerWasherList = res.data;
    });
  }
   filteredUsersList(event: any) {
     //console.log(event.target.value);
     this.searchValue = event.target.value;
     if (event.target.value.length > 1) {
       this.trailerWashererv.searchAndSortbyWasher(event.target.value, this.sortCode,this.pageNumber,this.pageSize).then((res: any) => {
         //console.log(res);
         this.trailerWasherList = res.data;
       });
     } else {
       this.getAllWasherList();
     }
   }
   getAllWasherList() {
     this.trailerWashererv.searchAndSortbyWasher('',this.sortCode,this.pageNumber,this.pageSize ).then((res: any) => {
       //console.log(res);
       this.trailerWasherList = res.data;
     })
   }
   sortByValue(event: any) {
     this.sortCode = event;
     this.trailerWashererv.searchAndSortbyWasher("", this.sortCode,this.pageNumber,this.pageSize).then((res: any) => {
       //console.log(res);
       this.trailerWasherList = res.data;
     });
   }
 
   addWashers() {
     this.trailerWashererv.viewTrailerWasherIndex = 0;
     this.trailerWashererv.editTrailerWasherRecord = null
     this.route.navigateByUrl('/home/trailerWashers/addTrailerWashers')
   }
   viewWashers(value:any, index: any) {
    if(this.permissions?.viewAccess){
     //console.log(index);
     this.trailerWashererv.viewTrailerWasherIndex = index
     this.trailerWashererv.viewWasherId = value
     this.route.navigateByUrl('/home/trailerWashers/viewTrailerWashers')
   }
  }
}
