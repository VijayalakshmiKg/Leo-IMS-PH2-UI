import { Component, } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community'
@Component({
    selector: "message-field",
    template: ` <form >
       <div class="status-column" >

  <div  class="tipped" *ngIf="datas.status.trim('\') == 'Available' " ><svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
  <circle cx="4" cy="4" r="4" fill="#52AC56"/>
</svg>{{datas.status ? datas.status : '-'}}</div>

   <div class="on-duty" *ngIf="datas.status.trim('\') == 'On duty' " ><svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
  <circle cx="4" cy="4" r="4" fill="#E81C28"/>
</svg>{{datas.status ? datas.status : '-'}}</div>
    </div>
    </form>`,
    styles: [`
      
  .status-column .tipped {
          color: #52AC56;
font-size: 13px;
font-style: normal;
font-weight: 500;

         }
 .status-column .on-duty {
   color: var(--Status-Not-Interested, #E81C28);
font-family: BlinkMacSystemFont;
font-size: 13px;
font-style: normal;
font-weight: 500;

         }

            
        `]
})


export class DriverStatusColumn {
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