import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatusMainComponent } from './status-main/status-main.component';
import { StatusHomeComponent } from './status-home/status-home.component';
import { AddEditStatusComponent } from './status-home/add-edit-status/add-edit-status.component';
import { ViewStatusComponent } from './status-home/view-status/view-status.component';

const routes: Routes = [
  {
    path: '', component: StatusMainComponent, children: [
      { path: '', component: StatusHomeComponent },
      { path: 'addStatus', component: AddEditStatusComponent },
      { path: 'viewStatus', component: ViewStatusComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatusRoutingModule { }
