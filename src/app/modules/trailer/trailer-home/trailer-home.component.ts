import { Component, OnInit } from '@angular/core';
import { TrailerService } from '../trailer.service';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-trailer-home',
  templateUrl: './trailer-home.component.html',
  styleUrls: ['./trailer-home.component.css']
})
export class TrailerHomeComponent implements OnInit {
  tailersList:any | any[] = []
  sortList: any[] = [];
  sortCode:any = '';
  searchValue: any;
  statusFilter= ''
  avalStatus = 'All';
  pageNumber = 1
  length = 200; // Total items
  pageSize = 10; // Items per page
  currentPage = 1; // Default first page
  totalPages = Math.ceil(this.length / this.pageSize); // Total pages
  totalTrailer:any;
  logedInUser:any;
  permissions:any;
  constructor(public route:Router,public TrailerServ:TrailerService,public utilSer:UtilityService) { }

  ngOnInit(): void {
     let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
     let childmenu = parsedData.rootMenu[parsedData.rootMenu.length - 2];
    for (var i = 0; i < childmenu.subMenus.length; i++) {
      if (childmenu.subMenus[i].subMenuName.toLowerCase() == 'trailers') {
        this.permissions = childmenu.subMenus[i];
        this.TrailerServ.permissions = this.permissions;
      }
    }
    //console.log(this.permissions);
    // //console.log(this.TrailerServ.TrailersList);
    // this.tailersList = this.TrailerServ.TrailersList;
    // this.getAllTralier();
    this.sortByValue("Newest to Oldest date");
    this.getAllSortValue();
  }
  clear(){
    this.searchValue = '';
    this.sortByValue("Newest to Oldest date");
    // this.getAllTralier();
  }
  onPageChange(event: PageEvent) {
    //console.log(event);
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.TrailerServ.getSearchAndSortedBy('',this.sortCode, this.statusFilter,this.pageNumber,this.pageSize).then((res: any) => {
      //console.log(res);
      this.totalTrailer = res.totalCount;
      this.totalPages = res.totalCount;
      this.tailersList = res.data;
    });
  }
  filteredUsersList(event:any){
    this.searchValue = event.target.value;

    if(event.target.value.length > 1){
    this.TrailerServ.getSearchAndSortedBy(event.target.value,this.sortCode, this.statusFilter,this.pageNumber,this.pageSize).then((res:any) => {
      //console.log(res);
      this.totalTrailer = res.totalCount;
      this.totalPages = res.totalCount;
      this.tailersList = res.data;
     });
    }else {
    this.sortByValue("Newest to Oldest date");
      // this.getAllTralier();
    }
  }
  getAllSortValue(){
    this.utilSer.getSortLits().then((res:any) =>{
      //console.log(res);
      this.sortList = res;
    })
  }

  statusSetoption(status:any){
    this.statusFilter = status;
    this.avalStatus = status ? status : 'All';
    //console.log(this.statusFilter);
    this.sortByValue(this.sortCode)
    
  }
  sortByValue(event:any){
    this.sortCode = event;
   this.TrailerServ.getSearchAndSortedBy("",this.sortCode, this.statusFilter,this.pageNumber,this.pageSize).then((res:any) => {
    //console.log(res);
    this.totalTrailer = res.totalCount;
    this.totalPages = res.totalCount;
    this.tailersList = res.data;
   });
  }
  getAllTralier(){
    this.TrailerServ.getAllTrailer().then((res:any) => {
      //console.log(res);
      this.totalTrailer = res.totalCount;
      this.totalPages = res.totalCount;
      this.tailersList = res.data;
    })
  }
  addTrailers(){
    this.TrailerServ.editTrailerRecord = null
    this.route.navigateByUrl('/home/trailer/addTrailer')
  }
  viewTrailers(index:any,trailerDet:any){
    if(this.permissions?.viewAccess){
    //console.log(index);
    this.TrailerServ.viewTrailer = trailerDet;
    this.TrailerServ.viewTrailerIndex = index;
    this.route.navigateByUrl('/home/trailer/viewTrailer')
  }
  }
}
