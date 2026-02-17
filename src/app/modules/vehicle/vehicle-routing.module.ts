import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleMainComponent } from './vehicle-main/vehicle-main.component';
import { AddEditVehicleComponent } from './vehicle-home/add-edit-vehicle/add-edit-vehicle.component';
import { VehicleHomeComponent } from './vehicle-home/vehicle-home.component';
import { ViewVehicleComponent } from './vehicle-home/view-vehicle/view-vehicle.component';

const routes: Routes = [
  {path:'' , component:VehicleMainComponent , children:[
    {path:'', component:VehicleHomeComponent},
    {path:'addVehicle', component:AddEditVehicleComponent},
    {path:'viewVehicle' , component:ViewVehicleComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleRoutingModule { }
