import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../components/loader/loader.component';
import { ToasterComponent } from '../components/toaster/toaster.component';
import { TimePickerComponent } from '../components/time-picker/time-picker.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
// import { CustomMessageBoxComponent } from '../components/custom-message-box/custom-message-box.component';





@NgModule({
  declarations: [
    //add reuse component like pipe, directive etcc... Don't forget to exports section what you declarations, imports and providers.
    // LoaderComponent,
    // ToasterComponent,
    TimePickerComponent,
    // CustomMessageBoxComponent,
    
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    
    //resuable module here

  ],
  providers : [
    DatePipe
  ],
  exports : [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    // LoaderComponent,
    // ToasterComponent,
    TimePickerComponent,
    NgxMaterialTimepickerModule,
    // CustomMessageBoxComponent
    

  ]
})
export class AngularCoreModule { }
