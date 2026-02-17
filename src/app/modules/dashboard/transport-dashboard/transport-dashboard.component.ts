import { Component, OnInit } from '@angular/core';
import { ExecutiveService } from '../../executive-dashboard/executive-service';
import { DashboardService } from '../dashboard.service';
import { StatusColumn } from './status-column';
import { OverviewDashboard } from './models/transportOverviewModel';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ConsineeColumn } from './ConsineeColumn';
import { PendingColumn } from './pending-column';
import { SupplierColumn } from './supplier-column';
import { DriverColumn } from './driver-column';
import { truckColumn } from './track-column';
import { TrailerColumn } from './trailer-column';
import { ProductColumn } from './puduct-column';
import { OrderModel } from './models/order-model';
import { DraftModel } from './models/draft-model';


@Component({
  selector: 'app-transport-dashboard',
  templateUrl: './transport-dashboard.component.html',
  styleUrls: ['./transport-dashboard.component.css']
})
export class TransportDashboardComponent implements OnInit {
  SelectedDateRange: string = "Day";
  VehicleChartOptions: any;
  trailerOptions: any;
  DriverChartOptions: any;
  OrderChartOptions: any;
  deliveryChartOptions: any;
  OrderCycleChartOptions: any;
  OrderAccuracyChartOptions: any;
  FillChartOptions: any;
  isOrderAvailable: boolean = false;
  isDriverAvailable: boolean = false;
  isTrailerStatusAvailable: boolean = false;
  isVehicleStatusAvailable: boolean = false;
  public paginationPageSize: any = 4;
  overviewList: any;
  pageSize = 4;
  ordersList: any = [];
  draftList: any = [];
  SelectedDateRangeForOrder: any = "All";
  selectedSearchTable: any;
  draftTotalList: any
  truckSearchSubject: Subject<any> = new Subject();
  driverStatusList:any;
  currentIndexSize:any = 5;
  currentIndexPage:any=1;

  OrdersHeaders = [{ field: 'orderID', headerName: "Id", sortable: true, maxWidth: 80 }, { field: 'orderNo', headerName: "Mov Doc No.", sortable: true, maxWidth: 115 }, {cellRenderer: DriverColumn, headerName: "Driver", sortable: true, maxWidth: 145 }, { cellRenderer: truckColumn, headerName: "Vehicle", maxWidth: 100 },
  { cellRenderer: TrailerColumn, headerName: "Trailer", maxWidth: 120 },
  { cellRenderer: ProductColumn, headerName: "Product", maxWidth: 170 },
  { cellRenderer: StatusColumn, headerName: "Status", maxWidth: 150 },
  ];
  DraftHeaders = [{ field: 'orderID', headerName: "Id", sortable: true, maxWidth: 90 }, { field: 'orderDate', headerName: "Mov doc date", sortable: true, maxWidth: 140 }, { field: 'orderNo', headerName: "Mov Doc No.", sortable: true, maxWidth: 120 }, {cellRenderer: SupplierColumn,   headerName: "Supplier", maxWidth: 180 },
  { cellRenderer: ConsineeColumn, headerName: "Consignee", maxWidth: 165 },
  { cellRenderer: PendingColumn, headerName: "Pending", maxWidth: 200 },

  ];
  ordersTotalList: any;

  constructor(public dashboardService: DashboardService, public router: Router, public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getStatus();
    this.getOverviewData(this.SelectedDateRange, "")
    this.getOrdersList(this.currentIndexPage, this.currentIndexSize, "", "");
    this.getDraftTableList(this.currentIndexPage, this.currentIndexSize, "")
    this.deliveryChart()
    this.OrderCycleChart()
    this.OrderAccuracyChartOptionsChart()
    this.FillChartOptionsChart();
    this.truckSearchSubject.pipe(debounceTime(200),
      distinctUntilChanged(),
      switchMap((query: any) => this.optimizeSearch(query))).subscribe((res: any) => {
        //console.log(res);
      });
      this.dashboardService.orderDeleteSub$.subscribe((res:any)=> {
        //console.log(res);
       if(res) {
        this.getOrdersList(this.currentIndexPage, this.currentIndexSize, "", "");
    this.getDraftTableList(this.currentIndexPage, this.currentIndexSize, "")
       }
      })
   
  }

  getStatus() {
    this.dashboardService.driverStatus().then((res:any)=> {
      //console.log(res);
      let allObj = {
        "statusId": 0,
        "description": "all orders",
        "statusName": "All",
        "createdDate": "2024-11-28T00:00:00",
        "createdBy": "User",
        "modifiedDate": "2025-01-24T07:55:07.79",
        "modifiedBy": "User",
        "deleted": false
    }
      let ststus = res.filter((val:any)=> val.statusId != 2);
      this.driverStatusList = [allObj, ...ststus]; 
      //console.log(this.driverStatusList);
    })
  }
  optimizeSearch(key: any): Observable<any> {
    //console.log(key);
    switch (this.selectedSearchTable) {
      case "Orders":
        return of(this.getOrdersList(1, 5, key, ""));
      case "Draft":
        return of(this.getDraftTableList(1, 4, key));
      default:
        return of([]);
    }
  }
  getOverviewData(range: any, date: any) {
    let overviewModel = new OverviewDashboard();
    overviewModel.Date = date;
    overviewModel.PageNumber = 1
    overviewModel.PageSize = 5
    overviewModel.FromDate = null
    overviewModel.ToDate = null
    overviewModel.ViewMode = range ? range : "day";
    //console.log(overviewModel);
    this.dashboardService.getTransportOverviewList(overviewModel).then((res: any) => {
      //console.log(res);
      this.overviewList = res
      if (res) {
        setTimeout(() => {
        this.findDataAvailable();
        this.trailerChartRender();
        this.VehicleChart();
        this.DriverChart();
        this.OrderChart();
        },200);
      }

     

    })
  }
  
 findDataAvailable() {
  //console.log(this.overviewList?.dashboardStatus?.trailerStatus);
  if(this.overviewList?.dashboardStatus?.trailerStatus) {
    let { totalTrailerCount, ...finalDataFortrailer } = this.overviewList?.dashboardStatus?.trailerStatus;
    this.isTrailerStatusAvailable = Object.values(finalDataFortrailer).some((value: any) => value > 0);
    //console.log(this.isTrailerStatusAvailable);
  }else {
    this.isTrailerStatusAvailable = false
  }

  if(this.overviewList?.dashboardStatus?.vehicleStatus) {
    let { totalVehicleCount, ...finalDataForvehicle } = this.overviewList.dashboardStatus.vehicleStatus;
  this.isVehicleStatusAvailable = Object.values(finalDataForvehicle).some((value: any) => value > 0);
  //console.log(this.isVehicleStatusAvailable);
  }else {
    this.isVehicleStatusAvailable = false
  }
  if(this.overviewList?.dashboardStatus?.orderStatus) {
    let { totalCount, ...finalData } = this.overviewList.dashboardStatus.orderStatus;
  this.isOrderAvailable = Object.values(finalData).some((value: any) => value > 0);
  //console.log(this.isOrderAvailable);
  }else {
    this.isOrderAvailable = false
  }
  if(this.overviewList?.dashboardStatus?.driverStatus) {
    let { driverTotalCount, ...finalDataForDriver } = this.overviewList.dashboardStatus.driverStatus;
  this.isDriverAvailable = Object.values(finalDataForDriver).some((value: any) => value > 0);
  //console.log(this.isDriverAvailable);
  }else {
    this.isDriverAvailable = false
  }
 }
  tableSearch(event: any, section: any) {
    this.selectedSearchTable = section
    switch (section) {
      case "Orders":
        //console.log(event.target.value);
        if (event.target.value?.length == 0) {
          this.getOrdersList(1, 5, "", "")
        } else {
          this.truckSearchSubject.next(event.target.value)
        }
        break;
      case "Draft":
        if (event.target.value?.length == 0) {
          this.getDraftTableList(1, 5, "")
        } else {
          this.truckSearchSubject.next(event.target.value)
        }
        break;
      default:
        break;
    }
  };
  switchModeForOrders(type: any) {
    this.SelectedDateRangeForOrder = type;
    this.getOrdersList(1, 5, "", type)
    // this.getTrackList(this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "", this.SelectedDateRangeForTracks);
  }
  deliveryChart() {
    this.deliveryChartOptions = {
      series: [0, 0],
      chart: {
        width: 300,
        type: 'donut',
      },

      dataLabels: {
        enabled: false
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val + "%"
          },
          title: {
            formatter: function (seriesName: any) {
              return "On time delivery rate"
            }
          }
        }
      },
      plotOptions: {
        pie: {

          donut: {
            labels: {
              show: true,
              name: {
                show: true
              },
              value: {
                show: true,
                fontWeight: 600,
                fontSize: '20px',
              },
              total: {
                fontSize: '12px',
                fontWeight: 400,
                color: '#475569',
                show: true,
                showAlways: true,
                formatter: (w: any) => {
                  return 0 + "%"
                }
              }
            }
          }
        }
      },

      legend: {
        show: false,
        formatter: function (val: any, opts: any) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex]
        }
      },
      title: {
        // text: 'Gradient Donut with custom Start-angle'
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      colors: [
        '#00984E',
        '#B4E1CD'
      ],
    };
    var chart = new ApexCharts(document.querySelector("#deliveryChart"), this.deliveryChartOptions);
    // chart.render();
  }
  OrderCycleChart() {
    this.OrderCycleChartOptions = {
      series: [0, 0],
      chart: {
        width: 300,
        type: 'donut',
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val + "%"
          },
          title: {
            formatter: function (seriesName: any) {
              return "Order cycle time"
            }
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        pie: {

          donut: {
            labels: {
              show: true,
              name: {
                show: true
              },
              value: {
                show: true,
                fontWeight: 600,
                fontSize: '20px',
              },
              total: {
                fontSize: '12px',
                fontWeight: 400,
                color: '#475569',
                show: true,
                showAlways: true,
                formatter: (w: any) => {
                  return 0 + "%"
                }
              }
            }
          }
        }
      },

      legend: {
        show: false,
        formatter: function (val: any, opts: any) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex]
        }
      },
      title: {
        // text: 'Gradient Donut with custom Start-angle'
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      colors: [
        '#3A91E1',
        '#D7EAF1'
      ],
    };
    var chart = new ApexCharts(document.querySelector("#OrderCycleChart"), this.OrderCycleChartOptions);
    //  chart.render();
  }
  OrderAccuracyChartOptionsChart() {
    this.OrderAccuracyChartOptions = {
      series: [0, 0],
      chart: {
        width: 300,
        type: 'donut',
      },

      dataLabels: {
        enabled: false
      },
      plotOptions: {
        pie: {

          donut: {
            labels: {
              show: true,
              name: {
                show: true
              },
              value: {
                show: true,
                fontWeight: 600,
                fontSize: '20px',
              },
              total: {
                fontSize: '12px',
                fontWeight: 400,
                color: '#475569',
                show: true,
                showAlways: true,
                formatter: (w: any) => {
                  return 0 + "%"
                }
              }
            }
          }
        }
      },

      legend: {
        show: false,
        formatter: function (val: any, opts: any) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex]
        }
      },
      title: {
        // text: 'Gradient Donut with custom Start-angle'
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val + "%"
          },
          title: {
            formatter: function (seriesName: any) {
              return "Order accuracy rate"
            }
          }
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      colors: [
        '#6566C0',
        '#D0D1EC'
      ],
    };
    var chart = new ApexCharts(document.querySelector("#OrderAccuracyChart"), this.OrderAccuracyChartOptions);
    //  chart.render();
  }
  FillChartOptionsChart() {
    this.FillChartOptions = {
      series: [0, 0],
      chart: {
        width: 300,
        type: 'donut',
      },

      dataLabels: {
        enabled: false,
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val + "%"
          },
          title: {
            formatter: function (seriesName: any) {
              return "Fill rate"
            }
          }
        }
      },
      plotOptions: {
        pie: {

          donut: {
            labels: {
              show: true,
              name: {
                show: true
              },
              value: {
                show: true,
                fontWeight: 600,
                fontSize: '20px',
              },
              total: {
                fontSize: '12px',
                fontWeight: 400,
                color: '#475569',
                show: true,
                showAlways: true,
                formatter: (w: any) => {
                  return 0 + "%"
                }
              }
            }
          }
        }
      },

      legend: {
        show: false,
        formatter: function (val: any, opts: any) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex]
        }
      },
      title: {
        // text: 'Gradient Donut with custom Start-angle'
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      colors: [
        '#2CB6B8',
        '#D7F1EC'
      ],
    };
    var chart = new ApexCharts(document.querySelector("#FillChart"), this.FillChartOptions);
    //  chart.render();
  }
  switchMode(type: any) {
    this.SelectedDateRange = type;
    this.getOverviewData(this.SelectedDateRange, "")
  }
  VehicleChart() {
    this.VehicleChartOptions = {
      series: [this.overviewList.dashboardStatus?.vehicleStatus?.vehicleAvailableCount, this.overviewList.dashboardStatus?.vehicleStatus?.vehicleInTransitCount],
      // series:[2,2,3],
      chart: {
        width: 400,
        type: "donut"
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any, opts: any) {
          // Get the index of the current data point
          const dataIndex = opts.seriesIndex;
          // Return the corresponding series value
          return opts.w.config.series[dataIndex];
        },
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          offsetY: 10,
          donut: {
            labels: {
              show: true,
              name: {
                show: true
              },
              value: {
                show: true,
                fontWeight: 600,
                fontSize: '20px',
                formatter: (val: any) => {
                  return val
                }
              },
              total: {
                label: 'Total Count',
                fontSize: '12px',
                fontWeight: 400,
                color: '#475569',
                show: true,
                showAlways: false,
                formatter: (w: any) => {
                  return this.overviewList.dashboardStatus.vehicleStatus?.totalVehicleCount
                }
              }
            }
          }
        }
      },
      grid: {
        padding: {
          bottom: -80
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },

          }
        }
      ],
      legend: {
        show: true,
        horizontalAlign: 'center',
        position: 'bottom',
      },
      colors: [
        '#52AC56',
        '#ff9900',
        '#3a91e1',

      ],
      labels: ['Available', 'In Transit'],


    };
    var truck = new ApexCharts(document.querySelector("#VehicleChart"), this.VehicleChartOptions);
    // truck.render();
  }
  navigateToMenu(menu: any) {

    switch (menu) {
      case "Orders":
        this.router.navigateByUrl("/home/orders")
        break;
      case "Drivers":
        this.router.navigateByUrl("/home/drivers")
        break;
      case "transitTrucks":
        // this.router.navigateByUrl("/home/shunterDrivers")
        break;
      case "Trucks":
        this.router.navigateByUrl("/home/vehicle")
        break;
      case "Trailers":
        this.router.navigateByUrl("/home/trailer")
        break;


      default:
        break;
    }

  }
  trailerChartRender() {
    this.trailerOptions = {

      series: [this.overviewList.dashboardStatus?.trailerStatus?.trailerAvailableCount, this.overviewList.dashboardStatus?.trailerStatus?.trailerInTransitCount,
      this.overviewList.dashboardStatus?.trailerStatus?.trailerWashingCount],
      // series:[2,2,3],
      chart: {
        width: 400,
        type: "donut"
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any, opts: any) {
          // Get the index of the current data point
          const dataIndex = opts.seriesIndex;
          // Return the corresponding series value
          return opts.w.config.series[dataIndex];
        },
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          offsetY: 10,
          donut: {
            labels: {
              show: true,
              name: {
                show: true
              },
              value: {
                show: true,
                fontWeight: 600,
                fontSize: '20px',
                // formatter: (val:any) => {
                //   return val + ' tCO2e';
                // }
              },
              total: {
                label: 'Total Count',
                fontSize: '12px',
                fontWeight: 400,
                color: '#475569',
                show: true,
                showAlways: false,
                formatter: (w: any) => {
                  return this.overviewList.dashboardStatus.trailerStatus?.totalTrailerCount
                }
              }
            }
          }
        },

      },
      grid: {
        padding: {
          bottom: -80
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },

          }
        }
      ],
      legend: {
        show: true,
        horizontalAlign: 'center',
        position: 'bottom',
      },
      colors: [
        '#52AC56',
        '#ff9900',
        '#3a91e1',

      ],
      labels: ['Available', 'In Transit', 'Washing'],

    }
    var trailer = new ApexCharts(document.querySelector("#TrailerChart"), this.trailerOptions);
    // trailer.render();
  }

  DriverChart() {
    this.DriverChartOptions = {
      series: [this.overviewList.dashboardStatus?.driverStatus?.driverAvailableCount, this.overviewList.dashboardStatus?.driverStatus?.driverInTransitCount
      ],
      // series:[2,2],
      chart: {
        width: 400,
        type: 'pie',
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any, opts: any) {
          // Get the index of the current data point
          const dataIndex = opts.seriesIndex;
          // Return the corresponding series value
          return opts.w.config.series[dataIndex];
        },
      },
      labels: ['Available', 'In Transit '],
      responsive: [{
        breakpoint: 460,
        options: {
          chart: {

          },
          legend: {
            show: false,
          }
        }
      }],
      legend: {
        show: true,
        horizontalAlign: 'center',
        position: 'bottom',
        floating: false,
      },
      colors: [
        '#52AC56',
        '#ff9900',
      ],

    }
    var consignors = new ApexCharts(document.querySelector("#DriverChart"), this.DriverChartOptions)
    // consignors.render();
  }
  OrderChart() {
    this.OrderChartOptions = {
      series: [this.overviewList.dashboardStatus?.orderStatus?.completedCount, this.overviewList.dashboardStatus?.orderStatus?.pendingCount
      ],
      // series:[2,2],
      chart: {
        width: 400,
        type: 'pie',
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any, opts: any) {
          // Get the index of the current data point
          const dataIndex = opts.seriesIndex;
          // Return the corresponding series value
          return opts.w.config.series[dataIndex];
        },
      },
      labels: ['Completed', 'Pending'],
      responsive: [{
        breakpoint: 460,
        options: {
          chart: {
          },
          legend: {
            show: false,
          }
        }
      }],
      legend: {
        show: true,
        horizontalAlign: 'center',
        position: 'bottom',
      },
      colors: [
        '#52AC56',
        '#ff9900',


      ],
    }

    var consignors = new ApexCharts(document.querySelector("#OrderChart"), this.OrderChartOptions)
    // consignors.render();
  }
  onPageChanged(event: any, type: any) {
    this.currentIndexPage = event.pageIndex + 1;
    this.currentIndexSize = event.pageIndex + 1;
    switch (type) {
      case "orders":
        this.getOrdersList(event.pageIndex + 1, event.pageSize, "", this.SelectedDateRangeForOrder == "All" ? "" :  this.SelectedDateRangeForOrder)
        break;
      case "draft":
        this.getDraftTableList(event.pageIndex + 1, event.pageSize, "")
        break;

      default:
        break;
    }
    // this.getERAreports(event.pageIndex + 1, event.pageSize)
  }

  getDraftTableList(page: any, count: any, key: any) {
    //console.log(this.draftList);
    let draftModel = new DraftModel();
    draftModel.Date = "";
    draftModel.FromDate = "";
    draftModel.ToDate = "";
    draftModel.PageNumber = page;
    draftModel.PageSize = count;
    draftModel.SearchKey = key
    draftModel.ViewMode = ""
    this.dashboardService.getDraftList(draftModel).then((res: any) => {
      //console.log(res);
      this.draftTotalList = res
      this.draftList = res?.draftorder.map((val: any) => {
        let [draftPending] = [val.driverName, val.trailerNumber,val.truckNumber ]

        //console.log(draftPending);
        
        return {
          ...val,
          orderID: val.orderID ? val.orderID : '-',
          consigneeName: val.consigneeName ? val.consigneeName : "-",
          orderNo: val.orderNo ? val.orderNo : '-',
          consignorName: val.consignorName ? val.consignorName : '-',
          orderDate: this.datePipe.transform(val.orderDate, "dd/MM/yyyy"),
          draftPending : [val.driverName == null ? "Driver":"", val.trailerNumber == null ? "Trailer":"",val.truckNumber == null ? "Vehicle":"" ].filter((val) => val != "").toString()

        }
      })
    //console.log(this.draftList);

    })
    
  }
  getOrdersList(page: any, count: any, key: any, filter: any) {
    let orderModel = new OrderModel()
    orderModel.PageNumber = page;
    orderModel.PageSize = count;
    orderModel.FilterStatus = filter;
    orderModel.SearchKey = key;
    orderModel.ViewMode = "";
    orderModel.FromDate = "";
    orderModel.ToDate = "";
    orderModel.Date = "";
    
    this.dashboardService.getTransportOrdersList(orderModel).then((res: any) => {
      //console.log(res);
      this.ordersTotalList = res
      this.ordersList = res?.draftorder.map((val: any) => {
        return {
          ...val,
          orderNo: val.orderNo ? val.orderNo : '-',
          driverName: val.driverName ? val.driverName : "-",
          truckNumber: val.truckNumber ? val.truckNumber : '-',
          trailerNumber: val.trailerNumber ? val.trailerNumber : '-',
          materialType: val.materialType ? val.materialType : '-',
          status: val.status ? val.status : '-',


        }
      })
    })

  }

  changeDateEvent(event: any) {
    //console.log(event);
    let date: any = this.datePipe.transform(event?.value, "dd/MM/yyyy")
    this.SelectedDateRange = date
    this.getOverviewData("", date)
  }
 
}




