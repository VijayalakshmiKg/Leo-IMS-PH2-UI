import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { CustomerTrailerOutRoutingModule } from './customer-trailer-out-routing.module';
import { CustomerTrailerOutMainComponent } from './customer-trailer-out-main/customer-trailer-out-main.component';
import { CustomerTrailerOutHomeComponent } from './customer-trailer-out-home/customer-trailer-out-home.component';
import { AddEditCustomerTrailerOutComponent } from './customer-trailer-out-home/add-edit-customer-trailer-out/add-edit-customer-trailer-out.component';
import { ViewCustomerTrailerOutComponent } from './customer-trailer-out-home/view-customer-trailer-out/view-customer-trailer-out.component';

@NgModule({
  declarations: [
    CustomerTrailerOutMainComponent,
    CustomerTrailerOutHomeComponent,
    AddEditCustomerTrailerOutComponent,
    ViewCustomerTrailerOutComponent
  ],
  imports: [
    CommonModule,
    CustomerTrailerOutRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CustomerTrailerOutModule { }
