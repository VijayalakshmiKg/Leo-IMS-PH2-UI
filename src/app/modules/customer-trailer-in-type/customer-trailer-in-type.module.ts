import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { CustomerTrailerInTypeRoutingModule } from './customer-trailer-in-type-routing.module';
import { CustomerTrailerInTypeMainComponent } from './customer-trailer-in-type-main/customer-trailer-in-type-main.component';
import { CustomerTrailerInTypeHomeComponent } from './customer-trailer-in-type-home/customer-trailer-in-type-home.component';
import { AddEditCustomerTrailerInTypeComponent } from './customer-trailer-in-type-home/add-edit-customer-trailer-in-type/add-edit-customer-trailer-in-type.component';
import { ViewCustomerTrailerInTypeComponent } from './customer-trailer-in-type-home/view-customer-trailer-in-type/view-customer-trailer-in-type.component';

@NgModule({
  declarations: [
    CustomerTrailerInTypeMainComponent,
    CustomerTrailerInTypeHomeComponent,
    AddEditCustomerTrailerInTypeComponent,
    ViewCustomerTrailerInTypeComponent
  ],
  imports: [
    CommonModule,
    CustomerTrailerInTypeRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CustomerTrailerInTypeModule { }
