import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductBinService } from '../product-bin.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PageEvent } from '@angular/material/paginator';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';

@Component({
  selector: 'app-product-bin-home',
  templateUrl: './product-bin-home.component.html',
  styleUrls: ['./product-bin-home.component.css']
})
export class ProductBinHomeComponent implements OnInit {

  productBinList: any | any[] = []
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
  totalProductBin: any;
  logedInUser: any
  permissions: any

  constructor(public route: Router, public productBinServ: ProductBinService, public utilSer: UtilityService) {

  }

  ngOnInit(): void {
    let user: any = sessionStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    let childmenu = parsedData.rootMenu[parsedData.rootMenu.length - 1];
    for (var i = 0; i < childmenu.subMenus.length; i++) {
      if (childmenu.subMenus[i].subMenuName.toLowerCase() == 'product bin mapping') {
        this.permissions = childmenu.subMenus[i];
        this.productBinServ.permissions = this.permissions;
      }
    }

    this.getAllProductBinList();
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
    this.productBinServ.getSearchAndSortBy("", this.sortCode, this.statusFilter, this.pageSize, this.pageNumber).then((res: any) => {
      this.totalProductBin = res.totalCount;
      this.totalPages = res.totalCount;
      this.productBinList = res.data;
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
    this.productBinServ.getSearchAndSortBy("", this.sortCode, this.statusFilter, this.pageSize, this.pageNumber).then((res: any) => {
      this.totalProductBin = res.totalCount;
      this.totalPages = res.totalCount;
      this.productBinList = res.data;
    }).catch((err: any) => {
      if (err) {
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
      }
    });
  }

  searchProductBin(event: any) {
    this.searchValue = event.target.value;
    if (event.target.value.length > 1) {
      this.productBinServ.getSearchAndSortBy(event.target.value, this.sortCode, this.statusFilter, this.pageSize, this.pageNumber).then((res: any) => {
        this.totalProductBin = res.totalCount;
        this.totalPages = res.totalCount;
        this.productBinList = res.data;
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
        }
      });
    } else {
      this.sortByValue("A to Z");
    }
  }

  addProductBin() {
    this.productBinServ.viewProductBinIndex = 0;
    this.productBinServ.editProductBinRecord = null
    this.route.navigateByUrl('/home/productBin/addProductBin')
  }

  getAllProductBinList() {
    this.productBinServ.getAllProductBins().then((res: any) => {
      this.totalProductBin = res.totalCount;
      this.totalPages = res.totalCount;
      this.productBinList = res.data;
    })
  }

  viewProductBin(productBin: any, index: any) {
    if (this.permissions?.viewAccess) {
      this.productBinServ.selectedProductBinRecord = productBin;
      this.productBinServ.viewProductBinId = productBin;
      this.productBinServ.viewProductBinIndex = index;
      this.route.navigateByUrl('/home/productBin/viewProductBin')
    }
  }
}
