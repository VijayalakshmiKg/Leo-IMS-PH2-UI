import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CustomerTrailerOutService } from '../../customer-trailer-out.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MatDialog } from '@angular/material/dialog';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { Router } from '@angular/router';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-customer-trailer-out',
  templateUrl: './view-customer-trailer-out.component.html',
  styleUrls: ['./view-customer-trailer-out.component.css']
})
export class ViewCustomerTrailerOutComponent implements OnInit {

  CustomerTrailerOutsList: any | any[] = []
  activeCustomerTrailerOut: any
  viewCustomerTrailerOutRecord: any | any[] = [];
  searchValue: any;
  customerTrailerOutHistorydetails: any;
  pageNumber = 1
  length = 200;
  pageSize = 10;
  currentPage = 1;
  totalPages = Math.ceil(this.length / this.pageSize);
  sortList: any[] = [];
  sortCode: any = 'Newest to Oldest date';
  totalCustomerTrailerOut: any;
  logedInUser: any
  permissions: any;

  constructor(
    public customerTrailerOutServ: CustomerTrailerOutService,
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
    this.permissions = this.customerTrailerOutServ.permissions || { editAccess: true, deleteAccess: true };
    this.getAllCustomerTrailerOuts();
    this.activeCustomerTrailerOut = this.customerTrailerOutServ.viewCustomerTrailerOutIndex ? this.customerTrailerOutServ.viewCustomerTrailerOutIndex : 0;
  }

  clear() {
    this.searchValue = '';
    this.getAllCustomerTrailerOuts();
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1;
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.customerTrailerOutServ.getSearchAndSortBy('', this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomerTrailerOut = res.totalCount;
      this.totalPages = res.totalCount;
      this.CustomerTrailerOutsList = res.data;
    });
  }

  getIndex() {
    for (let i = 0; i < this.CustomerTrailerOutsList?.length; i++) {
      if (this.CustomerTrailerOutsList[i].cTO_Mapping_ID == this.viewCustomerTrailerOutRecord.cTO_Mapping_ID) {
        this.activeCustomerTrailerOut = i
      }
    }
  }

  changeCustomerTrailerOutView(record: any, index: any) {
    this.activeCustomerTrailerOut = index
    this.customerTrailerOutServ.viewCustomerTrailerOutIndex = index
    this.viewCustomerTrailerOutRecord = record;
    this.customerTrailerOutHistory();
  }

  getAllCustomerTrailerOuts() {
    this.customerTrailerOutServ.getSearchAndSortBy("", this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomerTrailerOut = res.totalCount;
      this.totalPages = res.totalCount;
      this.CustomerTrailerOutsList = res.data;
      this.viewCustomerTrailerOutRecord = this.customerTrailerOutServ.viewDetail ? this.customerTrailerOutServ.viewDetail : this.CustomerTrailerOutsList[this.activeCustomerTrailerOut];
      this.getIndex()
      this.changeCustomerTrailerOutView(this.viewCustomerTrailerOutRecord, this.activeCustomerTrailerOut)
      this.customerTrailerOutHistory();
    }).catch(err => {
      console.error('Error loading customer trailer outs:', err);
    })
  }

  editCustomerTrailerOut() {
    console.log('Setting editCustomerTrailerOutRecord to:', this.viewCustomerTrailerOutRecord);
    this.customerTrailerOutServ.editCustomerTrailerOutRecord = this.viewCustomerTrailerOutRecord
    this.routes.navigateByUrl('/home/customerTrailerOut/add')
    this.customerTrailerOutServ.viewDetail = null;
  }

  customerTrailerOutHistory() {
    if (this.viewCustomerTrailerOutRecord?.cTO_Mapping_ID) {
      this.customerTrailerOutServ.getCustomerTrailerOutHistory(this.viewCustomerTrailerOutRecord.cTO_Mapping_ID).then(res => {
        this.customerTrailerOutHistorydetails = res;
      }).catch(err => {
        console.error('Error loading customer trailer out history:', err);
        this.customerTrailerOutHistorydetails = [];
      })
    }
  }

  deleteCustomerTrailerOut() {
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '480px',
      height: 'auto',
      data: { message: 'Are you sure want to delete the customer trailer out mapping?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.customerTrailerOutServ.deleteCustomerTrailerOut(this.viewCustomerTrailerOutRecord.ctO_Mapping_ID).then((res: any) => {
          if (res) {
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Customer trailer out mapping deleted successfully.' });
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
      this.customerTrailerOutServ.getSearchAndSortBy(event.target.value, this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
        this.totalCustomerTrailerOut = res.totalCount;
        this.totalPages = res.totalCount;
        this.CustomerTrailerOutsList = res.data;
      })
    } else {
      this.getAllCustomerTrailerOuts();
    }
  }

}
