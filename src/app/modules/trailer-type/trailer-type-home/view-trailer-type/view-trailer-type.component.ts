import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TrailerTypeService } from '../../trailer-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MatDialog } from '@angular/material/dialog';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { Router } from '@angular/router';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-trailer-type',
  templateUrl: './view-trailer-type.component.html',
  styleUrls: ['./view-trailer-type.component.css']
})
export class ViewTrailerTypeComponent implements OnInit {

  TrailerTypesList: any | any[] = []
  activeTrailerType: any
  viewTrailerTypeRecord: any | any[] = [];
  searchValue: any;
  trailerTypeHistorydetails: any;
  pageNumber = 1
  length = 200;
  pageSize = 10;
  currentPage = 1;
  totalPages = Math.ceil(this.length / this.pageSize);
  sortList: any[] = [];
  sortCode: any = 'Newest to Oldest date';
  totalTrailerType: any;
  logedInUser: any
  permissions: any;

  constructor(
    public trailerTypeServ: TrailerTypeService,
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
    this.permissions = this.trailerTypeServ.permissions || { editAccess: true, deleteAccess: true };
    this.getAllTrailerTypes();
    this.activeTrailerType = this.trailerTypeServ.viewTrailerTypeIndex ? this.trailerTypeServ.viewTrailerTypeIndex : 0;
  }

  clear() {
    this.searchValue = '';
    this.getAllTrailerTypes();
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1;
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.trailerTypeServ.getSearchAndSortBy(this.searchValue || '', this.sortCode, '', this.pageNumber, this.pageSize).then((res: any) => {
      this.totalTrailerType = res.totalCount;
      this.totalPages = res.totalCount;
      this.TrailerTypesList = res.data;
    });
  }

  getIndex() {
    for (let i = 0; i < this.TrailerTypesList?.length; i++) {
      if (this.TrailerTypesList[i].trailerTypeID == this.viewTrailerTypeRecord.trailerTypeID) {
        this.activeTrailerType = i
      }
    }
  }

  changeTrailerTypeView(record: any, index: any) {
    this.activeTrailerType = index
    this.trailerTypeServ.viewTrailerTypeIndex = index
    this.viewTrailerTypeRecord = record;
    this.trailerTypeHistory();
  }

  getAllTrailerTypes() {
    this.trailerTypeServ.getSearchAndSortBy("", this.sortCode, '', this.pageNumber, this.pageSize).then((res: any) => {
      this.totalTrailerType = res.totalCount;
      this.totalPages = res.totalCount;
      this.TrailerTypesList = res.data;
      this.viewTrailerTypeRecord = this.trailerTypeServ.viewDetail ? this.trailerTypeServ.viewDetail : this.TrailerTypesList[this.activeTrailerType];
      this.getIndex()
      this.changeTrailerTypeView(this.viewTrailerTypeRecord, this.activeTrailerType)
      this.trailerTypeHistory();
    }).catch(err => {
      console.error('Error loading trailer types:', err);
    })
  }

  editTrailerType() {
    this.trailerTypeServ.editTrailerTypeRecord = this.viewTrailerTypeRecord
    this.routes.navigateByUrl('/home/trailerType/addTrailerType')
    this.trailerTypeServ.viewDetail = null;
  }

  trailerTypeHistory() {
    if (this.viewTrailerTypeRecord?.trailerTypeID) {
      this.trailerTypeServ.getTrailerTypeHistory(this.viewTrailerTypeRecord.trailerTypeID).then(res => {
        this.trailerTypeHistorydetails = res;
      }).catch(err => {
        console.error('Error loading trailer type history:', err);
        this.trailerTypeHistorydetails = [];
      })
    }
  }

  deleteTrailerType() {
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '480px',
      height: 'auto',
      data: { message: 'Are you sure want to delete this trailer type?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.trailerTypeServ.deleteTrailerType(this.viewTrailerTypeRecord.trailerTypeID).then((res: any) => {
          if (res) {
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Trailer type deleted successfully.' });
            this.location.back();
          }
        }).catch((err: any) => {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Failed to delete trailer type.' });
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
      this.activeTrailerType = 0;
      this.trailerTypeServ.getSearchAndSortBy(event.target.value, this.sortCode, '', this.pageNumber, this.pageSize).then((res: any) => {
        this.totalTrailerType = res.totalCount;
        this.totalPages = res.totalCount;
        this.TrailerTypesList = res.data;
        this.viewTrailerTypeRecord = this.TrailerTypesList[this.activeTrailerType];
      })
    } else {
      this.getAllTrailerTypes();
    }
  }

}
