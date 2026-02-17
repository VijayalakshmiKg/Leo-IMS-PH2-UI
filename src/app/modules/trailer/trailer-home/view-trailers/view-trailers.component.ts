import { Component, OnInit } from '@angular/core';
import { TrailerService } from '../../trailer.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Location } from '@angular/common';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-trailers',
  templateUrl: './view-trailers.component.html',
  styleUrls: ['./view-trailers.component.css']
})
export class ViewTrailersComponent implements OnInit {
  trailersList: any | any[] = []
  activeTrailers: any
  viewTrailersRecord: any | any[] = []
  searchValue: any;
  trailerHistoryDetails:any;
  pageNumber = 1
  length = 200; // Total items
  pageSize = 10; // Items per page
  currentPage = 1; // Default first page
  totalPages = Math.ceil(this.length / this.pageSize); // Total pages
  sortList: any[] = [];
  sortCode:any = 'Newest to Oldest date';
  totalTrailer:any;
  logedInUser:any
  permissions: any;
  constructor(public TrailersServ: TrailerService, public routes: Router, public dialog: MatDialog, public utilSer: UtilityService, public location: Location) { }
  ngOnDestroy(): void {
    // this.TrailersServ.editTrailersRecord = null
  }

  ngOnInit(): void {
     let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
    this.permissions = this.TrailersServ.permissions;
    this.getAllTrailer();
    this.activeTrailers = this.TrailersServ.viewTrailerIndex ? this.TrailersServ.viewTrailerIndex : 0;

  }
  clear() {
    this.searchValue = '';
    this.getAllTrailer();
  }
  getIndex() {
    for (let i = 0; i < this.trailersList.length; i++) {
      if (this.trailersList[i].trailerID == this.viewTrailersRecord.trailerID) {
        //console.log(i);
        this.activeTrailers = i
      }
    }
  }
  changetrailersView(record: any, index: any) {
    this.activeTrailers = index
    this.TrailersServ.viewTrailerIndex = index
    this.viewTrailersRecord = record;
    //console.log(this.viewTrailersRecord);
    this.trailerHistory();

  }
  getAllTrailer() {
    this.TrailersServ.getSearchAndSortedBy('',this.sortCode,'',this.pageNumber,this.pageSize).then((res: any) => {
      //console.log(res);
      this.totalTrailer = res.totalCount;
      this.totalPages = res.totalCount;
      this.trailersList = res.data;
      this.activeTrailers = this.TrailersServ.viewTrailerIndex;
      this.viewTrailersRecord = this.TrailersServ.viewTrailer ? this.TrailersServ.viewTrailer : this.trailersList[this.activeTrailers];
      this.getIndex()
      this.changetrailersView(this.viewTrailersRecord, this.activeTrailers)
      this.trailerHistory();
    })
  }
  editTrailers() {
    this.TrailersServ.editTrailerRecord = this.viewTrailersRecord
    this.routes.navigateByUrl('/home/trailer/addTrailer');
    this.TrailersServ.viewTrailer = null;
    this.getAllTrailer();
  }

  trailerHistory() {
    this.TrailersServ.getTrailerHistory(this.viewTrailersRecord.trailerID).then(res => {
      //console.log(res);
      this.trailerHistoryDetails = res;
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
          this.TrailersServ.getSearchAndSortedBy('',this.sortCode,'',this.pageNumber,this.pageSize).then((res: any) => {
            //console.log(res);
            this.totalTrailer = res.totalCount;
            this.totalPages = res.totalCount;
            this.trailersList = res.data;
          });
        }
  filteredUsersList(event: any) {
    this.searchValue = event.target.value;

    //console.log(event.target.value);
    if (event.target.value.length > 1) {
      this.activeTrailers = 0;
      this.TrailersServ.getSearchAndSortedBy(event.target.value, this.sortCode, '',this.pageNumber,this.pageSize).then((res: any) => {
        //console.log(res);
        this.totalTrailer = res.totalCount;
        this.totalPages = res.totalCount;
        this.trailersList = res.data;
        this.viewTrailersRecord = this.trailersList[this.activeTrailers];
      });
    } else {
      this.getAllTrailer();
    }
  }

  deleteTrailers() {

    // let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
    //   width: '480px',
    //   height: 'auto',
    //   data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this trailer ?', title: 'Are you sure?' },
    //   disableClose: true,
    //   autoFocus: false,
    //   panelClass: 'custom-msg-box'
    // })
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.TrailersServ.TrailersList.splice(this.viewTrailersRecord.viewUserId, 1);

    //     // this.router.navigateByUrl('/home/users/list')
    //     this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Trailer deleted successfully.' })
    //     this.back()
    //   }
    // })
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '505px',
      height: 'auto',
      data: {
        title: 'Remove Trailer',
        message: 'Do you wish to remove the trailer? All the Trailer data will be deleted and cannot be restored again.',
        value: this.viewTrailersRecord.trailerNumber,
        placeholder: 'Enter the trailer number'
      },
      disableClose: true,
      autoFocus: false,
      panelClass: 'deletePopup'
    })
    dialogRef.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        // this.TrailersServ.TrailersList.splice(this.viewTrailersRecord.viewUserId, 1); // delete Your record
        this.TrailersServ.deleteTrailerById(this.viewTrailersRecord.trailerID).then((res: any) => {
          if (res) {
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Trailer removed successfully.' })
            this.back();
          }
        })
      }
    })

  }

}
