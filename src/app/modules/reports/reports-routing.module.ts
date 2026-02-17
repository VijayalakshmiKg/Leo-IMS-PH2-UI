import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsMainComponent } from './reports-main/reports-main.component';
import { ReportsHomeComponent } from './reports-home/reports-home.component';

const routes: Routes = [
  {path:'' , component:ReportsMainComponent, children:[
    {path:'' ,  component:ReportsHomeComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
