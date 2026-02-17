import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AccountSettingsService } from '../../../account-settings.service';
import { AddBinComponent } from './add-bin/add-bin.component';
import { MasterService } from '../master.service';

@Component({
  selector: 'app-bin',
  templateUrl: './bin.component.html',
  styleUrls: ['./bin.component.css']
})
export class BinComponent implements OnInit {
  binList:any | any[] = [
 
  ]

  constructor(public dialog:MatDialog,public settingServ:AccountSettingsService,public utilServ: UtilityService,public masterSer:MasterService) { }

  ngOnInit(): void {
    // this.binList = this.settingServ.binRecords;
    this.getAllBin();
  }

  addEditBin(data?:any,index?:any){
var dia = this.dialog.open(AddBinComponent,{
  panelClass:'add-bin',
  position: { right: "0" },
  height: "100vh",
  data: data ? {data,index,type:'Edit'} : null,
  width: "700px",
  disableClose: true
})


dia.afterClosed().subscribe(res => {
  //console.log(res);
  if(res){
    this.getAllBin();
  }
  
})
  }

getAllBin(){
  this.masterSer.getAllBin().then((res:any) => {
    //console.log(res);
    this.binList = res
  })
}
  copyBin(data:any){
    var dia = this.dialog.open(AddBinComponent,{
      panelClass:'add-bin',
      position: { right: "0" },
      height: "100vh",
      data: data ? {data,type:'Copy'} : null,
      width: "700px",
      disableClose: true
    })
    
    
    dia.afterClosed().subscribe(res => {
      //console.log(res);
      if(res){
        this.getAllBin();
      }
      
    })
  }

  deleteBin(item:any){
    let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
      width: '480px',
      height: 'auto',
      data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this bin ?', title: 'Remove bin ?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
       this.masterSer.deleteBinById(item.binID).then((res:any) => {
        //console.log(res);
        if(res){
          this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Bin deleted successfully' });
          this.getAllBin();
        }
       })
      }
    })
   
  }
}
