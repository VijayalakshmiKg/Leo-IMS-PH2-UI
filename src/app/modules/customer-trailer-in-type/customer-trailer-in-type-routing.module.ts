import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerTrailerInTypeMainComponent } from './customer-trailer-in-type-main/customer-trailer-in-type-main.component';
import { CustomerTrailerInTypeHomeComponent } from './customer-trailer-in-type-home/customer-trailer-in-type-home.component';
import { AddEditCustomerTrailerInTypeComponent } from './customer-trailer-in-type-home/add-edit-customer-trailer-in-type/add-edit-customer-trailer-in-type.component';
import { ViewCustomerTrailerInTypeComponent } from './customer-trailer-in-type-home/view-customer-trailer-in-type/view-customer-trailer-in-type.component';

const routes: Routes = [
  {
    path: '', component: CustomerTrailerInTypeMainComponent, children: [
      { path: '', component: CustomerTrailerInTypeHomeComponent },
      { path: 'home', component: CustomerTrailerInTypeHomeComponent },
      { path: 'add', component: AddEditCustomerTrailerInTypeComponent },
      { path: 'view', component: ViewCustomerTrailerInTypeComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerTrailerInTypeRoutingModule { }
