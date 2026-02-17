import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerTrailerOutService } from '../customer-trailer-out.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PageEvent } from '@angular/material/paginator';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';

@Component({
  selector: 'app-customer-trailer-out-home',
  templateUrl: './customer-trailer-out-home.component.html',
  styleUrls: ['./customer-trailer-out-home.component.css']
})
export class CustomerTrailerOutHomeComponent implements OnInit {

  customerTrailerOutList: any | any[] = []
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
  totalCustomerTrailerOut: any;
  logedInUser: any
  permissions: any

  constructor(
    public route: Router, 
    public customerTrailerOutServ: CustomerTrailerOutService, 
    public utilSer: UtilityService
  ) { }

  ngOnInit(): void {
    let user: any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    let childmenu = parsedData.rootMenu[parsedData.rootMenu.length - 1];
    for (var i = 0; i < childmenu.subMenus.length; i++) {
      if (childmenu.subMenus[i].subMenuName.toLowerCase() == 'customertrailerouts') {
        this.permissions = childmenu.subMenus[i];
        this.customerTrailerOutServ.permissions = this.permissions;
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
      this.customerTrailerOutServ.permissions = this.permissions;
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
    this.customerTrailerOutServ.getSearchAndSortBy("", this.sortCode, this.statusFilter, this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomerTrailerOut = res.totalCount;
      this.totalPages = res.totalCount;
      this.customerTrailerOutList = res.data;
    }).catch((err: any) => {
      if (err) {
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
      }
    });
  }

  onPageChange(event: any) {
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1;
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.customerTrailerOutServ.getSearchAndSortBy("", this.sortCode, this.statusFilter, this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomerTrailerOut = res.totalCount;
      this.totalPages = res.totalCount;
      this.customerTrailerOutList = res.data;
    }).catch((err: any) => {
      if (err) {
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
      }
    });
  }

  searchCustomerTrailerOut(event: any) {
    this.searchValue = event.target.value;
    if (event.target.value.length > 1) {
      this.customerTrailerOutServ.getSearchAndSortBy(this.searchValue, this.sortCode, this.statusFilter, this.pageSize, this.pageNumber).then((res: any) => {
        this.totalCustomerTrailerOut = res.totalCount;
        this.totalPages = res.totalCount;
        this.customerTrailerOutList = res.data;
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
        }
      });
    } else if (event.target.value == '') {
      this.sortByValue(this.sortCode)
    }
  }

  addCustomerTrailerOut() {
    this.customerTrailerOutServ.editCustomerTrailerOutRecord = null;
    this.route.navigate(['/home/customerTrailerOut/add']);
  }

  viewCustomerTrailerOut(customerTrailerOut: any, i: any) {
    this.customerTrailerOutServ.selectedCustomerTrailerOutRecord = customerTrailerOut;
    this.customerTrailerOutServ.viewCustomerTrailerOutId = customerTrailerOut.cTO_Mapping_ID;
    this.customerTrailerOutServ.viewCustomerTrailerOutIndex = i;
    this.route.navigate(['/home/customerTrailerOut/view']);
  }
}
