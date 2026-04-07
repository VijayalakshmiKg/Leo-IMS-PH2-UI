import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductBinMainComponent } from './product-bin-main/product-bin-main.component';
import { ProductBinHomeComponent } from './product-bin-home/product-bin-home.component';
import { AddEditProductBinComponent } from './product-bin-home/add-edit-product-bin/add-edit-product-bin.component';
import { ViewProductBinComponent } from './product-bin-home/view-product-bin/view-product-bin.component';

const routes: Routes = [
  {
    path: '', component: ProductBinMainComponent, children: [
      { path: '', component: ProductBinHomeComponent },
      { path: 'addProductBin', component: AddEditProductBinComponent },
      { path: 'viewProductBin', component: ViewProductBinComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductBinRoutingModule { }
