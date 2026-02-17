import { Component, OnInit } from '@angular/core';
import { AddVehicleComponent } from '../vehicle/add-vehicle/add-vehicle.component';
import { MatDialog } from '@angular/material/dialog';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AccountSettingsService } from '../../../account-settings.service';
import { AddVehicleTypeComponent } from './add-vehicle-type/add-vehicle-type.component';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { MasterService } from '../master.service';

@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.css']
})
export class VehicleTypeComponent implements OnInit {
  vehicleTypeList: any | any[] = [

  ]

  constructor(public dialog: MatDialog, public settingServ: AccountSettingsService, public masterSer: MasterService, public utilServ: UtilityService) { }

  ngOnInit(): void {
    // this.vehicleTypeList = this.settingServ.vehicleTypeRecords
    // //console.log(this.vehicleTypeList);
    this.getAllVehicleList();
  }
  getAllVehicleList(){
    this.masterSer.getAllVehicle().then((res:any) => {
      //console.log(res);
      this.vehicleTypeList = res;
    })
  }
  addEditVehicleType(data?: any, index?: any, type?: any) {
    var dia = this.dialog.open(AddVehicleTypeComponent, {
      panelClass: 'add-vehicleType',
      position: { right: "0" },
      height: "100vh",
      data: data ? { data, index, type: type } : null,
      width: "700px",
      disableClose: true
    })


    dia.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        this.getAllVehicleList();
      }

    })
  }

  deleteVehicleType(item: any) {

    let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
      width: '480px',
      height: 'auto',
      data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this vehicle type ?', title: 'Remove vehicle type ?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        //console.log(item.id);
        
        this.masterSer.deleteVehicle(item.id).then((res:any) => {
          //console.log(res);
          if(res){
            this.getAllVehicleList();
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Vehicle type deleted successfully' });
          }
        })
       
      }
    })

  }
}
