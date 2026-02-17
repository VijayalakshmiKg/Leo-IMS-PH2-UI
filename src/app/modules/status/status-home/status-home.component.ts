import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatusService } from '../status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PageEvent } from '@angular/material/paginator';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';

@Component({
  selector: 'app-status-home',
  templateUrl: './status-home.component.html',
  styleUrls: ['./status-home.component.css']
})
export class StatusHomeComponent implements OnInit {

  statusList: any | any[] = []
  sortList: any[] = [];
  sortCode: any = '';
  searchValue: any;
  sortedBy: string = 'All';
  statusFilter = ''
  avalStatus = 'All';
  pageNumber = 1
  length = 200;
  pageSize = 10;
  currentPage = 1;
  totalPages = Math.ceil(this.length / this.pageSize);
  totalStatus: any;
  logedInUser: any
  permissions: any

  constructor(public route: Router, public statusServ: StatusService, public utilSer: UtilityService) {

  }

  ngOnInit(): void {
    let user: any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    let childmenu = parsedData.rootMenu[parsedData.rootMenu.length - 2];
    for (var i = 0; i < childmenu.subMenus.length; i++) {
      if (childmenu.subMenus[i].subMenuName.toLowerCase() == 'status') {
        this.permissions = childmenu.subMenus[i];
        this.statusServ.permissions = this.permissions;
      }
    }

    this.getSortList();
    this.sortByValue("A to Z");
  }

  getSortList() {
    this.utilSer.getSortLits().then((res: any) => {
      this.sortList = res;
    })
  }

  clear() {
    this.searchValue = '';
    this.sortByValue("A to Z");
  }

  statusSetoption(status: any) {
    this.statusFilter = status;
    this.avalStatus = status ? status : 'All';
    this.sortByValue(this.sortCode)
  }

  sortByValue(event: any) {
    this.sortCode = event;
    this.statusServ.getSearchAndSortBy("", this.sortCode, this.statusFilter, this.pageSize, this.pageNumber).then((res: any) => {
      this.totalStatus = res.totalCount;
      this.totalPages = res.totalCount;
      this.statusList = res.data;
    }).catch((err: any) => {
      if (err) {
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1;
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.statusServ.getSearchAndSortBy("", this.sortCode, this.statusFilter, this.pageSize, this.pageNumber).then((res: any) => {
      this.totalStatus = res.totalCount;
      this.totalPages = res.totalCount;
      this.statusList = res.data;
    }).catch((err: any) => {
      if (err) {
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
      }
    });
  }

  searchStatus(event: any) {
    this.searchValue = event.target.value;
    if (event.target.value.length > 1) {
      this.statusServ.getSearchAndSortBy(event.target.value, this.sortCode, this.statusFilter, this.pageSize, this.pageNumber).then((res: any) => {
        this.totalStatus = res.totalCount;
        this.totalPages = res.totalCount;
        this.statusList = res.data;
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
        }
      });
    } else {
      this.sortByValue("A to Z");
    }
  }

  addStatus() {
    this.statusServ.viewStatusIndex = 0;
    this.statusServ.editStatusRecord = null
    this.route.navigateByUrl('/home/status/addStatus')
  }

  getAllStatusList() {
    this.statusServ.getAllStatus().then((res: any) => {
      this.totalStatus = res.totalCount;
      this.totalPages = res.totalCount;
      this.statusList = res.data;
    })
  }

  viewStatus(status: any, index: any) {
    if (this.permissions?.viewAccess) {
      this.statusServ.viewStatusId = status;
      this.statusServ.viewStatusIndex = index;
      this.route.navigateByUrl('/home/status/viewStatus')
    }
  }
}
