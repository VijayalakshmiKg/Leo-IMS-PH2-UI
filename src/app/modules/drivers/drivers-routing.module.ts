import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriversMainComponent } from './drivers-main/drivers-main.component';
import { DriversHomeComponent } from './drivers-home/drivers-home.component';
import { AddEditDriversComponent } from './drivers-home/add-edit-drivers/add-edit-drivers.component';
import { ViewDriversComponent } from './drivers-home/view-drivers/view-drivers.component';

const routes: Routes = [
  {path:'' , component:DriversMainComponent , children:[
    {path:'', component:DriversHomeComponent},
    {path:'addDrivers', component:AddEditDriversComponent},
    {path:'viewDrivers' , component:ViewDriversComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriversRoutingModule { }
