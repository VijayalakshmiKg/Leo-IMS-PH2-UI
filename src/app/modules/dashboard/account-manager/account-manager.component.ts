import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
import { DashboardService } from '../dashboard.service';
import { ReceivedProduct } from './models/received-material';
import { SupplierColumn } from '../transport-dashboard/supplier-column';
import { PlantProductColumn } from '../plan-site-dashboard/product-column';
import { PlantBinNameColumn } from '../plan-site-dashboard/bin-name';
@Component({
  selector: 'app-account-manager',
  templateUrl: './account-manager.component.html',
  styleUrls: ['./account-manager.component.css']
})
export class AccountManagerComponent implements OnInit {
  matrialChartList: any = [];
  SelectedDateRange: any = "Day";
  excelList: any
  customDateForm!: FormGroup;
  customIntakeDateForm!: FormGroup;
  cutomDateField: Boolean = false;
  reportsForm!: FormGroup;
  cutomDateFieldForIntake: Boolean = false;
  ChartOptionsForOrders: any;
  SelectedDateRangeForMaterial: any = "Day";
  SelectedDateRangeForIntake: any = "Day";
  selectFilterProductReceived: any = "Product categroy";
  selectFilterProductReceivedSub: any = "Supplier";
  selectFilterIntakeProd: any = "Product"
  selectFilterIntakeSub: any = "Supplier"
  pageSize: any = 5;
  materialIntake:any
  currentPage: any = 1
  materialList: any = [];
  truckSearchSubject: Subject<any> = new Subject();
  fromDate: any = "";
  toDate: any = "";
  twoSelectedDate: any;
  currentSearch: any;
  dropdownSub: Subject<any> = new Subject();
  receivedProductDropdownList: any = []
  receivedSubDropdownList: any = []
  reportsFormforSub!: FormGroup
  reportsFormforIntake!: FormGroup
  filterReceivedProd:any = []
  filterReceivedSub:any = []
  filterIntakeProd: any = []
  filterIntakeSub: any = []
  receivedProduct:any;
  receivedProductSup:any
  singleDate:any
  currentPageSize: any = 5
  receivedProductHeader = [{ field: 'orderID', headerName: "Id", sortable: true }, { field: 'orderDate', headerName: "Mov doc date", sortable: true },
  { cellRenderer: SupplierColumn, headerName: "Supplier", sortable: true, }, {  cellRenderer:PlantProductColumn, headerName: "Product", },
  { cellRenderer: PlantBinNameColumn, headerName: "Bin name", maxWidth: 170 },
  { field: 'grossWeight', headerName: "Total weight", },
  ];
  receivedProductList: any = [];
  fromDateSub: any;
  toDateSub: any
  fromDateIntake: any;
  toDateIntake: any;
  twoSelectedDateForSub: any
  twoSelectedDateForIntake: any
  receivedProductListSup:any
  constructor(public datePipe: DatePipe, public dashboardService:DashboardService) {
    this.getSupplier();
    this.getProduct();
   }
  ngOnInit(): void {  
    this.syncForm();
    this.reportsForm = new FormGroup({
      "dateRange": new FormGroup({
        "fromDate": new FormControl(null, Validators.required),
        "toDate": new FormControl(null, Validators.required),
      })
    })
    this.reportsFormforSub = new FormGroup({
      "dateRange": new FormGroup({
        "fromDate": new FormControl(null, Validators.required),
        "toDate": new FormControl(null, Validators.required),
      })
    })
    this.reportsFormforIntake = new FormGroup({
      "dateRange": new FormGroup({
        "fromDate": new FormControl(null, Validators.required),
        "toDate": new FormControl(null, Validators.required),
      })
    })
    this.reportsForm.valueChanges.subscribe((value: any) => {
      //console.log('Selected Date Range:', value);
      this.fromDate = this.datePipe.transform(this.reportsForm.get('dateRange.fromDate')?.value, "dd/MM/yyyy");
      this.toDate = this.datePipe.transform(this.reportsForm.get('dateRange.toDate')?.value, "dd/MM/yyyy");
      this.twoSelectedDate = this.getDateRangeDisplay(this.reportsForm.get('dateRange.fromDate')?.value, this.reportsForm.get('dateRange.toDate')?.value)
      if (this.reportsForm.valid) {
        this.getMaterialList(this.currentPage,this.currentPageSize,this.selectFilterProductReceived == "Product categroy" ? "" : this.selectFilterProductReceived,this.SelectedDateRange,this.singleDate,this.fromDate,this.toDate);
      }
    });
    this.reportsFormforSub.valueChanges.subscribe((value: any) => {
      //console.log('Selected Date Range:', value);
      this.fromDateSub = this.datePipe.transform(this.reportsFormforSub.get('dateRange.fromDate')?.value, "dd/MM/yyyy");
      this.toDateSub = this.datePipe.transform(this.reportsFormforSub.get('dateRange.toDate')?.value, "dd/MM/yyyy");
      this.twoSelectedDateForSub = this.getDateRangeDisplay(this.reportsFormforSub.get('dateRange.fromDate')?.value, this.reportsFormforSub.get('dateRange.toDate')?.value)
      if (this.reportsFormforSub.valid) {
        this.getMaterialList(this.currentPage,this.currentPageSize,this.SelectedDateRangeForMaterial == "Supplier" ? "" : this.SelectedDateRangeForMaterial,this.SelectedDateRange,this.singleDate,this.fromDateSub,this.toDateSub);
        //  this.getReports("",this.filterType ? this.filterType : "",this.sortCode ? this.sortCode : "" ,this.currentPage ? this.currentPage : 1,this.currentPageSize ? this.currentPageSize : 10,"custom" ,this.fromDate ? this.fromDate : null,this.toDate ? this.toDate : null)
      }
    });
    this.reportsFormforIntake.valueChanges.subscribe((value: any) => {
      //console.log('Selected Date Range:', value);
      this.fromDateIntake = this.datePipe.transform(this.reportsFormforIntake.get('dateRange.fromDate')?.value, "dd/MM/yyyy");
      this.toDateIntake = this.datePipe.transform(this.reportsFormforIntake.get('dateRange.toDate')?.value, "dd/MM/yyyy");
      this.twoSelectedDateForIntake = this.getDateRangeDisplay(this.reportsFormforIntake.get('dateRange.fromDate')?.value, this.reportsFormforIntake.get('dateRange.toDate')?.value)
      if (this.reportsFormforIntake.valid) {
        this.getMaterialIntake(this.currentPage,this.currentPageSize,this.selectFilterIntakeSub == 'Supplier'? "":this.selectFilterIntakeSub ,this.selectFilterIntakeProd == 'Product' ? "": this.selectFilterIntakeProd,this.singleDate ? "selecteddate":this.SelectedDateRangeForIntake,this.singleDate,this.fromDateIntake,this.toDateIntake);
      }
    });
    this.dropdownSub.pipe(debounceTime(200),
      distinctUntilChanged(),
      switchMap((query: any) => this.dropOptimizeSearch(query))).subscribe((res: any) => {
        //console.log(res);
        switch (this.currentSearch) {
          case "receivedProduct":
            this.filterReceivedProd = [...res]
            break;
          case "receivedSub":
            this.filterReceivedSub = [...res]
            break;
          case "intakeSub":
            this.filterIntakeSub = [...res]
            break;
          case "intakeProd":
            this.filterIntakeProd = [...res]
            break;

          default:
            break;
        }
      });
      this.getMaterialList(1,5,"","Day","","","");
      this.getMaterialListSupplier(1,5,"","Day","","","");
      this.getMaterialIntake(1,5,"","","Day","","","")
  }
  getMaterialIntake(pageNo:any,pageSize:any,suppiler:any,product:any,viewMode:any,selectedDate:any,fromDate:any,toDate:any) {
    let materialIntakeModel = new ReceivedProduct();
    materialIntakeModel.ConsignorSearchKey = suppiler
    materialIntakeModel.DateFrom = fromDate
    materialIntakeModel.DateTo = toDate
    materialIntakeModel.PageNumber = pageNo
    materialIntakeModel.PageSize = pageSize
    materialIntakeModel.ProductSearchKey = product
    materialIntakeModel.SelectedDate = selectedDate
    materialIntakeModel.ViewMode = viewMode
    this.dashboardService.GetMaterialIntake(materialIntakeModel).then((res:any)=> {
      //console.log(res);
      this.materialIntake = res
      this.materialList = res.data.map((val:any)=> {
        return {
          ...res,
          orderID: val.orderID ? val.orderID : "-",
          orderDate: this.datePipe.transform(val.orderDate,"dd/MM/yyyy"),
          consignorName : val.consignorName ? val.consignorName : "-",
          materialName: val.materialName ? val.materialName : "-",
          binName : val.binName ? val.binName : "-",
          grossWeight : val.grossWeight ? val.grossWeight : "-"
        }
      })
    })
  }
  getMaterialList(pageNo:any,pageSize:any,filter:any,viewMode:any,selectedDate:any,fromDate:any,toDate:any) {
    let receivedProductModel = new ReceivedProduct();
    receivedProductModel.ConsignorSearchKey = ""
    receivedProductModel.DateFrom = fromDate
    receivedProductModel.DateTo = toDate
    receivedProductModel.PageNumber = pageNo
    receivedProductModel.PageSize = pageSize
    receivedProductModel.ProductSearchKey = filter
    receivedProductModel.SearchKey = ""
    receivedProductModel.SelectedDate = selectedDate
    receivedProductModel.ViewMode = viewMode

    this.dashboardService.GetMaterialReceived(receivedProductModel).then((res:any)=> {
      //console.log(res);
      this.receivedProduct = res
      this.receivedProductList = res.data.map((val:any)=> {
        return {
          ...res,
          orderID: val.orderID ? val.orderID : "-",
          orderDate: this.datePipe.transform(val.orderDate,"dd/MM/yyyy"),
          consignorName : val.consignorName ? val.consignorName : "-",
          materialName: val.materialName ? val.materialName : "-",
          binName : val.binName ? val.binName : "-",
          grossWeight : val.netWeight ? val.netWeight : "-"
        }
      })
      
    })
  }
  getMaterialListSupplier(pageNo:any,pageSize:any,filter:any,viewMode:any,selectedDate:any,fromDate:any,toDate:any) {
    let receivedProductModel = new ReceivedProduct();
    receivedProductModel.ConsignorSearchKey = ""
    receivedProductModel.DateFrom = fromDate
    receivedProductModel.DateTo = toDate
    receivedProductModel.PageNumber = pageNo
    receivedProductModel.PageSize = pageSize
    receivedProductModel.ProductSearchKey = filter
    receivedProductModel.SearchKey = ""
    receivedProductModel.SelectedDate = selectedDate
    receivedProductModel.ViewMode = viewMode

    this.dashboardService.GetMaterialReceived(receivedProductModel).then((res:any)=> {
      //console.log(res);
      this.receivedProductSup = res
      this.receivedProductListSup = res.data.map((val:any)=> {
        return {
          ...res,
          orderID: val.orderID ? val.orderID : "-",
          orderDate: this.datePipe.transform(val.orderDate,"dd/MM/yyyy"),
          consignorName : val.consignorName ? val.consignorName : "-",
          materialName: val.materialName ? val.materialName : "-",
          binName : val.binName ? val.binName : "-",
          grossWeight : val.netWeight ? val.netWeight : "-"
        }
      })
      
    })
  }
  getProduct() {
  this.dashboardService.getProductDropdown().then((res:any)=> {
    //console.log(res);
    let obj =    {
      "materialID": 0,
      "consignorID": null,
      "materialType": "All",
      "description": "mutton kema",
      "maxDisposeDate": null,
      "createdDate": "2025-03-19T12:20:32.897",
      "createdBy": "User",
      "modifiedDate": null,
      "modifiedBy": null,
      "deleted": false,
      "productCategory": null,
      "netWeight": null,
      "grossWeight": null,
      "netVolume": null,
      "grossVolume": null,
      "materialName": "Mutton kema",
      "categoryType": "Category 2",
      "consigorName": null,
      "consigneeName": null
  }
   let prod:any = res.unshift(obj)
   this.receivedProductDropdownList = [...res]
    this.filterReceivedProd = [...this.receivedProductDropdownList]
    this.filterIntakeProd = [...this.receivedProductDropdownList]

  })
  }
  getSupplier() {
    this.dashboardService.getSupplierDropdown().then((res:any)=> {
      //console.log(res);
      let obj =   {
        "consignorID": 47,
        "consignorName": "All",
        "consignorType": null,
        "organizationCode": null,
        "consignorLicenseNo": "8545874587",
        "faxNumber": null,
        "email": "joohn@gmail.com",
        "address1": "8545874587",
        "address2": null,
        "county": null,
        "city": "Puilboreau",
        "pincode": "17289 CEDEX",
        "state": "Nouvelle-Aquitaine",
        "country": "France",
        "contactPerson": null,
        "contactDetails": "8545874587",
        "latitude": null,
        "longitude": null,
        "createdDate": "2025-03-18T19:15:41.137",
        "createdBy": "User",
        "modifiedDate": null,
        "modifiedBy": null,
        "deleted": false,
        "phoneCountryCode": "+44",
        "faxCountryCode": "+44",
        "phoneNumberWithCountryCode": "+44 8545874587",
        "faxNumberWithCountryCode": null
      }
      let prod:any = res.unshift(obj)
   this.receivedSubDropdownList = [...res]
    this.filterReceivedSub = [...this.receivedSubDropdownList]
    this.filterIntakeSub = [...this.receivedSubDropdownList]
    })
    }
  optimizeSearch(key: any): Observable<any> {
    return of([])
    // return of(this.getTrackListPagination(key,"",this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 6));
  }
  dropOptimizeSearch(key: any): Observable<any> {
    //console.log(key);
    //console.log(this.currentSearch);
    switch (this.currentSearch) {
      case "receivedProduct":
        return of(this.receivedProductDropdownList.filter((val: any) => val.materialType.toLowerCase().includes(key.toLowerCase())))
      case "receivedSub":
        return of(this.receivedSubDropdownList.filter((val: any) => val.consignorName.toLowerCase().includes(key.toLowerCase())))
      case "intakeSub":
        return of(this.receivedSubDropdownList.filter((val: any) => val.consignorName.toLowerCase().includes(key.toLowerCase())))
      case "intakeProd":
        return of(this.receivedProductDropdownList.filter((val: any) => val.materialType.toLowerCase().includes(key.toLowerCase())))
      default:
        break;
    }
    return of([])

  }
  exportTable(table: any): void {
    this.excelList = []
    
    switch (table) {
      case "Materials received":
        this.receivedProductList.forEach((res: any) => {
          let arrayList = {
            'orderDate': res.orderID,
            'Mov doc date': res.orderDate,
            'Supplier': res.consignorName,
            'Product': res.materialName,
            'Bin name': res.binName,
            'Total weight': res?.netWeight ? res.netWeight : "-",
          }
          this.excelList.push(arrayList)
        })
        break;
      case "receivedSub":
        this.receivedProductListSup.forEach((res: any) => {
          let arrayList = {
            'orderDate': res.orderID,
            'Mov doc date': res.orderDate,
            'Supplier': res.consignorName,
            'Product': res.materialName,
            'Bin name': res.binName,
            'Total weight': res?.grossWeight ? res.grossWeight : "-",
          }
          this.excelList.push(arrayList)
        })
        break;
      case "Materials intake":
        this.materialList.forEach((res: any) => {
          let arrayList = {
            'Id': res.orderID,
            'Mov doc date': res.orderNo,
            'Supplier': res.driverName,
            'Product': res.registrationNo,
            'Bin name': res.trailerNumber,
            'Total weight': res?.arrivalDateTime ? res.arrivalDateTime : "-",
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
  dropdownSearch(event: any, section: any) {
    this.currentSearch = section
    //console.log(event.target.value);
    switch (this.currentSearch) {
      case "receivedProduct":
        if (event.target.value?.length > 0) {
          this.dropdownSub.next(event.target.value)
        } else {
          //console.log("else", this.receivedProductDropdownList);

          this.filterReceivedProd = [...this.receivedProductDropdownList]
        }
        break;
      case "receivedSub":
        if (event.target.value?.length > 0) {
          this.dropdownSub.next(event.target.value)
        } else {
          //console.log("else", this.receivedProductDropdownList);

          this.filterReceivedSub = [...this.receivedSubDropdownList]
        }
        break;
      case "intakeSub":
        if (event.target.value?.length > 0) {
          this.dropdownSub.next(event.target.value)
        } else {
          //console.log("else", this.receivedSubDropdownList);

          this.filterIntakeSub = [...this.receivedSubDropdownList]
        }
        break;
      case "intakeProd":
        if (event.target.value?.length > 0) {
          this.dropdownSub.next(event.target.value)
        } else {
          //console.log("else", this.receivedProductDropdownList);

          this.filterIntakeProd = [...this.receivedProductDropdownList]
        }
        break;
      default:
        break;
    }

  }


  getDateRangeDisplay(from: any, to: any): string | null {
    const fromDate = from
    const toDate = to

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
  switchModeForOrders(mode: any, section: any) {
    this.singleDate = "";
    this.toDate = ""
    this.fromDate = ""
    this.toDateSub = ""
    this.fromDateSub = ""
     this.toDateIntake = ""
    this.fromDateIntake = ""
    switch (section) {
      case "receivedForMat":
        this.SelectedDateRange = mode
        if (this.SelectedDateRange == 'custom') {
          this.SelectedDateRange = "custom"
        } else {
          this.SelectedDateRange = mode
          //console.log(this.SelectedDateRange);
          this.getMaterialList(this.currentPage,this.currentPageSize,this.selectFilterProductReceived == "Product categroy" ? "" : this.selectFilterProductReceived,mode,this.singleDate,this.fromDate,this.toDate);
        }
        break;
      case "receivedForSub":
        this.SelectedDateRangeForMaterial = mode
        if (this.SelectedDateRangeForMaterial == 'custom') {
          this.SelectedDateRangeForMaterial = "custom"
        } else {
          this.SelectedDateRangeForMaterial = mode
          //console.log(this.SelectedDateRangeForMaterial);
          this.getMaterialListSupplier(this.currentPage,this.currentPageSize,this.selectFilterProductReceivedSub == "Supplier" ? "" : this.selectFilterProductReceivedSub,mode,this.singleDate,this.fromDateSub,this.toDateSub);
        }
        break;
      case "intake":
        this.SelectedDateRangeForIntake = mode
        if (this.SelectedDateRangeForIntake == 'custom') {
          this.SelectedDateRangeForIntake = "custom"
        } else {
          this.SelectedDateRangeForIntake = mode
          //console.log(this.SelectedDateRangeForIntake);
          this.getMaterialIntake(this.currentPage,this.currentPageSize,this.selectFilterIntakeSub == 'Supplier'? "":this.selectFilterIntakeSub ,this.selectFilterIntakeProd == 'Product' ? "": this.selectFilterIntakeProd,this.singleDate ? "selecteddate":mode,this.singleDate,this.fromDateIntake,this.toDateIntake);

          // this.getOrdersList(this.SelectedDateRange, "", this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "");
        }
        break;
      default:
        break;
    }
  }
  dropdownSwitchMode(data: any, section: any) {
    switch (section) {
      case "receivedProd":
        this.selectFilterProductReceived = data;
        this.getMaterialList(this.currentPage,this.currentPageSize,this.selectFilterProductReceived == "Product categroy" ? "" : this.selectFilterProductReceived,this.singleDate ? "selecteddate":this.SelectedDateRange,this.singleDate,this.fromDate,this.toDate);

        break;
      case "receivedSub":
        this.selectFilterProductReceivedSub = data;
        this.getMaterialListSupplier(this.currentPage,this.currentPageSize,this.selectFilterProductReceivedSub == "Supplier" ? "" : this.selectFilterProductReceivedSub,this.singleDate ? "selecteddate":this.SelectedDateRange,this.singleDate,this.fromDateSub,this.toDateSub);

          break;
      case "intakeSub":
        this.selectFilterIntakeSub = data;
        this.getMaterialIntake(this.currentPage,this.currentPageSize,this.selectFilterIntakeSub == 'Supplier'? "":this.selectFilterIntakeSub ,this.selectFilterIntakeProd == 'Product' ? "": this.selectFilterIntakeProd,this.singleDate ? "selecteddate":this.SelectedDateRangeForMaterial,this.singleDate,this.fromDateIntake,this.toDateIntake);

        
        // this.getTrackList(this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "", this.SelectedDateRangeForTracks);
        break;
      case "intakeProd":
        this.selectFilterIntakeProd = data;
        this.getMaterialIntake(this.currentPage,this.currentPageSize,this.selectFilterIntakeSub == 'Supplier'? "":this.selectFilterIntakeSub ,this.selectFilterIntakeProd == 'Product' ? "": this.selectFilterIntakeProd,this.singleDate ? "selecteddate":this.SelectedDateRangeForMaterial,this.singleDate,this.fromDateIntake,this.toDateIntake);

        // this.getTrackList(this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "", this.SelectedDateRangeForTracks);
        break;

      default:
        break;
    }
  }
  changeDateEvent(event: any, section: any) {
    let date: any = this.datePipe.transform(event?.value, "dd/MM/yyyy")
this.singleDate = date
    switch (section) {
      case "receivedForMat":
        this.SelectedDateRange = date
        this.getMaterialList(this.currentPage,this.currentPageSize,this.selectFilterProductReceived == "Product categroy" ? "" : this.selectFilterProductReceived,"selecteddate",this.singleDate,this.fromDate,this.toDate);

        break;
      case "receivedForSub":
        this.SelectedDateRangeForMaterial = date
        this.getMaterialListSupplier(this.currentPage,this.currentPageSize,this.selectFilterProductReceivedSub == "Supplier" ? "" : this.selectFilterProductReceivedSub,"selecteddate",this.singleDate,this.fromDateSub,this.toDateSub);
        break;
      case "intake":
        this.SelectedDateRangeForIntake = date
        this.getMaterialIntake(this.currentPage,this.currentPageSize,this.selectFilterIntakeSub == 'Supplier'? "":this.selectFilterIntakeSub ,this.selectFilterIntakeProd == 'Product' ? "": this.selectFilterIntakeProd,this.singleDate ? "selecteddate":this.SelectedDateRangeForMaterial,this.singleDate,this.fromDateIntake,this.toDateIntake);

        // this.getOrdersList("", "", this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, this.SelectedDateRange);
        break;

      default:
        break;
    }

  }
  onPageChanged(event: any, section: any) {
    switch (section) {
      case "receivedProd":
        this.currentPage = event.pageIndex + 1;
        this.currentPageSize = event.pageSize
        this.getMaterialList(this.currentPage,this.currentPageSize,this.selectFilterProductReceived == "Product categroy" ? "" : this.selectFilterProductReceived,this.singleDate ? "selecteddate":this.SelectedDateRange,this.singleDate,this.fromDate,this.toDate);
        break;
        case "receivedSub":
          this.currentPage = event.pageIndex + 1;
          this.currentPageSize = event.pageSize
          this.getMaterialListSupplier(this.currentPage,this.currentPageSize,this.selectFilterProductReceivedSub == "Supplier" ? "" : this.selectFilterProductReceivedSub,this.singleDate ? "selecteddate":this.SelectedDateRange,this.singleDate,this.fromDate,this.toDate);
          break;
          case "intake":
            this.currentPage = event.pageIndex + 1;
            this.currentPageSize = event.pageSize
            this.getMaterialIntake(this.currentPage,this.currentPageSize,this.selectFilterIntakeSub == 'Supplier'? "":this.selectFilterIntakeSub ,this.selectFilterIntakeProd == 'Product' ? "": this.selectFilterIntakeProd,this.singleDate ? "selecteddate":this.SelectedDateRangeForIntake,this.singleDate,this.fromDateIntake,this.toDateIntake);
            break;
      default:
        break;
    }
  }
  // tableSearch(event: any) {
  //   //console.log(event.target.value);
  //   if (event.target.value?.length == 0) {
  //     // this.getTrackListPagination("","",this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 6);
  //   } else {
  //     this.truckSearchSubject.next(event.target.value)
  //   }
  // }
 ordersChart() {
    this.ChartOptionsForOrders = {
      series: [{
        data: [21, 22, 10, 28, 43]
      }],
      chart: {
        width: "100%",
        height: 220,
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
              return "Orders delivered";
            }
          }
        }
      },
      colors: ["#13D090"],
      plotOptions: {
        bar: {
          borderRadius: 7,
          columnWidth: '10px',
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
        categories: ['Carcass', 'Chicken wings', 'Chicken feathers', 'Chicken nails', 'Chicken bones', 'SAT', 'SUN'],
        labels: {
          style: {
            fontSize: '12px'
          }
        }
      }
    };

   }
  syncForm() {
    this.customDateForm = new FormGroup({
      "fromDate": new FormControl(Validators.required),
      "toDate": new FormControl(Validators.required),
    })
  }
  syncFormIntake() {
    this.customIntakeDateForm = new FormGroup({
      "intakeFromDate": new FormControl(Validators.required),
      "intakeToDate": new FormControl(Validators.required),
    })
  }
  navigateToMenu(menu: any) {

  }
  switchMode(date: any, section: any) {

    switch (section) {
      case "matrial":
        this.cutomDateField = false
        //console.log(date);
        this.SelectedDateRange = date
        if (this.SelectedDateRange == 'custom range') {
          this.cutomDateField = true
        } else {
          this.cutomDateField = false
          // this.getOrdersList(this.SelectedDateRange, "", this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "");
        }
        break;
      case "intake":
        this.cutomDateFieldForIntake = false
        //console.log(date);
        this.SelectedDateRangeForIntake = date
        if (this.SelectedDateRangeForIntake == 'custom range') {
          this.cutomDateFieldForIntake = true
        } else {
          this.cutomDateFieldForIntake = false
          // this.getOrdersList(this.SelectedDateRange, "", this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "");
        }
        break;

      default:
        break;
    }

  }
  customRangeForDate() {
    //console.log(this.customDateForm);
    if (this.customDateForm.valid) {
      // this.getOredersGraph("custom", this.datePipe.transform(this.customDateForm.value.fromDate,'dd/MM/yyyy'), this.datePipe.transform(this.customDateForm.value.toDate,'dd/MM/yyyy'));
    }
  };
  customRangeForDateForIntake() {
    //console.log(this.customDateForm);
    if (this.customDateForm.valid) {
      // this.getOredersGraph("custom", this.datePipe.transform(this.customDateForm.value.fromDate,'dd/MM/yyyy'), this.datePipe.transform(this.customDateForm.value.toDate,'dd/MM/yyyy'));
    }
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
  intakeToDateValidation() {
    if (
      new Date(this.customIntakeDateForm.value.intakeFromDate) <
      new Date(this.customIntakeDateForm.value.intakeToDate)
    ) {
    } else {
      if (this.customIntakeDateForm.value.intakeFromDate) {
        this.customIntakeDateForm.get("IntakeToDate")?.setValue(null)
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

  intakeFromDateValidation() {
    if (
      new Date(this.customIntakeDateForm.value.intakeToDate) <
      new Date(this.customIntakeDateForm.value.intakeFromDate)
    ) {
      if (this.customIntakeDateForm.value.intakeToDate) {
        this.customIntakeDateForm.get("intakeFromDate")?.setValue(null)
      }
    }
  }
}
