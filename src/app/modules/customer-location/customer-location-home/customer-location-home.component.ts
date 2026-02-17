import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerLocationService } from '../customer-location.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-customer-location-home',
  templateUrl: './customer-location-home.component.html',
  styleUrls: ['./customer-location-home.component.css']
})
export class CustomerLocationHomeComponent implements OnInit {

  customerLocationList: any | any[] = []
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
  totalCustomerLocation: any;
  logedInUser: any;
  permissions: any;

  constructor(public route: Router, public customerLocationServ: CustomerLocationService, public ultiSer: UtilityService) { }

  ngOnInit(): void {
    let user: any = localStorage.getItem('loggedInUser')
    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    let childmenu = parsedData.rootMenu[parsedData.rootMenu.length - 1];
    for (var i = 0; i < childmenu.subMenus.length; i++) {
      if (childmenu.subMenus[i].subMenuName.toLowerCase() == 'customerlocations') {
        this.permissions = childmenu.subMenus[i];
        this.customerLocationServ.permissions = this.permissions;
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
      this.customerLocationServ.permissions = this.permissions;
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
      this.customerLocationServ.getSearchAndSortBy(event.target.value, "", this.statusFilter, this.pageNumber, this.pageSize).then((res: any) => {
        this.totalCustomerLocation = res.totalCount;
        this.totalPages = res.totalCount;
        this.customerLocationList = res.data;
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
    this.customerLocationServ.getSearchAndSortBy('', this.sortCode, this.statusFilter, this.pageNumber, this.pageSize).then((res: any) => {
      this.totalCustomerLocation = res.totalCount;
      this.totalPages = res.totalCount;
      this.customerLocationList = res.data;
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
    this.customerLocationServ.getSearchAndSortBy('', this.sortCode, this.statusFilter, this.pageNumber, this.pageSize).then((res: any) => {
      this.totalCustomerLocation = res.totalCount;
      this.totalPages = res.totalCount;
      this.customerLocationList = res.data;
    })
  }

  addCustomerLocation() {
    this.customerLocationServ.editCustomerLocationRecord = null;
    this.customerLocationServ.viewDetail = null;
    this.customerLocationServ.viewCustomerLocationIndex = 0;
    this.route.navigateByUrl('/home/customerLocation/addCustomerLocation')
  }

  viewCustomerLocation(index: any, customerLocationDet: any) {
    if (this.permissions?.viewAccess) {
      this.customerLocationServ.viewDetail = customerLocationDet;
      this.customerLocationServ.viewCustomerLocationIndex = index
      this.route.navigateByUrl('/home/customerLocation/viewCustomerLocation')
    }
  }
}
