import { Component, OnInit } from '@angular/core';
import { AddMaterialTypeComponent } from './add-material-type/add-material-type.component';
import { MatDialog } from '@angular/material/dialog';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AccountSettingsService } from '../../../account-settings.service';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { MasterService } from '../master.service';

@Component({
  selector: 'app-material-type',
  templateUrl: './material-type.component.html',
  styleUrls: ['./material-type.component.css']
})
export class MaterialTypeComponent implements OnInit {
  materialTypeList: any | any[] = []

  constructor(public dialog: MatDialog, public masterSer: MasterService, public settingServ: AccountSettingsService, public utilServ: UtilityService) { }

  ngOnInit(): void {
    // this.materialTypeList = this.settingServ.materialTypeRecords
    this.getAllMaterialtype();
  }
  getAllMaterialtype(){
    this.masterSer.getAllMaterial().then((res:any) => {
      //console.log(res);
      this.materialTypeList = res;
    })
  }
  addEditmaterialType(data?: any, index?: any) {
    var dia = this.dialog.open(AddMaterialTypeComponent, {
      panelClass: 'add-materialType',
      position: { right: "0" },
      height: "100vh",
      data: data ? { data, index, type: 'Edit' } : null,
      width: "700px",
      disableClose: true
    })


    dia.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        this.getAllMaterialtype();
      }

    })
  }
  copyMaterialType(data?: any) {
    var dia = this.dialog.open(AddMaterialTypeComponent, {
      panelClass: 'add-materialType',
      position: { right: "0" },
      height: "100vh",
      data: data ? { data, type: 'Copy' } : null,
      width: "700px",
      disableClose: true
    })


    dia.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        this.getAllMaterialtype();
      }

    })
  }

  deletematerialType(item: any) {
    let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
      width: '480px',
      height: 'auto',
      data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this product type ?', title: 'Remove product type ?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // this.settingServ.materialTypeRecords.splice(index, 1)
        this.masterSer.deleteMaterial(item.id).then((res:any) => {
          //console.log(res);
          if(res){
            this.getAllMaterialtype();
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Product type deleted successfully' });
          }
        })
       
      }
    })

  }

}
