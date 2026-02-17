import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AccountSettingsService } from '../../../account-settings.service';
import { AddRolesComponent } from '../roles/add-roles/add-roles.component';
import { AddGendersComponent } from './add-genders/add-genders.component';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { MasterService } from '../master.service';

@Component({
  selector: 'app-genders',
  templateUrl: './genders.component.html',
  styleUrls: ['./genders.component.css']
})
export class GendersComponent implements OnInit {
  gendersList: any | any[] = [

  ]

  constructor(public dialog: MatDialog, public masterSer: MasterService, public settingServ: AccountSettingsService, public utilServ: UtilityService) { }

  ngOnInit(): void {
    // this.gendersList = this.settingServ.gendersRecords;
    this.getAllGender();
  }

  addEditGenders(data?: any, index?: any) {
    var dia = this.dialog.open(AddGendersComponent, {
      panelClass: 'add-genders',
      position: { right: "0" },
      height: "100vh",
      data: data ? { data, index, type: 'Edit' } : null,
      width: "700px",
      disableClose: true
    })


    dia.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        // this.gendersList = this.settingServ.gendersRecords
        this.getAllGender();
      }

    })
  }
  getAllGender() {
    this.masterSer.getAllGender().then((res: any) => {
      //console.log(res);
      this.gendersList = res;
      this.settingServ.genderData = this.gendersList
    })
  }
  copyGender(data: any) {
    var dia = this.dialog.open(AddGendersComponent, {
      panelClass: 'add-genders',
      position: { right: "0" },
      height: "100vh",
      data: data ? { data, type: 'Copy' } : null,
      width: "700px",
      disableClose: true
    })


    dia.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
       this.getAllGender()
      };

    })
  }


  deleteGenders(item: any) {
    let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
      width: '480px',
      height: 'auto',
      data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this gender ?', title: 'Remove gender' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
       this.masterSer.deleteGenderById(item.genderID).then((res:any) => {
        //console.log(res);
        if(res){
          this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Gender deleted successfully' });
          this.getAllGender();
        }
       })
      
      }
    })

  }

}
