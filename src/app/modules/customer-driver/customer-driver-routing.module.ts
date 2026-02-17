import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDriverMainComponent } from './customer-driver-main/customer-driver-main.component';
import { CustomerDriverHomeComponent } from './customer-driver-home/customer-driver-home.component';
import { AddEditCustomerDriverComponent } from './customer-driver-home/add-edit-customer-driver/add-edit-customer-driver.component';
import { ViewCustomerDriverComponent } from './customer-driver-home/view-customer-driver/view-customer-driver.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerDriverMainComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: CustomerDriverHomeComponent },
      { path: 'addCustomerDriver', component: AddEditCustomerDriverComponent },
      { path: 'viewCustomerDriver', component: ViewCustomerDriverComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerDriverRoutingModule { }
