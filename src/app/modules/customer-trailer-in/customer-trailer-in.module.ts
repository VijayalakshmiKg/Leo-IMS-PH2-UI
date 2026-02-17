import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { CustomerTrailerInRoutingModule } from './customer-trailer-in-routing.module';
import { CustomerTrailerInMainComponent } from './customer-trailer-in-main/customer-trailer-in-main.component';
import { CustomerTrailerInHomeComponent } from './customer-trailer-in-home/customer-trailer-in-home.component';
import { AddEditCustomerTrailerInComponent } from './customer-trailer-in-home/add-edit-customer-trailer-in/add-edit-customer-trailer-in.component';
import { ViewCustomerTrailerInComponent } from './customer-trailer-in-home/view-customer-trailer-in/view-customer-trailer-in.component';

@NgModule({
  declarations: [
    CustomerTrailerInMainComponent,
    CustomerTrailerInHomeComponent,
    AddEditCustomerTrailerInComponent,
    ViewCustomerTrailerInComponent
  ],
  imports: [
    CommonModule,
    CustomerTrailerInRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CustomerTrailerInModule { }
