import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerDriverService } from '../customer-driver.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-customer-driver-home',
  templateUrl: './customer-driver-home.component.html',
  styleUrls: ['./customer-driver-home.component.css']
})
export class CustomerDriverHomeComponent implements OnInit {

  customerDriverList: any | any[] = []
  sortList: any[] = [];
  sortCode: any = '';
  searchValue: any;
  statusFilter = ''
  avalStatus = 'All';
  pageNumber = 1
  length = 200;
  pageSize = 10;
  currentPage = 1;
  totalPages = Math.ceil(this.length / this.pageSize);
  totalCustomerDriver: any;
  logedInUser: any;
  permissions: any;

  constructor(public route: Router, public customerDriverServ: CustomerDriverService, public ultiSer: UtilityService) { }

  ngOnInit(): void {
    let user: any = localStorage.getItem('loggedInUser')
    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    let childmenu = parsedData.rootMenu[parsedData.rootMenu.length - 1];
    for (var i = 0; i < childmenu.subMenus.length; i++) {
      if (childmenu.subMenus[i].subMenuName.toLowerCase() == 'customerdrivers') {
        this.permissions = childmenu.subMenus[i];
        this.customerDriverServ.permissions = this.permissions;
      }
    }
    
    // Set default permissions if not found in menu
    if (!this.permissions) {
      this.permissions = {
        createAccess: true,
        editAccess: true,
        deleteAccess: true,
        viewAccess: true
      };
      this.customerDriverServ.permissions = this.permissions;
    }
    
    this.getSortList();
    this.sortByValue("Newest to Oldest date");
  }

  clear() {
    this.searchValue = '';
    this.sortByValue("Newest to Oldest date");
  }

  filteredUsersList(event: any) {
    this.searchValue = event.target.value;
    if (event.target.value.length > 1) {
      this.customerDriverServ.getSearchAndSortBy(event.target.value, "", this.statusFilter, this.pageNumber, this.pageSize).then((res: any) => {
        this.totalCustomerDriver = res.totalCount;
        this.totalPages = res.totalCount;
        this.customerDriverList = res.data;
      })
    } else {
      this.sortByValue("Newest to Oldest date");
    }
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1;
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.customerDriverServ.getSearchAndSortBy('', this.sortCode, this.statusFilter, this.pageNumber, this.pageSize).then((res: any) => {
      this.totalCustomerDriver = res.totalCount;
      this.totalPages = res.totalCount;
      this.customerDriverList = res.data;
    });
  }

  getSortList() {
    this.ultiSer.getSortLits().then((res: any) => {
      this.sortList = res;
    })
  }

  statusSetoption(status: any) {
    this.statusFilter = status;
    this.avalStatus = status ? status : 'All';
    this.sortByValue(this.sortCode)
  }

  sortByValue(event: any) {
    this.sortCode = event;
    this.customerDriverServ.getSearchAndSortBy('', this.sortCode, this.statusFilter, this.pageNumber, this.pageSize).then((res: any) => {
      this.totalCustomerDriver = res.totalCount;
      this.totalPages = res.totalCount;
      this.customerDriverList = res.data;
    })
  }

  addCustomerDriver() {
    this.customerDriverServ.editCustomerDriverRecord = null;
    this.customerDriverServ.viewDetail = null;
    this.customerDriverServ.viewCustomerDriverIndex = 0;
    this.route.navigateByUrl('/home/customerDriver/addCustomerDriver')
  }

  viewCustomerDriver(index: any, customerDriverDet: any) {
    if (this.permissions?.viewAccess) {
      this.customerDriverServ.viewDetail = customerDriverDet;
      this.customerDriverServ.viewCustomerDriverIndex = index
      this.route.navigateByUrl('/home/customerDriver/viewCustomerDriver')
    }
  }
}
