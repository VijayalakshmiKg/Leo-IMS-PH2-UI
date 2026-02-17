import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SentVerifyMailComponent } from './sent-verify-mail/sent-verify-mail.component';
import { CreateNewPasswordComponent } from './create-new-password/create-new-password.component';
import { UpdateNewPasswordComponent } from './update-new-password/update-new-password.component';
import { OrganizationInformationComponent } from './organization-information/organization-information.component';
import { PrimaryContactInformationComponent } from './primary-contact-information/primary-contact-information.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
// import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: "", component: LoginComponent, children: [
      { path: 'login', component: LoginComponent },

    ]
  },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  { path: 'sentVerifymail', component: SentVerifyMailComponent },
  { path: 'createnewPassword', component: CreateNewPasswordComponent },
  { path: 'updatePassword', component: UpdateNewPasswordComponent },
  { path: 'organizationInfo', component: OrganizationInformationComponent },
  { path: 'primaryContactInfo', component: PrimaryContactInformationComponent },
  { path: 'welcomeScreen', component: WelcomeScreenComponent },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
