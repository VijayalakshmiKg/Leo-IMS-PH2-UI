import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SentVerifyMailComponent } from './sent-verify-mail/sent-verify-mail.component';
import { HttpClientModule } from '@angular/common/http';
import { CreateNewPasswordComponent } from './create-new-password/create-new-password.component';
import { UpdateNewPasswordComponent } from './update-new-password/update-new-password.component';
import { OrganizationInformationComponent } from './organization-information/organization-information.component';
import { PrimaryContactInformationComponent } from './primary-contact-information/primary-contact-information.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { MFAPopUpComponent } from './login/mfapop-up/mfapop-up.component';
import { NgOtpInputModule } from 'ng-otp-input';




@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    SentVerifyMailComponent,
    CreateNewPasswordComponent,
    UpdateNewPasswordComponent,
    OrganizationInformationComponent,
    PrimaryContactInformationComponent,
    WelcomeScreenComponent,
    MFAPopUpComponent,
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgOtpInputModule

    
  ]
})
export class LoginModule { }
