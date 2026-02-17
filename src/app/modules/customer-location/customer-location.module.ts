import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { CustomerLocationRoutingModule } from './customer-location-routing.module';
import { CustomerLocationMainComponent } from './customer-location-main/customer-location-main.component';
import { CustomerLocationHomeComponent } from './customer-location-home/customer-location-home.component';
import { AddEditCustomerLocationComponent } from './customer-location-home/add-edit-customer-location/add-edit-customer-location.component';
import { ViewCustomerLocationComponent } from './customer-location-home/view-customer-location/view-customer-location.component';

@NgModule({
  declarations: [
    CustomerLocationMainComponent,
    CustomerLocationHomeComponent,
    AddEditCustomerLocationComponent,
    ViewCustomerLocationComponent
  ],
  imports: [
    CommonModule,
    CustomerLocationRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CustomerLocationModule { }
