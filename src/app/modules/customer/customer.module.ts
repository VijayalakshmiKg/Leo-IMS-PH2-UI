import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerMainComponent } from './customer-main/customer-main.component';
import { CustomerHomeComponent } from './customer-home/customer-home.component';
import { AddEditCustomerComponent } from './customer-home/add-edit-customer/add-edit-customer.component';
import { ViewCustomerComponent } from './customer-home/view-customer/view-customer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';


@NgModule({
  declarations: [
    CustomerMainComponent,
    CustomerHomeComponent,
    AddEditCustomerComponent,
    ViewCustomerComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CustomerModule { }
