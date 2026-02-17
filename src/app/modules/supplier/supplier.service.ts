import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  supplierList:any | any[] = [{
    "supplierName": "ada",
    "email": "5356",
    "mobileNumber": "52353",
    "vatNo": "363",
    "utrNO": "346",
    "balancePay": "46346",
   "balanceDate": "2024-12-05T18:30:00.000Z",
    "billingAddress": "346346",
    "supplierAddress": "3463",
    "sameAsBillingAddress":false,
    "checked":false
}]

intakeSheetList:any | any[] = [
  {
    Product:'Carcass',
    Plant:'Offal plant',
    Supplier:'Medcalf J & E Ltd',
    intakeSheet:'19:22',
    netWeight:'22580 kg',

  }
]
summaryTabelList:any | any[] = [
  {
    Supplier:'Medcalf J & E Ltd',
    Product:'Carcass',
    paymentDate:'15/11/2024',
    Amount:'GBP 340.00',
    paymentStatus:'Paid',

  }
]



  viewSupplierIndex:any
  editSupplierRecord:any
  permissions: any;

  constructor() { }
}
