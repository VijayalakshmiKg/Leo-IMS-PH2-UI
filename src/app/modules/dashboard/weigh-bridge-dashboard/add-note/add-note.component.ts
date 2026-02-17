import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DashboardService } from '../../dashboard.service';
import { ToDoListModel } from '../models/todolist';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.css']
})
export class AddNoteComponent implements OnInit {
  notesValue:any = "";
 
  constructor(public dialog:MatDialogRef<AddNoteComponent>, public utilServ:UtilityService , public dashboardService:DashboardService) { }
  ngOnInit(): void {
  }
 get getLocalUserData() {
  let local:any = localStorage.getItem("userData");
 return JSON.parse( local)
}
  close(){
    this.dialog.close()
  }
  saveNotes() {
  //console.log(this.getLocalUserData);
   let toDoListModel = new ToDoListModel()
   toDoListModel.Id = 0;
   toDoListModel.ManagerId  = this.getLocalUserData.employeeId;
   toDoListModel.Notes  = this.notesValue;
   //console.log(toDoListModel);
      if(this.notesValue) {
        this.dashboardService.addUpdateToDoList(toDoListModel).then((res:any)=> {
          //console.log(res);
          if(res) {
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Notes added successful' });
            this.close()
          }
        })
      }

  }
}
