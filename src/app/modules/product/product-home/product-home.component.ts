import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-product-home',
  templateUrl: './product-home.component.html',
  styleUrls: ['./product-home.component.css']
})
export class ProductHomeComponent implements OnInit {

  ProductsList: any | any[] = []
  sortList: any[] = [];
  sortCode: any = '';
  searchValue: any;
  statusFilter = ''
  avalStatus = 'All';
  pageNumber = 1
  length = 200; // Total items
  pageSize = 10; // Items per page
  currentPage = 1; // Default first page
  totalPages = Math.ceil(this.length / this.pageSize); // Total pages
  totalProduct: any;
  logedInUser: any;
  permissions: any;

  constructor(public route: Router, public ProductServ: ProductService, public ultiSer: UtilityService) { }

  ngOnInit(): void {
    let user: any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    let childmenu = parsedData.rootMenu[parsedData.rootMenu.length - 2];
    for (var i = 0; i < childmenu.subMenus.length; i++) {
      if (childmenu.subMenus[i].subMenuName.toLowerCase() == 'products') {
        this.permissions = childmenu.subMenus[i];
        this.ProductServ.permissions = this.permissions;
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
      this.ProductServ.getSearchAndSortBy(event.target.value, "", this.statusFilter, this.pageNumber, this.pageSize).then((res: any) => {
        this.totalProduct = res.totalCount;
        this.totalPages = res.totalCount;
        this.ProductsList = res.data;
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
    this.ProductServ.getSearchAndSortBy('', this.sortCode, this.statusFilter, this.pageNumber, this.pageSize).then((res: any) => {
      this.totalProduct = res.totalCount;
      this.totalPages = res.totalCount;
      this.ProductsList = res.data;
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
    this.ProductServ.getSearchAndSortBy('', this.sortCode, this.statusFilter, this.pageNumber, this.pageSize).then((res: any) => {
      this.totalProduct = res.totalCount;
      this.totalPages = res.totalCount;
      this.ProductsList = res.data;
    })
  }

  getAllProductsList() {
    this.ProductServ.getAllProduct().then((res: any) => {
      this.totalProduct = res.totalCount;
      this.totalPages = res.totalCount;
      this.ProductsList = res.data;
    })
  }

  addProducts() {
    this.ProductServ.editProductRecord = null;
    this.ProductServ.viewDetail = null;
    this.ProductServ.viewProductIndex = 0;
    this.route.navigateByUrl('/home/product/addProduct')
  }

  viewProducts(index: any, productDet: any) {
    if (this.permissions?.viewAccess) {
      this.ProductServ.viewDetail = productDet;
      this.ProductServ.viewProductIndex = index
      this.route.navigateByUrl('/home/product/viewProduct')
    }
  }

}
