import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TemplateService } from 'src/app/modules/template/template.service';
// import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-import-template',
  templateUrl: './import-template.component.html',
  styleUrls: ['./import-template.component.css']
})
export class ImportTemplateComponent implements OnInit {

  importData:any;
  selectedTemplate: any;
  importForm !: FormGroup

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ImportTemplateComponent>, public tempSer: TemplateService, public fb: FormBuilder) { }

  ngOnInit(): void {
    // //console.log(this.tempSer.templateList);
    // //console.log(this.data);
    this.importForm = this.fb.group({
      selectedTemplate: [''], // Initialize the form control
    });
    // this.importData = this.data
    this.getTemplates()
  }

  getTemplates(){
    this.tempSer.getAllTemplates('3','','',1,20).then(res => {
      //console.log(res);
      if(res){
        this.importData = res.orderTemplateModels
      }
    })
  }

  importDetails(data:any){
    //console.log(data);
    
    this.selectedTemplate = data;
  }
  close(){
    this.dialogRef.close();
  }

  onImport() {
    if(this.selectedTemplate){
      //console.log('in', this.selectedTemplate);
      this.dialogRef.close(this.selectedTemplate);
    }
   
   
  }
}
