import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProductTypeService } from '../../product-type.service';
import { Location } from '@angular/common';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-product-type',
  templateUrl: './view-product-type.component.html',
  styleUrls: ['./view-product-type.component.css']
})
export class ViewProductTypeComponent implements OnInit {

  ProductTypesList: any | any[] = []
  activeProductTypes: any
  viewProductTypesRecord: any | any[] = [];
  searchValue: any;
  productTypeHistorydetails: any;
  pageNumber = 1
  length = 200;
  pageSize = 10;
  currentPage = 1;
  totalPages = Math.ceil(this.length / this.pageSize);
  sortList: any[] = [];
  sortCode: any = 'Newest to Oldest date';
  totalProductType: any;
  logedInUser: any
  permissions: any;

  constructor(
    public ProductTypeServ: ProductTypeService, 
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
    this.permissions = this.ProductTypeServ.permissions;
    this.getAllProductTypes();
    this.activeProductTypes = this.ProductTypeServ.viewProductTypeIndex ? this.ProductTypeServ.viewProductTypeIndex : 0;
  }

  clear() {
    this.searchValue = '';
    this.getAllProductTypes();
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1;
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.ProductTypeServ.getSearchAndSortBy('', this.sortCode, '', this.pageNumber, this.pageSize).then((res: any) => {
      this.totalProductType = res.totalCount;
      this.totalPages = res.totalCount;
      this.ProductTypesList = res.data;
    });
  }

  getIndex() {
    for (let i = 0; i < this.ProductTypesList?.length; i++) {
      if (this.ProductTypesList[i].productTypeID == this.viewProductTypesRecord.productTypeID) {
        this.activeProductTypes = i
      }
    }
  }

  changeProductTypesView(record: any, index: any) {
    this.activeProductTypes = index
    this.ProductTypeServ.viewProductTypeIndex = index
    this.viewProductTypesRecord = record;
    this.productTypeHistory();
  }

  getAllProductTypes() {
    this.ProductTypeServ.getSearchAndSortBy("", this.sortCode, '', this.pageNumber, this.pageSize).then((res: any) => {
      this.totalProductType = res.totalCount;
      this.totalPages = res.totalCount;
      this.ProductTypesList = res.data;
      this.viewProductTypesRecord = this.ProductTypeServ.viewDetail ? this.ProductTypeServ.viewDetail : this.ProductTypesList[this.activeProductTypes];
      this.getIndex()
      this.changeProductTypesView(this.viewProductTypesRecord, this.activeProductTypes)
      this.productTypeHistory();
    })
  }

  editProductTypes() {
    this.ProductTypeServ.editProductTypeRecord = this.viewProductTypesRecord
    this.routes.navigateByUrl('/home/productType/addProductType')
    this.ProductTypeServ.viewDetail = null;
    this.getAllProductTypes();
  }

  productTypeHistory() {
    this.ProductTypeServ.getProductTypeHistory(this.viewProductTypesRecord.productTypeID).then(res => {
      this.productTypeHistorydetails = res;
    })
  }

  deleteProductTypes() {
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '480px',
      height: 'auto',
      data: { message: 'Are you sure want to delete the product type?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.ProductTypeServ.deleteProductType(this.viewProductTypesRecord.productTypeID).then((res: any) => {
          if (res) {
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Product type deleted successfully.' });
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
      this.ProductTypeServ.getSearchAndSortBy(event.target.value, this.sortCode, '', this.pageNumber, this.pageSize).then((res: any) => {
        this.totalProductType = res.totalCount;
        this.totalPages = res.totalCount;
        this.ProductTypesList = res.data;
      })
    } else {
      this.getAllProductTypes();
    }
  }

}
