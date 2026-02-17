import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CustomerService } from '../../customer.service';
import { Location } from '@angular/common';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.css']
})
export class ViewCustomerComponent implements OnInit {

  CustomersList: any | any[] = []
  activeCustomers: any
  viewCustomersRecord: any | any[] = [];
  searchValue: any;
  customerHistorydetails: any;
  pageNumber = 1
  length = 200;
  pageSize = 10;
  currentPage = 1;
  totalPages = Math.ceil(this.length / this.pageSize);
  sortList: any[] = [];
  sortCode: any = 'Newest to Oldest date';
  totalCustomer: any;
  logedInUser: any
  permissions: any;

  constructor(
    public customerServ: CustomerService, 
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
    this.permissions = this.customerServ.permissions || { editAccess: true, deleteAccess: true, viewAccess: true };
    console.log('Customer permissions:', this.permissions);
    this.getAllCustomers();
    this.activeCustomers = this.customerServ.viewCustomerIndex ? this.customerServ.viewCustomerIndex : 0;
  }

  clear() {
    this.searchValue = '';
    this.getAllCustomers();
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1;
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.customerServ.getSearchAndSortBy('', this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomer = res.totalCount;
      this.totalPages = res.totalCount;
      this.CustomersList = res.data;
    });
  }

  getIndex() {
    for (let i = 0; i < this.CustomersList?.length; i++) {
      if (this.CustomersList[i].customerID == this.viewCustomersRecord.customerID) {
        this.activeCustomers = i
      }
    }
  }

  changeCustomersView(record: any, index: any) {
    this.activeCustomers = index
    this.customerServ.viewCustomerIndex = index
    this.viewCustomersRecord = record;
    this.customerHistory();
  }

  getAllCustomers() {
    this.customerServ.getSearchAndSortBy("", this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
      this.totalCustomer = res.totalCount;
      this.totalPages = res.totalCount;
      this.CustomersList = res.data;
      this.viewCustomersRecord = this.customerServ.viewCustomerId ? this.customerServ.viewCustomerId : this.CustomersList[this.activeCustomers];
      this.getIndex()
      this.changeCustomersView(this.viewCustomersRecord, this.activeCustomers)
      this.customerHistory();
    })
  }

  editCustomers() {
    this.customerServ.editCustomerRecord = this.viewCustomersRecord
    this.routes.navigateByUrl('/home/customer/addCustomer')
    this.customerServ.viewCustomerId = null;
    this.getAllCustomers();
  }

  customerHistory() {
    this.customerServ.getCustomerHistory(this.viewCustomersRecord.customerID).then(res => {
      this.customerHistorydetails = res;
    })
  }

  deleteCustomers() {
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '505px',
      height: 'auto',
      data: {
        title: 'Remove Customer',
        message: 'Do you wish to remove the customer? All the Customer data will be deleted and cannot be restored again.',
        value: this.viewCustomersRecord.customerName,
        placeholder: 'Enter the customer name'
      },
      disableClose: true,
      autoFocus: false,
      panelClass: 'deletePopup'
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.customerServ.deleteCustomer(this.viewCustomersRecord.customerID).then((res: any) => {
          if (res) {
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Customer removed successfully.' });
            this.location.back();
          }
        })
      }
    })
  }

  back() {
    this.location.back()
  }

  filteredCustomersList(event: any) {
    this.searchValue = event.target.value;
    if (event.target.value.length > 1) {
      this.customerServ.getSearchAndSortBy(event.target.value, this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
        this.totalCustomer = res.totalCount;
        this.totalPages = res.totalCount;
        this.CustomersList = res.data;
      })
    } else {
      this.getAllCustomers();
    }
  }

}
