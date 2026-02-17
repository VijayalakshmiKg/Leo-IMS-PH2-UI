import { Component, } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community'
@Component({
    selector: "message-field",
    template: ` <form >
       <div class="status-column" >
 <div  class="transit" *ngIf="datas.status.trim('\') == 'Load in transit' "><svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none" >
  <circle cx="4" cy="4" r="4" fill="#FF9900"/>
</svg>{{datas.status ? datas.status : '-'}}</div>
  <div  class="weighed" *ngIf="datas.status.trim('\') == 'Weighed' " ><svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
  <circle cx="4" cy="4" r="4" fill="#52AC56"/>
</svg>{{datas.status ? datas.status : '-'}}</div>
  <div  class="collected" *ngIf="datas.status.trim('\') == 'Load arrived' " ><svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
  <circle cx="4" cy="4" r="4" fill="#3A91E1"/>
</svg>{{datas.status ? datas.status : '-'}}</div>
  
    </div>
    </form>`,
    styles: [`
       .status-column .transit {
         color: #F90;
font-family: BlinkMacSystemFont;
font-size: 13px;
font-style: normal;
font-weight: 500;

         }
 .status-column .weighed {
       color: #52AC56;
font-family: BlinkMacSystemFont;
font-size: 13px;
font-style: normal;
font-weight: 500;

         }
 .status-column .collected {
        color: var(--Status-Converted, #007AFF);
font-family: BlinkMacSystemFont;
font-size: 13px;
font-style: normal;
font-weight: 500;

         }
            
        `]
})


export class TaskColumn {
    public params!: ICellRendererParams;

    agInit(params: ICellRendererParams): void {
        this.params = params;


        this.getmodel(params)
    }
    datas: any

    private getmodel(params: ICellRendererParams) {
        this.datas = params.data
    }

}