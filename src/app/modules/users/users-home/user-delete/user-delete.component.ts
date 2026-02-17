import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.css']
})
export class UserDeleteComponent implements OnInit {

  constructor(public dialog:MatDialogRef<UserDeleteComponent>) { }

  ngOnInit(): void {
  }

  close(){
    this.dialog.close()
  }

  delete(){
    this.dialog.close(true)
  }

}
