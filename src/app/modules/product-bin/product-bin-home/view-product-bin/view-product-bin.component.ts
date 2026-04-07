import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProductBinService } from '../../product-bin.service';
import { Location } from '@angular/common';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-product-bin',
  templateUrl: './view-product-bin.component.html',
  styleUrls: ['./view-product-bin.component.css']
})
export class ViewProductBinComponent implements OnInit {

  ProductBinsList: any | any[] = []
  activeProductBin: any
  viewProductBinRecord: any | any[] = [];
  searchValue: any;
  productBinHistorydetails: any;
  pageNumber = 1
  length = 200;
  pageSize = 10;
  currentPage = 1;
  totalPages = Math.ceil(this.length / this.pageSize);
  sortList: any[] = [];
  sortCode: any = 'Newest to Oldest date';
  totalProductBin: any;
  logedInUser: any
  permissions: any;

  constructor(
    public productBinServ: ProductBinService, 
    public routes: Router, 
    public dialog: MatDialog, 
    public utilSer: UtilityService, 
    public location: Location
  ) { }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    let user: any = sessionStorage.getItem('loggedInUser')
    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    this.permissions = this.productBinServ.permissions || { editAccess: true, deleteAccess: true };
    this.getAllProductBins();
    this.activeProductBin = this.productBinServ.viewProductBinIndex ? this.productBinServ.viewProductBinIndex : 0;
  }

  clear() {
    this.searchValue = '';
    this.getAllProductBins();
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1;
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.productBinServ.getSearchAndSortBy('', this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
      this.totalProductBin = res.totalCount;
      this.totalPages = res.totalCount;
      this.ProductBinsList = res.data;
    });
  }

  getIndex() {
    for (let i = 0; i < this.ProductBinsList?.length; i++) {
      if (this.ProductBinsList[i].pB_Mapping_ID == this.viewProductBinRecord.pB_Mapping_ID) {
        this.activeProductBin = i
      }
    }
  }

  changeProductBinView(record: any, index: any) {
    this.activeProductBin = index
    this.productBinServ.viewProductBinIndex = index
    this.viewProductBinRecord = record;
    this.productBinHistory();
  }

  getAllProductBins() {
    this.productBinServ.getSearchAndSortBy("", this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
      this.totalProductBin = res.totalCount;
      this.totalPages = res.totalCount;
      this.ProductBinsList = res.data;
      this.viewProductBinRecord = this.productBinServ.viewDetail ? this.productBinServ.viewDetail : this.ProductBinsList[this.activeProductBin];
      this.getIndex()
      this.changeProductBinView(this.viewProductBinRecord, this.activeProductBin)
      this.productBinHistory();
    }).catch(err => {
      console.error('Error loading product bins:', err);
    })
  }

  editProductBin() {
    this.productBinServ.editProductBinRecord = this.viewProductBinRecord
    this.routes.navigateByUrl('/home/productBin/addProductBin')
    this.productBinServ.viewDetail = null;
  }

  productBinHistory() {
    if (this.viewProductBinRecord?.pB_Mapping_ID) {
      this.productBinServ.getProductBinHistory(this.viewProductBinRecord.pB_Mapping_ID).then(res => {
        this.productBinHistorydetails = res;
      }).catch(err => {
        console.error('Error loading product bin history:', err);
        this.productBinHistorydetails = [];
      })
    }
  }

  deleteProductBin() {
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '480px',
      height: 'auto',
      data: { message: 'Are you sure want to delete the product bin mapping?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.productBinServ.deleteProductBin(this.viewProductBinRecord.pB_Mapping_ID).then((res: any) => {
          if (res) {
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Product bin mapping deleted successfully.' });
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
      this.productBinServ.getSearchAndSortBy(event.target.value, this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
        this.totalProductBin = res.totalCount;
        this.totalPages = res.totalCount;
        this.ProductBinsList = res.data;
      })
    } else {
      this.getAllProductBins();
    }
  }

}
