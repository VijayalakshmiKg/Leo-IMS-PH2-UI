import { Component, } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community'
@Component({
    selector: "message-field",
    template: ` <form >
       <div class="status-column" >

  <div  [matTooltip]="datas?.status"
       matTooltipPosition="above" class="tipped" *ngIf="datas?.status?.trim('\') == 'Tipping' " ><svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
  <circle cx="4" cy="4" r="4" fill="#52AC56"/>
</svg>{{datas?.status ? datas.status : '-'}}</div>
  <div [matTooltip]="datas.status"
       matTooltipPosition="above"  class="assigned" *ngIf=" datas?.status?.trim('\') ==  'Bin assigned' " ><svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
  <circle cx="4" cy="4" r="4" fill="#F90"/>
</svg>{{datas?.status ? datas.status : '-'}}</div>
  
    </div>
    </form>`,
    styles: [`
    
  .status-column .tipped {
          color: #52AC56;
font-size: 13px;
font-style: normal;
font-weight: 500;

         }

 .status-column .assigned {
  color: #F90;
font-family: BlinkMacSystemFont;
font-size: 13px;
font-style: normal;
font-weight: 500;

         }
            
        `]
})


export class TaskStatusColumn {
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