import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerProductTypeMainComponent } from './customer-product-type-main/customer-product-type-main.component';
import { CustomerProductTypeHomeComponent } from './customer-product-type-home/customer-product-type-home.component';
import { AddEditCustomerProductTypeComponent } from './customer-product-type-home/add-edit-customer-product-type/add-edit-customer-product-type.component';
import { ViewCustomerProductTypeComponent } from './customer-product-type-home/view-customer-product-type/view-customer-product-type.component';

const routes: Routes = [
  {
    path: '', component: CustomerProductTypeMainComponent, children: [
      { path: '', component: CustomerProductTypeHomeComponent },
      { path: 'home', component: CustomerProductTypeHomeComponent },
      { path: 'add', component: AddEditCustomerProductTypeComponent },
      { path: 'view', component: ViewCustomerProductTypeComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerProductTypeRoutingModule { }
