import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatusService } from '../../status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { Location } from '@angular/common';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-status',
  templateUrl: './view-status.component.html',
  styleUrls: ['./view-status.component.css']
})
export class ViewStatusComponent implements OnInit {
  statusList: any | any[] = []
  activeStatus: any
  viewStatusRecord: any | any[] = [];
  searchValue: any;
  statusHistoryDetails: any;
  pageNumber = 1
  length = 200; // Total items
  pageSize = 10; // Items per page
  currentPage = 1; // Default first page
  totalPages = Math.ceil(this.length / this.pageSize); // Total pages
  sortList: any[] = [];
  sortCode: any = 'Newest to Oldest date';
  totalStatus: any;
  logedInUser: any
  permissions: any;
  constructor(public statusServ: StatusService, public routes: Router, public dialog: MatDialog, public utilSer: UtilityService, public location: Location) { }
  ngOnDestroy(): void {
    // this.statusServ.editStatusRecord = null
  }

  ngOnInit(): void {
    let user: any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    console.log('User data:', parsedData);
    this.permissions = this.statusServ.permissions || { editAccess: true, deleteAccess: true };
    console.log('Permissions:', this.permissions);
    this.getAllStatus();
    this.activeStatus = this.statusServ.viewStatusIndex ? this.statusServ.viewStatusIndex : 0;

  }
  clear() {
    this.searchValue = '';
    this.getAllStatus();
  }
  getIndex() {
    for (let i = 0; i < this.statusList.length; i++) {
      if (this.statusList[i].statusID == this.viewStatusRecord.statusID) {
        //console.log(i);
        this.activeStatus = i
      }
    }
  }
  changeStatusView(record: any, index: any) {
    this.activeStatus = index
    this.statusServ.viewStatusIndex = index
    this.viewStatusRecord = record;
    console.log('changeStatusView - viewStatusRecord:', this.viewStatusRecord);
    this.getStatusHistory();

  }
  getAllStatus() {
    this.statusServ.getSearchAndSortBy('', this.sortCode, '', this.pageSize, this.pageNumber).then((res: any) => {
      console.log('getAllStatus response:', res);
      this.totalStatus = res.totalCount;
      this.totalPages = res.totalCount;
      this.statusList = res.data;
      console.log('statusList:', this.statusList);
      console.log('activeStatus:', this.activeStatus);
      this.viewStatusRecord = this.statusServ.viewStatusId ? this.statusServ.viewStatusId : this.statusList[this.activeStatus];
      console.log('viewStatusRecord after assignment:', this.viewStatusRecord);
      this.getIndex()
      this.changeStatusView(this.viewStatusRecord, this.activeStatus)
      this.getStatusHistory();
    })
  }
  editStatus() {
    this.statusServ.editStatusRecord = this.viewStatusRecord
    this.routes.navigateByUrl('/home/status/addStatus');
    this.statusServ.viewStatusId = null;
    this.getAllStatus();
  }

  getStatusHistory() {
    this.statusServ.getStatusHistory(this.viewStatusRecord.statusID).then(res => {
      console.log('getStatusHistory response:', res);
      this.statusHistoryDetails = res;
    })
  }

  back() {
    this.location.back()
  }
  onPageChange(event: PageEvent) {
    //console.log(event);
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.statusServ.getSearchAndSortBy('', this.sortCode, '', this.pageNumber, this.pageSize).then((res: any) => {
      //console.log(res);
      this.totalStatus = res.totalCount;
      this.totalPages = res.totalCount;
      this.statusList = res.data;
    });
  }
  filteredUsersList(event: any) {
    this.searchValue = event.target.value;

    //console.log(event.target.value);
    if (event.target.value.length > 1) {
      this.statusServ.getSearchAndSortBy(event.target.value, this.sortCode, '', this.pageNumber, this.pageSize).then((res: any) => {
        //console.log(res);
        this.totalStatus = res.totalCount;
        this.totalPages = res.totalCount;
        this.statusList = res.data;
      })
    } else {
      this.getAllStatus();
    }
  }

  deleteStatus() {

    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '505px',
      height: 'auto',
      data: {
        title: 'Remove Status',
        message: 'Do you wish to remove the status? All the Status data will be deleted and cannot be restored again.',
        value: this.viewStatusRecord.statusName,
        placeholder: 'Enter the status name'
      },
      disableClose: true,
      autoFocus: false,
      panelClass: 'deletePopup'
    })
    dialogRef.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        this.statusServ.deleteStatus(this.viewStatusRecord.statusID).then((res: any) => {
          if (res) {
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Status removed successfully.' })
            this.back();
          }
        })
      }
    })

  }

}
