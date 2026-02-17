import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DashboardComponent } from '../dashboard.component';
import { DashboardService } from '../dashboard.service';
import { TrackStatusColumn } from './track-status-column';
import { from, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
import { TaskStatusColumn } from './task-status-column';
import { DriverStatusColumn } from './drivers-status-column';
import { OrderModel } from './models/oreders-model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlantDriverColumn } from './driver-column';
import { PlantTrailerColumn } from './trailer-column';
import { PlantVehicleColumn } from './vehicle-column';
import { PlantShunterColumn } from './shunter-column';
import { PlantProductColumn } from './product-column';
import { SupplierColumn } from '../transport-dashboard/supplier-column';
import { PlantBinNameColumn } from './bin-name';
import { ConsineeColumn } from '../transport-dashboard/ConsineeColumn';
@Component({
  selector: 'app-plant-site-dashboard',
  templateUrl: './plant-site-dashboard.component.html',
  styleUrls: ['./plant-site-dashboard.component.css']
})
export class PlanSiteDashboardComponent implements OnInit {
  dateInputValue: any = new Date();
  SelectedDateRangeForTracks: any = "Supplier";
  SelectedDateRangeForTask: any = "Supplier";
  SelectedDateRangeForDriver: any = "Select weight";
  pageSize = 4;
  TrucksList: any = [];
  excelList: any;
  TasksList: any;
  currentSearch:any
  driversList: any;
  ordersList: any;
  searchTerm:any=""
  selectedSearchTable: any;
  dropdownSub:Subject<any> = new Subject()
  SelectedDateRange: any = "Day";
  TasksTableList: any = [];
  truckSearchSubject: Subject<any> = new Subject();
  currentPage: any;
  currentPageSize: any;
  SelectedDateRangeForWeight:any = "Bin name"
  TrucksTableList: any = [
  ];
  driversTableList: any = [
  ];
  ordersListTableList: any;
  customDateForm!: FormGroup;
  cutomDateField: boolean = false;
  intakeDropdownList = [
    "All",
    "Collected",
    "Load in transit",
    "Load arrived",
    "Weighed",
    "Material in transit",
    "Material arrived"
  ]
  binDropdownList = [
    "All",
    "Carcass bin",
    "Offal bin",
  ]
  supplierDropdownList = [
    "All",
    "Medcalf J & E Ltd",
    "Newman Abattoirs",
  ]
 
  weight_ranges = [
    "All",
    "0-1000kg",
    "1000-5000kg",
    "5000-10000kg",
    "10000-15000kg",
    "15000kg+"
]
  
  filterDropdownList:any =[...this.intakeDropdownList]
  SelectedDate:any = "Day";
  twoSelectedDate:any
  reportsForm: FormGroup |any;
  fromDate:any;
  toDate:any;
  overViewList:any;


  constructor(public dashboardService: DashboardService, public datePipe: DatePipe, public router:Router) { }
  TrucksHeaders = [{ field: 'orderID', headerName: "Id", sortable: true, maxWidth: 80 }, { field: 'orderDate', headerName: "Mov doc date", sortable: true, maxWidth: 130 },
    { cellRenderer: SupplierColumn, headerName: "Supplier", sortable: true, maxWidth: 190 }, {cellRenderer:PlantProductColumn,headerName: "Product", maxWidth: 190 },
    {cellRenderer: PlantBinNameColumn, headerName: "Bin name", maxWidth: 150 },
    { field: 'netWeight', headerName: "Total weight", maxWidth: 130 },
    ];
   
    TasksHeaders = [{ field: 'orderID', headerName: "Id", sortable: true, maxWidth: 80 }, { field: 'orderDate', headerName: "Mov doc date", sortable: true, maxWidth: 130 },
      {  field: 'orderNo', headerName: "Mov Doc No.", sortable: true, maxWidth: 125 },
      {  cellRenderer: SupplierColumn,  headerName: "Supplier", maxWidth: 190 },
      { cellRenderer:ConsineeColumn, headerName: "Consignee", maxWidth: 190 },
      { cellRenderer:PlantProductColumn,headerName: "Product", maxWidth: 180 },
      ];
      DriverHeaders = [{ field: 'orderID', headerName: "Id",maxWidth: 90,sortable: true, },
        { field: 'orderDate', headerName: "Mov doc date",maxWidth: 130, sortable: true, },
        {  cellRenderer: SupplierColumn,headerName: "Supplier", maxWidth: 190 },
        { cellRenderer:PlantProductColumn,  headerName: "Product", maxWidth: 180 },
        {cellRenderer: PlantBinNameColumn,headerName: "Bin name", maxWidth: 150 },
        { field: 'netWeight', headerName: "Total weight", maxWidth: 130 },
        ];
  TrucksHeadersOld = [{ field: 'orderID', headerName: "Id", sortable: true, maxWidth: 80 }, { field: 'orderNo', headerName: "Order No", sortable: true, maxWidth: 130 },
  {cellRenderer: PlantDriverColumn, headerName: "Driver", sortable: true, maxWidth: 125 }, {cellRenderer: PlantVehicleColumn, headerName: "Vehicle", maxWidth: 130 },
  {cellRenderer: PlantTrailerColumn, headerName: "Trailer", maxWidth: 130 },
  { field: 'arrivalDateTime', headerName: "ATA", maxWidth: 130 },
  { cellRenderer: TrackStatusColumn, headerName: "Status", maxWidth: 130 },
  ];
  TasksHeadersOld = [{ field: 'orderID', headerName: "Id", sortable: true, maxWidth: 80 }, { field: 'orderNo', headerName: "Order No", sortable: true, maxWidth: 130 },
  { cellRenderer:PlantShunterColumn, headerName: "Shunter", sortable: true, maxWidth: 125 },
  { cellRenderer: PlantTrailerColumn, headerName: "Trailer", maxWidth: 130 },
  { field: 'binName', headerName: "Bin", maxWidth: 130 },
  { cellRenderer:PlantProductColumn, headerName: "Material", maxWidth: 130 },
  { cellRenderer: TaskStatusColumn, headerName: "Status", maxWidth: 130 },
  ];
  OrdersHeaders = [{ field: 'orderID', headerName: "Id", sortable: true, maxWidth: 80 }, { field: 'orderNo', headerName: "Order No", sortable: true, maxWidth: 130 },
  { field: 'orderDate', headerName: "Order date", sortable: true, maxWidth: 125 },
  { cellRenderer:PlantShunterColumn, headerName: "Shunter", maxWidth: 130 },
  { cellRenderer: PlantTrailerColumn, headerName: "Trailer", maxWidth: 130 },
  { field: 'binName', headerName: "Bin", maxWidth: 130 },
  { cellRenderer:PlantProductColumn, headerName: "Material", maxWidth: 130 },
  ];
  DriverHeadersOld = [{ field: 'shunterDriverID', headerName: "Id",maxWidth: 130,sortable: true, },
  { cellRenderer:PlantShunterColumn, headerName: "Shunter", sortable: true, },
  { field: 'contactDetails', headerName: "Mobile", },
  { cellRenderer: DriverStatusColumn, headerName: "Status" },
  ];
  getTrackList(page: any, size: any, search: any, filter: any) {
    this.dashboardService.getMeterialIntakeList(page, size, filter,search).then((res: any) => {
      this.TrucksList = res
      this.TrucksTableList = res?.data?.map((val: any) => {
        return {
          ...val,
          consignorName: val.consignorName ? val.consignorName : "-",
          orderDate: this.datePipe.transform(val.orderDate,"dd/MM/yyyy"),
          materialType: val.materialType ? val.materialType : "-",
          binName: val.binName ? val.binName : "-",
          netWeight: val.netWeight ? val.netWeight : "-",
        }
      })
    })
  }
  getTaskList(page: any, size: any, search: any, filter: any) {

    this.dashboardService.getTaskTableList(page, size, search, filter).then((res: any) => {
      this.TasksList = res
      this.TasksTableList = res?.data?.map((val: any) => {
        return {
          ...val,
          consignorName: val.consignorName ? val.consignorName : "-",
          orderDate: this.datePipe.transform(val.orderDate,"dd/MM/yyyy"),
          materialType: val.materialType ? val.materialType : "-",
          binName: val.binName ? val.binName : "-",
          netWeight: val.netWeight ? val.netWeight : "-",
        }
      })
    })
  }
  getDriverList(page: any, size: any, search: any, binFilter: any,subFilter:any,weightFilter:any) {
    this.dashboardService.getMatrialTipped(page, size, binFilter,subFilter,weightFilter,search).then((res: any) => {
      this.driversList = res
      //console.log(res);
      
      this.driversTableList = res?.data?.map((val: any) => {
        return {
          ...val,
          consignorName: val.consignorName ? val.consignorName : "-",
          orderDate: this.datePipe.transform(val.orderDate,"dd/MM/yyyy"),
          materialType: val.materialType ? val.materialType : "-",
          binName: val.binName ? val.binName : "-",
          netWeight: val.netWeight ? val.netWeight : "-",
        }
      })
    })
  }
  getOrdersList(viewMode: any, key: any, pageNo: any, pageSize: any, date: any, fromDate?: any, toDate?: any) {
    let orderModel = new OrderModel();
    orderModel.SelectedDate = date ? date : null
    orderModel.DateFrom = fromDate ? fromDate : null
    orderModel.DateTo = toDate ? toDate : null
    orderModel.ViewMode = viewMode ? viewMode : "selecteddate"
    orderModel.SearchKey = key ? key : ""
    orderModel.PageNumber = pageNo ? pageNo : 1
    orderModel.PageSize = pageSize ? pageSize : 4
    this.dashboardService.getMocDocumentList(orderModel).then((res: any) => {
      this.ordersList = res
      //console.log(res);
      
      this.ordersListTableList = res?.data?.map((val: any) => {
        return {
          ...val,
          orderDate: val.orderDate ? this.datePipe.transform(val.orderDate, "dd/MM/yyyy") : "-",
          consignorName: val.consignorName ? val.consignorName : "-",
          consigneeName: val.consigneeName ? val.consigneeName : "-",
          materialType: val.materialType ? val.materialType : "-",
        }
      })
    })
  }
  ngOnInit(): void {
    this.reportsForm = new FormGroup({
      "dateRange" : new FormGroup({
        "fromDate": new FormControl(null,Validators.required),
        "toDate": new FormControl(null,Validators.required),
      })
    })

    this.getTrackList(1, 4, "", ""); 
    // this.getTaskList(1, 4, "", "");
    this.getDriverList(1, 4, "", "","","");
    this.getOrdersList("Day", "", 1, 2, "")
    this.dropdownSub.pipe(debounceTime(200),
    distinctUntilChanged(),
    switchMap((query: any) => this.dropOptimizeSearch(query))).subscribe((res: any) => {
      //console.log(res);
      this.filterDropdownList = [...res]
      
    });
    this.truckSearchSubject.pipe(debounceTime(200),
      distinctUntilChanged(),
      switchMap((query: any) => this.optimizeSearch(query))).subscribe((res: any) => {
        //console.log(res);
      });

      this.reportsForm.valueChanges.subscribe((value:any) => {
        //console.log('Selected Date Range:', value);
        this.fromDate = this.datePipe.transform(this.reportsForm.get('dateRange.fromDate')?.value,"dd/MM/yyyy");
        this.toDate = this.datePipe.transform(this.reportsForm.get('dateRange.toDate')?.value,"dd/MM/yyyy");
     this.twoSelectedDate = this.getDateRangeDisplay()
    if(this.reportsForm.valid) {
      this.getOrdersList("custom", "", this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4,"",this.fromDate ? this.fromDate : null,this.toDate ? this.toDate : null);

    //  this.getReports("",this.filterType ? this.filterType : "",this.sortCode ? this.sortCode : "" ,this.currentPage ? this.currentPage : 1,this.currentPageSize ? this.currentPageSize : 10,"custom" ,this.fromDate ? this.fromDate : null,this.toDate ? this.toDate : null)
    }
      });
      this.getOverview();
  }
 
 getOverview() {
  this.dashboardService.getPlantOverview().then((res:any)=> {
    //console.log(res);
    this.overViewList = res
  })
 }
  dropOptimizeSearch(key:any):Observable<any> {
    //console.log(key);
    //console.log(this.currentSearch);
    
    switch (this.currentSearch) {
      case "intake":
       return of(this.intakeDropdownList.filter((val:any)=> val.toLowerCase().includes(key)))
      default:
        break;
    }
    return of([])

  }
  changeDateEvent(event: any) {
    let date: any = this.datePipe.transform(event?.value, "dd/MM/yyyy")
    this.SelectedDateRange = date
    this.getOrdersList("", "", this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, this.SelectedDateRange);
  }
  tableSearch(event: any, section: any) {
    this.selectedSearchTable = section
    switch (section) {
      case "tracks":
        //console.log(event.target.value);
        if (event.target.value?.length == 0) {
          this.getTrackList(this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "", this.SelectedDateRangeForTracks == 'Supplier' ? "" :this.SelectedDateRangeForTracks );
        } else {
          this.truckSearchSubject.next(event.target.value)
        }
        break;
      case "task":
        if (event.target.value?.length == 0) {
          this.getTaskList(this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "", this.SelectedDateRange);
        } else {
          this.truckSearchSubject.next(event.target.value)
        }
        break;
      case "drivers":
        if (event.target.value?.length == 0) {
          this.getDriverList(this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "", this.SelectedDateRangeForWeight == "Bin name" ? "" :this.SelectedDateRangeForWeight,this.SelectedDateRangeForTask == "Supplier" ? "" : this.SelectedDateRangeForTask,this.SelectedDateRangeForDriver == "Select weight" ? "" : this.SelectedDateRangeForDriver );
        } else {
          this.truckSearchSubject.next(event.target.value)
        }
        break;
      case "orders":
        if (event.target.value?.length == 0) {
          this.getOrdersList(this.SelectedDateRange, "", this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "");
        } else {
          this.truckSearchSubject.next(event.target.value)
        }
        break;
      default:
        break;
    }
  };
  switchMode(type: any, table: any) {
    switch (table) {
      case "intakeSub":
        this.SelectedDateRangeForTracks = type;
        this.getTrackList(this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "", this.SelectedDateRangeForTracks == 'Supplier' ? "" :this.SelectedDateRangeForTracks );
        break;
      case "task":
        this.SelectedDateRangeForTask = type;
        this.getDriverList(this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "", this.SelectedDateRangeForWeight == "Bin name" ? "" :this.SelectedDateRangeForWeight,this.SelectedDateRangeForTask == "Supplier" ? "" : this.SelectedDateRangeForTask,this.SelectedDateRangeForDriver == "Select weight" ? "" : this.SelectedDateRangeForDriver );
        break;
      case "drivers":
        this.SelectedDateRangeForDriver = type;
        this.getDriverList(this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "", this.SelectedDateRangeForWeight == "Bin name" ? "" :this.SelectedDateRangeForWeight,this.SelectedDateRangeForTask == "Supplier" ? "" : this.SelectedDateRangeForTask,this.SelectedDateRangeForDriver == "Select weight" ? "" : this.SelectedDateRangeForDriver );
        break;
        case "weight":
          this.SelectedDateRangeForWeight = type;
          this.getDriverList(this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "", this.SelectedDateRangeForWeight == "Bin name" ? "" :this.SelectedDateRangeForWeight,this.SelectedDateRangeForTask == "Supplier" ? "" : this.SelectedDateRangeForTask,this.SelectedDateRangeForDriver == "Select weight" ? "" : this.SelectedDateRangeForDriver );
          break;
      default:
        break;
    }
  }
  onPageChanged(event: any, section: any) {
    switch (section) {
      case "tracks":
        this.currentPage = event.pageIndex + 1;
        this.currentPageSize = event.pageSize
        this.getTrackList(this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "", this.SelectedDateRangeForTracks == 'Supplier' ? "" :this.SelectedDateRangeForTracks );
        break;
      case "task":
        this.currentPage = event.pageIndex + 1;
        this.currentPageSize = event.pageSize
        this.getOrdersList(this.SelectedDateRange, "", this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "");
        break;
      case "drivers":
        this.currentPage = event.pageIndex + 1;
        this.currentPageSize = event.pageSize
        this.getDriverList(this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "", this.SelectedDateRangeForWeight == "Bin name" ? "" :this.SelectedDateRangeForWeight,this.SelectedDateRangeForTask == "Supplier" ? "" : this.SelectedDateRangeForTask,this.SelectedDateRangeForDriver == "Select weight" ? "" : this.SelectedDateRangeForDriver );
        break;
      default:
        break;
    }
  }
  switchModeForOrders(date: any) {
    this.cutomDateField = false
    //console.log(date);
    this.SelectedDateRange = date
    if (this.SelectedDateRange == 'custom') {
      
    } else {
      this.getOrdersList(this.SelectedDateRange,"", this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "")    }
  }
  
  getDateRangeDisplay(): string | null {
    const fromDate = this.reportsForm.get('dateRange.fromDate')?.value;
    const toDate = this.reportsForm.get('dateRange.toDate')?.value;
  
    if (fromDate && toDate) {
      return `${this.formatDate(fromDate)} - ${this.formatDate(toDate)}`;
    } else if (fromDate) {
      return `From: ${this.formatDate(fromDate)}`;
    } else if (toDate) {
      return `To: ${this.formatDate(toDate)}`;
    }
    return null;
  }
  
  formatDate(date: Date): string {
    const options: any = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options);
  }
  optimizeSearch(key: any): Observable<any> {
    //console.log(key);
    switch (this.selectedSearchTable) {
      case "tracks":
        return of(this.getTrackList(this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, key,  this.SelectedDateRangeForTracks == 'Supplier' ? "" :this.SelectedDateRangeForTracks));
      case "task":
        return of(this.getTaskList(this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, key, this.SelectedDateRange));
      case "drivers":
        return of(this.getDriverList(this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, key, this.SelectedDateRangeForWeight == "Bin name" ? "" :this.SelectedDateRangeForWeight,this.SelectedDateRangeForTask == "Supplier" ? "" : this.SelectedDateRangeForTask,this.SelectedDateRangeForDriver == "Select weight" ? "" : this.SelectedDateRangeForDriver ));
      case "orders":
        return of(this.getOrdersList(this.SelectedDateRange, key, this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, ""));
      default:
        return of([]);
    }
  }
  navigateToMenu(menu:any) {
    switch (menu) {
      case "drivers":
        this.router.navigateByUrl("/home/shunterDrivers")
        break;
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
  exportTable(table: any): void {
    this.excelList = []
  
    switch (table) {
      case "Materials intake":
        this.TrucksTableList.forEach((res: any) => {
          let arrayList = {
            'Id': res.orderID,
            'Mov doc date':res.orderDate,
            'Supplier': res.consignorName,
            'Product': res.materialType,
            'Bin name': res.binName,
            'Total weight': res.netWeight,
          }
          this.excelList.push(arrayList)
        })
        break;
      case "Movement documents":
        this.ordersListTableList.forEach((res: any) => {
          let arrayList = {
            'Id': res.orderID,
            'Mov doc date': res.orderDate ,
            'Mov Doc No.': res.orderNo,
            'Supplier': res.consignorName,
            'Consignee': res.consigneeName,
            'Product': res.materialType,
          }
          this.excelList.push(arrayList)
        })
        break;
      case "Materials tipped":
        this.driversTableList.forEach((res: any) => {
          let arrayList = {
            'Id': res.orderID,
            'Mov doc date':res.orderDate,
            'Supplier': res.consignorName,
            'Product': res.materialType,
            'Bin name': res.binName,
            'Total weight': res.netWeight,
          }
          this.excelList.push(arrayList)
        })
        break;
      case "Orders":
        this.ordersListTableList.forEach((res: any) => {
          let arrayList = {
            'Id': res.orderID,
            'Order No': res.orderNo,
            'Order date': res.orderDate,
            'Shunter': res.shunterDriverName,
            'Trailer': res.trailerNumber,
            'Bin': res.binName,
            'Material': res.materialType,
          }
          this.excelList.push(arrayList)
        })
        break;
      default:
        break;
    }
    //console.log(this.excelList)
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.excelList);
    //console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'data', table);
  }
  private saveAsExcelFile(buffer: any, fileName: string, table: any): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    const receviedDate = this.datePipe.transform(new Date(), 'MM/dd/yyyy');
    fileSaver.saveAs(data, " " + table + " " + receviedDate + EXCEL_EXTENSION);
  };
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
  customRangeForDate() {
    //console.log(this.customDateForm);
    if (this.customDateForm.valid) {
      this.getOrdersList(this.SelectedDateRange, "", this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "", this.customDateForm.value.fromDate, this.customDateForm.value.toDate);
    }
  }

  dropdownSearch(event:any,type:any) {
    this.currentSearch = type
    //console.log(event.target.value);
    if(event.target.value?.length > 0) {
      this.dropdownSub.next(event.target.value)
    } else {
      this.filterDropdownList = [...this.intakeDropdownList]
    }
    

  }
}