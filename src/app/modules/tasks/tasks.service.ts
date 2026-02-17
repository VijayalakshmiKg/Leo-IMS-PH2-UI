import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';
import { weighbridgeModel } from './tasks-home/task-model/weighbridgeModel';
import { platsiteManagerModel } from './tasks-home/task-model/platsiteManager';
import { qualityManagerModel } from './tasks-home/task-model/qualityManager';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  permissions: any;

  constructor(public http:CustomHttpService) { }


  taskList:any | any[] = [
   
  ]

  sort = 'Newest to Oldest date'
  filter = 'All'
  pageNumber = 1
  pageSize = 10
  viewTasksIndex:any | any[] = []
  currentPage:any


  editTaskRecord:any | any[] = []

  getAllWeighBridgeManagerTasks(roleID:any,sortBy:any,filterBy:any,pageNamber:any,pageSize:any){
return this.http.get("/User/GetOrdersByRoleid?Roleid="+roleID+"&sortBy="+sortBy+"&statusFilter="+filterBy+"&pageNumber="+pageNamber+"&pageSize="+pageSize).then(res => res)
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

  getTaskByOrderID(orderId:any){
    return this.http.get('/TransportManager/GetOrdersByOrderId?orderId='+orderId).then(res => res)
     
   }

   addUpdateWeighbridgeTasks(model:weighbridgeModel){
    return this.http.post('/WeighBridgeManager/AddUpdateWeighbridgeRecords',model).then(res => res)
   }

   getAllStatus(){
    return this.http.get("/Master/GetAllDriverStatus").then(res => res)
  }

  addUpdatePlatSiteManager(model:platsiteManagerModel){
    return this.http.post('/PlantSiteManager/AddUpdateBinAssignment',model).then(res => res)
  }

  getShuntDriverBYSearch(searchKey:any){
    return this.http.get('/PlantSiteManager/GetShunterDriverbysearchkey?searchKey='+searchKey).then(res => res)
  }

  getBin(){
    return this.http.get('/Master/GetAllBin').then(res => res)
  }

  addUpdateQualityManagerTask(model:qualityManagerModel){
    return this.http.post('/ProductionManager/AddUpdateQualityCheckForm',model).then(res => res)
  }


  getAllMaterials(){
    return this.http.get('/Master/GetAllMaterialTypes').then(res => res)
  }

  getAllBin(){
    return this.http.get('/Master/GetAllBin').then(res => res)
  }

getOrderForQualityManagerRecordById(qualityID:any){
  return this.http.get('/ProductionManager/GetQualityCheckFormByQualityCheckID?qualityCheckID='+qualityID).then(res => res)
}

signOff(plantSiteId:any,recID:any){
  return this.http.get('/PlantSiteManager/UpdateSignoffStatus?plantSiteManagerId='+plantSiteId+'&orderId='+recID)
}
 
}
