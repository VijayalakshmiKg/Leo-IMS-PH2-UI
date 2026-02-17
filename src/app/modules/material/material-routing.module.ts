import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialMainComponent } from './material-main/material-main.component';
import { MaterialHomeComponent } from './material-home/material-home.component';
import { AddMaterialComponent } from './material-home/add-material/add-material.component';
import { ViewMaterialComponent } from './material-home/view-material/view-material.component';

const routes: Routes = [
  {path:'' , component:MaterialMainComponent, children:[
    {path:'' , component:MaterialHomeComponent},
    {path:'addMeterial' , component:AddMaterialComponent},
    {path:'viewMeterial' , component:ViewMaterialComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialRoutingModule { }
