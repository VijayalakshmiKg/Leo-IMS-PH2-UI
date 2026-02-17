import { Component, OnInit } from '@angular/core';
import { AddUnitsComponent } from './add-units/add-units.component';
import { MatDialog } from '@angular/material/dialog';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AccountSettingsService } from '../../../account-settings.service';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { MasterService } from '../master.service';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {

  unitesList:any | any[] = [
 
  ]

  constructor(public dialog:MatDialog,public masterSer:MasterService,public settingServ:AccountSettingsService,public utilServ: UtilityService) { }

  ngOnInit(): void {
    // this.unitesList = this.settingServ.unitesRecords;
    this.getAllUnits();
  }

  addEditUnites(data?:any,index?:any,type?:any){
var dia = this.dialog.open(AddUnitsComponent,{
  panelClass:'add-unites',
  position: { right: "0" },
  height: "100vh",
  data: data ? {data,index,type:type} : null,
  width: "700px",
  disableClose: true
})


dia.afterClosed().subscribe(res => {
  //console.log(res);
  if(res){
    this.getAllUnits();
  }
  
})
  }
getAllUnits(){
  this.masterSer.getAllUnits().then((res:any) => {
    //console.log(res);
    this.unitesList = res;
  })
}
  deleteUnites(item:any){
    let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
      width: '480px',
      height: 'auto',
      data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this unit ?', title: 'Remove unit ?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // this.settingServ.unitesRecords.splice(index,1)
        //console.log(item.unitID);
        
       this.masterSer.deleteUnit(item.unitID).then((res:any) => {
        //console.log(res);
        
        if(res){

          this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Unit deleted successfully' });
          this.getAllUnits();
        }
       })
      }
    })
   
  }
}
