import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginAuthGuard } from './core/guards/login-guard';
import { RoleGuard } from './shared/guard/role.guard';
import { CanDeactivateGuard } from './core/guards/can-deactivate.guard';
import { NotAuthorizedComponent } from './shared/components/not-authorized/not-authorized.component';
import { RecordsComponent } from './modules/dashboard/records/records.component';

const routes: Routes = [
  {
    path: "", redirectTo: "login", pathMatch: 'full'
  },
  {
    path: 'login', canActivate: [LoginAuthGuard], loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
  },
  { path: 'not-authorized', component: NotAuthorizedComponent },
  {
    path: 'home', component: HomeComponent, children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [RoleGuard], canDeactivate: [CanDeactivateGuard] },
      { path: 'executive-dashboard', loadChildren: () => import('./modules/executive-dashboard/executive-module').then(m => m.ExecutiveModule), canActivate: [RoleGuard] },
      { path: 'users', loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule), canActivate: [RoleGuard] },
      { path: 'settings', loadChildren: () => import('./modules/account-settings/account-settings.module').then(m => m.AccountSettingsModule), canActivate: [RoleGuard] },
      { path: 'drivers', loadChildren: () => import('./modules/drivers/drivers.module').then(m => m.DriversModule), canActivate: [RoleGuard] },
      { path: 'vehicle', loadChildren: () => import('./modules/vehicle/vehicle.module').then(m => m.VehicleModule), canActivate: [RoleGuard] },
      { path: 'trailer', loadChildren: () => import('./modules/trailer/trailer.module').then(m => m.TrailerModule), canActivate: [RoleGuard] },
      { path: 'trailerType', loadChildren: () => import('./modules/trailer-type/trailer-type.module').then(m => m.TrailerTypeModule), canActivate: [RoleGuard] },
      { path: 'material', loadChildren: () => import('./modules/material/material.module').then(m => m.MaterialsModule), canActivate: [RoleGuard] },
      { path: 'orders', loadChildren: () => import('./modules/orders/orders.module').then(m => m.OrdersModule), canActivate: [RoleGuard] },
      { path: 'consignor', loadChildren: () => import('./modules/consignor/consignor.module').then(m => m.ConsignorModule), canActivate: [RoleGuard] },
      { path: 'consignee', loadChildren: () => import('./modules/consignee/consignee.module').then(m => m.ConsigneeModule), canActivate: [RoleGuard] },
      { path: 'tasks', loadChildren: () => import('./modules/tasks/tasks.module').then(m => m.TasksModule), canActivate: [RoleGuard] },
      { path: 'tracking', loadChildren: () => import('./modules/tracking/tracking.module').then(m => m.TrackingModule), canActivate: [RoleGuard] },
      { path: 'supplier', loadChildren: () => import('./modules/supplier/supplier.module').then(m => m.SupplierModule), canActivate: [RoleGuard] },
      { path: 'reports', loadChildren: () => import('./modules/reports/reports.module').then(m => m.ReportsModule), canActivate: [RoleGuard] },
      { path: 'template', loadChildren: () => import('./modules/template/template.module').then(m => m.TemplateModule), canActivate: [RoleGuard] },
      { path: 'shunterDrivers', loadChildren: () => import('./modules/shunter-driver/shunter-driver.module').then(m => m.ShunterDriverModule), canActivate: [RoleGuard] },
      { path: 'trailerWashers', loadChildren: () => import('./modules/trailer-washer/trailer-washer.module').then(m => m.TrailerWasherModule), canActivate: [RoleGuard] },
      { path: 'product', loadChildren: () => import('./modules/product/product.module').then(m => m.ProductModule), canActivate: [RoleGuard] },
      { path: 'productType', loadChildren: () => import('./modules/product-type/product-type.module').then(m => m.ProductTypeModule), canActivate: [RoleGuard] },
      { path: 'customer', loadChildren: () => import('./modules/customer/customer.module').then(m => m.CustomerModule), canActivate: [RoleGuard] },
      { path: 'status', loadChildren: () => import('./modules/status/status.module').then(m => m.StatusModule), canActivate: [RoleGuard] },
      { path: 'location', loadChildren: () => import('./modules/location/location.module').then(m => m.LocationModule), canActivate: [RoleGuard] },
      { path: 'customerProduct', loadChildren: () => import('./modules/customer-product/customer-product.module').then(m => m.CustomerProductModule), canActivate: [RoleGuard] },
      { path: 'customerProductType', loadChildren: () => import('./modules/customer-product-type/customer-product-type.module').then(m => m.CustomerProductTypeModule), canActivate: [RoleGuard] },
      { path: 'customerTrailerIn', loadChildren: () => import('./modules/customer-trailer-in/customer-trailer-in.module').then(m => m.CustomerTrailerInModule), canActivate: [RoleGuard] },
      { path: 'customerTrailerInType', loadChildren: () => import('./modules/customer-trailer-in-type/customer-trailer-in-type.module').then(m => m.CustomerTrailerInTypeModule), canActivate: [RoleGuard] },
      { path: 'customerTrailerOut', loadChildren: () => import('./modules/customer-trailer-out/customer-trailer-out.module').then(m => m.CustomerTrailerOutModule), canActivate: [RoleGuard] },
      { path: 'customerTrailerOutType', loadChildren: () => import('./modules/customer-trailer-out-type/customer-trailer-out-type.module').then(m => m.CustomerTrailerOutTypeModule), canActivate: [RoleGuard] },
      { path: 'customerDriver', loadChildren: () => import('./modules/customer-driver/customer-driver.module').then(m => m.CustomerDriverModule), canActivate: [RoleGuard] },
      { path: 'customerLocation', loadChildren: () => import('./modules/customer-location/customer-location.module').then(m => m.CustomerLocationModule), canActivate: [RoleGuard] },
      { path: 'records', component: RecordsComponent, canActivate: [RoleGuard] },
      
    ]
  },
  { path: '**', redirectTo: '/not-authorized' }
];


@NgModule({
  // imports: [RouterModule.forRoot(routes)],
  // exports: [RouterModule]
  imports:[RouterModule.forRoot(routes)],
  exports:[RouterModule]
})
export class AppRoutingModule { }
