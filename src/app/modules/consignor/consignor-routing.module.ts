import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsignorHomeComponent } from './consignor-home/consignor-home.component';
import { ConsignorMainComponent } from './consignor-main/consignor-main.component';
import { AddEditConsignorComponent } from './consignor-home/add-edit-consignor/add-edit-consignor.component';
import { ViewConsignorComponent } from './consignor-home/view-consignor/view-consignor.component';

const routes: Routes = [
  {path:'' , component:ConsignorMainComponent, children:[
    {path:'' , component:ConsignorHomeComponent},
    {path:'addConsignor' , component:AddEditConsignorComponent},
    {path:'viewConsignor' , component:ViewConsignorComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsignorRoutingModule { }
