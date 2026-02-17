import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleRoutingModule } from './vehicle-routing.module';
import { VehicleHomeComponent } from './vehicle-home/vehicle-home.component';
import { VehicleMainComponent } from './vehicle-main/vehicle-main.component';
import { AddEditVehicleComponent } from './vehicle-home/add-edit-vehicle/add-edit-vehicle.component';
import { ViewVehicleComponent } from './vehicle-home/view-vehicle/view-vehicle.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';


@NgModule({
  declarations: [
    VehicleHomeComponent,
    VehicleMainComponent,
    AddEditVehicleComponent,
    ViewVehicleComponent
  ],
  imports: [
    CommonModule,
    VehicleRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class VehicleModule { }
