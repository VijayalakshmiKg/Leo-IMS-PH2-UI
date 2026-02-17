import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { VehicleService } from '../../vehicle.service';
import { Location } from '@angular/common';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-vehicle',
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.css']
})
export class ViewVehicleComponent implements OnInit {

  VehiclesList:any | any[] = []
  activeVehicles :any
  viewVehiclessRecord:any | any[] = [];
  searchValue: any;
  vehicleHistorydetails:any;
  pageNumber = 1
  length = 200; // Total items
  pageSize = 10; // Items per page
  currentPage = 1; // Default first page
  totalPages = Math.ceil(this.length / this.pageSize); // Total pages;
  sortList: any[] = [];
  sortCode: any = 'Newest to Oldest date';
  totalTrailer:any;
  logedInUser:any
  permissions: any;
  constructor(public VehiclesServ:VehicleService, public routes:Router , public dialog:MatDialog,public utilSer:UtilityService, public location:Location) { }
  ngOnDestroy(): void {
    // this.VehiclesServ.editVehiclesRecord = null
  }

  ngOnInit(): void {
 let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
    this.permissions = this.VehiclesServ.permissions;
    this.getAllTrucks();
    this.activeVehicles = this.VehiclesServ.viewVehicleIndex ? this.VehiclesServ.viewVehicleIndex : 0;
  }
  clear(){
    this.searchValue = '';
    this.getAllTrucks();
  }
  onPageChange(event: PageEvent) {
    //console.log(event);
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.VehiclesServ.getSearchAndSortBy('', this.sortCode, '',this.pageNumber,this.pageSize).then((res: any) => {
      //console.log(res);
      this.totalTrailer = res.totalCount;
      this.totalPages = res.totalCount;
      this.VehiclesList = res.data;
    });
  }
  getIndex() {
    for (let i = 0; i < this.VehiclesList?.length; i++) {
      if (this.VehiclesList[i].truckID == this.viewVehiclessRecord.truckID) {
        //console.log(i);
        this.activeVehicles = i
      }
    }
  }
  changeVehiclesView(record:any, index:any){
    this.activeVehicles = index
    this.VehiclesServ.viewVehicleIndex = index
    this.viewVehiclessRecord = record;
    //console.log(this.viewVehiclessRecord);
    this.vehicleHistroy();
    
  }
getAllTrucks(){
  this.VehiclesServ.getSearchAndSortBy("",this.sortCode, '',this.pageNumber,this.pageSize).then((res:any) => {
    //console.log(res);
    this.totalTrailer = res.totalCount;
    this.totalPages = res.totalCount;
    this.VehiclesList = res.data;
    this.viewVehiclessRecord = this.VehiclesServ.viewDetail ? this.VehiclesServ.viewDetail : this.VehiclesList[this.activeVehicles];
    this.getIndex()
    this.changeVehiclesView(this.viewVehiclessRecord, this.activeVehicles)
    this.vehicleHistroy();
  })
}
  editVehicles(){
    this.VehiclesServ.editVehicleRecord = this.viewVehiclessRecord
    this.routes.navigateByUrl('/home/vehicle/addVehicle')
    this.VehiclesServ.viewDetail = null;
    this.getAllTrucks();
  }
  vehicleHistroy(){
    this.VehiclesServ.getVehicleHistory(this.viewVehiclessRecord.truckID).then(res=>{
      //console.log(res);
      this.vehicleHistorydetails = res;
    })
  }

  back(){
    this.location.back()
  }

  filteredUsersList(event:any){
    this.searchValue = event.target.value;

    if(event.target.value.length > 1){
      this.activeVehicles = 0;
    this.VehiclesServ.getSearchAndSortBy(event.target.value,this.sortCode, '',this.pageNumber,this.pageSize).then((res:any) => {
      //console.log(res);
      this.totalTrailer = res.totalCount;
      this.totalPages = res.totalCount;
      this.VehiclesList = res.data;
      this.viewVehiclessRecord = this.VehiclesList[this.activeVehicles];
     })
    }else {
      this.getAllTrucks();
    }
  }

  deleteVehicles(){

    // let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
    //   width: '480px',
    //   height: 'auto',
    //   data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this vehicle ?', title: 'Are you sure?' },
    //   disableClose: true,
    //   autoFocus: false,
    //   panelClass: 'custom-msg-box'
    // })
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.VehiclesServ.VehiclesList.splice(this.viewVehiclessRecord.viewUserId, 1);
        
    //     // this.router.navigateByUrl('/home/users/list')
    //     this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Driver deleted successfully.' })
    //     this.back()
    //   }
    // })
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '505px',
      height: 'auto',
      data: {title: 'Remove Vehicle', 
             message: 'Do you wish to remove the vehicle? All the Vehicle data will be deleted and cannot be restored again.', 
             value:this.viewVehiclessRecord.vechicleNumber,
             placeholder:'Enter the vehicle number'},
      disableClose: true,
      autoFocus: false,
      panelClass: 'deletePopup'
    })
    dialogRef.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        this.VehiclesServ.deleteVehicle(this.viewVehiclessRecord.truckID).then((res:any) => {
          //console.log(res,"came");
          if(res){
            //console.log(res);
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Vehicle removed successfully.' });
          this.back()
          }
        })                 
      
      }
    })
   
  }
}
