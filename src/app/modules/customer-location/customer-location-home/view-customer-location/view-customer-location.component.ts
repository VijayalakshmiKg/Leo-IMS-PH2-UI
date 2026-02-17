import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerLocationService } from '../../customer-location.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { Location } from '@angular/common';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-customer-location',
  templateUrl: './view-customer-location.component.html',
  styleUrls: ['./view-customer-location.component.css']
})
export class ViewCustomerLocationComponent implements OnInit {
  customerLocationList: any | any[] = []
  activeCustomerLocation: any
  viewCustomerLocationRecord: any | any[] = [];
  searchValue: any;
  customerLocationHistoryDetails: any;
  pageNumber = 1
  length = 200;
  pageSize = 10;
  currentPage = 1;
  totalPages = Math.ceil(this.length / this.pageSize);
  sortList: any[] = [];
  sortCode: any = 'Newest to Oldest date';
  totalCustomerLocation: any;
  logedInUser: any
  permissions: any;
  
  constructor(
    public customerLocationServ: CustomerLocationService, 
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
    this.permissions = this.customerLocationServ.permissions || { editAccess: true, deleteAccess: true, viewAccess: true, createAccess: true };
    console.log('Permissions:', this.permissions);
    this.getAllCustomerLocation();
    this.activeCustomerLocation = this.customerLocationServ.viewCustomerLocationIndex ? this.customerLocationServ.viewCustomerLocationIndex : 0;

  }
  
  clear() {
    this.searchValue = '';
    this.getAllCustomerLocation();
  }
  
  getIndex() {
    for (let i = 0; i < this.customerLocationList.length; i++) {
      if (this.customerLocationList[i].cP_Mapping_ID == this.viewCustomerLocationRecord.cP_Mapping_ID) {
        this.activeCustomerLocation = i
      }
    }
  }
  
  changeCustomerLocationView(record: any, index: any) {
    this.activeCustomerLocation = index
    this.customerLocationServ.viewCustomerLocationIndex = index
    this.viewCustomerLocationRecord = record;
    console.log('changeCustomerLocationView - viewCustomerLocationRecord:', this.viewCustomerLocationRecord);
    this.getCustomerLocationHistory();

  }
  
  getAllCustomerLocation() {
    this.customerLocationServ.getSearchAndSortBy('', this.sortCode, '', this.pageNumber, this.pageSize).then((res: any) => {
      console.log('getAllCustomerLocation response:', res);
      this.totalCustomerLocation = res.totalCount;
      this.totalPages = res.totalCount;
      this.customerLocationList = res.data;
      console.log('customerLocationList:', this.customerLocationList);
      console.log('activeCustomerLocation:', this.activeCustomerLocation);
      this.viewCustomerLocationRecord = this.customerLocationServ.viewDetail ? this.customerLocationServ.viewDetail : this.customerLocationList[this.activeCustomerLocation];
      console.log('viewCustomerLocationRecord after assignment:', this.viewCustomerLocationRecord);
      this.getIndex()
      this.changeCustomerLocationView(this.viewCustomerLocationRecord, this.activeCustomerLocation)
      this.getCustomerLocationHistory();
    })
  }
  
  editCustomerLocation() {
    this.customerLocationServ.editCustomerLocationRecord = this.viewCustomerLocationRecord
    this.routes.navigateByUrl('/home/customerLocation/addCustomerLocation');
    this.customerLocationServ.viewDetail = null;
    this.getAllCustomerLocation();
  }

  getCustomerLocationHistory() {
    this.customerLocationServ.getCustomerLocationHistory(this.viewCustomerLocationRecord.cP_Mapping_ID).then(res => {
      console.log('getCustomerLocationHistory response:', res);
      this.customerLocationHistoryDetails = res;
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
    this.customerLocationServ.getSearchAndSortBy('', this.sortCode, '', this.pageNumber, this.pageSize).then((res: any) => {
      this.totalCustomerLocation = res.totalCount;
      this.totalPages = res.totalCount;
      this.customerLocationList = res.data;
    });
  }
  
  filteredUsersList(event: any) {
    this.searchValue = event.target.value;

    if (event.target.value.length > 1) {
      this.customerLocationServ.getSearchAndSortBy(event.target.value, this.sortCode, '', this.pageNumber, this.pageSize).then((res: any) => {
        this.totalCustomerLocation = res.totalCount;
        this.totalPages = res.totalCount;
        this.customerLocationList = res.data;
      })
    } else {
      this.getAllCustomerLocation();
    }
  }

  deleteCustomerLocation() {

    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '505px',
      height: 'auto',
      data: {
        title: 'Remove Customer Location',
        message: 'Do you wish to remove the customer location mapping? All the customer location data will be deleted and cannot be restored again.',
        value: this.viewCustomerLocationRecord.clientName + ' - ' + this.viewCustomerLocationRecord.locationName,
        placeholder: 'Enter the customer location name'
      },
      disableClose: true,
      autoFocus: false,
      panelClass: 'deletePopup'
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.customerLocationServ.deleteCustomerLocation(this.viewCustomerLocationRecord.cP_Mapping_ID).then((res: any) => {
          if (res) {
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Customer location mapping removed successfully.' })
            this.back();
          }
        })
      }
    })

  }

}
