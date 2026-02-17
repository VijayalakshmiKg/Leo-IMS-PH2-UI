import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddRolesComponent } from './add-roles/add-roles.component';
import { AccountSettingsService } from '../../../account-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  rolesList: any | any[] = [

  ]

  constructor(public dialog: MatDialog, public settingServ: AccountSettingsService, public utilServ: UtilityService) { }

  ngOnInit(): void {
    this.rolesList = this.settingServ.rolesRecords
  }

  addEditRoles(data?: any, index?: any) {
    var dia = this.dialog.open(AddRolesComponent, {
      panelClass: 'add-roles',
      position: { right: "0" },
      height: "100vh",
      data: data ? { data, index } : null,
      width: "700px",
      disableClose: true
    })


    dia.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        this.rolesList = this.settingServ.rolesRecords
      }

    })
  }

  deleteRoles(index: any) {
    let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
      width: '480px',
      height: 'auto',
      data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this role ?', title: 'Are you sure?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.settingServ.rolesRecords.splice(index, 1)
        this.rolesList = this.settingServ.rolesRecords
        this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Role deleted successfully' });
      }
    })

  }




}
