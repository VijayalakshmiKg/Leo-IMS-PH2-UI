import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddNoteComponent } from './add-note/add-note.component';
import { DashboardService } from '../dashboard.service';
import { OverviewModel } from './models/overview';
import { DatePipe } from '@angular/common';
import { TaskColumn } from './task-column';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-weigh-bridge-dashboard',
  templateUrl: './weigh-bridge-dashboard.component.html',
  styleUrls: ['./weigh-bridge-dashboard.component.css']
})
export class WeighBridgeDashboardComponent implements OnInit {
public chartOptions: Partial<ChartOptions> | any;
pageSize:any = 5;
pageSizeForTask:any = 5
dateInputValue:any = new Date();
overViewModel = new OverviewModel();
overViewList:any;
toDoList:any;
currentPageSize:any;
currentPage:any;
SelectedDateRangeForTask:any= "All";
SelectedDateRange:any = "Day";
customDateForm!:FormGroup;
cutomDateField:boolean = false;
TrucksList:any = [];
xAxisValue:any;
yAxisValue:any
//  TrucksHeaders = [{ field: 'orderID', headerName: "Id", sortable: true, maxWidth: 80 }, { field: 'orderNo', headerName: "Order No", sortable: true, maxWidth: 130 },
//   { field: 'driverName', headerName: "Driver", sortable: true, maxWidth: 125 }, { field: 'registrationNo', headerName: "Vehicle", maxWidth: 130 },
//   { field: 'trailerNumber', headerName: "Trailer", maxWidth: 130 },
//   { field: 'departureDateTime', headerName: "ATA", maxWidth: 130 },
//   { field: 'arrivalDateTime', headerName: "ETA", maxWidth: 130 }
  
//   ];
 TrucksHeaders = [{ field: 'orderID', headerName: "Id", sortable: true, maxWidth: 80 }, { field: 'orderNo', headerName: "Order No", sortable: true, maxWidth: 130 },
  { field: 'driverName', headerName: "Driver", sortable: true, maxWidth: 125 }, { field: 'registrationNo', headerName: "Vehicle", maxWidth: 130 },
  { field: 'trailerNumber', headerName: "Trailer", maxWidth: 130 },
  { field: 'arrivalDateTime', headerName: "ATA", maxWidth: 130 },
  { cellRenderer: TaskColumn, headerName: "status", maxWidth: 130 },
  ];
notes:any[] = [];
overViewCardCount:any;
  ChartOptionsForOrders: any;
  TasksList:any;
  overAllTaskList:any
    truckSearchSubject: Subject<any> = new Subject();
    dateText:any;
    orderChartList:any;
  constructor(public dialog:MatDialog ,public router:Router, public dashboardSerive:DashboardService, public datePipe:DatePipe ) { 
    this.chartOptions = {
      series: [
        {
          name: "Net Profit",
          data: [44, 55, 57, 56, 61, 58, 63],
          
        },
      
      ],
      chart: {
        type: "bar",
        height: 220,
        
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "35%",
         borderRadius:8,
        
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 6,
        colors: ["#13D090"]
      },
      xaxis: {
        categories: [
          "MON",
          "TUE",
          "WED",
          "THU",
          "FRI",
          "SAT",
          "SUN",
        ],
        
        
        
  
      },
      yaxis: {
        title: {
          // text: "$ (thousands)"
        },
        
      },
      fill: {
        opacity: 1,
        colors:['#13D090']
        
      },
      tooltip: {
        y: {
          formatter: function(val:any) {
            return "$ " + val + " thousands";
          }
        }
      }
    };
  }
  ngOnInit(): void {
       this.customDateForm = new FormGroup({
          "fromDate": new FormControl(Validators.required),
          "toDate": new FormControl(Validators.required),
        })
    // this.getOverview(this.dateInputValue)
    // this.getTrackListPagination(1,5);
    // this.getToDoList(this.getLocalUserData?.employeeId,1,10);
    //new design changes //
      // this.totalOrdersChart();

    this.getOverviewCount();
    this.getTrackListPagination("","",1,6);

    
    this.getOredersGraph(this.SelectedDateRange,"","");

    this.truckSearchSubject.pipe(debounceTime(200),
          distinctUntilChanged(),
          switchMap((query: any) => this.optimizeSearch(query))).subscribe((res: any) => {
            //console.log(res);
          });

  }
 optimizeSearch(key: any): Observable<any> {
  return of(this.getTrackListPagination(key,"",this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 6));
 }
  getOverviewCount() {
   this.dashboardSerive.weighBridgeCount().then((res:any)=>{
    //console.log(res);
    this.overViewCardCount = res
    
   })
  }
  get getLocalUserData() {
    let local:any = localStorage.getItem("userData");
   return JSON.parse( local)
  }
getToDoList(id:any,pageNo:any,pageSize:any) {
  this.dashboardSerive.getToDoList(id,pageNo,pageSize).then((res:any)=> {
    this.toDoList = res
    //console.log(res);
  })
}
  getOverview(date:any,page?:any,size?:any) {
    let newDate:any =  this.datePipe.transform(date, "dd/MM/yyyy") 
    this.overViewModel.Date = newDate
    this.overViewModel.PageNumber = page ? page : 1
     this.overViewModel.PageSize = size? size : 5
     this.overViewModel.FromDate = null
     this.overViewModel.ToDate = null
     this.overViewModel.ViewMode = "day";
    this.dashboardSerive.getWeighBridgeList(this.overViewModel).then((res:any)=> {
      //console.log(res);
      this.overViewList = res
    })
  }
  onPageChanged(event: any) {
    this.currentPage = event.pageIndex + 1;
    //console.log(this.currentPage,this.currentPageSize);
    
    this.getTrackListPagination("","",event.pageIndex + 1,event.pageSize)
  }
  getTrackListPagination(searchKey:any,filterKey:any,pageNumber:any,pageSize:any) {
    this.dashboardSerive.getWeighBridgeTaskTable(searchKey,filterKey,pageNumber,pageSize).then((res:any)=> {
this.overAllTaskList = res
      this.TasksList = res?.data?.map((val:any)=> {
        return {
          ...val,
          orderNo: val.orderNo ? val.orderNo : "-",
          arrivalDateTime : val.arrivalDateTime ? this.datePipe.transform(val.arrivalDateTime,"dd/MM/yyyy")  : "-",
          driverName : val.driverName ? val.driverName : "-",
          registrationNo : val.registrationNo ? val.registrationNo : "-",
          status : val.status ? val.status : "-",
          trailerNumber: val.trailerNumber ? val.trailerNumber : "-"
        }
       })
    })
  }

  switchMode(data:any) {
this.SelectedDateRangeForTask = data
this.getTrackListPagination("",this.SelectedDateRangeForTask,this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 6);

  }

  tableSearch(event:any) {
    //console.log(event.target.value);
    if (event.target.value?.length == 0) {
      this.getTrackListPagination("","",this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 6);
    } else {
      this.truckSearchSubject.next(event.target.value)
    }
  }
  addNotes(){
    var dia = this.dialog.open(AddNoteComponent,{
      panelClass:'add-notes',
      position: { right: "0" },
      height: "100vh",
      width: "700px",
      disableClose: true
    });
    dia.afterClosed().subscribe(res => {
        this.getToDoList(this.getLocalUserData?.employeeId,this.currentPage ? this.currentPage :1,this.currentPageSize ? this.currentPageSize :10)
    })
  }
  changeDateEvent(event:any) {
    this.dateInputValue = event?.value
    this.getOverview(this.dateInputValue)
  }

  updateTask(event:any,data:any) {
//console.log(data);
this.dashboardSerive.updateToDoList(data.id).then((res:any)=> {
if(res) {
  this.getToDoList(this.getLocalUserData?.employeeId,this.currentPage ? this.currentPage : 1,this.currentPageSize ? this.currentPageSize :10)
}
})

  }

  getOredersGraph(range:any,fromDate:any,toDate:any){
    this.dashboardSerive.getOrederGraph(range,fromDate,toDate).then((res:any)=>{
      //console.log(res);
      this.orderChartList = res
      if(res)
{
 
  
  this.totalOrdersChart(this.orderChartList[0]);
}      
    })

  }
  switchModeForOrders(type:any) {
    this.SelectedDateRange = type
    this.cutomDateField = false
    if (this.SelectedDateRange == 'custom range') {

      this.cutomDateField = true
    } else {
      this.cutomDateField = false
      this.getOredersGraph(this.SelectedDateRange,"","");
    }
  }
  changeDateEventForOrder(event:any) {
    let date: any = this.datePipe.transform(event?.value, "dd/MM/yyyy")
    this.SelectedDateRange = date
    this.getOredersGraph(this.SelectedDateRange,"","");
  }
  // onPageChangedForTask(event:any) {
  //   this.currentPage = event.pageIndex + 1;
  //   this.currentPageSize = event.pageSize;
  //   this.getToDoList(this.getLocalUserData?.employeeId,event.pageIndex + 1,event.pageSize)
  // }

  customRangeForDate() {
    //console.log(this.customDateForm);
    if (this.customDateForm.valid) {
this.dateText = this.datePipe.transform(this.customDateForm.value.fromDate,'MMM dd') +"- "+ this.datePipe.transform(this.customDateForm.value.toDate,'MMM dd')

      this.getOredersGraph("custom", this.datePipe.transform(this.customDateForm.value.fromDate,'dd/MM/yyyy'), this.datePipe.transform(this.customDateForm.value.toDate,'dd/MM/yyyy'));
    }
  }

  toDateValidation() {
    if (
      new Date(this.customDateForm.value.fromDate) <
      new Date(this.customDateForm.value.toDate)
    ) {
    } else {
      if (this.customDateForm.value.fromDate) {
        this.customDateForm.get("toDate")?.setValue(null)
      }
    }
  }
  fromDateValidation() {
    if (
      new Date(this.customDateForm.value.toDate) <
      new Date(this.customDateForm.value.fromDate)
    ) {
      if (this.customDateForm.value.toDate) {
        this.customDateForm.get("fromDate")?.setValue(null)
      }
    }
  }
  navigateToMenu(menu:any) {

    switch (menu) {
      case "tasks":
        this.router.navigateByUrl("/home/tasks")
        break;
        case "Orders":
        this.router.navigateByUrl("/home/orders")
        break;

    
      default:
        break;
    }

  }
  totalOrdersChart(data:any){
switch (this.SelectedDateRange) {
  case "Day":
    this.xAxisValue = Object.keys(this.orderChartList[0]?.timeIntervalDetails)
    this.yAxisValue = Object.values(this.orderChartList[0]?.timeIntervalDetails)
    //console.log(this.xAxisValue,this.yAxisValue);
    break;
    case "Week":
      this.yAxisValue = this.orderChartList[0]?.orderDetails.map((val:any)=> val.totalOrder)
      this.xAxisValue = this.orderChartList[0]?.orderDetails.map((val:any)=> val.orderDay)
    break;
    case "Month":
      this.yAxisValue = this.orderChartList[0]?.orderDetails.map((val:any)=> val.totalOrder)
      this.xAxisValue = this.orderChartList[0]?.orderDetails.map((val:any)=> val.orderWeek)
    break;
    case "custom range":
      this.yAxisValue = this.orderChartList[0]?.orderDetails.map((val:any)=> val.totalOrder)
      this.xAxisValue = this.orderChartList[0]?.orderDetails.map((val:any)=> val.orderDate)
    break;

  default:
    break;
}
    this.ChartOptionsForOrders = {
      series: [
        {
          name: "Orders",
          data: this.yAxisValue ? this.yAxisValue : [0,0,0,0,0,0],
          color: "#25AE4D" 
        }
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
      toolbar:{
        show:false,
        
      }
      },
      
      colors: ["#25AE4D"],  // Set line color

      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: 'smooth',
        width: 3, // Adjust line thickness if needed
        colors: ["#25AE4D"], // Explicitly setting stroke color,
        hover: {
          colors: ["#FF5733"] // Change line color to red when hovering
        }
      },
      markers: {
        size: 0, // Increases dot size
       
      },
   
      title: {
        show:false
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // alternating colors
          opacity: 0.5
        }
      },
      xaxis: {
        categories: this.xAxisValue ? this.xAxisValue : [
          "12am-4am",
          "4am-8am",
          "8am-12pm",
          "12pm-4pm",
          "4pm-8pm",
          "8pm-12am"
      ]
      }
    };
  
  }
}
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};
