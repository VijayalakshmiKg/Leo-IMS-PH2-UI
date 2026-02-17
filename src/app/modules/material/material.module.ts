import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialRoutingModule } from './material-routing.module';
import { MaterialMainComponent } from './material-main/material-main.component';
import { MaterialHomeComponent } from './material-home/material-home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { AddMaterialComponent } from './material-home/add-material/add-material.component';
import { ViewMaterialComponent } from './material-home/view-material/view-material.component';


@NgModule({
  declarations: [
    MaterialMainComponent,
    MaterialHomeComponent,
    AddMaterialComponent,
    ViewMaterialComponent
  ],
  imports: [
    CommonModule,
    MaterialRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    
  ]
})
export class MaterialsModule { }
