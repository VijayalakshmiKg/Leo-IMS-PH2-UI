import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductTypeRoutingModule } from './product-type-routing.module';
import { ProductTypeHomeComponent } from './product-type-home/product-type-home.component';
import { ProductTypeMainComponent } from './product-type-main/product-type-main.component';
import { AddEditProductTypeComponent } from './product-type-home/add-edit-product-type/add-edit-product-type.component';
import { ViewProductTypeComponent } from './product-type-home/view-product-type/view-product-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';


@NgModule({
  declarations: [
    ProductTypeHomeComponent,
    ProductTypeMainComponent,
    AddEditProductTypeComponent,
    ViewProductTypeComponent
  ],
  imports: [
    CommonModule,
    ProductTypeRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ProductTypeModule { }
