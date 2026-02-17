import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersMainComponent } from './users-main/users-main.component';
import { UsersHomeComponent } from './users-home/users-home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { AddUsersComponent } from './users-home/add-users/add-users.component';
import { UsersViewComponent } from './users-home/users-view/users-view.component';
import { UserDeleteComponent } from './users-home/user-delete/user-delete.component';
import { ResetPswdPopupComponent } from './users-home/reset-pswd-popup/reset-pswd-popup.component';


@NgModule({
  declarations: [
    UsersMainComponent,
    UsersHomeComponent,
    AddUsersComponent,
    UsersViewComponent,
    UserDeleteComponent,
    ResetPswdPopupComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class UsersModule { }
