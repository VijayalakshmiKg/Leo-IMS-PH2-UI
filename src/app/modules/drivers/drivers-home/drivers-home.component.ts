import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DriversService } from '../drivers.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PageEvent } from '@angular/material/paginator';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';

@Component({
  selector: 'app-drivers-home',
  templateUrl: './drivers-home.component.html',
  styleUrls: ['./drivers-home.component.css']
})
export class DriversHomeComponent implements OnInit {

  driversList: any | any[] = []
  sortList: any[] = [];
  sortCode: any = '';
  searchValue: any;
  sortedBy: string = 'All';
  statusFilter = ''
  avalStatus = 'All';
  pageNumber = 1
  length = 200; // Total items
  pageSize = 10; // Items per page
  currentPage = 1; // Default first page
  totalPages = Math.ceil(this.length / this.pageSize); // Total pages
  totalDriver: any;
  logedInUser: any
  permissions: any

  constructor(public route: Router, public driverServ: DriversService, public utilSer: UtilityService) {

  }

  ngOnInit(): void {
    let user: any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
     console.log(parsedData);
       debugger;
    let childmenu = parsedData.rootMenu[parsedData.rootMenu.length - 2];
    for (var i = 0; i < childmenu.subMenus.length; i++) {
      if (childmenu.subMenus[i].subMenuName.toLowerCase() == 'drivers') {
          debugger;
        this.permissions = childmenu.subMenus[i];
        this.driverServ.permissions = this.permissions;
      }
    }
    //console.log(this.permissions);

    // //console.log(this.driverServ.driversList);
    // this.driversList = this.driverServ.driversList;
    this.getSortList();
    this.sortByValue("A to Z");
    // this.getAllDriverList();

  }
  //  getCountryCode(){}
  getSortList() {
    this.utilSer.getSortLits().then((res: any) => {
      //console.log(res);
      this.sortList = res;
    })
  }
  clear() {
    this.searchValue = '';
    this.sortByValue("A to Z");
    // this.getAllDriverList();
  }

  statusSetoption(status: any) {
    this.statusFilter = status;
    this.avalStatus = status ? status : 'All';
    //console.log(this.statusFilter);
    this.sortByValue(this.sortCode)

  }
  sortByValue(event: any) {
    this.sortCode = event;
    this.driverServ.searchAndSortbyDriver("", this.sortCode, this.statusFilter, this.pageNumber, this.pageSize).then((res: any) => {
      //console.log(res);
      this.totalDriver = res.totalCount;
      this.totalPages = res.totalCount;
      this.driversList = res.data;
    }).catch((err: any) => {
      //console.log(err);
      if (err) {
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
      }
    });;
  }
  onPageChange(event: PageEvent) {
    //console.log(event);
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.driverServ.searchAndSortbyDriver("", this.sortCode, this.statusFilter, this.pageNumber, this.pageSize).then((res: any) => {
      //console.log(res);
      this.totalDriver = res.totalCount;
      this.totalPages = res.totalCount;
      this.driversList = res.data;
    }).catch((err: any) => {
      //console.log(err);
      if (err) {
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
      }
    });;
  }
  searchDriver(event: any) {
    //console.log(event.target.value);
    this.searchValue = event.target.value;
    if (event.target.value.length > 1) {
      this.driverServ.searchAndSortbyDriver(event.target.value, this.sortCode, this.statusFilter, this.pageNumber, this.pageSize).then((res: any) => {
        //console.log(res);
        this.totalDriver = res.totalCount;
        this.totalPages = res.totalCount;
        this.driversList = res.data;
      }).catch((err: any) => {
        //console.log(err);
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
        }
      });;
    } else {
      this.sortByValue("A to Z");
      // this.getAllDriverList();
    }
  }
  addDrivers() {
    // this.driverServ.viewDriverId = null;
    this.driverServ.viewDriverIndex = 0;
    this.driverServ.editDriverRecord = null
    this.route.navigateByUrl('/home/drivers/addDrivers')
  }
  getAllDriverList() {
    this.driverServ.getAllDriverList().then((res: any) => {
      //console.log(res);
      this.totalDriver = res.totalCount;
      this.totalPages = res.totalCount;
      this.driversList = res.data;;
    })
  }
  viewDrivers(driver: any, index: any) {
    if(this.permissions?.viewAccess){
    //console.log(driver);
    this.driverServ.viewDriverId = driver;
    this.driverServ.viewDriverIndex = index;
    this.route.navigateByUrl('/home/drivers/viewDrivers')
  }
  }
}
