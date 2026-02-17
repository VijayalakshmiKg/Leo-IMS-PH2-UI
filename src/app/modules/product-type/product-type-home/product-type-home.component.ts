import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductTypeService } from '../product-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-product-type-home',
  templateUrl: './product-type-home.component.html',
  styleUrls: ['./product-type-home.component.css']
})
export class ProductTypeHomeComponent implements OnInit {

  ProductTypesList: any | any[] = []
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
  totalProductType: any;
  logedInUser: any;
  permissions: any;

  constructor(public route: Router, public ProductTypeServ: ProductTypeService, public ultiSer: UtilityService) { }

  ngOnInit(): void {
    let user: any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    let childmenu = parsedData.rootMenu[parsedData.rootMenu.length - 2];
    for (var i = 0; i < childmenu.subMenus.length; i++) {
        debugger;
      if (childmenu.subMenus[i].subMenuName.toLowerCase() == 'product types') {
        this.permissions = childmenu.subMenus[i];
        this.ProductTypeServ.permissions = this.permissions;
      }
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
      this.ProductTypeServ.getSearchAndSortBy(event.target.value, "", this.statusFilter, this.pageNumber, this.pageSize).then((res: any) => {
        this.totalProductType = res.totalCount;
        this.totalPages = res.totalCount;
        this.ProductTypesList = res.data;
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
    this.ProductTypeServ.getSearchAndSortBy('', this.sortCode, this.statusFilter, this.pageNumber, this.pageSize).then((res: any) => {
      this.totalProductType = res.totalCount;
      this.totalPages = res.totalCount;
      this.ProductTypesList = res.data;
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
    this.ProductTypeServ.getSearchAndSortBy('', this.sortCode, this.statusFilter, this.pageNumber, this.pageSize).then((res: any) => {
      this.totalProductType = res.totalCount;
      this.totalPages = res.totalCount;
      this.ProductTypesList = res.data;
    })
  }

  getAllProductTypesList() {
    this.ProductTypeServ.getAllProductType().then((res: any) => {
      this.totalProductType = res.totalCount;
      this.totalPages = res.totalCount;
      this.ProductTypesList = res.data;
    })
  }

  addProductTypes() {
    this.ProductTypeServ.editProductTypeRecord = null;
    this.ProductTypeServ.viewDetail = null;
    this.ProductTypeServ.viewProductTypeIndex = 0;
    this.route.navigateByUrl('/home/productType/addProductType')
  }

  viewProductTypes(index: any, productTypeDet: any) {
    if (this.permissions?.viewAccess) {
      this.ProductTypeServ.viewDetail = productTypeDet;
      this.ProductTypeServ.viewProductTypeIndex = index
      this.route.navigateByUrl('/home/productType/viewProductType')
    }
  }

}
