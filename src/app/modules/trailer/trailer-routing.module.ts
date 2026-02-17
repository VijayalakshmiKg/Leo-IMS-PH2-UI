import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrailerMainComponent } from './trailer-main/trailer-main.component';
import { TrailerHomeComponent } from './trailer-home/trailer-home.component';
import { AddTrailerComponent } from './trailer-home/add-trailer/add-trailer.component';
import { ViewTrailersComponent } from './trailer-home/view-trailers/view-trailers.component';

const routes: Routes = [
  {path:'' , component:TrailerMainComponent , children:[
    {path:'', component:TrailerHomeComponent},
    {path:'addTrailer', component:AddTrailerComponent},
    {path:'viewTrailer' , component:ViewTrailersComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrailerRoutingModule { }
