import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material Modules
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PmrecordsComponent } from './pmrecords.component';
import { PmrecordsService } from './pmrecords.service';

const routes: Routes = [
  {
    path: '',
    component: PmrecordsComponent
  }
];

@NgModule({
  declarations: [
    PmrecordsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatPaginatorModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  providers: [
    PmrecordsService
  ]
})
export class PmrecordsModule { }
