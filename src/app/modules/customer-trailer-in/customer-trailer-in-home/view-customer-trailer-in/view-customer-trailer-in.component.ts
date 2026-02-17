import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CustomerTrailerInService } from '../../customer-trailer-in.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MatDialog } from '@angular/material/dialog';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { Router } from '@angular/router';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-customer-trailer-in',
  templateUrl: './view-customer-trailer-in.component.html',
  styleUrls: ['./view-customer-trailer-in.component.css']
})
export class ViewCustomerTrailerInComponent implements OnInit {

  CustomerTrailerInsList: any | any[] = []
  activeCustomerTrailerIn: any
  viewCustomerTrailerInRecord: any | any[] = [];
  searchValue: any;
  customerTrailerInHistorydetails: any;
  pageNumber = 1
  length = 200;
  pageSize = 10;
  currentPage = 1;
  totalPages = Math.ceil(this.length / this.pageSize);
  sortList: any[] = [];
  sortCode: any = 'Newest to Oldest date';
  totalCustomerTrailerIn: any;
  logedInUser: any
  permissions: any;

  constructor(
    public customerTrailerInServ: CustomerTrailerInService,
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
    this.permissions = this.customerTrailerInServ.permissions || { editAccess: true, deleteAccess: true };
    this.getAllCustomerTrailerIns();
    this.activeCustomerTrailerIn = this.customerTrailerInServ.viewCustomerTrailerInIndex ? this.customerTrailerInServ.viewCustomerTrailerInIndex : 0;
  }

  clear() {
    this.searchValue = '';
    this.getAllCustomerTrailerIns();
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1;
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.customerTrailerInServ.getSearchAndSortBy('', this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomerTrailerIn = res.totalCount;
      this.totalPages = res.totalCount;
      this.CustomerTrailerInsList = res.data;
    });
  }

  getIndex() {
    for (let i = 0; i < this.CustomerTrailerInsList?.length; i++) {
      if (this.CustomerTrailerInsList[i].cTI_Mapping_ID == this.viewCustomerTrailerInRecord.cTI_Mapping_ID) {
        this.activeCustomerTrailerIn = i
      }
    }
  }

  changeCustomerTrailerInView(record: any, index: any) {
    this.activeCustomerTrailerIn = index
    this.customerTrailerInServ.viewCustomerTrailerInIndex = index
    this.viewCustomerTrailerInRecord = record;
    this.customerTrailerInHistory();
  }

  getAllCustomerTrailerIns() {
    this.customerTrailerInServ.getSearchAndSortBy("", this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomerTrailerIn = res.totalCount;
      this.totalPages = res.totalCount;
      this.CustomerTrailerInsList = res.data;
      this.viewCustomerTrailerInRecord = this.customerTrailerInServ.viewDetail ? this.customerTrailerInServ.viewDetail : this.CustomerTrailerInsList[this.activeCustomerTrailerIn];
      this.getIndex()
      this.changeCustomerTrailerInView(this.viewCustomerTrailerInRecord, this.activeCustomerTrailerIn)
      this.customerTrailerInHistory();
    }).catch(err => {
      console.error('Error loading customer trailer ins:', err);
    })
  }

  editCustomerTrailerIn() {
    console.log('Setting editCustomerTrailerInRecord to:', this.viewCustomerTrailerInRecord);
    this.customerTrailerInServ.editCustomerTrailerInRecord = this.viewCustomerTrailerInRecord
    this.routes.navigateByUrl('/home/customerTrailerIn/add')
    this.customerTrailerInServ.viewDetail = null;
  }

  customerTrailerInHistory() {
    if (this.viewCustomerTrailerInRecord?.cTI_Mapping_ID) {
      this.customerTrailerInServ.getCustomerTrailerInHistory(this.viewCustomerTrailerInRecord.cTI_Mapping_ID).then(res => {
        this.customerTrailerInHistorydetails = res;
      }).catch(err => {
        console.error('Error loading customer trailer in history:', err);
        this.customerTrailerInHistorydetails = [];
      })
    }
  }

  deleteCustomerTrailerIn() {
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '480px',
      height: 'auto',
      data: { message: 'Are you sure want to delete the customer trailer in mapping?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.customerTrailerInServ.deleteCustomerTrailerIn(this.viewCustomerTrailerInRecord.cTI_Mapping_ID).then((res: any) => {
          if (res) {
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Customer trailer in mapping deleted successfully.' });
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
      this.customerTrailerInServ.getSearchAndSortBy(event.target.value, this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
        this.totalCustomerTrailerIn = res.totalCount;
        this.totalPages = res.totalCount;
        this.CustomerTrailerInsList = res.data;
      })
    } else {
      this.getAllCustomerTrailerIns();
    }
  }

}
