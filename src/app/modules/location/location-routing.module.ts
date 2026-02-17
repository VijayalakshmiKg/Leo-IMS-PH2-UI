import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationMainComponent } from './location-main/location-main.component';
import { LocationHomeComponent } from './location-home/location-home.component';
import { AddEditLocationComponent } from './location-home/add-edit-location/add-edit-location.component';
import { ViewLocationComponent } from './location-home/view-location/view-location.component';

const routes: Routes = [
  {
    path: '', component: LocationMainComponent, children: [
      { path: '', component: LocationHomeComponent },
      { path: 'addLocation', component: AddEditLocationComponent },
      { path: 'viewLocation', component: ViewLocationComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationRoutingModule { }
