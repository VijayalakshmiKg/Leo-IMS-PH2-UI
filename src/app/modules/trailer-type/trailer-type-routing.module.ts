import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrailerTypeMainComponent } from './trailer-type-main/trailer-type-main.component';
import { TrailerTypeHomeComponent } from './trailer-type-home/trailer-type-home.component';
import { AddEditTrailerTypeComponent } from './trailer-type-home/add-edit-trailer-type/add-edit-trailer-type.component';
import { ViewTrailerTypeComponent } from './trailer-type-home/view-trailer-type/view-trailer-type.component';

const routes: Routes = [
  {
    path: '', component: TrailerTypeMainComponent, children: [
      { path: '', component: TrailerTypeHomeComponent },
      { path: 'home', component: TrailerTypeHomeComponent },
      { path: 'addTrailerType', component: AddEditTrailerTypeComponent },
      { path: 'viewTrailerType', component: ViewTrailerTypeComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrailerTypeRoutingModule { }
