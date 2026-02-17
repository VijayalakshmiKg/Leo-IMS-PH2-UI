import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrailerWasherRoutingModule } from './trailer-washer-routing.module';
import { TrailerWasherMainComponent } from './trailer-washer-main/trailer-washer-main.component';
import { TrailerWasherHomeComponent } from './trailer-washer-home/trailer-washer-home.component';
import { AddEditTrailerWasherComponent } from './trailer-washer-home/add-edit-trailer-washer/add-edit-trailer-washer.component';
import { ViewTrailerWasherComponent } from './trailer-washer-home/view-trailer-washer/view-trailer-washer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';


@NgModule({
  declarations: [
    TrailerWasherMainComponent,
    TrailerWasherHomeComponent,
    AddEditTrailerWasherComponent,
    ViewTrailerWasherComponent
  ],
  imports: [
    CommonModule,
    TrailerWasherRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class TrailerWasherModule { }
