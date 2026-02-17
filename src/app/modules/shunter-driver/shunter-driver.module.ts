import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShunterDriverRoutingModule } from './shunter-driver-routing.module';
import { ShunterDriverHomeComponent } from './shunter-driver-home/shunter-driver-home.component';
import { ShunterDriverMainComponent } from './shunter-driver-main/shunter-driver-main.component';
import { ViewShunterDriversComponent } from './shunter-driver-home/view-shunter-drivers/view-shunter-drivers.component';
import { AddEditShunterDriversComponent } from './shunter-driver-home/add-edit-shunter-drivers/add-edit-shunter-drivers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';


@NgModule({
  declarations: [
    ShunterDriverHomeComponent,
    ShunterDriverMainComponent,
    ViewShunterDriversComponent,
    AddEditShunterDriversComponent
  ],
  imports: [
    CommonModule,
    ShunterDriverRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ShunterDriverModule { }
