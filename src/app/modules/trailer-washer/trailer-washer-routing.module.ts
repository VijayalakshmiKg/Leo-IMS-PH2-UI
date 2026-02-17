import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrailerWasherMainComponent } from './trailer-washer-main/trailer-washer-main.component';
import { TrailerHomeComponent } from '../trailer/trailer-home/trailer-home.component';
import { AddEditTrailerWasherComponent } from './trailer-washer-home/add-edit-trailer-washer/add-edit-trailer-washer.component';
import { ViewTrailerWasherComponent } from './trailer-washer-home/view-trailer-washer/view-trailer-washer.component';
import { TrailerWasherHomeComponent } from './trailer-washer-home/trailer-washer-home.component';

const routes: Routes = [
  {path:'' , component:TrailerWasherMainComponent , children:[
        {path:'', component:TrailerWasherHomeComponent},
        {path:'addTrailerWashers', component:AddEditTrailerWasherComponent},
        {path:'viewTrailerWashers' , component:ViewTrailerWasherComponent}
      ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrailerWasherRoutingModule { }
