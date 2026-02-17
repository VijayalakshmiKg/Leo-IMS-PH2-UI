import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerProductTypeRoutingModule } from './customer-product-type-routing.module';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { CustomerProductTypeMainComponent } from './customer-product-type-main/customer-product-type-main.component';
import { CustomerProductTypeHomeComponent } from './customer-product-type-home/customer-product-type-home.component';
import { AddEditCustomerProductTypeComponent } from './customer-product-type-home/add-edit-customer-product-type/add-edit-customer-product-type.component';
import { ViewCustomerProductTypeComponent } from './customer-product-type-home/view-customer-product-type/view-customer-product-type.component';

@NgModule({
  declarations: [
    CustomerProductTypeMainComponent,
    CustomerProductTypeHomeComponent,
    AddEditCustomerProductTypeComponent,
    ViewCustomerProductTypeComponent
  ],
  imports: [
    CommonModule,
    CustomerProductTypeRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CustomerProductTypeModule { }
