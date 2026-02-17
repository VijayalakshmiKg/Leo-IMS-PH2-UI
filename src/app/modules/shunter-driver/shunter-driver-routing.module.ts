import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShunterDriverMainComponent } from './shunter-driver-main/shunter-driver-main.component';
import { ShunterDriverHomeComponent } from './shunter-driver-home/shunter-driver-home.component';
import { AddEditShunterDriversComponent } from './shunter-driver-home/add-edit-shunter-drivers/add-edit-shunter-drivers.component';
import { ViewShunterDriversComponent } from './shunter-driver-home/view-shunter-drivers/view-shunter-drivers.component';

const routes: Routes = [
   {path:'' , component:ShunterDriverMainComponent , children:[
      {path:'', component:ShunterDriverHomeComponent},
      {path:'addShunterDrivers', component:AddEditShunterDriversComponent},
      {path:'viewShunterDrivers' , component:ViewShunterDriversComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShunterDriverRoutingModule { }
