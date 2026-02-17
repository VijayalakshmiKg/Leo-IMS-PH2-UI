import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatusRoutingModule } from './status-routing.module';
import { StatusMainComponent } from './status-main/status-main.component';
import { StatusHomeComponent } from './status-home/status-home.component';
import { AddEditStatusComponent } from './status-home/add-edit-status/add-edit-status.component';
import { ViewStatusComponent } from './status-home/view-status/view-status.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';


@NgModule({
  declarations: [
    StatusMainComponent,
    StatusHomeComponent,
    AddEditStatusComponent,
    ViewStatusComponent
  ],
  imports: [
    CommonModule,
    StatusRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class StatusModule { }
