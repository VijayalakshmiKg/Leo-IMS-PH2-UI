import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  viewReportsIndex:any
report:any = [
  {"Date":"4/2/2025","Supplier":"Medcalf J & E Ltd","Product":"Carcass","Haulier":"Haulage Holdings","Netweight":"22,480 kg","CheckBox":false},
  {"Date":"4/2/2025","Supplier":"Medcalf J & E Ltd","Product":"Carcass","Haulier":"Haulage Holdings","Netweight":"22,480 kg","CheckBox":false},
  {"Date":"4/2/2025","Supplier":"Medcalf J & E Ltd","Product":"Carcass","Haulier":"Haulage Holdings","Netweight":"22,480 kg","CheckBox":false},
  {"Date":"4/2/2025","Supplier":"Medcalf J & E Ltd","Product":"Carcass","Haulier":"Haulage Holdings","Netweight":"22,480 kg","CheckBox":false},
  {"Date":"4/2/2025","Supplier":"Medcalf J & E Ltd","Product":"Carcass","Haulier":"Haulage Holdings","Netweight":"22,480 kg","CheckBox":true},
]
  reportsList:any | any[] = {
    'Supplier':[
      {
        "CheckBox":false,
        "Supplier":"Medcalf J & E Ltd",
        "Mobile number":"8749567345",
        "VAT no":"GB123456789",
        "UTR no":"8574653975",
        "Opening balance":"GBP 570",
        "Status":"Active",
      },
      {
        "CheckBox":false,
        "Supplier":"Newmans Meat Shop",
        "Mobile number":"9754567345",
        "VAT no":"GB123456789",
        "UTR no":"8574653975",
        "Opening balance":"GBP 570",
        "Status":"Inactive",
      },
    ],

    'Material type':[
      {
        "CheckBox":false,
        "Date":"5/12/2024",
        "Supplier":"Medcalf J & E Ltd",
        "Product":"Carcass",
        "Plant":"Offal plant",
        "Net weight":"22,480 kg",
      },
    ]
  }
  constructor(public http:CustomHttpService) { }
  getReport(key:any,filter:any,sort:any,pageNo:any,pageSize:any,mode:any,fromDate:any,toDate:any) {
   return this.http.get('/AccountsManager/GetAccountManagerAllReports?SearchKey='+key+'&FilterKey='+filter+'&SortBy='+sort+'&PageNo='+pageNo+'&PageSize='+pageSize+'&ViewMode='+mode+'&DateFrom='+fromDate+'&DateTo='+toDate)
  }
}
