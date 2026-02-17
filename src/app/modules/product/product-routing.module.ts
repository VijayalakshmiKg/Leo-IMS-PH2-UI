import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductMainComponent } from './product-main/product-main.component';
import { AddEditProductComponent } from './product-home/add-edit-product/add-edit-product.component';
import { ProductHomeComponent } from './product-home/product-home.component';
import { ViewProductComponent } from './product-home/view-product/view-product.component';

const routes: Routes = [
  {path:'' , component:ProductMainComponent , children:[
    {path:'', component:ProductHomeComponent},
    {path:'addProduct', component:AddEditProductComponent},
    {path:'viewProduct' , component:ViewProductComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
