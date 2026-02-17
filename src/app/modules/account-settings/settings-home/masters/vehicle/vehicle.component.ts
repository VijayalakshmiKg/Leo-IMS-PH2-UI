import { Component, OnInit } from '@angular/core';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { MatDialog } from '@angular/material/dialog';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AccountSettingsService } from '../../../account-settings.service';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {
  vehicleList:any | any[] = [
 
  ]

  constructor(public dialog:MatDialog,public settingServ:AccountSettingsService,public utilServ: UtilityService) { }

  ngOnInit(): void {
    this.vehicleList = this.settingServ.vehicleRecords
  }

  addEditVehicle(data?:any,index?:any){
var dia = this.dialog.open(AddVehicleComponent,{
  panelClass:'add-vehicle',
  position: { right: "0" },
  height: "100vh",
  data: data ? {data,index} : null,
  width: "700px",
  disableClose: true
})


dia.afterClosed().subscribe(res => {
  //console.log(res);
  if(res){
    this.vehicleList = this.settingServ.vehicleRecords
  }
  
})
  }

  deleteVehicle(index:any){
    // this.settingServ.vehicleRecords.splice(index,1)
    // this.vehicleList = this.settingServ.vehicleRecords
    // this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Staus deleted successfully' });


    let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
      width: '480px',
      height: 'auto',
      data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this vehicle type ?', title: 'Remove vehicle ?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.settingServ.vehicleRecords.splice(index,1)
    this.vehicleList = this.settingServ.vehicleRecords
    this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Vehicle deleted successfully' });
      }
    })
  }

}
