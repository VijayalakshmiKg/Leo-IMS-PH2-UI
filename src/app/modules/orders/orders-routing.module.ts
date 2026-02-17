import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersMainComponent } from './orders-main/orders-main.component';
import { OrdersHomeComponent } from './orders-home/orders-home.component';
import { AddOrdersComponent } from './orders-home/add-orders/add-orders.component';
import { ViewOrdersComponent } from './orders-home/view-orders/view-orders.component';
import { CanDeactivateGuard } from 'src/app/shared/guard/can-deactivate.guard';
import { QualityTaskComponent } from '../tasks/tasks-home/quality-task/quality-task.component';


const routes: Routes = [
  {path:'' ,  component:OrdersMainComponent , children:[
    {path:'' , component:OrdersHomeComponent},
    {path:'addOrders' , component:AddOrdersComponent,canDeactivate: [CanDeactivateGuard]},
    {path:'qualityTask' , component:QualityTaskComponent},
    {path:'viewOrders' , component:ViewOrdersComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
