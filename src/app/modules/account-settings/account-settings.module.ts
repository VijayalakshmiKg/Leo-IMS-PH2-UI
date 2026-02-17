import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { AccountSettingsRoutingModule } from './account-settings-routing.module';
import { AddBinComponent } from './settings-home/masters/bin/add-bin/add-bin.component';
import { BinComponent } from './settings-home/masters/bin/bin.component';
import { AddCategoryTypeComponent } from './settings-home/masters/category-type/add-category-type/add-category-type.component';
import { CategoryTypeComponent } from './settings-home/masters/category-type/category-type.component';
import { AddGendersComponent } from './settings-home/masters/genders/add-genders/add-genders.component';
import { GendersComponent } from './settings-home/masters/genders/genders.component';
import { MastersComponent } from './settings-home/masters/masters.component';
import { AddMaterialTypeComponent } from './settings-home/masters/material-type/add-material-type/add-material-type.component';
import { MaterialTypeComponent } from './settings-home/masters/material-type/material-type.component';
import { MaterialComponent } from './settings-home/masters/material/material.component';
import { AddRolesComponent } from './settings-home/masters/roles/add-roles/add-roles.component';
import { RolesComponent } from './settings-home/masters/roles/roles.component';
import { AddStatusComponent } from './settings-home/masters/status/add-status/add-status.component';
import { StatusComponent } from './settings-home/masters/status/status.component';
import { AddTemperatureComponent } from './settings-home/masters/temperature/add-temperature/add-temperature.component';
import { TemperatureComponent } from './settings-home/masters/temperature/temperature.component';
import { AddTrailerTypeComponent } from './settings-home/masters/trailer-type/add-trailer-type/add-trailer-type.component';
import { TrailerTypeComponent } from './settings-home/masters/trailer-type/trailer-type.component';
import { AddTrailersComponent } from './settings-home/masters/trailers/add-trailers/add-trailers.component';
import { TrailersComponent } from './settings-home/masters/trailers/trailers.component';
import { AddUnitsComponent } from './settings-home/masters/units/add-units/add-units.component';
import { UnitsComponent } from './settings-home/masters/units/units.component';
import { AddVehicleTypeComponent } from './settings-home/masters/vehicle-type/add-vehicle-type/add-vehicle-type.component';
import { VehicleTypeComponent } from './settings-home/masters/vehicle-type/vehicle-type.component';
import { VehicleComponent } from './settings-home/masters/vehicle/vehicle.component';
import { AddVendorsComponent } from './settings-home/masters/vendors/add-vendors/add-vendors.component';
import { VendorsComponent } from './settings-home/masters/vendors/vendors.component';
import { EditProfileComponent } from './settings-home/profile-home/edit-profile/edit-profile.component';
import { ProfileHomeComponent } from './settings-home/profile-home/profile-home.component';
import { ProfileMainComponent } from './settings-home/profile-home/profile-main/profile-main.component';
import { RoleAndPermissionMainComponent } from './settings-home/roles-permission/role-and-permission-main/role-and-permission-main.component';
import { AddEditRolesPermissionComponent } from './settings-home/roles-permission/roles-permission-home/add-edit-roles-permission/add-edit-roles-permission.component';
import { RolesPermissionHomeComponent } from './settings-home/roles-permission/roles-permission-home/roles-permission-home.component';
import { ChangePasswordComponent } from './settings-home/security/change-password/change-password.component';
import { SecurityComponent } from './settings-home/security/security.component';
import { SettingsHomeComponent } from './settings-home/settings-home.component';
import { UserAccountVerifyComponent } from './settings-home/security/user-account-verify/user-account-verify.component';
import { QRVerificationComponent } from './settings-home/security/qrverification/qrverification.component';
import { QRCodeModule } from 'angularx-qrcode';
import { FaxNumberPipe } from 'src/app/shared/pipes/fax-number.pipe';



@NgModule({
  declarations: [
    SettingsHomeComponent,
    ProfileHomeComponent,
    SecurityComponent,
    MastersComponent,
    VendorsComponent,
    RolesComponent,
    StatusComponent,
    VehicleComponent,
    MaterialComponent,
    MaterialTypeComponent,
    CategoryTypeComponent,
    UnitsComponent,
    GendersComponent,
    TrailersComponent,
    AddRolesComponent,
    AddGendersComponent,
    AddStatusComponent,
    AddVehicleTypeComponent,
    VehicleTypeComponent,
    AddUnitsComponent,
    AddTrailersComponent,
    AddVendorsComponent,
    AddMaterialTypeComponent,
    EditProfileComponent,
    ProfileMainComponent,
    ChangePasswordComponent,
    RolesPermissionHomeComponent,
    AddEditRolesPermissionComponent,
    RoleAndPermissionMainComponent,
    TemperatureComponent,
    AddTemperatureComponent,
    BinComponent,
    AddBinComponent,
    AddCategoryTypeComponent,
    TrailerTypeComponent,
    AddTrailerTypeComponent,
    UserAccountVerifyComponent,
    QRVerificationComponent,
    
  ],
  imports: [
    CommonModule,
    AccountSettingsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    QRCodeModule

  ]
})
export class AccountSettingsModule { }
