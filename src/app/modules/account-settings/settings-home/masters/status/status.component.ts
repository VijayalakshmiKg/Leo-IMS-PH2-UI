import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AccountSettingsService } from '../../../account-settings.service';
import { AddStatusComponent } from './add-status/add-status.component';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { MasterService } from '../master.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  statusList: any | any[] = [

  ]

  constructor(public dialog: MatDialog, public settingServ: AccountSettingsService, public masterSer: MasterService, public utilServ: UtilityService) { }

  ngOnInit(): void {
    // this.statusList = this.settingServ.statusRecords
    this.getAllStatusList();
  }

  addEditStatus(data?: any, index?: any) {
    var dia = this.dialog.open(AddStatusComponent, {
      panelClass: 'add-status',
      position: { right: "0" },
      height: "100vh",
      data: data ? { data, index, type: 'Edit' } : null,
      width: "700px",
      disableClose: true
    })


    dia.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        this.getAllStatusList();
      }

    })
  }
  getAllStatusList() {
    this.masterSer.getAllStatusList().then((res: any) => {
      //console.log(res);
      this.statusList = res;
    })
  }

  copyStatus(data: any) {
    var dia = this.dialog.open(AddStatusComponent, {
      panelClass: 'add-status',
      position: { right: "0" },
      height: "100vh",
      data: data ? { data, type: 'Copy' } : null,
      width: "700px",
      disableClose: true
    })


    dia.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        this.getAllStatusList();
      }

    })
  }

  deleteStatus(item: any) {
    let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
      width: '480px',
      height: 'auto',
      data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this status ?', title: 'Delete status?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    })
    dialogRef.afterClosed().subscribe(res => {
      //console.log(item.statusId);
      
      if (res) {
        this.masterSer.deleteStatusById(item.statusId).then((res: any) => {
          //console.log(res);
          if (res) {
            this.getAllStatusList();
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Status deleted successfully' });
          }
        })
      }
    })

  }

}
