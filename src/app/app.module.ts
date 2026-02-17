import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpErrorInterceptor } from './core/interceptors/httpErrorInterceptor';
import { LoadingScreenInterceptor } from './core/interceptors/loadingscreen-interceptor.service';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './shared/modules/material.module';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuHeaderSectionComponent } from './ux/menu-header-section/menu-header-section.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './core/guards/auth.service';
import { CustomHttpService } from './core/http/custom-http.service';
import { LoginService } from './modules/login/login.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ToasterComponent } from './shared/components/toaster/toaster.component';
import { DeletePopupComponent } from './shared/components/delete-popup/delete-popup.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { NotificationPopupComponent } from './shared/components/notification-popup/notification-popup.component';
import { NotificationToasterComponent } from './shared/components/notification-toaster/notification-toaster.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { AddNotesComponent } from './modules/dashboard/add-notes/add-notes.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TimePickerComponent } from './shared/components/time-picker/time-picker.component';
import { TransportDashboardComponent } from './modules/dashboard/transport-dashboard/transport-dashboard.component';
import { DashboardService } from './modules/dashboard/dashboard.service';
import { AgGridModule } from 'ag-grid-angular';
import { StatusColumn } from './modules/dashboard/transport-dashboard/status-column';
import { PlanSiteDashboardComponent } from './modules/dashboard/plan-site-dashboard/plant-site-dashboard.component';
import { TrackStatusColumn } from './modules/dashboard/plan-site-dashboard/track-status-column';
import { TaskStatusColumn } from './modules/dashboard/plan-site-dashboard/task-status-column';
import { DriverStatusColumn } from './modules/dashboard/plan-site-dashboard/drivers-status-column';
import { WeighBridgeDashboardComponent } from './modules/dashboard/weigh-bridge-dashboard/weigh-bridge-dashboard.component';
import { AddNoteComponent } from './modules/dashboard/weigh-bridge-dashboard/add-note/add-note.component';
import { FaxNumberPipe } from './shared/pipes/fax-number.pipe';
import { TaskColumn } from './modules/dashboard/weigh-bridge-dashboard/task-column';
import { DocumentViewerComponent } from './shared/components/document-viewer/document-viewer.component';
import { AccountManagerComponent } from './modules/dashboard/account-manager/account-manager.component';
import { ConsineeColumn } from './modules/dashboard/transport-dashboard/ConsineeColumn';
import { PendingColumn } from './modules/dashboard/transport-dashboard/pending-column';
import { SupplierColumn } from './modules/dashboard/transport-dashboard/supplier-column';
import { DriverColumn } from './modules/dashboard/transport-dashboard/driver-column';
import { ProductColumn } from './modules/dashboard/transport-dashboard/puduct-column';
import { truckColumn } from './modules/dashboard/transport-dashboard/track-column';
import { TrailerColumn } from './modules/dashboard/transport-dashboard/trailer-column';
import { PlantDriverColumn } from './modules/dashboard/plan-site-dashboard/driver-column';
import { PlantTrailerColumn } from './modules/dashboard/plan-site-dashboard/trailer-column';
import { PlantVehicleColumn } from './modules/dashboard/plan-site-dashboard/vehicle-column';
import { PlantProductColumn } from './modules/dashboard/plan-site-dashboard/product-column';
import { PlantShunterColumn } from './modules/dashboard/plan-site-dashboard/shunter-column';
import { PlantBinNameColumn } from './modules/dashboard/plan-site-dashboard/bin-name';
import { QualityManagerComponent } from './modules/dashboard/quality-manager/quality-manager.component';
import { NotAuthorizedComponent } from './shared/components/not-authorized/not-authorized.component';
import { PlannerDashboardComponent } from './modules/dashboard/planner-dashboard/planner-dashboard/planner-dashboard.component';
import { PlannerPaginatorComponent } from './modules/dashboard/planner-dashboard/planner-paginator/planner-paginator.component';
import { WeighbridgeDashboardComponent } from './modules/dashboard/weighbridge-dashboard/weighbridge-dashboard/weighbridge-dashboard.component';
import { RecordsComponent } from './modules/dashboard/records/records.component';
import { RecordsService } from './modules/dashboard/records/records.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoaderComponent,
    MenuHeaderSectionComponent,
    ToasterComponent,
    DeletePopupComponent,
    NotificationPopupComponent,
    DashboardComponent,
    AddNotesComponent,
    NotificationToasterComponent,
    TimePickerComponent,
    TransportDashboardComponent,
    StatusColumn,
    PlanSiteDashboardComponent,
    TrackStatusColumn,
    TaskStatusColumn,
    DriverStatusColumn,
    WeighBridgeDashboardComponent,
    AddNoteComponent,
    TaskColumn,
    DocumentViewerComponent,
    AccountManagerComponent,
    ConsineeColumn,
    PendingColumn,
    SupplierColumn,
    DriverColumn,
    truckColumn,
    ProductColumn,
    TrailerColumn,
    PlantVehicleColumn,
    PlantDriverColumn,
    PlantTrailerColumn,
    PlantShunterColumn,
    PlantProductColumn,
    PlantBinNameColumn,
    QualityManagerComponent,
    NotAuthorizedComponent,
    PlannerDashboardComponent,
    PlannerPaginatorComponent,
    WeighbridgeDashboardComponent,
    RecordsComponent

  ],
  imports: [
   AppRoutingModule,
   MaterialModule,
   BrowserModule,
   ReactiveFormsModule,
   FormsModule,
   BrowserAnimationsModule,
   CommonModule,
   HttpClientModule,
   NgOtpInputModule,
   NgApexchartsModule,
   NgxMaterialTimepickerModule.setOpts('en-US'),
  AgGridModule,
  // FaxNumberPipe
  ],
  providers: [
    DatePipe,
    AuthService,
    CustomHttpService,
    LoginService,
    DashboardService,
    RecordsService,
   { provide:HTTP_INTERCEPTORS,useClass:HttpErrorInterceptor,multi:true},
   {provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'primary' },},
   { provide:HTTP_INTERCEPTORS,useClass: LoadingScreenInterceptor, multi: true },
  

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
