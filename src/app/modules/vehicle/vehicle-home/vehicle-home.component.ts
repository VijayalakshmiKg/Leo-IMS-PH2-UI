import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from '../vehicle.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-vehicle-home',
  templateUrl: './vehicle-home.component.html',
  styleUrls: ['./vehicle-home.component.css']
})
export class VehicleHomeComponent implements OnInit {

  VehiclesList: any | any[] = []
  sortList: any[] = [];
  sortCode: any = '';
  searchValue: any;
  statusFilter = ''
  avalStatus = 'All';
  pageNumber = 1
  length = 200; // Total items
  pageSize = 10; // Items per page
  currentPage = 1; // Default first page
  totalPages = Math.ceil(this.length / this.pageSize); // Total pages
  totalVehicle:any;
  logedInUser:any;
  permissions:any;

  constructor(public route: Router, public VehicleServ: VehicleService, public ultiSer: UtilityService) { }

  ngOnInit(): void {
     let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
     let childmenu = parsedData.rootMenu[parsedData.rootMenu.length - 2];
    for (var i = 0; i < childmenu.subMenus.length; i++) {
      if (childmenu.subMenus[i].subMenuName.toLowerCase() == 'vehicles') {
        this.permissions = childmenu.subMenus[i];
        this.VehicleServ.permissions = this.permissions;
      }
    }
    //console.log(this.permissions);
    // //console.log(this.VehicleServ.VehiclesList);
    // this.VehiclesList = this.VehicleServ.VehiclesList
    this.getSortList();
    this.sortByValue("Newest to Oldest date");
    // this.getAllTrucksList();
  }
  clear() {
    this.searchValue = '';
    this.sortByValue("Newest to Oldest date");
    // this.getAllTrucksList();
  }
  filteredUsersList(event: any) {
    //console.log(event.target.value);
    this.searchValue = event.target.value;

    if (event.target.value.length > 1) {
      this.VehicleServ.getSearchAndSortBy(event.target.value, "", this.statusFilter,this.pageNumber,this.pageSize).then((res: any) => {
        //console.log(res);
        this.totalVehicle = res.totalCount;
        this.totalPages = res.totalCount;
        this.VehiclesList = res.data;
      })
    } else {
      this.sortByValue("Newest to Oldest date");
      // this.getAllTrucksList();
    }
  }
   onPageChange(event: PageEvent) {
          //console.log(event);
          this.pageNumber = Number(event.pageIndex) + 1
          this.pageSize = event.pageSize
          this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
          this.totalPages = Math.ceil(event.length / event.pageSize);
          this.VehicleServ.getSearchAndSortBy('',this.sortCode, this.statusFilter,this.pageNumber,this.pageSize).then((res: any) => {
            //console.log(res);
            this.totalVehicle = res.totalCount;
            this.totalPages = res.totalCount;
            this.VehiclesList = res.data;
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
    //console.log(this.statusFilter);
    this.sortByValue(this.sortCode)

  }
  sortByValue(event: any) {
    this.sortCode = event;
    this.VehicleServ.getSearchAndSortBy('', this.sortCode, this.statusFilter,this.pageNumber,this.pageSize).then((res: any) => {
      //console.log(res);
      this.totalVehicle = res.totalCount;
      this.totalPages = res.totalCount;
      this.VehiclesList = res.data;
    })
  }
  getAllTrucksList() {
    this.VehicleServ.getAllVehicle().then((res: any) => {
      //console.log(res);
      this.totalVehicle = res.totalCount;
      this.totalPages = res.totalCount;
      this.VehiclesList = res.data;
    })
  }
  addVehicles() {
    this.VehicleServ.editVehicleRecord = null;
    this.VehicleServ.viewDetail = null;
    this.VehicleServ.viewVehicleIndex = 0;

    this.route.navigateByUrl('/home/vehicle/addVehicle')
  }
  viewVehicles(index: any, truckDet: any) {
    if(this.permissions?.viewAccess){
    //console.log(index);
    this.VehicleServ.viewDetail = truckDet;
    this.VehicleServ.viewVehicleIndex = index
    this.route.navigateByUrl('/home/vehicle/viewVehicle')
  }
  }

}
