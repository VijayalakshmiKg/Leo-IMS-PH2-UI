import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { LocationService } from '../../location.service';
import { Location } from '@angular/common';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-location',
  templateUrl: './view-location.component.html',
  styleUrls: ['./view-location.component.css']
})
export class ViewLocationComponent implements OnInit {

  LocationsList: any | any[] = []
  activeLocation: any
  viewLocationRecord: any | any[] = [];
  searchValue: any;
  locationHistorydetails: any;
  pageNumber = 1
  length = 200;
  pageSize = 10;
  currentPage = 1;
  totalPages = Math.ceil(this.length / this.pageSize);
  sortList: any[] = [];
  sortCode: any = 'Newest to Oldest date';
  totalLocation: any;
  logedInUser: any
  permissions: any;

  constructor(
    public locationServ: LocationService, 
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
    this.permissions = this.locationServ.permissions || { editAccess: true, deleteAccess: true }; 
    this.getAllLocations();
    this.activeLocation = this.locationServ.viewLocationIndex ? this.locationServ.viewLocationIndex : 0;
  }

  clear() {
    this.searchValue = '';
    this.getAllLocations();
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1;
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.locationServ.getSearchAndSortBy('', this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
      this.totalLocation = res.totalCount;
      this.totalPages = res.totalCount;
      this.LocationsList = res.data;
    });
  }

  getIndex() {
    for (let i = 0; i < this.LocationsList?.length; i++) {
      if (this.LocationsList[i].locationID == this.viewLocationRecord.locationID) {
        this.activeLocation = i
      }
    }
  }

  changeLocationView(record: any, index: any) {
    this.activeLocation = index
    this.locationServ.viewLocationIndex = index
    this.viewLocationRecord = record;
    this.locationHistory();
  }

  getAllLocations() {
    this.locationServ.getSearchAndSortBy("", this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
      this.totalLocation = res.totalCount;
      this.totalPages = res.totalCount;
      this.LocationsList = res.data;
      this.viewLocationRecord = this.locationServ.viewDetail ? this.locationServ.viewDetail : this.LocationsList[this.activeLocation];
      this.getIndex()
      this.changeLocationView(this.viewLocationRecord, this.activeLocation)
      this.locationHistory();
    }).catch(err => {
      console.error('Error loading locations:', err);
    })
  }

  editLocation() {
    this.locationServ.editLocationRecord = this.viewLocationRecord
    this.routes.navigateByUrl('/home/location/addLocation')
    this.locationServ.viewDetail = null;
    this.getAllLocations();
  }

  locationHistory() {
    if (this.viewLocationRecord?.locationID) {
      this.locationServ.getLocationHistory(this.viewLocationRecord.locationID).then(res => {
        this.locationHistorydetails = res;
      }).catch(err => {
        console.error('Error loading location history:', err);
        this.locationHistorydetails = [];
      })
    }
  }

  deleteLocation() {
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '480px',
      height: 'auto',
      data: { message: 'Are you sure want to delete the location?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.locationServ.deleteLocation(this.viewLocationRecord.locationID).then((res: any) => {
          if (res) {
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Location deleted successfully.' });
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
      this.locationServ.getSearchAndSortBy(event.target.value, this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
        this.totalLocation = res.totalCount;
        this.totalPages = res.totalCount;
        this.LocationsList = res.data;
      })
    } else {
      this.getAllLocations();
    }
  }

}
