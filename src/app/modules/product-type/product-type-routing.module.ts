import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductTypeMainComponent } from './product-type-main/product-type-main.component';
import { AddEditProductTypeComponent } from './product-type-home/add-edit-product-type/add-edit-product-type.component';
import { ProductTypeHomeComponent } from './product-type-home/product-type-home.component';
import { ViewProductTypeComponent } from './product-type-home/view-product-type/view-product-type.component';

const routes: Routes = [
  {path:'' , component:ProductTypeMainComponent , children:[
    {path:'', component:ProductTypeHomeComponent},
    {path:'addProductType', component:AddEditProductTypeComponent},
    {path:'viewProductType' , component:ViewProductTypeComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductTypeRoutingModule { }
