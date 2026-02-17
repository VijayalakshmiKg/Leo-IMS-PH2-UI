import { Component, OnInit } from '@angular/core';
import { ShunterDriverService } from '../shunter-driver.service';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-shunter-driver-home',
  templateUrl: './shunter-driver-home.component.html',
  styleUrls: ['./shunter-driver-home.component.css']
})
export class ShunterDriverHomeComponent implements OnInit {

  shuntDriversList: any | any[] = []
  sortList: any[] = [];
  sortCode: any = 'A to Z';
  searchValue: any;
  statusFilter = ''
  avalStatus = 'All';
  pageNumber = 1
  length = 200; // Total items
  pageSize = 10; // Items per page
  currentPage = 1; // Default first page
  totalPages = Math.ceil(this.length / this.pageSize); // Total pages
  logedInUser:any;
  permissions:any;
  constructor(public route: Router, public shuntDriverServ: ShunterDriverService, public utilSer: UtilityService) { }

  ngOnInit(): void {

    // this.shuntDriverServ.subject.subscribe((val: any) => {
    //   if (val) {
    //     this.getSortList();
    //     this.getAllDriverList();
    //   }
    // })

     let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
     let childmenu = parsedData.rootMenu[parsedData.rootMenu.length - 1];
    for (var i = 0; i < childmenu.subMenus.length; i++) {
      if (childmenu.subMenus[i].subMenuName.toLowerCase() == 'shunter drivers') {
        this.permissions = childmenu.subMenus[i];
        this.shuntDriverServ.permissions = this.permissions;
      }
    }
    //console.log(this.permissions);
    this.getSortList();
    this.getAllDriverList();
  }
  getSortList() {
    this.utilSer.getSortLits().then((res: any) => {
      //console.log(res);
      this.sortList = res;
    })
  }
  clear() {
    this.searchValue = '';
    this.getAllDriverList();
  }
   onPageChange(event: PageEvent) {
      //console.log(event);
      this.pageNumber = Number(event.pageIndex) + 1
      this.pageSize = event.pageSize
      this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
      this.totalPages = Math.ceil(event.length / event.pageSize);
      this.shuntDriverServ.searchAndSortbyDriver('',this.sortCode, this.statusFilter,this.pageNumber,this.pageSize).then((res: any) => {
        //console.log(res);
        this.shuntDriversList = res.data;
      });
    }
  filteredUsersList(event: any) {
    //console.log(event.target.value);
    this.searchValue = event.target.value;
    if (event.target.value.length > 1) {
      this.shuntDriverServ.searchAndSortbyDriver(event.target.value, this.sortCode, this.statusFilter,this.pageNumber,this.pageSize).then((res: any) => {
        //console.log(res);
        this.shuntDriversList = res.data;
      });
    } else {
      this.getAllDriverList();
    }
  }
  getAllDriverList() {
    this.shuntDriverServ.searchAndSortbyDriver('', 'A to Z', '',this.pageNumber,this.pageSize).then((res: any) => {
      //console.log(res);
      this.shuntDriversList = res.data;
    })
  }
  statusSetoption(status: any) {
    this.statusFilter = status;
    this.avalStatus = status ? status : 'All';
    //console.log(this.statusFilter);
    this.sortByValue(this.sortCode)

  }
  sortByValue(event: any) {
    this.sortCode = event;
    this.shuntDriverServ.searchAndSortbyDriver("", this.sortCode, this.statusFilter,this.pageNumber,this.pageSize).then((res: any) => {
      //console.log(res);
      this.shuntDriversList =res.data;
    });
  }



  addDrivers() {
    this.shuntDriverServ.viewShuntDriverIndex = 0;
    this.shuntDriverServ.editShunDriverRecord = null
    this.route.navigateByUrl('/home/shunterDrivers/addShunterDrivers')
  }
  viewDrivers(value:any, index: any) {
    if(this.permissions?.viewAccess){
    //console.log(index);
    this.shuntDriverServ.viewShuntDriverIndex = index;
    this.shuntDriverServ.viewDriverId = value;

    this.route.navigateByUrl('/home/shunterDrivers/viewShunterDrivers')
  }
  }
}
