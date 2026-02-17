import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriversRoutingModule } from './drivers-routing.module';
import { DriversMainComponent } from './drivers-main/drivers-main.component';
import { DriversHomeComponent } from './drivers-home/drivers-home.component';
import { AddEditDriversComponent } from './drivers-home/add-edit-drivers/add-edit-drivers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { ViewDriversComponent } from './drivers-home/view-drivers/view-drivers.component';
import { MatAutocomplete } from '@angular/material/autocomplete';


@NgModule({
  declarations: [
    DriversMainComponent,
    DriversHomeComponent,
    AddEditDriversComponent,
    ViewDriversComponent
  ],
  imports: [
    CommonModule,
    DriversRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  
  ]
})
export class DriversModule { }
