import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateMainComponent } from './template-main/template-main.component';
import { TemplateHomeComponent } from './template-home/template-home.component';
import { AddEditTemplateComponent } from './template-home/add-edit-template/add-edit-template.component';
import { ViewTemplateComponent } from './template-home/view-template/view-template.component';
import { CanDeactivateGuard } from 'src/app/core/guards/can-deactivate.guard';

const routes: Routes = [
  {path:'' , component:TemplateMainComponent , children:[
    {path:'', component:TemplateHomeComponent, canDeactivate: [CanDeactivateGuard]},
    {path:'addEditTemplate', component:AddEditTemplateComponent},
    {path:'viewTemplate', component:ViewTemplateComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateRoutingModule { }
