import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerProductTypeService } from '../customer-product-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PageEvent } from '@angular/material/paginator';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';

@Component({
  selector: 'app-customer-product-type-home',
  templateUrl: './customer-product-type-home.component.html',
  styleUrls: ['./customer-product-type-home.component.css']
})
export class CustomerProductTypeHomeComponent implements OnInit {

  customerProductTypeList: any | any[] = []
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
  totalCustomerProductType: any;
  logedInUser: any
  permissions: any

  constructor(public route: Router, public customerProductTypeServ: CustomerProductTypeService, public utilSer: UtilityService) {

  }

  ngOnInit(): void {
    let user: any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    let childmenu = parsedData.rootMenu[parsedData.rootMenu.length - 1];
    for (var i = 0; i < childmenu.subMenus.length; i++) {
      if (childmenu.subMenus[i].subMenuName.toLowerCase() == 'customerproducttypes') {
        this.permissions = childmenu.subMenus[i];
        this.customerProductTypeServ.permissions = this.permissions;
      }
    }

    // Add default permissions if not set
    if (!this.permissions) {
      this.permissions = { createAccess: true, editAccess: true, deleteAccess: true };
      this.customerProductTypeServ.permissions = this.permissions;
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
    this.customerProductTypeServ.getSearchAndSortBy("", this.sortCode, this.statusFilter, this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomerProductType = res.totalCount;
      this.totalPages = res.totalCount;
      this.customerProductTypeList = res.data;
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
    this.customerProductTypeServ.getSearchAndSortBy("", this.sortCode, this.statusFilter, this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomerProductType = res.totalCount;
      this.totalPages = res.totalCount;
      this.customerProductTypeList = res.data;
    }).catch((err: any) => {
      if (err) {
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
      }
    });
  }

  searchCustomerProductType(event: any) {
    this.searchValue = event.target.value;
    if (event.target.value.length > 1) {
      this.customerProductTypeServ.getSearchAndSortBy(event.target.value, this.sortCode, this.statusFilter, this.pageSize, this.pageNumber).then((res: any) => {
        this.totalCustomerProductType = res.totalCount;
        this.totalPages = res.totalCount;
        this.customerProductTypeList = res.data;
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
        }
      });
    }
    if (event.target.value == '') {
      this.sortByValue(this.sortCode);
    }
  }

  addCustomerProductType() {
    this.customerProductTypeServ.editCustomerProductTypeRecord = null;
    this.route.navigate(['/home/customerProductType/add'])
  }

  viewCustomerProductType(customerProductType: any, i: any) {
    this.customerProductTypeServ.selectedCustomerProductTypeRecord = customerProductType;
    this.customerProductTypeServ.viewCustomerProductTypeId = customerProductType.cpT_Mapping_ID;
    this.customerProductTypeServ.viewCustomerProductTypeIndex = i;
    this.route.navigate(['/home/customerProductType/view']);
  }

}
