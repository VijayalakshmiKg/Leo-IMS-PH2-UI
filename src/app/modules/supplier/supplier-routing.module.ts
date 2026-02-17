import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierMainComponent } from './supplier-main/supplier-main.component';
import { SupplierHomeComponent } from './supplier-home/supplier-home.component';
import { AddEditSupplierComponent } from './supplier-home/add-edit-supplier/add-edit-supplier.component';
import { SupplierViewComponent } from './supplier-home/supplier-view/supplier-view.component';

const routes: Routes = [
  {path:'' , component:SupplierMainComponent , children:[
    {path:'' , component:SupplierHomeComponent},
    {path:'addEditSupplier' , component:AddEditSupplierComponent},
    {path:'viewSupplier' , component:SupplierViewComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
