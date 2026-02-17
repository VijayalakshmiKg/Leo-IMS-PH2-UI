import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsHomeComponent } from './settings-home/settings-home.component';
import { ProfileHomeComponent } from './settings-home/profile-home/profile-home.component';
import { SecurityComponent } from './settings-home/security/security.component';
import { MastersComponent } from './settings-home/masters/masters.component';
import { VendorsComponent } from './settings-home/masters/vendors/vendors.component';
import { RolesComponent } from './settings-home/masters/roles/roles.component';
import { CategoryTypeComponent } from './settings-home/masters/category-type/category-type.component';
import { GendersComponent } from './settings-home/masters/genders/genders.component';
import { MaterialTypeComponent } from './settings-home/masters/material-type/material-type.component';
import { MaterialComponent } from './settings-home/masters/material/material.component';
import { StatusComponent } from './settings-home/masters/status/status.component';
import { TrailersComponent } from './settings-home/masters/trailers/trailers.component';
import { UnitsComponent } from './settings-home/masters/units/units.component';
import { VehicleTypeComponent } from './settings-home/masters/vehicle-type/vehicle-type.component';
import { VehicleComponent } from './settings-home/masters/vehicle/vehicle.component';
import { EditProfileComponent } from './settings-home/profile-home/edit-profile/edit-profile.component';
import { ProfileMainComponent } from './settings-home/profile-home/profile-main/profile-main.component';
import { RolesPermissionHomeComponent } from './settings-home/roles-permission/roles-permission-home/roles-permission-home.component';
import { AddEditRolesPermissionComponent } from './settings-home/roles-permission/roles-permission-home/add-edit-roles-permission/add-edit-roles-permission.component';
import { RoleAndPermissionMainComponent } from './settings-home/roles-permission/role-and-permission-main/role-and-permission-main.component';
import { TemperatureComponent } from './settings-home/masters/temperature/temperature.component';
import { BinComponent } from './settings-home/masters/bin/bin.component';
import { TrailerTypeComponent } from './settings-home/masters/trailer-type/trailer-type.component';

const routes: Routes = [
  { 
    path: '', 
    component: SettingsHomeComponent, 
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileMainComponent , children:[
        {path:'', component:ProfileHomeComponent },
        {path:'editProfile' , component:EditProfileComponent},
      ] },
      { path: 'security', component: SecurityComponent },
      { path: 'roles', component: RolesPermissionHomeComponent },
      { path: 'addEditRoles', component: AddEditRolesPermissionComponent },
      { 
        path: 'masters', 
        component: MastersComponent, 
        children: [
          { path: '', redirectTo: 'vendors', pathMatch: 'full' }, 
          { path: 'vendors', component: VendorsComponent },
          { path: 'roles', component: RolesComponent },
          { path: 'vehicleType', component: VehicleTypeComponent },
          { path: 'vehicle', component: VehicleComponent },
          { path: 'units', component: UnitsComponent },
          { path: 'trailers', component: TrailersComponent },
          { path: 'status', component: StatusComponent },
          { path: 'materialType', component: MaterialTypeComponent },
          { path: 'material', component: MaterialComponent },
          { path: 'genders', component: GendersComponent },
          { path: 'category', component: CategoryTypeComponent },
          { path: 'temperature', component: TemperatureComponent },
          { path: 'bin', component: BinComponent },
          { path: 'trailerType', component: TrailerTypeComponent },
        ] 
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountSettingsRoutingModule { }
