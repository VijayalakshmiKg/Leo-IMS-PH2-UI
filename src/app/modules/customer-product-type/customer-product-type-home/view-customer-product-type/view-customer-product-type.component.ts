import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CustomerProductTypeService } from '../../customer-product-type.service';
import { Location } from '@angular/common';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-customer-product-type',
  templateUrl: './view-customer-product-type.component.html',
  styleUrls: ['./view-customer-product-type.component.css']
})
export class ViewCustomerProductTypeComponent implements OnInit {

  CustomerProductTypesList: any | any[] = []
  activeCustomerProductType: any
  viewCustomerProductTypeRecord: any | any[] = [];
  searchValue: any;
  customerProductTypeHistorydetails: any;
  pageNumber = 1
  length = 200;
  pageSize = 10;
  currentPage = 1;
  totalPages = Math.ceil(this.length / this.pageSize);
  sortList: any[] = [];
  sortCode: any = 'Newest to Oldest date';
  totalCustomerProductType: any;
  logedInUser: any
  permissions: any;

  constructor(
    public customerProductTypeServ: CustomerProductTypeService, 
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
    this.permissions = this.customerProductTypeServ.permissions || { editAccess: true, deleteAccess: true };
    this.getAllCustomerProductTypes();
    this.activeCustomerProductType = this.customerProductTypeServ.viewCustomerProductTypeIndex ? this.customerProductTypeServ.viewCustomerProductTypeIndex : 0;
  }

  clear() {
    this.searchValue = '';
    this.getAllCustomerProductTypes();
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1;
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.customerProductTypeServ.getSearchAndSortBy('', this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomerProductType = res.totalCount;
      this.totalPages = res.totalCount;
      this.CustomerProductTypesList = res.data;
    });
  }

  getIndex() {
    for (let i = 0; i < this.CustomerProductTypesList?.length; i++) {
      if (this.CustomerProductTypesList[i].cpT_Mapping_ID == this.viewCustomerProductTypeRecord.cpT_Mapping_ID) {
        this.activeCustomerProductType = i
      }
    }
  }

  changeCustomerProductTypeView(record: any, index: any) {
    this.activeCustomerProductType = index
    this.customerProductTypeServ.viewCustomerProductTypeIndex = index
    this.viewCustomerProductTypeRecord = record;
    this.customerProductTypeHistory();
  }

  getAllCustomerProductTypes() {
    this.customerProductTypeServ.getSearchAndSortBy("", this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomerProductType = res.totalCount;
      this.totalPages = res.totalCount;
      this.CustomerProductTypesList = res.data;
      this.viewCustomerProductTypeRecord = this.customerProductTypeServ.viewDetail ? this.customerProductTypeServ.viewDetail : this.CustomerProductTypesList[this.activeCustomerProductType];
      this.getIndex()
      this.changeCustomerProductTypeView(this.viewCustomerProductTypeRecord, this.activeCustomerProductType)
      this.customerProductTypeHistory();
    }).catch(err => {
      console.error('Error loading customer product types:', err);
    })
  }

  filteredUsersList(event: any) {
    if (event.target.value == '') {
      this.searchValue = '';
      this.getAllCustomerProductTypes();
    } else {
      this.customerProductTypeServ.getSearchAndSortBy(event.target.value, this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
        this.totalCustomerProductType = res.totalCount;
        this.totalPages = res.totalCount;
        this.CustomerProductTypesList = res.data;
      });
    }
  }

  back() {
    this.location.back();
  }

  editCustomerProductType() {
    console.log('Setting editCustomerProductTypeRecord to:', this.viewCustomerProductTypeRecord);
    this.customerProductTypeServ.editCustomerProductTypeRecord = this.viewCustomerProductTypeRecord
    this.routes.navigateByUrl('/home/customerProductType/add')
    this.customerProductTypeServ.viewDetail = null;
  }

  customerProductTypeHistory() {
    if (this.viewCustomerProductTypeRecord?.cpT_Mapping_ID) {
      this.customerProductTypeServ.getCustomerProductTypeHistory(this.viewCustomerProductTypeRecord.cpT_Mapping_ID).then(res => {
        this.customerProductTypeHistorydetails = res;
      }).catch(err => {
        console.error('Error loading customer product type history:', err);
        this.customerProductTypeHistorydetails = [];
      })
    }
  }

  deleteCustomerProductType() {
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '480px',
      height: 'auto',
      data: { message: 'Are you sure want to delete the customer product type mapping?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.customerProductTypeServ.deleteCustomerProductType(this.viewCustomerProductTypeRecord.cpT_Mapping_ID).then((res: any) => {
          if (res) {
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Customer product type mapping deleted successfully!' });
            this.getAllCustomerProductTypes();
          }
        }).catch((err: any) => {
          if (err) {
            this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'A problem occurred! Server error!' });
          }
        });
      }
    });
  }
}
