import { Component, OnInit } from '@angular/core';
import { AccountSettingsService } from '../../../account-settings.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';

@Component({
  selector: 'app-roles-permission-home',
  templateUrl: './roles-permission-home.component.html',
  styleUrls: ['./roles-permission-home.component.css']
})
export class RolesPermissionHomeComponent implements OnInit {


  rolesRecords: any | any[];

  sortList: any[] = [{ name: 'Oldest to Latest', element: 'oldest first' }, { name: 'Latest to Oldest', element: 'newest first' }, { name: 'z-a', element: 'z-a' }, { name: 'a-z', element: 'a-z' }];


  constructor(public route: Router, public rolesServ: AccountSettingsService, public dialog: MatDialog, public utilServ: UtilityService) { }

  ngOnInit(): void {
    // this.rolesRecords = this.rolesServ.rolesList
    //console.log(this.rolesRecords);

    this.getRolelistData();
    this.emptyRoles();
  }

  sortByValue(filter: any) {

  }

  addEditRoles(index?: any, record?: any) {
    //console.log('akjafh');

    this.rolesServ.editRoleIndex = index ? index : null
    this.rolesServ.editRoleRecord = record
    this.route.navigateByUrl('/home/settings/addEditRoles')
  }






  filteredrolessList(event: any) {
    //console.log(event);
    //console.log(event.value);

    if (!this.rolesServ.rolesList) {
      return this.rolesServ.rolesList;
    }
    this.rolesRecords.filter((roles: any) =>
      roles.firstName.toLowerCase().includes(event.value.toLowerCase()) ||
      roles.lastName.toLowerCase().includes(event.value.toLowerCase())
    );

    //console.log(this.rolesRecords);

  }
  emptyRoles() {
    this.rolesServ.getemptyRoles(13).then(res => {
      //console.log(res);

    })
  }

  viewroles(rolesData: any, index: any) {
    this.rolesServ.editRoleIndex = index
    this.rolesServ.viewByEditRoles = rolesData
    //console.log(this.rolesServ.viewByEditRoles);

    this.route.navigateByUrl('/home/roless/viewroless')
  }


  deleteRole(index: any, data: any) {
    //console.log(data);


    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '505px',
      height: 'auto',
      data: {
        title: 'Remove role',
        message: 'Do you wish to remove this role? All the role data will be deleted and cannot be restored again.',
        value: data.roleName,
        placeholder: 'Enter the name'
      },
      disableClose: true,
      autoFocus: false,
      panelClass: 'deletePopup'
    })
    dialogRef.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        this.rolesServ.deleteRoles(data.roleID).then(res => {
          if (res) {
            this.getRolelistData();
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Role removed successfully.' })
          }

        })
      }
    })
  }
  getRolelistData() {
    this.rolesServ.getRolelist().then(res => {
      //console.log(res);
      this.rolesRecords = res;

    })
  }
}
