import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductBinRoutingModule } from './product-bin-routing.module';
import { ProductBinMainComponent } from './product-bin-main/product-bin-main.component';
import { ProductBinHomeComponent } from './product-bin-home/product-bin-home.component';
import { AddEditProductBinComponent } from './product-bin-home/add-edit-product-bin/add-edit-product-bin.component';
import { ViewProductBinComponent } from './product-bin-home/view-product-bin/view-product-bin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';


@NgModule({
  declarations: [
    ProductBinMainComponent,
    ProductBinHomeComponent,
    AddEditProductBinComponent,
    ViewProductBinComponent
  ],
  imports: [
    CommonModule,
    ProductBinRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProductBinModule { }
