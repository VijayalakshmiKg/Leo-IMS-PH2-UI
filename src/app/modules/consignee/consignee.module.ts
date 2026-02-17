import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsigneeRoutingModule } from './consignee-routing.module';
import { ConsigneeHomeComponent } from './consignee-home/consignee-home.component';
import { ConsigneeMainComponent } from './consignee-main/consignee-main.component';
import { AddEditConsigneeComponent } from './consignee-home/add-edit-consignee/add-edit-consignee.component';
import { ViewConsigneeComponent } from './consignee-home/view-consignee/view-consignee.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaxNumberPipe } from 'src/app/shared/pipes/fax-number.pipe';


@NgModule({
  declarations: [
    ConsigneeHomeComponent,
    ConsigneeMainComponent,
    AddEditConsigneeComponent,
    ViewConsigneeComponent,
  ],
  imports: [
    CommonModule,
    ConsigneeRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    // FaxNumberPipe
  ]
})
export class ConsigneeModule { }
