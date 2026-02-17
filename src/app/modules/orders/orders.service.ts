import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';
import { addUpdateOrderModel, statusUpadte, transitModel } from './orders-home/order-model/addUpdateOrderModel';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  orderNo:any
  currentPage:any

  ordersList:any | any[] = [
    // {
    //   "weighbridgeRecordID": 9,
    //   "orderID": 147,
    //   "truckID": 7,
    //   "weighedBy": 5,
    //   "receiptNumber": "",
    //   "weighTimestamp": "2025-02-04T07:26:00.467",
    //   "movementdocNo": "111",
    //   "ticketIssued": true,
    //   "digitalSignOff": false,
    //   "reportLocationURl": "",
    //   "grossWeight": 11,
    //   "tareWeight": 11,
    //   "netWeight": 22,
    //   "temperature": "",
    //   "water": "",
    //   "totalWater": "",
    //   "netWithoutWater": "",
    //   "createdDate": "2025-02-04T07:26:00.467",
    //   "createdBy": "User",
    //   "modifiedDate": null,
    //   "modifiedBy": null,
    //   "deleted": false,
    //   "notes": "",
    //   "ticketNo": "1111",
    //   "weighBridgeOperator": 'ksajfkasf',
    //   "grossWeightDateTime": "2025-02-24T01:56:00",
    //   "tareWeightDateTime": "2025-02-18T01:56:00",
    //   "orderStatus": "Tipped",
    //   "collectionDate": "2025-02-04T07:26:00.467",
    //   "driverID": 1,
    //   "trailerID": 13,
    //   "consignorID": 1,
    //   "consigneeID": 1,
    //   "materialID": 5,
    //   "quantity": "12",
    //   "registrationNo": '11111',
    //   "trailerNumber": "tr@#23",
    //   "driverName": "John Doe",
    //   "materialType": "Hazardous-1",
    //   "consignorName": "Alpha Logistics",
    //   "shunterDriverName": 'adjoaijd',
    //   "shunterDriverID": 'askjakosd',
    //   "binNumber": '00989',
    //   "verificationStatus": '00989',
    //   "durations": '00989',
    //   "timeList": '00989',
    //   "totalorder": '00989',
    //   "consignorPincode": '00989',
    //   "consigneePincode": "123456",
    //   "trailerType": "tried",
    //   "consignorLicenseNo": 'djahnd',
    //   "consigneeAddress1": "123 Business Rd",
    //   "consigneeAddress2": "Suite 456",
    //   "consigneeName": "ABC Corporation",
    //   "consigneeCity": "Cityville",
    //   "consigneeCountry": "Country1",
    //   "consigneeCounty": "XYZ",
    //   "consigneeState": "State1",
    //   "consignorAddress1": "123 Main Street",
    //   "consignorAddress2": "Suite 101",
    //   "consignorCity": "Seattle",
    //   "consignorCountry": "USA",
    //   "consignorCounty": "King County",
    //   "consignorState": "Washington",
    //   "truckNumber": 'aldmaksdj',
    //   "consignorType": 'aldmaksdj',
    //   "consignorRegNo": 'aldmaksdj',
    //   "address1": 'aldmaksdj',
    //   "address2": 'aldmaksdj',
    //   "county": 'aldmaksdj',
    //   "city": 'aldmaksdj',
    //   "state": 'aldmaksdj',
    //   "truckName": 'aldmaksdj',
    //   "organisationName": 'aldmaksdj',
    //   "licenseNumber": 'aldmaksdj',
    //   "contactDetails": 'aldmaksdj',
    //   "description":'aldmaksdj'
    // }
  ]

  sort ='Newest to Oldest date'
  filter =''
  pageNumber =1
  pageSize =10

  empID:any;
  permissions: any;


  getOrders() {
    return this.ordersList; // Later replace with an API call
  }

  viewOrdersIndex:any
  editOrdersRecord:any ;
  editOrdersIndex:any | any[] = []
  constructor(public http:CustomHttpService) {
    let data = localStorage.getItem('userData');
    if (data) {
      //console.log(data);
      let parsed = JSON.parse(data)
      this.empID =parsed.employeeId ; // Parse the JSON string into an object or array
      //console.log(this.empID);
    } else {
      console.error('No userData found in localStorage');
    }
 
   }

  getAllTemplates(empID:any){
    return this.http.get("/TransportManager/GetOrderTemplateByEmployeeId?EmployeeId="+this.empID).then(res => res)
}

  getAllOrders(empID:any,filter:any,sort:any,pageNumber:any,pageSize:any){
    //console.log(pageNumber,pageSize);
    
    //console.log(filter,sort);
    //console.log("/TransportManager/GetOrderDetailsBySortandFilter?sort="+sort+"&filter="+filter+"&empID="+empID+"&pageNumber=&pageSize=");
    
  //  return this.http.get('/TransportManager/GetAllOrdersbyEmployeeid?Employeeid='+empID).then(res => res)
   return this.http.get("/TransportManager/GetOrderDetailsBySortandFilter?sort="+sort+"&filter="+filter+"&empID="+empID+"&pageNumber="+pageNumber+"&pageSize="+pageSize).then(res => res)
    
  }
  getOrderByOrderID(orderId:any){
   return this.http.get('/TransportManager/GetOrdersByOrderId?orderId='+orderId).then(res => res)
    
  }
  deleteOrderByOrderID(orderId:any){
    //console.log('/TransportManager/DeleteTransportAssignment?orderIds=',orderId);
    
   return this.http.post('/TransportManager/DeleteTransportAssignment?orderIds=' ,orderId).then(res => res)
    
  }

  addUpdateOrdersByOrderModel(orderModel:addUpdateOrderModel){
    return this.http.post('/TransportManager/AddUpdateOrders',orderModel).then(res => res)
  }

  getConsigneeDetailsBySearch(searchKey:any){
    return this.http.get('/TransportManager/GetConsigneeDetailsBySearch?searchKey='+searchKey).then(res => res)
  }
  getConsignorDetailsBySearch(searchKey:any){
    return this.http.get('/TransportManager/GetConsignorDetailsBySearch?searchKey='+searchKey).then(res => res)
  }

  getMaterialsDetailsBySearch(searchKey:any){
    return this.http.get('/TransportManager/GetAllMaterialsDetailsBySearch?searchKey='+searchKey).then(res => res)
  }
  getDriversBySearch(searchKey:any){
    return this.http.get('/TransportManager/GetAllDriversBySearch?searchKey='+searchKey.value).then(res => res)
  }
  getTrailersBySearch(searchKey:any){
    return this.http.get('/TransportManager/GetAllTrailersBySearch?searchKey='+searchKey.value).then(res => res)
  }
  getTrucksBySearch(searchKey:any){
    //console.log(searchKey.value);
    
    return this.http.get('/TransportManager/GetAllTrucksBySearch?searchKey='+searchKey.value).then(res => res)
  }

  getAllStatus(){
    return this.http.get("/Master/GetAllDriverStatus").then(res => res)
  }


  changeStatusFor(model:statusUpadte){
    return this.http.post('/TransportManager/UpdateStatusForTruckDriverTrailer',model).then(res => res)
  }

  changeTransit(model:transitModel){
    return this.http.post('/TransportManager/AddTransist',model).then(res => res)
  }

  getWeighbridgeRecordsByWeighbridgeId(id:any){
    return this.http.get('/WeighBridgeManager/GetWeighbridgeRecordsByWeighbridgeId?WeighbridgeRecordID='+id).then(res => res)
  }

  getAllWeighbridgeRecords(weighedBy:any,sortBy:any,status:any,pageNumber:any,pageSize:any){
    return this.http.get('/WeighBridgeManager/GetWeighbridgeRecordsByWeighedBy?weighedBy='+weighedBy+'&sortBy='+sortBy+'&status='+status+"&pageNumber="+pageNumber+"&pageSize="+pageSize).then(res => res)
  }
  getAllPlantSiteRecords(plantSiteId:any,sortBy:any,pageNumber:any,pageSize:any){
    return this.http.get('/PlantSiteManager/GetAllOrderDetails?assignby='+plantSiteId+'&sortKey='+sortBy+"&pageNumber="+pageNumber+"&pageSize="+pageSize).then(res => res)
  }
  getAllAdminRecords(adminId:any,filter:any,sortBy:any,pageNumber:any,pageSize:any){
    return this.http.get('/User/GetOrdersByRoleid?Roleid='+adminId+'&statusFilter='+filter+'&sortKey='+sortBy+"&pageNumber="+pageNumber+"&pageSize="+pageSize).then(res => res)
  }

  getPlantSiteRecordByBinAssignedId(assignID:any){
    return this.http.get('/PlantSiteManager/GetBinAssigmentbyBinAssignid?BinAssignmentID='+assignID).then(res => res)
  }

  getQualityCheckOrdersRecord(qualityManId:any,sortBy:any,pageNumber:any,pageSize:any){
    return this.http.get('/ProductionManager/GetAllQualityCheckFormbyQualityManagerID?QualityManagerID='+qualityManId+'&sortBy='+sortBy+'&pageNumber='+pageNumber+'&pageSize='+pageSize).then(res => res)
    // return this.http.get('/ProductionManager/GetAllQualityCheckFormbyQualityManagerID?QualityManagerID='+qualityManId+'&pageNumber='+pageNumber+'1&pageSize='+pageSize).then(res => res)
  }

  getAllWashedTrailers(consignerID:any,searchKey:any){
    return this.http.get('/TransportManager/GetPickupTrailer?consignerId='+consignerID+'&searchKey='+searchKey).then(res => res)
  }

  getAllDocuments(roleID:any,driverID:any){
    return this.http.get('/TransportManager/GetOrderDocs?orderId='+roleID+'&driverId='+driverID).then(res => res)
  }

 
}
