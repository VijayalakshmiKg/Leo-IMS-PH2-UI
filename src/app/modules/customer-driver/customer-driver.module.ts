import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { CustomerDriverRoutingModule } from './customer-driver-routing.module';
import { CustomerDriverMainComponent } from './customer-driver-main/customer-driver-main.component';
import { CustomerDriverHomeComponent } from './customer-driver-home/customer-driver-home.component';
import { AddEditCustomerDriverComponent } from './customer-driver-home/add-edit-customer-driver/add-edit-customer-driver.component';
import { ViewCustomerDriverComponent } from './customer-driver-home/view-customer-driver/view-customer-driver.component';

@NgModule({
  declarations: [
    CustomerDriverMainComponent,
    CustomerDriverHomeComponent,
    AddEditCustomerDriverComponent,
    ViewCustomerDriverComponent
  ],
  imports: [
    CommonModule,
    CustomerDriverRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CustomerDriverModule { }
