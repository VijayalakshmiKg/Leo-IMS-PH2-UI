import { NgModule } from '@angular/core';
import { ExecutiveDashboardComponent } from './executive-dashboard.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExecutiveRoutingModule } from './executive-routing';
import { ExecutiveHomeComponent } from './executive-home/executive-home.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
    declarations: [ExecutiveDashboardComponent, ExecutiveHomeComponent],
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        AgGridModule,
        ExecutiveRoutingModule,
    ]
})


export class ExecutiveModule { }