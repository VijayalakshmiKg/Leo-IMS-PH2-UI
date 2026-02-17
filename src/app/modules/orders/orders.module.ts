import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersMainComponent } from './orders-main/orders-main.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersHomeComponent } from './orders-home/orders-home.component';
import { AddOrdersComponent } from './orders-home/add-orders/add-orders.component';
import { AddVehicleDriverComponent } from './orders-home/add-orders/add-vehicle-driver/add-vehicle-driver.component';
import { ViewOrdersComponent } from './orders-home/view-orders/view-orders.component';
import { ImportTemplateComponent } from './orders-home/add-orders/import-template/import-template.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';



@NgModule({
  declarations: [
    OrdersHomeComponent,
    OrdersMainComponent,
    AddOrdersComponent,
    AddVehicleDriverComponent,
    ViewOrdersComponent,
    ImportTemplateComponent
  ],

  imports: [
    CommonModule,
    OrdersRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule
    
  ]
})
export class OrdersModule { }
