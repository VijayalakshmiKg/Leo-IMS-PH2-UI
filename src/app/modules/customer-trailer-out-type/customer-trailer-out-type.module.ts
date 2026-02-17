import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { CustomerTrailerOutTypeRoutingModule } from './customer-trailer-out-type-routing.module';
import { CustomerTrailerOutTypeMainComponent } from './customer-trailer-out-type-main/customer-trailer-out-type-main.component';
import { CustomerTrailerOutTypeHomeComponent } from './customer-trailer-out-type-home/customer-trailer-out-type-home.component';
import { AddEditCustomerTrailerOutTypeComponent } from './customer-trailer-out-type-home/add-edit-customer-trailer-out-type/add-edit-customer-trailer-out-type.component';
import { ViewCustomerTrailerOutTypeComponent } from './customer-trailer-out-type-home/view-customer-trailer-out-type/view-customer-trailer-out-type.component';

@NgModule({
  declarations: [
    CustomerTrailerOutTypeMainComponent,
    CustomerTrailerOutTypeHomeComponent,
    AddEditCustomerTrailerOutTypeComponent,
    ViewCustomerTrailerOutTypeComponent
  ],
  imports: [
    CommonModule,
    CustomerTrailerOutTypeRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CustomerTrailerOutTypeModule { }
