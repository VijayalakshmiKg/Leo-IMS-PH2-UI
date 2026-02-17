import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerLocationMainComponent } from './customer-location-main/customer-location-main.component';
import { CustomerLocationHomeComponent } from './customer-location-home/customer-location-home.component';
import { AddEditCustomerLocationComponent } from './customer-location-home/add-edit-customer-location/add-edit-customer-location.component';
import { ViewCustomerLocationComponent } from './customer-location-home/view-customer-location/view-customer-location.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerLocationMainComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: CustomerLocationHomeComponent },
      { path: 'addCustomerLocation', component: AddEditCustomerLocationComponent },
      { path: 'viewCustomerLocation', component: ViewCustomerLocationComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerLocationRoutingModule { }
