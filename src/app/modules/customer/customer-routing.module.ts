import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerMainComponent } from './customer-main/customer-main.component';
import { CustomerHomeComponent } from './customer-home/customer-home.component';
import { AddEditCustomerComponent } from './customer-home/add-edit-customer/add-edit-customer.component';
import { ViewCustomerComponent } from './customer-home/view-customer/view-customer.component';

const routes: Routes = [
  {
    path: '', component: CustomerMainComponent, children: [
      { path: '', component: CustomerHomeComponent },
      { path: 'addCustomer', component: AddEditCustomerComponent },
      { path: 'viewCustomer', component: ViewCustomerComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
