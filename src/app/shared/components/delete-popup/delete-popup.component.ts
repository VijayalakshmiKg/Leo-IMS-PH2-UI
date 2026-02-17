import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.css']
})
export class DeletePopupComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DeletePopupComponent>, private router: Router, @Inject(MAT_DIALOG_DATA) public data: any) {
    //console.log(data);

  }

  ngOnInit() {
  }

  // closing dialog popup
  dialogClose(): void {
    this.dialogRef.close();
  }

  // this will delete selected item
  deleteOrg() {
    this.dialogRef.close(true);
  }
}
