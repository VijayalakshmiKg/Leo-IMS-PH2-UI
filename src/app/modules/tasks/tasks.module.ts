import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksHomeComponent } from './tasks-home/tasks-home.component';
import { TasksMainComponent } from './tasks-main/tasks-main.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { ViewTaskComponent } from './tasks-home/view-task/view-task.component';
import { QualityTaskComponent } from './tasks-home/quality-task/quality-task.component';
import { AddTaskComponent } from './tasks-home/add-task/add-task.component';
// import { TasktableComponent } from './tasks-home/taskNgclass';



@NgModule({
  declarations: [
    TasksHomeComponent,
    TasksMainComponent,
    ViewTaskComponent,
    QualityTaskComponent,
    AddTaskComponent,
    // TasktableComponent
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class TasksModule { }
