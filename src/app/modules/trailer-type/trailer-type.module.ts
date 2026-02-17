import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { TrailerTypeRoutingModule } from './trailer-type-routing.module';
import { TrailerTypeMainComponent } from './trailer-type-main/trailer-type-main.component';
import { TrailerTypeHomeComponent } from './trailer-type-home/trailer-type-home.component';
import { AddEditTrailerTypeComponent } from './trailer-type-home/add-edit-trailer-type/add-edit-trailer-type.component';
import { ViewTrailerTypeComponent } from './trailer-type-home/view-trailer-type/view-trailer-type.component';

@NgModule({
  declarations: [
    TrailerTypeMainComponent,
    TrailerTypeHomeComponent,
    AddEditTrailerTypeComponent,
    ViewTrailerTypeComponent
  ],
  imports: [
    CommonModule,
    TrailerTypeRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TrailerTypeModule { }
