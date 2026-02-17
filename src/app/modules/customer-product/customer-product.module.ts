import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerProductRoutingModule } from './customer-product-routing.module';
import { CustomerProductMainComponent } from './customer-product-main/customer-product-main.component';
import { CustomerProductHomeComponent } from './customer-product-home/customer-product-home.component';
import { AddEditCustomerProductComponent } from './customer-product-home/add-edit-customer-product/add-edit-customer-product.component';
import { ViewCustomerProductComponent } from './customer-product-home/view-customer-product/view-customer-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';


@NgModule({
  declarations: [
    CustomerProductMainComponent,
    CustomerProductHomeComponent,
    AddEditCustomerProductComponent,
    ViewCustomerProductComponent
  ],
  imports: [
    CommonModule,
    CustomerProductRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CustomerProductModule { }
