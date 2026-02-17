import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProductService } from '../../product.service';
import { Location } from '@angular/common';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {

  ProductsList: any | any[] = []
  activeProducts: any
  viewProductsRecord: any | any[] = [];
  searchValue: any;
  productHistorydetails: any;
  pageNumber = 1
  length = 200;
  pageSize = 10;
  currentPage = 1;
  totalPages = Math.ceil(this.length / this.pageSize);
  sortList: any[] = [];
  sortCode: any = 'Newest to Oldest date';
  totalProduct: any;
  logedInUser: any
  permissions: any;

  constructor(
    public ProductServ: ProductService, 
    public routes: Router, 
    public dialog: MatDialog, 
    public utilSer: UtilityService, 
    public location: Location
  ) { }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    let user: any = localStorage.getItem('loggedInUser')
    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    this.permissions = this.ProductServ.permissions;
    this.getAllProducts();
    this.activeProducts = this.ProductServ.viewProductIndex ? this.ProductServ.viewProductIndex : 0;
  }

  clear() {
    this.searchValue = '';
    this.getAllProducts();
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1;
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.ProductServ.getSearchAndSortBy('', this.sortCode, '', this.pageNumber, this.pageSize).then((res: any) => {
      this.totalProduct = res.totalCount;
      this.totalPages = res.totalCount;
      this.ProductsList = res.data;
    });
  }

  getIndex() {
    for (let i = 0; i < this.ProductsList?.length; i++) {
      if (this.ProductsList[i].productID == this.viewProductsRecord.productID) {
        this.activeProducts = i
      }
    }
  }

  changeProductsView(record: any, index: any) {
    this.activeProducts = index
    this.ProductServ.viewProductIndex = index
    this.viewProductsRecord = record;
    this.productHistory();
  }

  getAllProducts() {
    this.ProductServ.getSearchAndSortBy("", this.sortCode, '', this.pageNumber, this.pageSize).then((res: any) => {
      this.totalProduct = res.totalCount;
      this.totalPages = res.totalCount;
      this.ProductsList = res.data;
      this.viewProductsRecord = this.ProductServ.viewDetail ? this.ProductServ.viewDetail : this.ProductsList[this.activeProducts];
      this.getIndex()
      this.changeProductsView(this.viewProductsRecord, this.activeProducts)
      this.productHistory();
    })
  }

  editProducts() {
    this.ProductServ.editProductRecord = this.viewProductsRecord
    this.routes.navigateByUrl('/home/product/addProduct')
    this.ProductServ.viewDetail = null;
    this.getAllProducts();
  }

  productHistory() {
    this.ProductServ.getProductHistory(this.viewProductsRecord.productID).then(res => {
      this.productHistorydetails = res;
    })
  }

  deleteProducts() {
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '505px',
      height: 'auto',
      data: {
        title: 'Remove Product',
        message: 'Do you wish to remove the product? All the Product data will be deleted and cannot be restored again.',
        value: this.viewProductsRecord.productName,
        placeholder: 'Enter the product name'
      },
      disableClose: true,
      autoFocus: false,
      panelClass: 'deletePopup'
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.ProductServ.deleteProduct(this.viewProductsRecord.productID).then((res: any) => {
          if (res) {
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Product removed successfully.' });
            this.location.back();
          }
        })
      }
    })
  }

  back() {
    this.location.back()
  }

  filteredUsersList(event: any) {
    this.searchValue = event.target.value;
    if (event.target.value.length > 1) {
      this.ProductServ.getSearchAndSortBy(event.target.value, this.sortCode, '', this.pageNumber, this.pageSize).then((res: any) => {
        this.totalProduct = res.totalCount;
        this.totalPages = res.totalCount;
        this.ProductsList = res.data;
      })
    } else {
      this.getAllProducts();
    }
  }

}
