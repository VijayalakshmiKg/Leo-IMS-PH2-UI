import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerDriverService } from '../../customer-driver.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { Location } from '@angular/common';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-customer-driver',
  templateUrl: './view-customer-driver.component.html',
  styleUrls: ['./view-customer-driver.component.css']
})
export class ViewCustomerDriverComponent implements OnInit {
  customerDriverList: any | any[] = []
  activeCustomerDriver: any
  viewCustomerDriverRecord: any | any[] = [];
  searchValue: any;
  customerDriverHistoryDetails: any;
  pageNumber = 1
  length = 200;
  pageSize = 10;
  currentPage = 1;
  totalPages = Math.ceil(this.length / this.pageSize);
  sortList: any[] = [];
  sortCode: any = 'Newest to Oldest date';
  totalCustomerDriver: any;
  logedInUser: any
  permissions: any;
  
  constructor(
    public customerDriverServ: CustomerDriverService, 
    public routes: Router, 
    public dialog: MatDialog, 
    public utilSer: UtilityService, 
    public location: Location
  ) { }
  
  ngOnDestroy(): void {
    // cleanup if needed
  }

  ngOnInit(): void {
    let user: any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    console.log('User data:', parsedData);
    this.permissions = this.customerDriverServ.permissions || { editAccess: true, deleteAccess: true, viewAccess: true, createAccess: true };
    console.log('Permissions:', this.permissions);
    this.getAllCustomerDriver();
    this.activeCustomerDriver = this.customerDriverServ.viewCustomerDriverIndex ? this.customerDriverServ.viewCustomerDriverIndex : 0;

  }
  
  clear() {
    this.searchValue = '';
    this.getAllCustomerDriver();
  }
  
  getIndex() {
    for (let i = 0; i < this.customerDriverList.length; i++) {
      if (this.customerDriverList[i].cP_Mapping_ID == this.viewCustomerDriverRecord.cP_Mapping_ID) {
        this.activeCustomerDriver = i
      }
    }
  }
  
  changeCustomerDriverView(record: any, index: any) {
    this.activeCustomerDriver = index
    this.customerDriverServ.viewCustomerDriverIndex = index
    this.viewCustomerDriverRecord = record;
    console.log('changeCustomerDriverView - viewCustomerDriverRecord:', this.viewCustomerDriverRecord);
    this.getCustomerDriverHistory();

  }
  
  getAllCustomerDriver() {
    this.customerDriverServ.getSearchAndSortBy('', this.sortCode, '', this.pageNumber, this.pageSize).then((res: any) => {
      console.log('getAllCustomerDriver response:', res);
      this.totalCustomerDriver = res.totalCount;
      this.totalPages = res.totalCount;
      this.customerDriverList = res.data;
      console.log('customerDriverList:', this.customerDriverList);
      console.log('activeCustomerDriver:', this.activeCustomerDriver);
      this.viewCustomerDriverRecord = this.customerDriverServ.viewDetail ? this.customerDriverServ.viewDetail : this.customerDriverList[this.activeCustomerDriver];
      console.log('viewCustomerDriverRecord after assignment:', this.viewCustomerDriverRecord);
      this.getIndex()
      this.changeCustomerDriverView(this.viewCustomerDriverRecord, this.activeCustomerDriver)
      this.getCustomerDriverHistory();
    })
  }
  
  editCustomerDriver() {
    this.customerDriverServ.editCustomerDriverRecord = this.viewCustomerDriverRecord
    this.routes.navigateByUrl('/home/customerDriver/addCustomerDriver');
    this.customerDriverServ.viewDetail = null;
    this.getAllCustomerDriver();
  }

  getCustomerDriverHistory() {
    this.customerDriverServ.getCustomerDriverHistory(this.viewCustomerDriverRecord.cP_Mapping_ID).then(res => {
      console.log('getCustomerDriverHistory response:', res);
      this.customerDriverHistoryDetails = res;
    })
  }

  back() {
    this.location.back()
  }
  
  onPageChange(event: PageEvent) {
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1;
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.customerDriverServ.getSearchAndSortBy('', this.sortCode, '', this.pageNumber, this.pageSize).then((res: any) => {
      this.totalCustomerDriver = res.totalCount;
      this.totalPages = res.totalCount;
      this.customerDriverList = res.data;
    });
  }
  
  filteredUsersList(event: any) {
    this.searchValue = event.target.value;

    if (event.target.value.length > 1) {
      this.customerDriverServ.getSearchAndSortBy(event.target.value, this.sortCode, '', this.pageNumber, this.pageSize).then((res: any) => {
        this.totalCustomerDriver = res.totalCount;
        this.totalPages = res.totalCount;
        this.customerDriverList = res.data;
      })
    } else {
      this.getAllCustomerDriver();
    }
  }

  deleteCustomerDriver() {

    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '505px',
      height: 'auto',
      data: {
        title: 'Remove Customer Driver',
        message: 'Do you wish to remove the customer driver mapping? All the customer driver data will be deleted and cannot be restored again.',
        value: this.viewCustomerDriverRecord.clientName + ' - ' + this.viewCustomerDriverRecord.driverName,
        placeholder: 'Enter the customer driver name'
      },
      disableClose: true,
      autoFocus: false,
      panelClass: 'deletePopup'
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.customerDriverServ.deleteCustomerDriver(this.viewCustomerDriverRecord.cP_Mapping_ID).then((res: any) => {
          if (res) {
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Customer driver mapping removed successfully.' })
            this.back();
          }
        })
      }
    })

  }

}
