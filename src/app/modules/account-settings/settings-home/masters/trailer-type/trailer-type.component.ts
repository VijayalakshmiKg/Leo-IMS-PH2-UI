import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AccountSettingsService } from '../../../account-settings.service';
import { AddTrailerTypeComponent } from './add-trailer-type/add-trailer-type.component';
import { MasterService } from '../master.service';

@Component({
  selector: 'app-trailer-type',
  templateUrl: './trailer-type.component.html',
  styleUrls: ['./trailer-type.component.css']
})
export class TrailerTypeComponent implements OnInit {
  trailerTypeList: any | any[] = [

  ]

  constructor(public dialog: MatDialog, public settingServ: AccountSettingsService, public masterSer: MasterService, public utilServ: UtilityService) { }

  ngOnInit(): void {
    // this.trailerTypeList = this.settingServ.trailerTypeRecords
    this.getAllTrailer();
  }

  addEditTrailerType(data?: any, index?: any) {
    var dia = this.dialog.open(AddTrailerTypeComponent, {
      panelClass: 'add-trailerType',
      position: { right: "0" },
      height: "100vh",
      data: data ? { data, index, type: 'Edit' } : null,
      width: "700px",
      disableClose: true
    })


    dia.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        // this.trailerTypeList = this.settingServ.trailerTypeRecords
        this.getAllTrailer();
      }

    })
  }

  getAllTrailer() {
    this.masterSer.getAllTrailer().then((res: any) => {
      //console.log(res);
      this.trailerTypeList = res;
    })
  }
  copyTrailerType(data: any) {
    var dia = this.dialog.open(AddTrailerTypeComponent, {
      panelClass: 'add-trailerType',
      position: { right: "0" },
      height: "100vh",
      data: data ? { data, type: 'Copy' } : null,
      width: "700px",
      disableClose: true
    })


    dia.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        // this.trailerTypeList = this.settingServ.trailerTypeRecords
        this.getAllTrailer();
      }

    })
  }

  deleteTrailerType(item: any) {
    let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
      width: '480px',
      height: 'auto',
      data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this trailer type ?', title: 'Remove trailer type ?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // this.settingServ.trailerTypeRecords.splice(index, 1)
        // this.trailerTypeList = this.settingServ.trailerTypeRecords
        this.masterSer.deleteTrailer(item.id).then((res: any) => {
          //console.log(res);
          if (res) {
            
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Trailer type deleted successfully' });
            this.getAllTrailer();
          }
        })
      }
    })

  }

}
