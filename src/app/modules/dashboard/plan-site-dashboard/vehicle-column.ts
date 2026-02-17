import { Component, ElementRef, ViewChild, } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community'
@Component({
    selector: "message-field",
    template: ` <form >
       <div 
       [matTooltip]="datas.registrationNo"
       matTooltipPosition="above"
        class="d-flex justify-content-between  " >
 <div  class="ag-cell-value" >{{datas.registrationNo ? datas.registrationNo : '-'}}</div>

    </div>
    </form>`,
    styles: [`
   
.ag-cell-value {
  width:100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
            
        `]
})


export class PlantVehicleColumn {
    @ViewChild(MatTooltip) tooltip!: MatTooltip;
    constructor(public router: Router) {
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

   
   
}