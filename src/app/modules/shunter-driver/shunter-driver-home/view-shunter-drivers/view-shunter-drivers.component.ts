import { Component, OnInit } from '@angular/core';
import { ShunterDriverService } from '../../shunter-driver.service';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DocumentViewerComponent } from 'src/app/shared/components/document-viewer/document-viewer.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-shunter-drivers',
  templateUrl: './view-shunter-drivers.component.html',
  styleUrls: ['./view-shunter-drivers.component.css']
})
export class ViewShunterDriversComponent implements OnInit {

  shunterDriversList: any | any[] = []
  activeDriver: any
  viewShuntDriversRecord: any | any[] = [];
  searchValue: any;
  status = '';
  shunterHistory: any;
  pageNumber = 1
  length = 200; // Total items
  pageSize = 10; // Items per page
  currentPage = 1; // Default first page
  totalPages = Math.ceil(this.length / this.pageSize); // Total pages
  sortCode:any = 'A to Z';
  sortList: any[] = [];
  logedInUser:any
  permissions: any;

  constructor(public shuntDriverServ: ShunterDriverService, public routes: Router, public dialog: MatDialog, public utilSer: UtilityService, public location: Location) { }
  ngOnDestroy(): void {
    // this.shuntDriverServ.editShunDriverRecord = null
  }

  ngOnInit(): void {
     let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
    this.permissions = this.shuntDriverServ.permissions;
    this.getSortList();
    this.getDriverList();
    this.activeDriver = this.shuntDriverServ.viewShuntDriverIndex ? this.shuntDriverServ.viewShuntDriverIndex : 0;
    //console.log(this.activeDriver);
  }
  clear() {
    this.searchValue = '';
    this.getDriverList();
  }
  getIndex() {
    for (let i = 0; i < this.shunterDriversList.length; i++) {
      if (this.shunterDriversList[i].shunterDriverID == this.viewShuntDriversRecord.shunterDriverID) {
        // //console.log(i);
        this.activeDriver = i
      }
    }
  }
  changeDriverView(record: any, index: any) {
    this.activeDriver = index
    this.shuntDriverServ.viewShuntDriverIndex = index;
    this.viewShuntDriversRecord = record
    //console.log(this.viewShuntDriversRecord);
    this.shunterDochistory();
  }
  sortByValue(event: any) {
    this.sortCode = event;
    this.shuntDriverServ.searchAndSortbyDriver('',this.sortCode, '',this.pageNumber,this.pageSize).then((res: any) => {
      //console.log(res);
      this.shunterDriversList = res.data;
    });
  }
  onPageChange(event: PageEvent) {
    //console.log(event);
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.shuntDriverServ.searchAndSortbyDriver('',this.sortCode, '',this.pageNumber,this.pageSize).then((res: any) => {
      //console.log(res);
      this.shunterDriversList = res.data;
    });
  }
  getDriverList() {
    this.shuntDriverServ.searchAndSortbyDriver('', 'A to Z', '',this.pageNumber,this.pageSize).then((res: any) => {
      //console.log(res);
      this.shunterDriversList = res.data;
      this.viewShuntDriversRecord = this.shuntDriverServ.viewDriverId ? this.shuntDriverServ.viewDriverId : this.shunterDriversList[this.activeDriver];
      this.getIndex()
      this.changeDriverView(this.viewShuntDriversRecord, this.activeDriver);
      this.shunterDochistory();
    })
  }
  getSortList() {
    this.shuntDriverServ.getSortLits().then(res=>{
      //console.log(res);
      this.sortList = res
        })
  }
  shunterDochistory() {
    this.shuntDriverServ.shunterHistory(this.viewShuntDriversRecord.shunterDriverID).then(res => {
      //console.log(res);
      this.shunterHistory = res;

    })
  }
  editDriver() {
    this.shuntDriverServ.editShunDriverRecord = this.viewShuntDriversRecord
    this.routes.navigateByUrl('/home/shunterDrivers/addShunterDrivers');
    this.shuntDriverServ.viewDriverId = null;
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
      this.shuntDriverServ.searchAndSortbyDriver(event.target.value, this.sortCode, this.status,this.pageNumber,this.pageSize).then((res: any) => {
        //console.log(res);
        this.shunterDriversList = res.data;
        this.viewShuntDriversRecord = this.shunterDriversList[this.activeDriver];
      });
    } else {
      this.getDriverList();
    }
  }

  activeStatus() {
    this.shuntDriverServ.activeShunterstatus(this.viewShuntDriversRecord?.shunterDriverID).then(res => {
      //console.log(res);
      if (res) {
        if (res.isActive) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Shunter driver marked as active.' })
          this.getDriverList();
        } else if (!res.isActive) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Shunter driver marked as inactive.' })
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
    //     this.shuntDriverServ.shunterDriversList.splice(this.activeDriver, 1);
    //     // this.router.navigateByUrl('/home/users/list')
    //     this.back()
    //     this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Driver deleted successfully.' })
    //   }
    // })
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '505px',
      height: 'auto',
      data: {
        title: 'Remove Driver',
        message: 'Do you wish to remove the driver? All the Driver data will be deleted and cannot be restored again.',
        value: this.viewShuntDriversRecord.email,
        placeholder: 'Enter the driver email'
      },
      disableClose: true,
      autoFocus: false,
      panelClass: 'deletePopup'
    })
    dialogRef.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        this.shuntDriverServ.removeShunterDriver(this.viewShuntDriversRecord?.shunterDriverID).then((res: any) => {
          if (res) {
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Shunter driver removed successfully.' })
            this.back()
          }
        })
      }
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

  userDelete() {
    // var dis = this.dialog.open(UserDeleteComponent,{
    //    panelClass:'userDelete-cls',
    //    width:'400px'
    //  })

    //  dis.afterClosed().subscribe(res => {
    //    //console.log(res);
    //    if(res){
    //      this.shuntDriverServ.usersList.splice(this.viewShuntDriversRecord,1)
    //      this.utilServ.toaster.next({ type: customToaster.successToast, message: 'User deleted successfully' });
    //      this.back()
    //    }
    //  })
  }
  resendInvitation() {
    this.shuntDriverServ.resendEmail(this.viewShuntDriversRecord.email).then(res => {
      if (res) {
        this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Invitation resent successfully.' })
      }
    })

  }
}
