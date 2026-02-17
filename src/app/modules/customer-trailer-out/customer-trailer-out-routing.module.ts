import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerTrailerOutMainComponent } from './customer-trailer-out-main/customer-trailer-out-main.component';
import { CustomerTrailerOutHomeComponent } from './customer-trailer-out-home/customer-trailer-out-home.component';
import { AddEditCustomerTrailerOutComponent } from './customer-trailer-out-home/add-edit-customer-trailer-out/add-edit-customer-trailer-out.component';
import { ViewCustomerTrailerOutComponent } from './customer-trailer-out-home/view-customer-trailer-out/view-customer-trailer-out.component';

const routes: Routes = [
  {
    path: '', component: CustomerTrailerOutMainComponent, children: [
      { path: '', component: CustomerTrailerOutHomeComponent },
      { path: 'add', component: AddEditCustomerTrailerOutComponent },
      { path: 'view', component: ViewCustomerTrailerOutComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerTrailerOutRoutingModule { }
