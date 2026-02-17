import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerTrailerInMainComponent } from './customer-trailer-in-main/customer-trailer-in-main.component';
import { CustomerTrailerInHomeComponent } from './customer-trailer-in-home/customer-trailer-in-home.component';
import { AddEditCustomerTrailerInComponent } from './customer-trailer-in-home/add-edit-customer-trailer-in/add-edit-customer-trailer-in.component';
import { ViewCustomerTrailerInComponent } from './customer-trailer-in-home/view-customer-trailer-in/view-customer-trailer-in.component';

const routes: Routes = [
  {
    path: '', component: CustomerTrailerInMainComponent, children: [
      { path: '', component: CustomerTrailerInHomeComponent },
      { path: 'home', component: CustomerTrailerInHomeComponent },
      { path: 'add', component: AddEditCustomerTrailerInComponent },
      { path: 'view', component: ViewCustomerTrailerInComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerTrailerInRoutingModule { }
