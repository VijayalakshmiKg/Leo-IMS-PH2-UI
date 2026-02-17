import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditConsigneeComponent } from './consignee-home/add-edit-consignee/add-edit-consignee.component';
import { ConsigneeHomeComponent } from './consignee-home/consignee-home.component';
import { ViewConsigneeComponent } from './consignee-home/view-consignee/view-consignee.component';
import { ConsigneeMainComponent } from './consignee-main/consignee-main.component';

const routes: Routes = [
  {path:'' , component:ConsigneeMainComponent, children:[
    {path:'' , component:ConsigneeHomeComponent},
    {path:'addConsignee' , component:AddEditConsigneeComponent},
    {path:'viewConsignee' , component:ViewConsigneeComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsigneeRoutingModule { }
