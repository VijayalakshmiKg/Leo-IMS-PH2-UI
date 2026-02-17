import { Component, OnInit } from '@angular/core';
import { AddTrailersComponent } from './add-trailers/add-trailers.component';
import { MatDialog } from '@angular/material/dialog';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AccountSettingsService } from '../../../account-settings.service';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';

@Component({
  selector: 'app-trailers',
  templateUrl: './trailers.component.html',
  styleUrls: ['./trailers.component.css']
})
export class TrailersComponent implements OnInit {
  trailersList:any | any[] = [
 
  ]

  constructor(public dialog:MatDialog,public settingServ:AccountSettingsService,public utilServ: UtilityService) { }

  ngOnInit(): void {
    this.trailersList = this.settingServ.trailersRecords
  }

  addEditTrailers(data?:any,index?:any){
var dia = this.dialog.open(AddTrailersComponent,{
  panelClass:'add-trailers',
  position: { right: "0" },
  height: "100vh",
  data: data ? {data,index} : null,
  width: "700px",
  disableClose: true
})


dia.afterClosed().subscribe(res => {
  //console.log(res);
  if(res){
    this.trailersList = this.settingServ.trailersRecords
  }
  
})
  }

  deleteTrailers(index:any){
    let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
      width: '480px',
      height: 'auto',
      data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this trailer ?', title: 'Remove trailer ?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.settingServ.trailersRecords.splice(index,1)
    this.trailersList = this.settingServ.trailersRecords
    this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Status deleted successfully' });
      }
    })
  
  }

}
