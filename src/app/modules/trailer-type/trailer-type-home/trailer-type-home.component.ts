import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrailerTypeService } from '../trailer-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PageEvent } from '@angular/material/paginator';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';

@Component({
  selector: 'app-trailer-type-home',
  templateUrl: './trailer-type-home.component.html',
  styleUrls: ['./trailer-type-home.component.css']
})
export class TrailerTypeHomeComponent implements OnInit {

  TrailerTypesList: any | any[] = []
  sortList: any[] = [];
  sortCode: any = '';
  searchValue: any;
  statusFilter = ''
  avalStatus = 'All';
  pageNumber = 1
  length = 200;
  pageSize = 10;
  currentPage = 1;
  totalPages = Math.ceil(this.length / this.pageSize);
  totalTrailerType: any;
  logedInUser: any;
  permissions: any;

  constructor(
    public route: Router,
    public TrailerTypeServ: TrailerTypeService,
    public ultiSer: UtilityService
  ) { }

  ngOnInit(): void {
    let user: any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    let childmenu = parsedData.rootMenu[parsedData.rootMenu.length - 1];
    for (var i = 0; i < childmenu.subMenus.length; i++) {
      if (childmenu.subMenus[i].subMenuName.toLowerCase() == 'trailertypes') {
        this.permissions = childmenu.subMenus[i];
        this.TrailerTypeServ.permissions = this.permissions;
      }
    }

    // Set default permissions if not found
    if (!this.permissions) {
      this.permissions = {
        createAccess: true,
        editAccess: true,
        deleteAccess: true,
        viewAccess: true
      };
      this.TrailerTypeServ.permissions = this.permissions;
    }

    this.getSortList();
    this.sortByValue("Newest to Oldest date");
  }

  clear() {
    this.searchValue = '';
    this.sortByValue("Newest to Oldest date");
  }

  filteredUsersList(event: any) {
    this.searchValue = event.target.value;

    if (event.target.value.length > 1) {
      this.TrailerTypeServ.getSearchAndSortBy(event.target.value, "", this.statusFilter, this.pageNumber, this.pageSize).then((res: any) => {
        this.totalTrailerType = res.totalCount;
        this.totalPages = res.totalCount;
        this.TrailerTypesList = res.data;
      }).catch((err: any) => {
        if (err) {
          this.ultiSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
        }
      });
    } else {
      this.sortByValue("Newest to Oldest date");
    }
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1;
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.TrailerTypeServ.getSearchAndSortBy('', this.sortCode, this.statusFilter, this.pageNumber, this.pageSize).then((res: any) => {
      this.totalTrailerType = res.totalCount;
      this.totalPages = res.totalCount;
      this.TrailerTypesList = res.data;
    }).catch((err: any) => {
      if (err) {
        this.ultiSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
      }
    });
  }

  getSortList() {
    this.ultiSer.getSortLits().then((res: any) => {
      this.sortList = res;
    })
  }

  statusSetoption(status: any) {
    this.statusFilter = status;
    this.avalStatus = status ? status : 'All';
    this.sortByValue(this.sortCode)
  }

  sortByValue(event: any) {
    this.sortCode = event;
    this.TrailerTypeServ.getSearchAndSortBy('', this.sortCode, this.statusFilter, this.pageNumber, this.pageSize).then((res: any) => {
      this.totalTrailerType = res.totalCount;
      this.totalPages = res.totalCount;
      this.TrailerTypesList = res.data;
    }).catch((err: any) => {
      if (err) {
        this.ultiSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
      }
    });
  }

  addTrailerType() {
    this.TrailerTypeServ.editTrailerTypeRecord = null;
    this.TrailerTypeServ.viewDetail = null;
    this.TrailerTypeServ.viewTrailerTypeIndex = 0;
    this.route.navigateByUrl('/home/trailerType/addTrailerType')
  }

  viewTrailerType(index: any, trailerTypeDet: any) {
    if (this.permissions?.viewAccess) {
      this.TrailerTypeServ.viewDetail = trailerTypeDet;
      this.TrailerTypeServ.viewTrailerTypeIndex = index
      this.route.navigateByUrl('/home/trailerType/viewTrailerType')
    }
  }
}
