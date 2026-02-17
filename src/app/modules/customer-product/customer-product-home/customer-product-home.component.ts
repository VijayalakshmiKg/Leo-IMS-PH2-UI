import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerProductService } from '../customer-product.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PageEvent } from '@angular/material/paginator';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';

@Component({
  selector: 'app-customer-product-home',
  templateUrl: './customer-product-home.component.html',
  styleUrls: ['./customer-product-home.component.css']
})
export class CustomerProductHomeComponent implements OnInit {

  customerProductList: any | any[] = []
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
  totalCustomerProduct: any;
  logedInUser: any
  permissions: any

  constructor(public route: Router, public customerProductServ: CustomerProductService, public utilSer: UtilityService) {

  }

  ngOnInit(): void {
    let user: any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    let childmenu = parsedData.rootMenu[parsedData.rootMenu.length - 1];
    for (var i = 0; i < childmenu.subMenus.length; i++) {
      if (childmenu.subMenus[i].subMenuName.toLowerCase() == 'customer product mapping') {
        this.permissions = childmenu.subMenus[i];
        this.customerProductServ.permissions = this.permissions;
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
    this.customerProductServ.getSearchAndSortBy("", this.sortCode, this.statusFilter, this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomerProduct = res.totalCount;
      this.totalPages = res.totalCount;
      this.customerProductList = res.data;
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
    this.customerProductServ.getSearchAndSortBy("", this.sortCode, this.statusFilter, this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomerProduct = res.totalCount;
      this.totalPages = res.totalCount;
      this.customerProductList = res.data;
    }).catch((err: any) => {
      if (err) {
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
      }
    });
  }

  searchCustomerProduct(event: any) {
    this.searchValue = event.target.value;
    if (event.target.value.length > 1) {
      this.customerProductServ.getSearchAndSortBy(event.target.value, this.sortCode, this.statusFilter, this.pageSize, this.pageNumber).then((res: any) => {
        this.totalCustomerProduct = res.totalCount;
        this.totalPages = res.totalCount;
        this.customerProductList = res.data;
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
        }
      });
    } else {
      this.sortByValue("A to Z");
    }
  }

  addCustomerProduct() {
    this.customerProductServ.viewCustomerProductIndex = 0;
    this.customerProductServ.editCustomerProductRecord = null
    this.route.navigateByUrl('/home/customerProduct/addCustomerProduct')
  }

  getAllCustomerProductList() {
    this.customerProductServ.getAllCustomerProducts().then((res: any) => {
      this.totalCustomerProduct = res.totalCount;
      this.totalPages = res.totalCount;
      this.customerProductList = res.data;
    })
  }

  viewCustomerProduct(customerProduct: any, index: any) {
    if (this.permissions?.viewAccess) {
      this.customerProductServ.selectedCustomerProductRecord = customerProduct;
      this.customerProductServ.viewCustomerProductId = customerProduct;
      this.customerProductServ.viewCustomerProductIndex = index;
      this.route.navigateByUrl('/home/customerProduct/viewCustomerProduct')
    }
  }
}
