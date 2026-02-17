import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  permissions: any;

  constructor(public http: CustomHttpService) { }
  notesList:any = []

  transboardDashboardCount: any = {
    "totalDrivers": 0,
    "totalTrucks": 0,
    "totalTrailers": 0,
    "totalOrders": 0,
    "totalProducts": 0
  };
  planSiteDashboardCount: any = {
    "totalTasks": 0,
    "totalShunter": 0,
    "totaltransit": 0,
    "totalTrucks": 0,
    "totalOrders": 0
  };

  unreadMessages: any = [
    {
      "profile": null,
      "fName": "Henry",
      "lName": "Matthew",

      "messages": "Hii John, I have uploaded some material documents for the order OR0020. Can you check the ...",
      "receivedTime": "10/11/2024",
      "messageCount": "2"
    },
    {
      "profile": null,
      "fName": "Henry",
      "lName": "Matthew",

      "messages": "Hii John, I have uploaded some material documents for the order OR0020. Can you check the ...",
      "receivedTime": "17 min ago",
      "messageCount": "2"
    },
    {
      "profile": null,
      "fName": "Henry",
      "lName": "Matthew",

      "messages": "Hii John, I have uploaded some material documents for the order OR0020. Can you check the ...",
      "receivedTime": "Yesterday",
      "messageCount": "2"
    },
    {
      "profile": null,
      "fName": "Henry",
      "lName": "Matthew",

      "messages": "Hii John, I have uploaded some material documents for the order OR0020. Can you check the ...",
      "receivedTime": "11 min ago",
      "messageCount": "2"
    }
  ]
  orderDeleteSub$ = new Subject<any>()

   getDraftList(model:any) {
    return this.http.post('/TransportManager/GetAllDraftOrderStatus',model).then(res => res)
  }
  getTransportOrdersList(model:any) {
    return this.http.post('/TransportManager/GetAllOrderStatusByPagination',model).then(res => res)
  }
  getWeighBridgeTracksList(pageNumber:any,pageSize:any) {
    return this.http.get('/WeighBridgeManager/GetInTransitTrucksByPagination?pageNumber='+pageNumber+ '&pageSize='+pageSize).then(res => res)
  }
   
  getTransportOverviewList(overviewModel:any) {
    return this.http.post('/TransportManager/GetConsolidateDashBoardByCalender',overviewModel).then(res => res)
  }
  deleteOrder(id:any) {
    return this.http.get('/TransportManager/DeleteTransportOrders?orderID='+ id).then(res => res)
  }

getWeighBridgeList(overviewModel:any) {
  return this.http.post('/WeighBridgeManager/GetWeighBridgeDashBoard',overviewModel).then(res => res)
}

addUpdateToDoList(Model:any) {
  return this.http.post('/WeighBridgeManager/AddUpdateToDoListForWeighbridgeManager',Model).then(res => res)
  
}
getToDoList(roleId:any,pageNo:any,pageSize:any) {
  
  return this.http.get('/WeighBridgeManager/GetAllNotesbyManagerid?managerId='+roleId+'&pageNumber='+pageNo+'&pageSize='+pageSize).then(res => res)
}
updateToDoList(noteId:any) {
  return this.http.get('/WeighBridgeManager/CompletedNotes?ids='+ noteId).then(res => res)
  
}

//    Plan site manager  //

getTaskTableList(pageNo:any,pageSize:any,searchKey:any,filterKey:any) {
  return this.http.get('/PlantSiteManager/GetAllTaskSearchAndFilter?pageNumber='+pageNo+'&pageSize='+pageSize+'&searchKey='+searchKey+'&filterKey='+filterKey).then(res => res)
  
}
getTruckTableList(pageNo:any,pageSize:any,searchKey:any,filterKey:any) {
  return this.http.get('/PlantSiteManager/GetAllTruckAndSearchFilter?pageNumber='+pageNo+'&pageSize='+pageSize+'&searchKey='+searchKey+'&filterKey='+filterKey).then(res => res)
  
}
getShunterdriverTableList(pageNo:any,pageSize:any,searchKey:any,filterKey:any) {
  return this.http.get('/PlantSiteManager/GetAllShunterdriverAndSearchFilter?pageNumber='+pageNo+'&pageSize='+pageSize+'&searchKey='+searchKey+'&filterKey='+filterKey).then(res => res)
  
}

getOrdersList(Model:any) {
  return this.http.post('/PlantSiteManager/GetAllOrdersAndSearch',Model).then(res => res)
}
// updated plant site //
getPlantOverview() {
  return this.http.get('/PlantSiteManager/TrailersStatus').then(res => res)
}
getMocDocumentList(Model:any) {
  return this.http.post('/PlantSiteManager/GetAllSignOffMovementDocumentForPlantesiteManager',Model).then(res => res)
}
getMeterialIntakeList(PageNo:any,pageSize:any,supplierFilter:any,key:any) {
  return this.http.get('/PlantSiteManager/GetMaterialIntakeForPlantesiteManager?searchKey='+key+'&consignorFilter='+supplierFilter+'&pageNumber='+PageNo+'&pageSize='+pageSize).then(res => res)
} 
getMatrialTipped(PageNo:any,pageSize:any,binFilter:any,SupplierFilter:any,WeightFilter:any,key:any) {
  return this.http.get('/PlantSiteManager/GetAllMaterialTippedForPlantesiteManager?&SearchKey='+key+'&Consignorfilter='+SupplierFilter+'&WeightFilterKey='+WeightFilter+'&PageNumber='+PageNo+'&PageSize='+pageSize+'&BinNameFilterKey='+binFilter).then(res => res)
}
// updated design weighbridge //
weighBridgeCount() {
  return this.http.get('/WeighBridgeManager/GetTotalOrderCountForWeighBridgeOperatorDashBoard').then(res => res)
}
getWeighBridgeTaskTable(searchKey:any,filterKey:any,pageNumber:any,pageSize:any) {
  return this.http.get('/WeighBridge/GetWeighbridgeOperatorAllTaskforDashBoard?searchKey='+searchKey+'&filterKey='+filterKey+'&pageNumber='+pageNumber+'&pageSize='+pageSize).then(res => res)

}
getWeighBridgeTaskTableByEmpId(){
  return this.http.get('/WeighBridge/GetWeighbridgeTrailerByEmpId').then(res => res)
}
getOrederGraph(viewMode:any,dateFrom:any,dateTo:any){
  return this.http.get('/WeighBridgeManager/GetAllWeighedOrdersForDashBoard?viewMode='+viewMode+'&dateFrom='+dateFrom+'&dateTo='+dateTo).then(res => res)
}
driverStatus() {
  return this.http.get('/Master/GetAllDriverStatus').then(res => res)



}
// Account manager //
GetMaterialReceived(model:any) {
  return this.http.post('/AccountsManager/GetAllMaterialReceivedForDashBoard',model).then((res)=> res)
}
GetMaterialIntake(model:any) {
  return this.http.post('/AccountsManager/GetAllProductIntakedataForDashboardBy',model).then((res)=> res)
}
getProductDropdown() {
  return this.http.get("/TransportManager/GetAllMaterialsDetails").then((res:any)=> res)
}
getSupplierDropdown() {
  return this.http.get("/TransportManager/GetConsignors").then((res:any)=> res)
}

// quality manager // 
getQualityOverview() {
  return this.http.get("/ProductionManager/TotalTaskAndOrderCountForQualityManager").then((res:any)=> res)
}
getQualityTask(key:any,pageNo:any,pageSize:any) {
  return this.http.get('/ProductionManager/GetAllOrderForTotalTaskBySearchkeyAndPagination?searchKey='+key+'&pageNumber='+pageNo+ '&pageSize='+pageSize).then((res:any)=> res)
}
getQualityIntake(model:any) {
  return this.http.post('/ProductionManager/GetIntakeSheetsForQualityManagerDashboardGraph',model).then((res:any)=> res)
}
getQualityOrders(model:any) {
  return this.http.post('/ProductionManager/GetTotalOrderForDashboardByCalendar',model).then((res:any)=> res)
}

}
