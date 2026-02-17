import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { ExecutiveDashboardComponent } from "./executive-dashboard.component"
import { ExecutiveHomeComponent } from "./executive-home/executive-home.component"
const routes: Routes = [

    {path:'', component:ExecutiveDashboardComponent ,children:[
        {path:"",component:ExecutiveHomeComponent}
    ]},
]

@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports:[RouterModule]
})
export class ExecutiveRoutingModule { }