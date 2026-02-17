import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackingMainComponent } from './tracking-main/tracking-main.component';
import { TrackingHomeComponent } from './tracking-home/tracking-home.component';

const routes: Routes = [
  {path:'' , component:TrackingMainComponent, children:[
    {path:'' , component:TrackingHomeComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackingRoutingModule { }
