import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationRoutingModule } from './location-routing.module';
import { LocationMainComponent } from './location-main/location-main.component';
import { LocationHomeComponent } from './location-home/location-home.component';
import { AddEditLocationComponent } from './location-home/add-edit-location/add-edit-location.component';
import { ViewLocationComponent } from './location-home/view-location/view-location.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';


@NgModule({
  declarations: [
    LocationMainComponent,
    LocationHomeComponent,
    AddEditLocationComponent,
    ViewLocationComponent
  ],
  imports: [
    CommonModule,
    LocationRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LocationModule { }
