import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DashboardService } from '../dashboard.service';
import { PlantProductColumn } from '../plan-site-dashboard/product-column';
import { SupplierColumn } from '../transport-dashboard/supplier-column';
import { IntakeModel } from './models/intake-model';
import { OrderModel } from './models/order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quality-manager',
  templateUrl: './quality-manager.component.html',
  styleUrls: ['./quality-manager.component.css']
})
export class QualityManagerComponent implements OnInit {

  constructor(public datePipe: DatePipe, public dashboardSer:DashboardService, public router:Router) { }
  selectedSearchTable:any;
  SearchSubject:Subject<any> = new Subject();
  pageSize:any = 5;
  currentPage:any = 1;
  currentPageSize:any = 5;
  SelectedDateRange:any = "Day";
  SelectedDateRangeForIntake:any = "Day";
  taskTableList:any = [];
  intakeChart:any;
  taskList:any;
  xAxisValue:any;
  yAxisValue:any;
  customDate:any;
  isAvailable:boolean = false
  taskHeaders:any = [
    { field: 'orderID', headerName: "Id",maxWidth: 90,sortable: true, },
    { field: 'orderNo', headerName: "Moc doc no",maxWidth: 130,sortable: true  },
            { field: 'orderDate', headerName: "Moc doc Date",maxWidth: 130, sortable: true, },
            {  cellRenderer: SupplierColumn,headerName: "Consignor", maxWidth: 190 },
            { cellRenderer:PlantProductColumn,  headerName: "Product", maxWidth: 190 },
  ];
  ordersTableList:any = [];
  orderHeaders:any = [];
  ordersList:any;
  overview:any;
  ChartOptions:any;
  ngOnInit(): void {
    // this.ordersChart();
    this.SearchSubject.pipe(debounceTime(200),
          distinctUntilChanged(),
          switchMap((query: any) => this.optimizeSearch(query))).subscribe((res: any) => {
            //console.log(res);
          });
          this.overviewList();
          this.getTaskTable("",this.currentPage,this.currentPageSize);
          this.getIntakeChart(this.SelectedDateRangeForIntake,"");

          this.getOrderTable(this.SelectedDateRange,"",this.currentPage,this.currentPageSize)
  }
  navigateToMenu(section:any) {
    switch (section) {
      
        case "Orders":
        this.router.navigateByUrl("/home/orders")
        break;
        case "tasks":
        this.router.navigateByUrl("/home/tasks")
        break;

      default:
        break;
    }
  }
  tableSearch(event: any, section: any) {
    this.selectedSearchTable = section
    switch (section) {
      case "task":
        //console.log(event.target.value);
        if (event.target.value?.length == 0) {
          this.getTaskTable("",this.currentPage,this.currentPageSize)
          // this.getTrackList(this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "", this.SelectedDateRangeForTracks == 'Supplier' ? "" :this.SelectedDateRangeForTracks );
        } else {
          this.SearchSubject.next(event.target.value)
        }
        break;
      case "orders":
        if (event.target.value?.length == 0) {
          this.getOrderTable(this.SelectedDateRange,"",this.currentPage,this.currentPageSize)
        } else {
          this.SearchSubject.next(event.target.value)
        }
        break;
        default:
        break;
      }
};
overviewList() {
  this.dashboardSer.getQualityOverview().then((res:any)=> {
    //console.log(res);
    this.overview = res[0]
  })
}
getTaskTable(key:any,pageNo:any,pageSize:any) {
  this.dashboardSer.getQualityTask(key,pageNo,pageSize).then((res:any)=> {
    //console.log(res);
    this.taskList = res
    this.taskTableList = res?.items.map((val:any)=> {
      return {
        ...val,
        orderDate : this.datePipe.transform(val.orderDate,"dd/MM/yyyy"),
        consignorName : val.consignorName ? val.consignorName : "-",
        materialType : val.materialType ? val.materialType : "-"
      }
    })
  })
}
getIntakeChart(mode:any,date:any) {
  let model = new IntakeModel();
  model.Date = date ? date : ""
  model.ViewMode = mode ? mode :  ""
  this.dashboardSer.getQualityIntake(model).then((res:any)=> {
    //console.log(res);
    this.intakeChart = res
    if(res)
      {
        this.ordersChart();
      } 
  })
}
getOrderTable(mode:any,key:any,pageNo:any,pageSize:any,date?:any) {
  let model = new OrderModel();
  model.ViewMode = mode ? mode : ""
  model.SelectedDate = date 
  model.SearchKey = key ? key : ""
  model.PageNumber = pageNo
  model.PageSize = pageSize
this.dashboardSer.getQualityOrders(model).then((res:any) => {
  //console.log(res);
  this.ordersList = res
  this.ordersTableList = res?.items.map((val:any)=> {
    return {
      ...val,
      orderDate : this.datePipe.transform(val.orderDate,"dd/MM/yyyy"),
      consignorName : val.consignorName ? val.consignorName : "-",
      materialType : val.materialType ? val.materialType : "-"
    }
  })
})
}
ordersChart() {
  this.isAvailable = false;
  this.SelectedDateRangeForIntake = this.SelectedDateRangeForIntake.includes("/") ? "selecteddate" : this.SelectedDateRangeForIntake
  switch (this.SelectedDateRangeForIntake) {
    case "Day":
      this.xAxisValue = Object.keys(this.intakeChart[0]?.timeIntervalDetails)
      this.yAxisValue = Object.values(this.intakeChart[0]?.timeIntervalDetails);
      this.isAvailable = this.yAxisValue.some((val:any)=> val > 0 );
      //console.log(this.isAvailable);
      
      //console.log(this.xAxisValue,this.yAxisValue);
      break;
      case "Week":
        this.yAxisValue = this.intakeChart[0]?.orderDetails.map((val:any)=> val.totalOrder)
        this.xAxisValue = this.intakeChart[0]?.orderDetails.map((val:any)=> val.orderDay)
        this.isAvailable = this.yAxisValue.some((val:any)=> val > 0 );

        //console.log(this.xAxisValue,this.yAxisValue);

      break;
      case "Month":
        this.yAxisValue = this.intakeChart[0]?.orderDetails.map((val:any)=> val.totalOrder)
        this.xAxisValue = this.intakeChart[0]?.orderDetails.map((val:any)=> val.orderWeek)
        this.isAvailable = this.yAxisValue.some((val:any)=> val > 0 );

        //console.log(this.xAxisValue,this.yAxisValue);

      break;
      case "selecteddate":
        this.xAxisValue = Object.keys(this.intakeChart[0]?.timeIntervalDetails)
      this.yAxisValue = Object.values(this.intakeChart[0]?.timeIntervalDetails)
      this.isAvailable = this.yAxisValue.some((val:any)=> val > 0 );

      //console.log(this.xAxisValue,this.yAxisValue);

      break;
  
    default:
      break;
  }
  this.ChartOptions = {
    series: [{
      data: this.yAxisValue ? this.yAxisValue : [0,0,0,0,0,0],
    }],
    chart: {
      height: 320,
      toolbar: { show: false },
      type: 'bar',
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val;
        },
        title: {
          formatter: function (seriesName: any) {
            return "Intake sheets";
          }
        }
      }
    },
    colors: ["#13D090"],
    plotOptions: {
      bar: {
        borderRadius: 10,
        distributed: false,  // Set to false for better control over the spacing between bars
        columnWidth: '10%',  // Adjust this value to control bar width
        barSpacing: 10, 
      }
    },
    dataLabels: {
      enabledOnSeries: undefined,
      enabled: true
    },
    legend: {
      show: false
    },
    xaxis: {
      categories:this.xAxisValue ? this.xAxisValue : ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    }
  };
 }
 optimizeSearch(key: any): Observable<any> {
    //console.log(key);
    switch (this.selectedSearchTable) {
      case "task":
        return of(this.getTaskTable(key,this.currentPage,this.currentPageSize)
      );
      case "orders":
        return of(this.getOrderTable(this.SelectedDateRange,key,this.currentPage,this.currentPageSize)
      );
      default:
        return of([]);
    }
  };
  onPageChanged(event: any, section: any) {
    switch (section) {
      case "task":
        this.currentPage = event.pageIndex + 1;
        this.currentPageSize = event.pageSize
        this.getTaskTable("",this.currentPage,this.currentPageSize)

        // this.getTrackList(this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "", this.SelectedDateRangeForTracks == 'Supplier' ? "" :this.SelectedDateRangeForTracks );
        break;
      case "order":
        this.currentPage = event.pageIndex + 1;
        this.currentPageSize = event.pageSize
        this.getOrderTable(this.SelectedDateRange,"",this.currentPage,this.currentPageSize)
        // this.getOrdersList(this.SelectedDateRange, "", this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "");
        break;
      default:
        break;
    }
  };
  switchMode(type: any,section:any) {
    this.customDate = ""

    switch (section) {
      case "order":
        this.SelectedDateRange = type;
        this.getOrderTable(this.SelectedDateRange,"",this.currentPage,this.currentPageSize)

        // this.getTrackList(this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "", this.SelectedDateRangeForTracks);
        break;
        case "intake":
        this.SelectedDateRangeForIntake = type;
        this.getIntakeChart(this.SelectedDateRangeForIntake,"")

        // this.getTrackList(this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "", this.SelectedDateRangeForTracks);
        break;
    
      default:
        break;
    }
  }
  changeDateEvent(event: any,section:any) {
    switch (section) {
      case "order":
        let date: any = this.datePipe.transform(event?.value, "dd/MM/yyyy")
        this.SelectedDateRange = date;
        this.customDate = "selecteddate"
        this.getOrderTable("selecteddate","",this.currentPage,this.currentPageSize,date)

        // this.getOrdersList("", "", this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, this.SelectedDateRange);
        break;
        case "intake":
          let dates: any = this.datePipe.transform(event?.value, "dd/MM/yyyy")
          this.SelectedDateRangeForIntake = dates
          this.getIntakeChart("selecteddate",this.SelectedDateRangeForIntake)
          // this.getOrdersList("", "", this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, this.SelectedDateRange);
          break;
      default:
        break;
    }
  }
}