import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.css']
})
export class DocumentViewerComponent implements OnInit {

  constructor(@Inject (MAT_DIALOG_DATA) public data: any, public dialog:MatDialogRef<DocumentViewerComponent>) { 
    //console.log(data);
    
  }

  ngOnInit(): void {
  }

  close() {
    this.dialog.close();
  }
}
