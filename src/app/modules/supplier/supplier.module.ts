import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierHomeComponent } from './supplier-home/supplier-home.component';
import { SupplierMainComponent } from './supplier-main/supplier-main.component';
import { SupplierViewComponent } from './supplier-home/supplier-view/supplier-view.component';
import { AddEditSupplierComponent } from './supplier-home/add-edit-supplier/add-edit-supplier.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';


@NgModule({
  declarations: [
    SupplierHomeComponent,
    SupplierMainComponent,
    SupplierViewComponent,
    AddEditSupplierComponent
  ],
  imports: [
    CommonModule,
    SupplierRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SupplierModule { }
