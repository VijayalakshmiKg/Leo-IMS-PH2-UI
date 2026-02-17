import { Component, } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community'
import { DashboardService } from '../dashboard.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { OrdersService } from '../../orders/orders.service';
@Component({
    selector: "message-field",
    template: ` <form >
       <div class="d-flex justify-content-between  consinee" >
 <div   [matTooltip]="datas.draftPending"
       matTooltipPosition="above" class="pending-sts ag-cell-value" >{{datas.draftPending ? datas.draftPending : '-'}}</div>
  <div class="to-assign "  >
<button mat-icon-button [matMenuTriggerFor]="menu" aria-label="">
  <mat-icon>more_vert</mat-icon>
</button>
<mat-menu #menu="matMenu">
  <button mat-menu-item (click)="moveToOrder(datas)">
    <span>Assign order</span>
  </button>
  <button mat-menu-item (click)="deleteOrder(datas)" *ngIf="permissions?.deleteAccess">
    <span>Delete order</span>
  </button>
 
</mat-menu>
        </div>
    </div>
    </form>`,
    styles: [`
        .pending-sts {
           color:#E81C28;

font-size: 13px;
font-style: normal;
font-weight: 500;

         }
 
.to-assign {
display:none
}
.consinee {
cursor: pointer;
}
.consinee:hover {
.to-assign {
display:block
}
}
 ::ng-deep .ag-theme-material .ag-row-hover {
        .to-assign {
display:block !important;
}
      }
.ag-cell-value {
  width:100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
            
        `]
})


export class PendingColumn {
    logedInUser: any;
  permissions: any;
    constructor(public router: Router, public dashboardService:DashboardService, public utilServ:UtilityService,public ordersServ:OrdersService) {
    let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
for(var i=0;i<parsedData.rootMenu.length;i++){
if(parsedData.rootMenu[i].rootMenuName.toLowerCase() == 'dashboard'){
  this.permissions = parsedData.rootMenu[i];
  this.dashboardService.permissions = this.permissions
}
}
//console.log(this.permissions);
    }
    public params!: ICellRendererParams;

    agInit(params: ICellRendererParams): void {
        this.params = params;

        // //console.log(this.params);

        this.getmodel(params)
    }
    datas: any

    private getmodel(params: ICellRendererParams) {
        this.datas = params.data
        // //console.log(this.datas);
    }
    moveToOrder(datas: any) {
      this.ordersServ.editOrdersRecord = datas
      this.router.navigateByUrl('/home/orders/addOrders')
        // this.router.navigate(["/home/orders",datas])
    }
    deleteOrder(order:any) {
        this.dashboardService.deleteOrder(order.orderID).then((res:any)=> {
            //console.log(res);
            if(res) {
                          this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Moment document deleted successfully!' });
                this.dashboardService.orderDeleteSub$.next(true);
            }
        })
    }
}