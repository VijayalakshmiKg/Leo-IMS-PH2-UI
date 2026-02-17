import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrailerRoutingModule } from './trailer-routing.module';
import { TrailerHomeComponent } from './trailer-home/trailer-home.component';
import { TrailerMainComponent } from './trailer-main/trailer-main.component';
import { AddTrailerComponent } from './trailer-home/add-trailer/add-trailer.component';
import { ViewTrailersComponent } from './trailer-home/view-trailers/view-trailers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';


@NgModule({
  declarations: [
    TrailerHomeComponent,
    TrailerMainComponent,
    AddTrailerComponent,
    ViewTrailersComponent
  ],
  imports: [
    CommonModule,
    TrailerRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class TrailerModule { }
