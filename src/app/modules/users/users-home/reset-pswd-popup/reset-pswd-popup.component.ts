import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-reset-pswd-popup',
  templateUrl: './reset-pswd-popup.component.html',
  styleUrls: ['./reset-pswd-popup.component.css']
})
export class ResetPswdPopupComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ResetPswdPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 
    //console.log(data);
    
  }

  ngOnInit(): void {

  }

  close() {
    this.dialogRef.close();
  }
  resetPswd(){
    this.dialogRef.close(true);
  }
}
