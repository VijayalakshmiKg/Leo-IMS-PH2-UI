import { Component, } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community'
@Component({
    selector: "message-field",
    template: ` <form >
       <div  >
 <div  class="transit" *ngIf="datas.status.trim('\') == 'Material in transit' || datas.status.trim('\') == 'Assigned'  || datas.status.trim('\') == 'Material arrived' || datas.status.trim('\') == 'Load arrived' || datas.status.trim('\') == 'Material verified' "><svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none" >
  <circle cx="4" cy="4" r="4" fill="#FF9900"/>
</svg>{{datas.status ? datas.status : '-'}}</div>
  <div  class="tipped" *ngIf="datas.status.trim('\') == 'Tipped' " ><svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
  <circle cx="4" cy="4" r="4" fill="#52AC56"/>
</svg>{{datas.status ? datas.status : '-'}}</div>
  <div  class="reached" *ngIf="datas.status.trim('\') == 'Reached Site' || datas.status.trim('\') == 'Load in transit' || datas.status.trim('\') ==  'Bin assigned' ||  datas.status.trim('\') == 'Collected' || datas.status.trim('\')  == 'Sign off' " ><svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
  <circle cx="4" cy="4" r="4" fill="#3A91E1"/>
</svg>{{datas.status ? datas.status : '-'}}</div>
   <div class="weighed" *ngIf="datas.status.trim('\') == 'Weighed' || datas.status.trim('\') ==  'Material Intake' || datas.status.trim('\') == 'Driver in transit' || datas.status.trim('\') == 'Driver arrived' || datas.status.trim('\') == 'Tipping'" ><svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
  <circle cx="4" cy="4" r="4" fill="#6566C0"/>
</svg>{{datas.status ? datas.status : '-'}}</div>
    </div>
    </form>`,
    styles: [`
        .transit {
           color: #F90;

font-size: 13px;
font-style: normal;
font-weight: 500;

         }
  .tipped {
          color: #52AC56;
font-size: 13px;
font-style: normal;
font-weight: 500;

         }
  .weighed {
           color: #6566C0;

font-size: 13px;
font-style: normal;
font-weight: 500;

         }
  .reached {
          color: #3A91E1;
font-size: 13px;
font-style: normal;
font-weight: 500;

         }
            
        `]
})


export class StatusColumn {
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

}