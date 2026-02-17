import { Component, OnInit } from '@angular/core';
import { AddVendorsComponent } from './add-vendors/add-vendors.component';
import { MatDialog } from '@angular/material/dialog';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AccountSettingsService } from '../../../account-settings.service';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { MasterService } from '../master.service';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit {
  vendorsList: any | any[] = [

  ]

  constructor(public dialog: MatDialog, public masterSer: MasterService, public settingServ: AccountSettingsService, public utilServ: UtilityService) { }

  ngOnInit(): void {
    // this.vendorsList = this.settingServ.vendorsRecords
    this.getAllVendor();
  }
  getAllVendor() {
    this.masterSer.getAllVendor().then((res: any) => {
      //console.log(res);
      this.vendorsList = res;
    })
  }
  addEditVendors(data?: any, index?: any) {
    var dia = this.dialog.open(AddVendorsComponent, {
      panelClass: 'add-vendors',
      position: { right: "0" },
      height: "100vh",
      data: data ? { data, index } : null,
      width: "700px",
      disableClose: true
    })


    dia.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        this.getAllVendor();
      }

    })
  }

  deleteVendors(item: any) {

    let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
      width: '480px',
      height: 'auto',
      data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this vendor ?', title: 'Remove vendor' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.masterSer.deleteVendor(item.vendorId).then((res:any) => {
          //console.log(res);
          if(res){
            // this.settingServ.vendorsRecords.splice(index, 1)
            this.getAllVendor();
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Vendor deleted successfully' });
          }
        })
      }
    })

  }
}
