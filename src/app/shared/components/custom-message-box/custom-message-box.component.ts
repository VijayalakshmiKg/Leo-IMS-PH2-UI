import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-message-box',
  templateUrl: './custom-message-box.component.html',
  styleUrls: ['./custom-message-box.component.css']
})
export class CustomMessageBoxComponent implements OnInit {

  popupType: string = '';

  buttonCollection: any | any = {
    'success': [{ text: 'Ok', class: 'btn-cls-1', action: true }],
    'delete': [{ text: 'Delete', class: 'btn-cls-1', action: true }, { text: 'Cancel', class: 'btn-cls-2', action: false }],
    'cancel': [{ text: 'Continue', class: 'btn-cls-1', action: true }, { text: 'Cancel', class: 'btn-cls-2', action: false }],
    
  };

  selectedBtn: Array<{ text: string; class: string; action: string }> | any = [];

  condition1 : boolean = false;

  condition2 : boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<CustomMessageBoxComponent>) { }

  ngOnInit(): void {
    //console.log(this.data)
    this.msgBoxType()
  }

  //listen message box type
  msgBoxType() {
    switch (this.data.type) {
      case 0:
        this.popupType = 'success';
        break;
      case 1:
        this.popupType = 'delete';
        break;
      case 2:
        this.popupType = 'cancel';
        break;
    }
    this.condition1 = this.popupType !== 'success';
    this.condition2 = this.popupType === 'success'
    this.selectedBtn = this.buttonCollection[this.popupType]
  }

  //close the dialog popup
  closeDialog(res: any) {
    this.dialogRef.close(res)
  }

}

export enum messageBox {
  successMessageBox,
  deleteMessageBox,
  cancelMessageBox,
}
