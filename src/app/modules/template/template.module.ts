import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplateRoutingModule } from './template-routing.module';
import { TemplateMainComponent } from './template-main/template-main.component';
import { TemplateHomeComponent } from './template-home/template-home.component';
import { AddEditTemplateComponent } from './template-home/add-edit-template/add-edit-template.component';
import { ViewTemplateComponent } from './template-home/view-template/view-template.component';
import { ImportExcelModalComponent } from './import-excel-modal/import-excel-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


@NgModule({
  declarations: [
    TemplateMainComponent,
    TemplateHomeComponent,
    AddEditTemplateComponent,
    ViewTemplateComponent,
    ImportExcelModalComponent,
  ],
  imports: [
    CommonModule,
    TemplateRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class TemplateModule { }
