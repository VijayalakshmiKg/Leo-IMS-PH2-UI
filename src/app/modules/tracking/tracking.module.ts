import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrackingRoutingModule } from './tracking-routing.module';
import { TrackingHomeComponent } from './tracking-home/tracking-home.component';
import { TrackingMainComponent } from './tracking-main/tracking-main.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';


@NgModule({
  declarations: [
    TrackingHomeComponent,
    TrackingMainComponent
  ],
  imports: [
    CommonModule,
    TrackingRoutingModule,
    MaterialModule
  ]
})
export class TrackingModule { }
