import { Component, OnInit } from '@angular/core';
import { AddTemperatureComponent } from './add-temperature/add-temperature.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AccountSettingsService } from '../../../account-settings.service';
import { MasterService } from '../master.service';
import { temperatureModel } from '../masterModel/temperatureModel';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.css']
})
export class TemperatureComponent implements OnInit {
  temperatureList: any | any[] = [];
  

  constructor(public dialog: MatDialog, public masterSer: MasterService, public settingServ: AccountSettingsService, public utilServ: UtilityService) { }

  ngOnInit(): void {
    // this.temperatureList = this.settingServ.temperatureRecords
    this.getAllTemperature();
  }
  getAllTemperature(){
    this.masterSer.getAllTemperature().then((res:any) => {
      //console.log(res);
      this.temperatureList =  res;
    })
  }
  addEditTemperature(data?: any, index?: any) {
    var dia = this.dialog.open(AddTemperatureComponent, {
      panelClass: 'add-temperature',
      position: { right: "0" },
      height: "100vh",
      data: data ? { data, index, type: 'Edit' } : null,
      width: "700px",
      disableClose: true
    })


    dia.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        this.getAllTemperature();
      }

    })
  }


  copyTemperature(data: any) {
    var dia = this.dialog.open(AddTemperatureComponent, {
      panelClass: 'add-temperature',
      position: { right: "0" },
      height: "100vh",
      data: data ? { data, type: 'Copy' } : null,
      width: "700px",
      disableClose: true
    })


    dia.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        this.getAllTemperature();
      }

    })
  }

  deleteTemperature(item: any) {
    let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
      width: '480px',
      height: 'auto',
      data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this temperature ?', title: 'Remove temperature ?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // this.settingServ.temperatureRecords.splice(index, 1)
        // this.temperatureList = this.settingServ.temperatureRecords
       this.masterSer.deleteTemperature(item.id).then((res:any) => {
        if(res){
          this.getAllTemperature();
          this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Temperature deleted successfully' });
        }
       })
      }
    })

  }

}
