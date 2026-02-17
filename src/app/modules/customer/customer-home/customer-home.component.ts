import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../customer.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PageEvent } from '@angular/material/paginator';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';

@Component({
  selector: 'app-customer-home',
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.css']
})
export class CustomerHomeComponent implements OnInit {

  customersList: any | any[] = []
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
  totalCustomer: any;
  logedInUser: any
  permissions: any

  constructor(public route: Router, public customerServ: CustomerService, public utilSer: UtilityService) {

  }

  ngOnInit(): void {
    let user: any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    let childmenu = parsedData.rootMenu[parsedData.rootMenu.length - 2];
    for (var i = 0; i < childmenu.subMenus.length; i++) {
      if (childmenu.subMenus[i].subMenuName.toLowerCase() == 'customers') {
      
        this.permissions = childmenu.subMenus[i];
        this.customerServ.permissions = this.permissions;
      }
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
    this.customerServ.getSearchAndSortBy("", this.sortCode, this.statusFilter, this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomer = res.totalCount;
      this.totalPages = res.totalCount;
      this.customersList = res.data;
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
    this.customerServ.getSearchAndSortBy("", this.sortCode, this.statusFilter, this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomer = res.totalCount;
      this.totalPages = res.totalCount;
      this.customersList = res.data;
    }).catch((err: any) => {
      if (err) {
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
      }
    });
  }

  searchCustomer(event: any) {
    this.searchValue = event.target.value;
    if (event.target.value.length > 1) {
      this.customerServ.getSearchAndSortBy(event.target.value, this.sortCode, this.statusFilter, this.pageSize, this.pageNumber).then((res: any) => {
        this.totalCustomer = res.totalCount;
        this.totalPages = res.totalCount;
        this.customersList = res.data;
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
        }
      });
    } else {
      this.sortByValue("A to Z");
    }
  }

  addCustomer() {
    this.customerServ.viewCustomerIndex = 0;
    this.customerServ.editCustomerRecord = null
    this.route.navigateByUrl('/home/customer/addCustomer')
  }

  getAllCustomerList() {
    this.customerServ.getAllCustomers().then((res: any) => {
      this.totalCustomer = res.totalCount;
      this.totalPages = res.totalCount;
      this.customersList = res.data;
    })
  }

  viewCustomer(customer: any, index: any) {
    if (this.permissions?.viewAccess) {
      this.customerServ.viewCustomerId = customer;
      this.customerServ.viewCustomerIndex = index;
      this.route.navigateByUrl('/home/customer/viewCustomer')
    }
  }
}
