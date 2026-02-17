import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerTrailerOutTypeMainComponent } from './customer-trailer-out-type-main/customer-trailer-out-type-main.component';
import { CustomerTrailerOutTypeHomeComponent } from './customer-trailer-out-type-home/customer-trailer-out-type-home.component';
import { AddEditCustomerTrailerOutTypeComponent } from './customer-trailer-out-type-home/add-edit-customer-trailer-out-type/add-edit-customer-trailer-out-type.component';
import { ViewCustomerTrailerOutTypeComponent } from './customer-trailer-out-type-home/view-customer-trailer-out-type/view-customer-trailer-out-type.component';

const routes: Routes = [
  {
    path: '', component: CustomerTrailerOutTypeMainComponent, children: [
      { path: '', component: CustomerTrailerOutTypeHomeComponent },
      { path: 'add', component: AddEditCustomerTrailerOutTypeComponent },
      { path: 'view', component: ViewCustomerTrailerOutTypeComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerTrailerOutTypeRoutingModule { }
