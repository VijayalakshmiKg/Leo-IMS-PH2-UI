import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CustomerTrailerOutTypeService } from '../../customer-trailer-out-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MatDialog } from '@angular/material/dialog';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { Router } from '@angular/router';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-customer-trailer-out-type',
  templateUrl: './view-customer-trailer-out-type.component.html',
  styleUrls: ['./view-customer-trailer-out-type.component.css']
})
export class ViewCustomerTrailerOutTypeComponent implements OnInit {

  CustomerTrailerOutTypesList: any | any[] = []
  activeCustomerTrailerOutType: any
  viewCustomerTrailerOutTypeRecord: any | any[] = [];
  searchValue: any;
  customerTrailerOutTypeHistorydetails: any;
  pageNumber = 1
  length = 200;
  pageSize = 10;
  currentPage = 1;
  totalPages = Math.ceil(this.length / this.pageSize);
  sortList: any[] = [];
  sortCode: any = 'Newest to Oldest date';
  totalCustomerTrailerOutType: any;
  logedInUser: any
  permissions: any;

  constructor(
    public customerTrailerOutTypeServ: CustomerTrailerOutTypeService,
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
    this.permissions = this.customerTrailerOutTypeServ.permissions || { editAccess: true, deleteAccess: true };
    this.getAllCustomerTrailerOutTypes();
    this.activeCustomerTrailerOutType = this.customerTrailerOutTypeServ.viewCustomerTrailerOutTypeIndex ? this.customerTrailerOutTypeServ.viewCustomerTrailerOutTypeIndex : 0;
  }

  clear() {
    this.searchValue = '';
    this.getAllCustomerTrailerOutTypes();
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1;
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.customerTrailerOutTypeServ.getSearchAndSortBy('', this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomerTrailerOutType = res.totalCount;
      this.totalPages = res.totalCount;
      this.CustomerTrailerOutTypesList = res.data;
    });
  }

  getIndex() {
    for (let i = 0; i < this.CustomerTrailerOutTypesList?.length; i++) {
      if (this.CustomerTrailerOutTypesList[i].cTOT_Mapping_ID == this.viewCustomerTrailerOutTypeRecord.cTOT_Mapping_ID) {
        this.activeCustomerTrailerOutType = i
      }
    }
  }

  changeCustomerTrailerOutTypeView(record: any, index: any) {
    this.activeCustomerTrailerOutType = index
    this.customerTrailerOutTypeServ.viewCustomerTrailerOutTypeIndex = index
    this.viewCustomerTrailerOutTypeRecord = record;
    this.customerTrailerOutTypeHistory();
  }

  getAllCustomerTrailerOutTypes() {
    this.customerTrailerOutTypeServ.getSearchAndSortBy("", this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomerTrailerOutType = res.totalCount;
      this.totalPages = res.totalCount;
      this.CustomerTrailerOutTypesList = res.data;
      this.viewCustomerTrailerOutTypeRecord = this.customerTrailerOutTypeServ.viewDetail ? this.customerTrailerOutTypeServ.viewDetail : this.CustomerTrailerOutTypesList[this.activeCustomerTrailerOutType];
      this.getIndex()
      this.changeCustomerTrailerOutTypeView(this.viewCustomerTrailerOutTypeRecord, this.activeCustomerTrailerOutType)
      this.customerTrailerOutTypeHistory();
    }).catch(err => {
      console.error('Error loading customer trailer out types:', err);
    })
  }

  editCustomerTrailerOutType() {
    console.log('Setting editCustomerTrailerOutTypeRecord to:', this.viewCustomerTrailerOutTypeRecord);
    this.customerTrailerOutTypeServ.editCustomerTrailerOutTypeRecord = this.viewCustomerTrailerOutTypeRecord
    this.routes.navigateByUrl('/home/customerTrailerOutType/add')
    this.customerTrailerOutTypeServ.viewDetail = null;
  }

  customerTrailerOutTypeHistory() {
    if (this.viewCustomerTrailerOutTypeRecord?.cTOT_Mapping_ID) {
      this.customerTrailerOutTypeServ.getCustomerTrailerOutTypeHistory(this.viewCustomerTrailerOutTypeRecord.cTOT_Mapping_ID).then(res => {
        this.customerTrailerOutTypeHistorydetails = res;
      }).catch(err => {
        console.error('Error loading customer trailer out type history:', err);
        this.customerTrailerOutTypeHistorydetails = [];
      })
    }
  }

  deleteCustomerTrailerOutType() {
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '480px',
      height: 'auto',
      data: { message: 'Are you sure want to delete the customer trailer out type mapping?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.customerTrailerOutTypeServ.deleteCustomerTrailerOutType(this.viewCustomerTrailerOutTypeRecord.cTOT_Mapping_ID).then((res: any) => {
          if (res) {
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Customer trailer out type mapping deleted successfully.' });
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
      this.customerTrailerOutTypeServ.getSearchAndSortBy(event.target.value, this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
        this.totalCustomerTrailerOutType = res.totalCount;
        this.totalPages = res.totalCount;
        this.CustomerTrailerOutTypesList = res.data;
      })
    } else {
      this.getAllCustomerTrailerOutTypes();
    }
  }

}
