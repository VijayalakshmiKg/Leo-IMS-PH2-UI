import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsignorRoutingModule } from './consignor-routing.module';
import { ConsignorHomeComponent } from './consignor-home/consignor-home.component';
import { ConsignorMainComponent } from './consignor-main/consignor-main.component';
import { AddEditConsignorComponent } from './consignor-home/add-edit-consignor/add-edit-consignor.component';
import { ViewConsignorComponent } from './consignor-home/view-consignor/view-consignor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { FaxNumberPipe } from 'src/app/shared/pipes/fax-number.pipe';


@NgModule({
  declarations: [
    ConsignorHomeComponent,
    ConsignorMainComponent,
    AddEditConsignorComponent,
    ViewConsignorComponent,
  ],
  imports: [
    CommonModule,
    ConsignorRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ConsignorModule { }
