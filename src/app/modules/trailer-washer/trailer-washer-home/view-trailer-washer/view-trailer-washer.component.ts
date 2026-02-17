import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TrailerWasherService } from '../../trailer-washer.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-trailer-washer',
  templateUrl: './view-trailer-washer.component.html',
  styleUrls: ['./view-trailer-washer.component.css']
})
export class ViewTrailerWasherComponent implements OnInit {

  trailerWashersList: any | any[] = []
  activeWasher: any
  viewTrailerWashersRecord: any | any[] = [];
  searchValue: any;
  pageNumber = 1
  length = 200; // Total items
  pageSize = 10; // Items per page
  currentPage = 1; // Default first page
  totalPages = Math.ceil(this.length / this.pageSize); // Total pages
  sortCode:any = 'A to Z';
  sortList: any[] = [];
  logedInUser:any
  permissions: any;
  constructor(public trailerWasherServ: TrailerWasherService, public routes: Router, public dialog: MatDialog, public utilSer: UtilityService, public location: Location) { }
  ngOnDestroy(): void {
    // this.trailerWasherServ.editTrailerWasherRecord = null
  }

  ngOnInit(): void {
     let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
    this.permissions = this.trailerWasherServ.permissions;
    this.getSortList();
    this.getWasherList();
    this.activeWasher = this.trailerWasherServ.viewTrailerWasherIndex ? this.trailerWasherServ.viewTrailerWasherIndex : 0;
    //console.log(this.activeWasher);
    //console.log(this.viewTrailerWashersRecord);
  }
  clear() {
    this.searchValue = '';
    this.getWasherList();
  }
  getIndex() {
    for (let i = 0; i < this.trailerWashersList.length; i++) {
      if (this.trailerWashersList[i].trailerWasherId == this.viewTrailerWashersRecord.trailerWasherId) {
        // //console.log(i);
        this.activeWasher = i
      }
    }
  }
  getSortList() {
    this.trailerWasherServ.getSortLits().then(res=>{
      //console.log(res);
      this.sortList = res
        })
  }
  changeWasherView(record: any, index: any) {
    this.activeWasher = index
    this.trailerWasherServ.viewTrailerWasherIndex = index;
    this.viewTrailerWashersRecord = record
    //console.log(this.viewTrailerWashersRecord);
    this.getWasherHistory()
  }
     onPageChange(event: PageEvent) {
      //console.log(event);
      this.pageNumber = Number(event.pageIndex) + 1
      this.pageSize = event.pageSize
      this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
      this.totalPages = Math.ceil(event.length / event.pageSize);
      this.trailerWasherServ.searchAndSortbyWasher('',this.sortCode,this.pageNumber,this.pageSize).then((res: any) => {
        //console.log(res);
        this.trailerWashersList = res.data;
      });
    }
  getWasherList() {
    this.trailerWasherServ.searchAndSortbyWasher('',this.sortCode,this.pageNumber,this.pageSize).then((res: any) => {
      //console.log(res);
      this.trailerWashersList = res.data;
      this.viewTrailerWashersRecord = this.trailerWasherServ.viewWasherId ? this.trailerWasherServ.viewWasherId : this.trailerWashersList[this.activeWasher];
      this.getIndex()
      this.changeWasherView(this.viewTrailerWashersRecord, this.activeWasher);
      this.getWasherHistory()
    })
  }
  getWasherHistory() {
    this.trailerWasherServ.getWasherHistory(this.viewTrailerWashersRecord?.trailerWasherId).then(res => {
      //console.log(res);
    })
  }
  editWasher() {
    this.trailerWasherServ.editTrailerWasherRecord = this.viewTrailerWashersRecord
    this.routes.navigateByUrl('/home/trailerWashers/addTrailerWashers');
    this.trailerWasherServ.viewWasherId = null;
    this.getWasherList();
  }

  back() {
    this.location.back()
  }

  filteredUsersList(event: any) {
    //console.log(event.target.value);
    this.searchValue = event.target.value;
    if (event.target.value.length > 1) {
      this.activeWasher = 0;
      this.trailerWasherServ.searchAndSortbyWasher(event.target.value, this.sortCode,this.pageNumber,this.pageSize).then((res: any) => {
        //console.log(res);
        this.trailerWashersList = res.data;
        this.viewTrailerWashersRecord = this.trailerWashersList[this.activeWasher];
      });
    } else {
      this.getWasherList();
    }
  }

  activeStatus() {
    this.trailerWasherServ.markStatus(this.viewTrailerWashersRecord?.trailerWasherId).then(res => {
      //console.log(res);
      if (res) {
        if (res.isActive) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Trailer washer marked as active.' })
          this.getWasherList();
        } else if (!res.isActive) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Trailer washer marked as inactive.' })
          this.getWasherList();
        }
      }
      else {
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Something went wrong!' })
      }
    })
  }

  deleteWasher() {
    //console.log(this.activeWasher);

    // let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
    //   width: '480px',
    //   height: 'auto',
    //   data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this driver ?', title: 'Are you sure?' },
    //   disableClose: true,
    //   autoFocus: false,
    //   panelClass: 'custom-msg-box'
    // })
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.trailerWasherServ.trailerWashersList.splice(this.activeWasher, 1);
    //     // this.router.navigateByUrl('/home/users/list')
    //     this.back()
    //     this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Washer deleted successfully.' })
    //   }
    // })
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '505px',
      height: 'auto',
      data: {
        title: 'Remove Washer',
        message: 'Do you wish to remove the trailer washer? All the Washer data will be deleted and cannot be restored again.',
        value: this.viewTrailerWashersRecord.email,
        placeholder: 'Enter the trailer washer email'
      },
      disableClose: true,
      autoFocus: false,
      panelClass: 'deletePopup'
    })
    dialogRef.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        this.trailerWasherServ.trailerWasherRemove(this.viewTrailerWashersRecord?.trailerWasherId).then((res: any) => {
          if (res) {
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Trailer washer removed successfully.' })
            this.back()
          }
        })
      }
    })
  }


  userDelete() {
    // var dis = this.dialog.open(UserDeleteComponent,{
    //    panelClass:'userDelete-cls',
    //    width:'400px'
    //  })

    //  dis.afterClosed().subscribe(res => {
    //    //console.log(res);
    //    if(res){
    //      this.trailerWasherServ.usersList.splice(this.viewTrailerWashersRecord,1)
    //      this.utilServ.toaster.next({ type: customToaster.successToast, message: 'User deleted successfully' });
    //      this.back()
    //    }
    //  })
  }
  resendInvitation() {
    this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Invitation resent successfully.' })
  }

}
