import { Component, OnInit, ViewChild } from '@angular/core';
import { ExecutiveService } from '../executive-service';
import * as ApexCharts from 'apexcharts';

@Component({
  selector: 'app-executive-home',
  templateUrl: './executive-home.component.html',
  styleUrls: ['./executive-home.component.css']
})
export class ExecutiveHomeComponent implements OnInit {
  dateInputValue: any = new Date()
  public truckChart: any;
  public trailerOptions: any;
  public OrderChart: any;
  public consignorsChartOptions: any;
  public paginationPageSize: any = 4;
  trackSelectedType: any = 'Day';
  ordersSelectedType: any = 'Day';
  trilerSelectedType: any = 'Day';
  driversHeaders = [{ field: '#', sortable: true, maxWidth: 80 }, { field: 'Driver', sortable: true, maxWidth: 130 }, { field: 'TruckNo', headerName: "Truck no", sortable: true, maxWidth: 125 }, { field: 'MobileNo', headerName: "Mobile no", maxWidth: 130 }];
  ProductsHeaders = [{ field: '#', sortable: true, maxWidth: 70 },
  { field: 'Product', sortable: true, maxWidth: 125 },
  { field: 'Plant', headerName: "Plant", sortable: true, maxWidth: 120 },
  { field: 'Supplier', headerName: "Supplier", maxWidth: 146 },
  { field: 'NetWeight', headerName: "Net weight", maxWidth: 120 }];

  driversList = [
    { "#": 2, Driver: 'Jerry Paul', TruckNo: 'BD5573', MobileNo: 8945748321 },
    { "#": 4, Driver: 'Brian Adams', TruckNo: 'BD5573', MobileNo: 8945748321 },
    { "#": 5, Driver: 'Joseph', TruckNo: 'BD5573', MobileNo: 8945748321 },
    { "#": 6, Driver: 'Brian Adams', TruckNo: 'BD5573', MobileNo: 8945748321 },
    { "#": 11, Driver: 'Jerry Paul', TruckNo: 'BD5573', MobileNo: 8945748321 },
    { "#": 12, Driver: 'Joseph', TruckNo: 'BD5573', MobileNo: 8945748321 },
    { "#": 13, Driver: 'Joseph', TruckNo: 'BD5573', MobileNo: 8945748321 },
    { "#": 14, Driver: 'Brian Adams', TruckNo: 'BD5573', MobileNo: 8945748321 },
    { "#": 15, Driver: 'Joseph', TruckNo: 'BD5573', MobileNo: 8945748321 },
    { "#": 17, Driver: 'Jerry Paul', TruckNo: 'BD5573', MobileNo: 8945748321 },
    { "#": 16, Driver: 'Brian Adams', TruckNo: 'BD5573', MobileNo: 8945748321 },
    { "#": 17, Driver: 'Joseph', TruckNo: 'BD5573', MobileNo: 8945748321 },
    { "#": 18, Driver: 'Jerry Paul', TruckNo: 'BD5573', MobileNo: 8945748321 },
    { "#": 19, Driver: 'Brian Adams', TruckNo: 'BD5573', MobileNo: 8945748321 },
    { "#": 20, Driver: 'Joseph', TruckNo: 'BD5573', MobileNo: 8945748321 },
    { "#": 21, Driver: 'Jerry Paul', TruckNo: 'BD5573', MobileNo: 8945748321 },
    { "#": 22, Driver: 'Brian Adams', TruckNo: 'BD5573', MobileNo: 8945748321 },
  ];
  ProductsList = [
    { "#": 2, Product: 'Carcass', Plant: 'Offal plant', Supplier: 'Medcalf J&E Ltd', NetWeight: '22,480 kg' },
    { "#": 4, Product: 'Feathers', Plant: 'Offal plant', Supplier: 'Medcalf J&E Ltd', NetWeight: '22,480 kg' },
    { "#": 5, Product: 'Chicken blood', Plant: 'Offal plant', Supplier: 'Medcalf J&E Ltd', NetWeight: '22,480 kg' },
    { "#": 6, Product: 'Feathers', Plant: 'Offal plant', Supplier: 'Medcalf J&E Ltd', NetWeight: '22,480 kg' },
    { "#": 11, Product: 'Carcass', Plant: 'Offal plant', Supplier: 'Medcalf J&E Ltd', NetWeight: '22,480 kg' },
    { "#": 12, Product: 'Chicken blood', Plant: 'Offal plant', Supplier: 'Medcalf J&E Ltd', NetWeight: '22,480 kg' },
    { "#": 13, Product: 'Chicken blood', Plant: 'Poultry plant', Supplier: 'Medcalf  J&E Ltd', NetWeight: '22,480 kg' },
    { "#": 14, Product: 'Feathers', Plant: 'Poultry plant', Supplier: 'Medcalf J&E Ltd', NetWeight: '22,480 kg' },
    { "#": 15, Product: 'Chicken blood', Plant: 'Poultry plant', Supplier: 'Medcalf J&E Ltd', NetWeight: '22,480 kg' },
    { "#": 17, Product: 'Carcass', Plant: 'Poultry plant', Supplier: 'Medcalf J&E Ltd', NetWeight: '22,480 kg' },
    { "#": 16, Product: 'Feathers', Plant: 'Poultry plant', Supplier: 'Medcalf J&E Ltd', NetWeight: '22,480 kg' },
    { "#": 17, Product: 'Chicken blood', Plant: 'Poultry plant', Supplier: 'Medcalf J&E Ltd', NetWeight: '22,480 kg' },
    { "#": 18, Product: 'Carcass', Plant: 'Poultry plant', Supplier: 'Medcalf J&E Ltd', NetWeight: '22,480 kg' },
    { "#": 19, Product: 'Feathers', Plant: 'Poultry plant', Supplier: 'Medcalf J&E Ltd', NetWeight: '22,480 kg' },
    { "#": 20, Product: 'Chicken blood', Plant: 'Poultry plant', Supplier: 'Medcalf J&E Ltd', NetWeight: '22,480 kg' },
    { "#": 21, Product: 'Carcass', Plant: 'Poultry plant', Supplier: 'Medcalf J&E Ltd', NetWeight: '22,480 kg' },
    { "#": 22, Product: 'Feathers', Plant: 'Poultry plant', Supplier: 'Medcalf J&E Ltd', NetWeight: '22,480 kg' },
  ];
  constructor(public executiveService: ExecutiveService) {
  }

  ngOnInit(): void {
    this.truckChartRender();
    this.trailerChartRender();
    this.ordersChartRender();
    this.consignorsChart()
  }

  truckChartRender() {
    this.truckChart = {
      series: [44, 55, 41],
      chart: {
        width: 400,
        type: "donut"
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
                  return w.globals.seriesTotals.reduce((a: any, b: any) => {
                    return a + b
                  }, 0)
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
      labels: ['Available', 'In Transit', 'Washing'],


    };

    var truck = new ApexCharts(document.querySelector("#truckChart"), this.truckChart);
    truck.render();
  }
  trailerChartRender() {
    this.trailerOptions = {

      series: [50, 25, 25],
      chart: {
        width: 400,
        type: "donut"
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
                  return w.globals.seriesTotals.reduce((a: any, b: any) => {
                    return a + b
                  }, 0)
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
    var trailer = new ApexCharts(document.querySelector("#trailerChart"), this.trailerOptions);
    trailer.render();
  }

  ordersChartRender() {
    this.OrderChart = {
      series: [{
        data: [21, 22, 10, 28, 43, 43, 34]
      }],
      chart: {
        width: "100%",
        height: 220,
        toolbar: { show: false },
        type: 'bar',

      },
      tooltip: {
        y: {
          formatter: function(val:any) {
            return val 
          },
          title: {
            formatter: function (seriesName:any) {
              return "Orders delivered"
            }
          }
        }
      },
      colors: ["#13D090"],
      plotOptions: {
        bar: {
          borderRadius: 7,
          columnWidth: '30px',
          distributed: true,
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
        categories: [
          ['MON'],
          ['TUE'],
          ['WED'],
          ['THU'],
          ['FRI'],
          ['SAT'],
          ['SUN'],

        ],
        labels: {
          style: {
            // colors: ["#13D090"],
            fontSize: '12px'
          }
        }
      }
    }

    var order = new ApexCharts(document.querySelector("#OrdersChart"), this.OrderChart);
    order.render();
  }
  consignorsChart() {
    this.consignorsChartOptions = {
      series: [44, 55, 13],
      chart: {
        width: "100%",

        type: 'pie',
      },
      labels: ['Medcalf J & E Ltd', 'Newmans Meat shop', 'ABC Meat & Chicken shop '],
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
        show: false,
        position: 'right',
        horizontalAlign: 'right',
        floating: false,
      }
    }

    var consignors = new ApexCharts(document.querySelector("#consignorsChart"), this.consignorsChartOptions)
    consignors.render();
  }
  changeDateEvent(event: any) {

    this.executiveService.executiveDashboardCount.totalDrivers = (Math.random() * 100).toFixed();
    this.executiveService.executiveDashboardCount.totalTrucks = (Math.random() * 100).toFixed();
    this.executiveService.executiveDashboardCount.totalTrailers = (Math.random() * 100).toFixed();
    this.executiveService.executiveDashboardCount.totalOrders = (Math.random() * 100).toFixed();
    this.executiveService.executiveDashboardCount.totalProducts = (Math.random() * 100).toFixed();
  }
  truckSwitchMode(type: any) {
    this.trackSelectedType = type;
  }
  OrderswitchMode(type: any) {
    this.ordersSelectedType = type;
  }
  trilerSwitchMode(type: any) {
    this.trilerSelectedType = type;
  }
};

