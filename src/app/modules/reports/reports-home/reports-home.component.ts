import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ReportsService } from '../reports.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-reports-home',
  templateUrl: './reports-home.component.html',
  styleUrls: ['./reports-home.component.css']
})
export class ReportsHomeComponent implements OnInit {

  reportsForm: FormGroup |any;

 reportsList:any | any[] = []
  sortList: any[] = [];
  status = 'Status'
  orderKeys:any
  sortByText:any = 'All';
  SelectedDate:any = "Day"
  sortCode:any;
  selectAll:boolean = false;
  excelList:any = []
  truckSearchSubject: Subject<any> = new Subject();
  reportList:any;
  filterType:any= "";
  reportAll:any;
  totalPages:any
  currentPage: any;
  currentPageSize: any;
  fromDate:any;
  toDate:any;
  twoSelectedDate:any
  logedInUser:any
  constructor(public route:Router,public datePipe:DatePipe, public reportserv:ReportsService,public dialog:MatDialog, public utilServ:UtilityService,private fb: FormBuilder) { }

ngOnInit(): void {

   let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);

  //console.log(this.reportserv.reportsList);
  this.reportsList = this.reportserv.reportsList
  if(this.reportsList.length > 0){
   

  }

  this.reportsForm = this.fb.group({
    dateRange: this.fb.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    }),
    type: [''],
    sortBy:['']
  });
  this.truckSearchSubject.pipe(debounceTime(200),
  distinctUntilChanged(),
  switchMap((query: any) => this.optimizeSearch(query))).subscribe((res: any) => {
    //console.log(res);
  });
  this.getSortList();
  this.reportsForm.valueChanges.subscribe((value:any) => {
    //console.log('Selected Date Range:', value);
    this.fromDate = this.datePipe.transform(this.reportsForm.get('dateRange.fromDate')?.value,"dd/MM/yyyy");
    this.toDate = this.datePipe.transform(this.reportsForm.get('dateRange.toDate')?.value,"dd/MM/yyyy");



 this.twoSelectedDate = this.getDateRangeDisplay()
if(this.reportsForm.valid) {
 this.getReports("",this.filterType ? this.filterType : "",this.sortCode ? this.sortCode : "" ,this.currentPage ? this.currentPage : 1,this.currentPageSize ? this.currentPageSize : 10,"custom" ,this.fromDate ? this.fromDate : null,this.toDate ? this.toDate : null)

}
    // Now you have access to the start and end date values
  });
  this.getReports("","","",1,3,"month",null,null)
}
optimizeSearch(key:any): Observable<any>{
  // return of(this.getTrackList(this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, key, this.SelectedDateRangeForTracks))
return of(this.getReports(key,this.filterType ? this.filterType : "",this.sortCode ? this.sortCode : "" ,this.currentPage ? this.currentPage : 1,this.currentPageSize ? this.currentPageSize : 10,this.SelectedDate ,this.fromDate ? this.fromDate : null,this.toDate ? this.toDate : null))
}



filteredUsersList(event:any){
  //console.log(event);
  
  if (event.target.value?.length == 0) {
    this.getReports("",this.filterType ? this.filterType : "",this.sortCode ? this.sortCode : "" ,this.currentPage ? this.currentPage : 1,this.currentPageSize ? this.currentPageSize : 10,this.SelectedDate ,this.fromDate ? this.fromDate : null,this.toDate ? this.toDate : null)    // this.getTrackList(this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "", this.SelectedDateRangeForTracks);
  } else {
    //console.log("else");
    
    this.truckSearchSubject.next(event.target.value)
  }
}
getReports(key:any,filter:any,sort:any,pageNo:any,pageSize:any,mode:any,fromDate:any,toDate:any){
  this.reportserv.getReport(key,filter,sort,pageNo,pageSize,mode,fromDate,toDate).then((res:any)=> {
    this.reportAll = res
    this.totalPages = res.data.totalCount
    //console.log(this.reportAll);
    
    this.reportList = res.data?.data.map((val:any)=> {
      return {
        ...val,
        checked : false
      }
    })
    //console.log(this.reportList);

    
  })
}
changeDateEvent(event: any) {
  let date: any = this.datePipe.transform(event?.value, "dd/MM/yyyy")
  this.SelectedDate = date 
  this.getReports("",this.filterType ? this.filterType : "",this.sortCode ? this.sortCode : "" ,this.currentPage ? this.currentPage : 1,this.currentPageSize ? this.currentPageSize : 10,this.SelectedDate ,this.fromDate ? this.fromDate : null,this.toDate ? this.toDate : null)
  // this.getOrdersList("", "", this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, this.SelectedDateRange);
}
switchModeForOrders(mode:any) {
this.SelectedDate = mode

if (this.SelectedDate == 'custom') {
  this.SelectedDate = "custom"
  // this.cutomDateField = true
} else {
    this.SelectedDate = mode
    //console.log(this.SelectedDate);
    

this.getReports("",this.filterType ? this.filterType : "",this.sortCode ? this.sortCode : "" ,this.currentPage ? this.currentPage : 1,this.currentPageSize ? this.currentPageSize : 10,mode ,this.fromDate ? this.fromDate : null,this.toDate ? this.toDate : null)

  // this.cutomDateField = false
  // this.getOrdersList(this.SelectedDateRange, "", this.currentPage ? this.currentPage : 1, this.currentPageSize ? this.currentPageSize : 4, "");
}
}
setSortBy(value: string): void {
  this.filterType = value
  this.reportsForm.get('type')?.setValue(value);
  this.getReports("",this.filterType ? this.filterType : "",this.sortCode ? this.sortCode : "" ,this.currentPage ? this.currentPage : 1,this.currentPageSize ? this.currentPageSize : 10,this.SelectedDate ,this.fromDate ? this.fromDate : null,this.toDate ? this.toDate : null)
}

onSubmit(): void {
  if (this.reportsForm.valid) {
    const formData = this.reportsForm.value;
    const fromDate = formData.dateRange.fromDate;
    const toDate = formData.dateRange.toDate;
    const sortBy = formData.type;
//console.log(formData);

    //console.log('From Date:', fromDate);
    //console.log('To Date:', toDate);
    //console.log('type:', sortBy);

    this.reportsList = this.reportserv.reportsList[sortBy]
    this.orderKeys = Object.keys(this.reportsList[0]);
    //console.log(this.reportsList);
    
  } else {
    // console.error('Form is invalid');
  }
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

addReports(){
  this.route.navigateByUrl('/home/orders/addReports')
}
onCheckboxChange(event:any) {
  //console.log(event);
  if(event.checked === true) {
    this.reportList.map((val:any)=> {
      return {
        ...val,
        checked: val.checked = true
      }
    })
    //console.log(this.reportserv.report);
    
  }else {
    this.reportList.map((val:any)=> {
      return {
        ...val,
        checked: val.checked = false
      }
    })
  }
  

}

viewReports(index:any){
  //console.log(index);
  this.reportserv.viewReportsIndex = index
  // this.route.navigateByUrl('/home/orders/viewReports')

}
exportReport() {
  this.excelList = []
  this.reportList.filter((val:any)=> val.checked).forEach((res: any) => {
    let arrayList = {
      'Date': res.orderDate,
      'Supplier': res.consignorName,
      'Product': res.materialName,
      'Haulier': res.haulierName,
      'Net weight': res.netWeight + " kg",
    }
    this.excelList.push(arrayList);

    //console.log(this.excelList);
    
  })
   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.excelList);
      //console.log('worksheet', worksheet);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'data', "Report");
}
 private saveAsExcelFile(buffer: any, fileName: string, table: any): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    const receviedDate = this.datePipe.transform(new Date(), 'MM/dd/yyyy');
    fileSaver.saveAs(data, " " + table + " " + receviedDate + EXCEL_EXTENSION);
    this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Report generated successfully' });

  };
  onPageChange(event:any) {
    //console.log(event);
    this.currentPage = event.pageIndex + 1;
        this.currentPageSize = event.pageSize
        this.getReports("",this.filterType ? this.filterType : "",this.sortCode ? this.sortCode : "" ,this.currentPage ? this.currentPage : 1,this.currentPageSize ? this.currentPageSize : 10,this.SelectedDate ,this.fromDate ? this.fromDate : null,this.toDate ? this.toDate : null)

  }
deleteReportsList(index:any){
  let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
    width: '480px',
    height: 'auto',
    data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this order ?', title: 'Remove order ?' },
    disableClose: true,
    autoFocus: false,
    panelClass: 'custom-msg-box'
  })
  dialogRef.afterClosed().subscribe(res => {
    if (res) {
      this.reportsList.splice(index,1)
  
  this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Order deleted successfully' });
    }
  })
}

changeSortBY(values:any){

}
getSortList() {
  this.utilServ.getSortLits().then((res: any) => {
    //console.log(res);
    this.sortList = res;
  })
}
sortByValue(code:any){
  this.sortCode = code
  this.reportsForm.get('sortBy')?.setValue(code);
  this.getReports("",this.filterType ? this.filterType : "",this.sortCode ? this.sortCode : "" ,this.currentPage ? this.currentPage : 1,this.currentPageSize ? this.currentPageSize : 10,this.SelectedDate ,this.fromDate ? this.fromDate : null,this.toDate ? this.toDate : null)
  // this.getAllTemplates()
}

}
