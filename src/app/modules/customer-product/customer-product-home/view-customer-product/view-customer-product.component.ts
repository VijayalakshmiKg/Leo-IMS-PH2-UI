import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CustomerProductService } from '../../customer-product.service';
import { Location } from '@angular/common';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-customer-product',
  templateUrl: './view-customer-product.component.html',
  styleUrls: ['./view-customer-product.component.css']
})
export class ViewCustomerProductComponent implements OnInit {

  CustomerProductsList: any | any[] = []
  activeCustomerProduct: any
  viewCustomerProductRecord: any | any[] = [];
  searchValue: any;
  customerProductHistorydetails: any;
  pageNumber = 1
  length = 200;
  pageSize = 10;
  currentPage = 1;
  totalPages = Math.ceil(this.length / this.pageSize);
  sortList: any[] = [];
  sortCode: any = 'Newest to Oldest date';
  totalCustomerProduct: any;
  logedInUser: any
  permissions: any;

  constructor(
    public customerProductServ: CustomerProductService, 
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
    this.permissions = this.customerProductServ.permissions || { editAccess: true, deleteAccess: true };
    this.getAllCustomerProducts();
    this.activeCustomerProduct = this.customerProductServ.viewCustomerProductIndex ? this.customerProductServ.viewCustomerProductIndex : 0;
  }

  clear() {
    this.searchValue = '';
    this.getAllCustomerProducts();
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1;
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.customerProductServ.getSearchAndSortBy('', this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomerProduct = res.totalCount;
      this.totalPages = res.totalCount;
      this.CustomerProductsList = res.data;
    });
  }

  getIndex() {
    for (let i = 0; i < this.CustomerProductsList?.length; i++) {
      if (this.CustomerProductsList[i].cP_Mapping_ID == this.viewCustomerProductRecord.cP_Mapping_ID) {
        this.activeCustomerProduct = i
      }
    }
  }

  changeCustomerProductView(record: any, index: any) {
    this.activeCustomerProduct = index
    this.customerProductServ.viewCustomerProductIndex = index
    this.viewCustomerProductRecord = record;
    this.customerProductHistory();
  }

  getAllCustomerProducts() {
    this.customerProductServ.getSearchAndSortBy("", this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomerProduct = res.totalCount;
      this.totalPages = res.totalCount;
      this.CustomerProductsList = res.data;
      this.viewCustomerProductRecord = this.customerProductServ.viewDetail ? this.customerProductServ.viewDetail : this.CustomerProductsList[this.activeCustomerProduct];
      this.getIndex()
      this.changeCustomerProductView(this.viewCustomerProductRecord, this.activeCustomerProduct)
      this.customerProductHistory();
    }).catch(err => {
      console.error('Error loading customer products:', err);
    })
  }

  editCustomerProduct() {
    console.log('Setting editCustomerProductRecord to:', this.viewCustomerProductRecord);
    this.customerProductServ.editCustomerProductRecord = this.viewCustomerProductRecord
    this.routes.navigateByUrl('/home/customerProduct/addCustomerProduct')
    this.customerProductServ.viewDetail = null;
  }

  customerProductHistory() {
    if (this.viewCustomerProductRecord?.cP_Mapping_ID) {
      this.customerProductServ.getCustomerProductHistory(this.viewCustomerProductRecord.cP_Mapping_ID).then(res => {
        this.customerProductHistorydetails = res;
      }).catch(err => {
        console.error('Error loading customer product history:', err);
        this.customerProductHistorydetails = [];
      })
    }
  }

  deleteCustomerProduct() {
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '480px',
      height: 'auto',
      data: { message: 'Are you sure want to delete the customer product mapping?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.customerProductServ.deleteCustomerProduct(this.viewCustomerProductRecord.cP_Mapping_ID).then((res: any) => {
          if (res) {
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Customer product mapping deleted successfully.' });
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
      this.customerProductServ.getSearchAndSortBy(event.target.value, this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
        this.totalCustomerProduct = res.totalCount;
        this.totalPages = res.totalCount;
        this.CustomerProductsList = res.data;
      })
    } else {
      this.getAllCustomerProducts();
    }
  }

}
