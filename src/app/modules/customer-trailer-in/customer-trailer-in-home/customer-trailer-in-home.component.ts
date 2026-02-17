import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerTrailerInService } from '../customer-trailer-in.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PageEvent } from '@angular/material/paginator';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';

@Component({
  selector: 'app-customer-trailer-in-home',
  templateUrl: './customer-trailer-in-home.component.html',
  styleUrls: ['./customer-trailer-in-home.component.css']
})
export class CustomerTrailerInHomeComponent implements OnInit {

  customerTrailerInList: any | any[] = []
  sortList: any[] = [];
  sortCode: any = '';
  searchValue: any;
  sortedBy: string = 'All';
  statusFilter = ''
  avalStatus = 'All';
  pageNumber = 1
  length = 200;
  pageSize = 10;
  currentPage = 1;
  totalPages = Math.ceil(this.length / this.pageSize);
  totalCustomerTrailerIn: any;
  logedInUser: any
  permissions: any

  constructor(public route: Router, public customerTrailerInServ: CustomerTrailerInService, public utilSer: UtilityService) {

  }

  ngOnInit(): void {
    let user: any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    let childmenu = parsedData.rootMenu[parsedData.rootMenu.length - 1];
    for (var i = 0; i < childmenu.subMenus.length; i++) {
      if (childmenu.subMenus[i].subMenuName.toLowerCase() == 'customertrailerins') {
        this.permissions = childmenu.subMenus[i];
        this.customerTrailerInServ.permissions = this.permissions;
      }
    }

    // Set default permissions if not found
    if (!this.permissions) {
      this.permissions = {
        createAccess: true,
        editAccess: true,
        deleteAccess: true,
        viewAccess: true
      };
      this.customerTrailerInServ.permissions = this.permissions;
    }

    this.getSortList();
    this.sortByValue("A to Z");
  }

  getSortList() {
    this.utilSer.getSortLits().then((res: any) => {
      this.sortList = res;
    })
  }

  clear() {
    this.searchValue = '';
    this.sortByValue("A to Z");
  }

  statusSetoption(status: any) {
    this.statusFilter = status;
    this.avalStatus = status ? status : 'All';
    this.sortByValue(this.sortCode)
  }

  sortByValue(event: any) {
    this.sortCode = event;
    this.customerTrailerInServ.getSearchAndSortBy("", this.sortCode, this.statusFilter, this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomerTrailerIn = res.totalCount;
      this.totalPages = res.totalCount;
      this.customerTrailerInList = res.data;
    }).catch((err: any) => {
      if (err) {
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1;
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.customerTrailerInServ.getSearchAndSortBy("", this.sortCode, this.statusFilter, this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomerTrailerIn = res.totalCount;
      this.totalPages = res.totalCount;
      this.customerTrailerInList = res.data;
    }).catch((err: any) => {
      if (err) {
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
      }
    });
  }

  searchCustomerTrailerIn(event: any) {
    this.searchValue = event.target.value;
    if (event.target.value.length > 1) {
      this.customerTrailerInServ.getSearchAndSortBy(this.searchValue, this.sortCode, this.statusFilter, this.pageSize, this.pageNumber).then((res: any) => {
        this.totalCustomerTrailerIn = res.totalCount;
        this.totalPages = res.totalCount;
        this.customerTrailerInList = res.data;
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
        }
      });
    } else if (event.target.value == '') {
      this.sortByValue(this.sortCode)
    }
  }

  addCustomerTrailerIn() {
    this.customerTrailerInServ.editCustomerTrailerInRecord = null;
    this.route.navigate(['/home/customerTrailerIn/add']);
  }

  viewCustomerTrailerIn(customerTrailerIn: any, i: any) {
    this.customerTrailerInServ.selectedCustomerTrailerInRecord = customerTrailerIn;
    this.customerTrailerInServ.viewCustomerTrailerInId = customerTrailerIn.cTI_Mapping_ID;
    this.customerTrailerInServ.viewCustomerTrailerInIndex = i;
    this.route.navigate(['/home/customerTrailerIn/view']);
  }

}
