import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksMainComponent } from './tasks-main/tasks-main.component';
import { TasksHomeComponent } from './tasks-home/tasks-home.component';
import { ViewTaskComponent } from './tasks-home/view-task/view-task.component';
import { QualityTaskComponent } from './tasks-home/quality-task/quality-task.component';
import { AddTaskComponent } from './tasks-home/add-task/add-task.component';
import { CanDeactivateGuard } from 'src/app/shared/guard/can-deactivate.guard';

const routes: Routes = [
  {
    path: '', component: TasksMainComponent, children: [
      { path: '', component: TasksHomeComponent },
      { path: 'addTasks', component: AddTaskComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'qualityTask', component: QualityTaskComponent },
      { path: 'viewTasks', component: ViewTaskComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
