import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersMainComponent } from './users-main/users-main.component';
import { UsersHomeComponent } from './users-home/users-home.component';
import { AddUsersComponent } from './users-home/add-users/add-users.component';
import { UsersViewComponent } from './users-home/users-view/users-view.component';

const routes: Routes = [
  {path:'' , component:UsersMainComponent, children:[
    {path:'' , component:UsersHomeComponent},
    {path:'addUsers' , component:AddUsersComponent},
    {path:'viewUsers' , component:UsersViewComponent},
  ]


   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
