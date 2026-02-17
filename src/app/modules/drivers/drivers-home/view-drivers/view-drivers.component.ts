import { Component, OnDestroy, OnInit } from '@angular/core';
import { DriversService } from '../../drivers.service';
import { Router, Routes } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Location } from '@angular/common';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { UserDeleteComponent } from 'src/app/modules/users/users-home/user-delete/user-delete.component';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { DocumentViewerComponent } from 'src/app/shared/components/document-viewer/document-viewer.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-drivers',
  templateUrl: './view-drivers.component.html',
  styleUrls: ['./view-drivers.component.css']
})

export class ViewDriversComponent implements OnInit, OnDestroy {

  driversList: any | any[] = []
  activeDriver: any
  viewDriversRecord: any | any[] = []
  orderHistoryList: any | any[] = []
  searchValue: any;
  totalDriver:any;
  pageNumber = 1
  length = 200; // Total items
  pageSize = 10; // Items per page
  currentPage = 1; // Default first page
  totalPages = Math.ceil(this.length / this.pageSize); // Total pages
  logedInUser:any;
  permissions:any;

  constructor(public driverServ: DriversService, public routes: Router, public dialog: MatDialog, public utilSer: UtilityService, public location: Location) { }
  ngOnDestroy(): void {
     

    // this.driverServ.editDriverRecord = null
    sessionStorage.clear();

  }

  ngOnInit(): void {
    // this.driversList = this.driverServ.driversList
    let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
    this.permissions = this.driverServ.permissions;
    this.getDriverList();
    this.activeDriver = this.driverServ.viewDriverIndex ? this.driverServ.viewDriverIndex : 0;
    //console.log(this.activeDriver);
    const storedIndex = sessionStorage.getItem('activeDriverIndex');
    this.activeDriver = storedIndex ? JSON.parse(storedIndex) : 0;
  }
  clear() {
    this.searchValue = '';
    this.getDriverList();
  }

  getIndex() {
    for (let i = 0; i < this.driversList.length; i++) {
      if (this.driversList[i].driverID == this.viewDriversRecord.driverID) {
        //console.log(i);
        this.activeDriver = i
        sessionStorage.setItem('activeDriverIndex', JSON.stringify(i)) //index values store in session Storage
      }
    }
  }
    onPageChange(event: PageEvent) {
        //console.log(event);
        this.pageNumber = Number(event.pageIndex) + 1
        this.pageSize = event.pageSize
        this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
        this.totalPages = Math.ceil(event.length / event.pageSize);
        this.driverServ.searchAndSortbyDriver('', 'A to Z', '',this.pageNumber,this.pageSize).then((res: any) => {
          //console.log(res);
          this.totalDriver = res.totalCount;
          this.totalPages = res.totalCount;
          this.driversList = res.data;
        });
      }
  changeDriverView(record: any, index: any) {
    this.activeDriver = index
    this.driverServ.viewDriverIndex = index
    this.viewDriversRecord = record
    //console.log(this.viewDriversRecord);
    this.activeDriver = index;
    sessionStorage.setItem('activeDriverIndex', JSON.stringify(index)); // session was set the values in session storege
    this.getDriverHistory()
  }

  getDriverList() {
    this.driverServ.searchAndSortbyDriver('', 'A to Z', '',this.pageNumber,this.pageSize).then((res: any) => {
      //console.log(res);
      this.totalDriver = res.totalCount;
      this.totalPages = res.totalCount;
      this.driversList = res.data;
      this.viewDriversRecord = this.driverServ.viewDriverId ? this.driverServ.viewDriverId : this.driversList[this.activeDriver];
      this.getIndex()
      this.changeDriverView(this.viewDriversRecord, this.activeDriver);
      this.getDriverHistory()
    })
  }
  editDriver() {
    this.driverServ.editDriverRecord = this.viewDriversRecord
    this.routes.navigateByUrl('/home/drivers/addDrivers');
    this.driverServ.viewDriverId = null;
    this.getDriverList();
  }

  back() {
    this.location.back()

  }

  filteredUsersList(event: any) {
    //console.log(event.target.value);
    this.searchValue = event.target.value;

    if (event.target.value.length > 1) {
      this.activeDriver = 0;
      this.driverServ.searchAndSortbyDriver(event.target.value, "", "",this.pageNumber,this.pageSize).then((res: any) => {
        //console.log(res);
        this.totalDriver = res.totalCount;
        this.totalPages = res.totalCount;
        this.driversList = res.data;
        this.viewDriversRecord = this.driversList[this.activeDriver];
      });
    } else {
      this.getDriverList();
    }
  }


  activeStatus() {
    this.driverServ.markAsActive(this.viewDriversRecord?.driverID).then(res => {
      //console.log(res);
      if (res) {
        if (res.isActive) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Driver marked as active.' })
          this.getDriverList();
        } else if (!res.isActive) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Driver marked as inactive.' })
          this.getDriverList();
        }
      }
      else {
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Something went wrong!' })
      }
    })
  }


  deleteDriver() {
    //console.log(this.activeDriver);

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
    //     this.driverServ.driversList.splice(this.activeDriver, 1);
    //     // this.router.navigateByUrl('/home/users/list')
    //     this.back()
    //     this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Driver deleted successfully.' })
    //   }
    // })
    //console.log(this.driverServ?.viewDriverId?.driverID);

    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '505px',
      height: 'auto',
      data: {
        title: 'Remove Driver',
        message: 'Do you wish to remove the driver? All the Driver data will be deleted and cannot be restored again.',
        value: this.viewDriversRecord.email,
        placeholder: 'Enter the driver email'
      },
      disableClose: true,
      autoFocus: false,
      panelClass: 'deletePopup'
    })
    dialogRef.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        this.driverServ.removeDriver(this.viewDriversRecord?.driverID).then((res: any) => {
          if (res) {
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Driver removed successfully.' })
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
    //      this.driverServ.usersList.splice(this.viewDriversRecord,1)
    //      this.utilServ.toaster.next({ type: customToaster.successToast, message: 'User deleted successfully' });
    //      this.back()
    //    }
    //  })
  }
  resendInvitation() {
    this.driverServ.resendEmail(this.viewDriversRecord.email).then(res => {
      if (res) {
        this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Invitation resent successfully.' })
      }
    })

  }

  getDriverHistory() {
    this.driverServ.getOrderHistory(this.viewDriversRecord.driverID).then(res => {
      //console.log(res);
      this.orderHistoryList = res;
    })
  }
  viewFile(file: any) {
    var dailogRef = this.dialog.open(DocumentViewerComponent, {
      width: '580px',
      height: 'auto',
      maxHeight: '440px',
      data: file,
      disableClose: true,
      autoFocus: false,
      panelClass: 'document-viewer'
    })
  }

  deleteFile(file: any) {

  }
}
