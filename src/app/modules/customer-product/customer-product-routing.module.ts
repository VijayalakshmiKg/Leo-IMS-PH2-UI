import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerProductMainComponent } from './customer-product-main/customer-product-main.component';
import { CustomerProductHomeComponent } from './customer-product-home/customer-product-home.component';
import { AddEditCustomerProductComponent } from './customer-product-home/add-edit-customer-product/add-edit-customer-product.component';
import { ViewCustomerProductComponent } from './customer-product-home/view-customer-product/view-customer-product.component';

const routes: Routes = [
  {
    path: '', component: CustomerProductMainComponent, children: [
      { path: '', component: CustomerProductHomeComponent },
      { path: 'addCustomerProduct', component: AddEditCustomerProductComponent },
      { path: 'viewCustomerProduct', component: ViewCustomerProductComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerProductRoutingModule { }
