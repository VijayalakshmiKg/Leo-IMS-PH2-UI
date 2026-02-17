import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CanComponentDeactivate } from 'src/app/core/guards/can-deactivate.guard';
import { PlannerDashboardComponent } from './planner-dashboard/planner-dashboard/planner-dashboard.component';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, CanComponentDeactivate {
  // public chartOptions : any | any[] = [];

  @ViewChild(PlannerDashboardComponent) plannerDashboard!: PlannerDashboardComponent;
  

constructor(public title:Title){
  this.title.setTitle("Leo Group Ltd | Dashboard");

  
}
get loggedInUser() {
  let user:any = localStorage.getItem('loggedInUser')
  return JSON.parse(user)
}

// Check if there's unsaved data in child components
canDeactivate(): boolean {
  // Check if planner dashboard has unsaved data
  if (this.plannerDashboard && this.plannerDashboard.hasUnsavedData()) {
    return confirm('You have unsaved changes. Are you sure you want to leave this page? Any unsaved work will be lost.');
  }
  return true;
}

ngOnInit(): void {
  //console.log(this.loggedInUser);
  
}
}
