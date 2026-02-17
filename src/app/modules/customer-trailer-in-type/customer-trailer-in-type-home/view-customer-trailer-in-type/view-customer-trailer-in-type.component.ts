import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CustomerTrailerInTypeService } from '../../customer-trailer-in-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MatDialog } from '@angular/material/dialog';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { Router } from '@angular/router';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-customer-trailer-in-type',
  templateUrl: './view-customer-trailer-in-type.component.html',
  styleUrls: ['./view-customer-trailer-in-type.component.css']
})
export class ViewCustomerTrailerInTypeComponent implements OnInit {

  CustomerTrailerInTypesList: any | any[] = []
  activeCustomerTrailerInType: any
  viewCustomerTrailerInTypeRecord: any | any[] = [];
  searchValue: any;
  customerTrailerInTypeHistorydetails: any;
  pageNumber = 1
  length = 200;
  pageSize = 10;
  currentPage = 1;
  totalPages = Math.ceil(this.length / this.pageSize);
  sortList: any[] = [];
  sortCode: any = 'Newest to Oldest date';
  totalCustomerTrailerInType: any;
  logedInUser: any
  permissions: any;

  constructor(
    public customerTrailerInTypeServ: CustomerTrailerInTypeService,
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
    this.permissions = this.customerTrailerInTypeServ.permissions || { editAccess: true, deleteAccess: true };
    this.getAllCustomerTrailerInTypes();
    this.activeCustomerTrailerInType = this.customerTrailerInTypeServ.viewCustomerTrailerInTypeIndex ? this.customerTrailerInTypeServ.viewCustomerTrailerInTypeIndex : 0;
  }

  clear() {
    this.searchValue = '';
    this.getAllCustomerTrailerInTypes();
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1;
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.customerTrailerInTypeServ.getSearchAndSortBy('', this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomerTrailerInType = res.totalCount;
      this.totalPages = res.totalCount;
      this.CustomerTrailerInTypesList = res.data;
    });
  }

  getIndex() {
    for (let i = 0; i < this.CustomerTrailerInTypesList?.length; i++) {
      if (this.CustomerTrailerInTypesList[i].cTIT_Mapping_ID == this.viewCustomerTrailerInTypeRecord.cTIT_Mapping_ID) {
        this.activeCustomerTrailerInType = i
      }
    }
  }

  changeCustomerTrailerInTypeView(record: any, index: any) {
    this.activeCustomerTrailerInType = index
    this.customerTrailerInTypeServ.viewCustomerTrailerInTypeIndex = index
    this.viewCustomerTrailerInTypeRecord = record;
    this.customerTrailerInTypeHistory();
  }

  getAllCustomerTrailerInTypes() {
    this.customerTrailerInTypeServ.getSearchAndSortBy("", this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomerTrailerInType = res.totalCount;
      this.totalPages = res.totalCount;
      this.CustomerTrailerInTypesList = res.data;
      this.viewCustomerTrailerInTypeRecord = this.customerTrailerInTypeServ.viewDetail ? this.customerTrailerInTypeServ.viewDetail : this.CustomerTrailerInTypesList[this.activeCustomerTrailerInType];
      this.getIndex()
      this.changeCustomerTrailerInTypeView(this.viewCustomerTrailerInTypeRecord, this.activeCustomerTrailerInType)
      this.customerTrailerInTypeHistory();
    }).catch(err => {
      console.error('Error loading customer trailer in types:', err);
    })
  }

  editCustomerTrailerInType() {
    console.log('Setting editCustomerTrailerInTypeRecord to:', this.viewCustomerTrailerInTypeRecord);
    this.customerTrailerInTypeServ.editCustomerTrailerInTypeRecord = this.viewCustomerTrailerInTypeRecord
    this.routes.navigateByUrl('/home/customerTrailerInType/add')
    this.customerTrailerInTypeServ.viewDetail = null;
  }

  customerTrailerInTypeHistory() {
    if (this.viewCustomerTrailerInTypeRecord?.cTIT_Mapping_ID) {
      this.customerTrailerInTypeServ.getCustomerTrailerInTypeHistory(this.viewCustomerTrailerInTypeRecord.cTIT_Mapping_ID).then(res => {
        this.customerTrailerInTypeHistorydetails = res;
      }).catch(err => {
        console.error('Error loading customer trailer in type history:', err);
        this.customerTrailerInTypeHistorydetails = [];
      })
    }
  }

  deleteCustomerTrailerInType() {
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '480px',
      height: 'auto',
      data: { message: 'Are you sure want to delete the customer trailer in type mapping?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.customerTrailerInTypeServ.deleteCustomerTrailerInType(this.viewCustomerTrailerInTypeRecord.cTIT_Mapping_ID).then((res: any) => {
          if (res) {
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Customer trailer in type mapping deleted successfully.' });
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
      this.customerTrailerInTypeServ.getSearchAndSortBy(event.target.value, this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
        this.totalCustomerTrailerInType = res.totalCount;
        this.totalPages = res.totalCount;
        this.CustomerTrailerInTypesList = res.data;
      })
    } else {
      this.getAllCustomerTrailerInTypes();
    }
  }

}
