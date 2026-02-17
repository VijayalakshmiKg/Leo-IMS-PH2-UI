import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class WeighbridgeDashboardService {

  constructor(public http: CustomHttpService) { }

  // Get weighbridge overview count for dashboard cards
  getWeighBridgeCount() {
    return this.http.get('/WeighBridgeManager/GetTotalOrderCountForWeighBridgeOperatorDashBoard').then(res => res);
  }

  // Get weighbridge task table data with search, filter and pagination
  getWeighBridgeTaskTable(searchKey: string, filterKey: string, pageNumber: number, pageSize: number) {
    return this.http.get('/WeighBridge/GetWeighbridgeOperatorAllTaskforDashBoard?searchKey=' + searchKey + '&filterKey=' + filterKey + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize).then(res => res);
  }

  // Get weighbridge task table by employee ID
  getWeighBridgeTaskTableByEmpId(employeeId : any) {
    return this.http.get('/WeighBridge/GetWeighbridgeTrailerByEmpId?employeeId=' + employeeId).then(res => res);
  }

  

  // Get weighbridge tracks list with pagination
  getWeighBridgeTracksList(pageNumber: number, pageSize: number) {
    return this.http.get('/WeighBridgeManager/GetInTransitTrucksByPagination?pageNumber=' + pageNumber + '&pageSize=' + pageSize).then(res => res);
  }

  // Get weighbridge dashboard list
  getWeighBridgeList(overviewModel: any) {
    return this.http.post('/WeighBridgeManager/GetWeighBridgeDashBoard', overviewModel).then(res => res);
  }

  // Add or update to-do list for weighbridge manager
  addUpdateToDoList(model: any) {
    return this.http.post('/WeighBridgeManager/AddUpdateToDoListForWeighbridgeManager', model).then(res => res);
  }

  // Get to-do list by manager ID
  getToDoList(roleId: number, pageNo: number, pageSize: number) {
    return this.http.get('/WeighBridgeManager/GetAllNotesbyManagerid?managerId=' + roleId + '&pageNumber=' + pageNo + '&pageSize=' + pageSize).then(res => res);
  }

  // Update to-do list (mark as completed)
  updateToDoList(noteId: string) {
    return this.http.get('/WeighBridgeManager/CompletedNotes?ids=' + noteId).then(res => res);
  }

  // Get order graph data for weighbridge dashboard
  getOrderGraph(viewMode: string, dateFrom: string, dateTo: string) {
    return this.http.get('/WeighBridgeManager/GetAllWeighedOrdersForDashBoard?viewMode=' + viewMode + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo).then(res => res);
  }
  
  // Get weigh trailer details by task ID
  getWeighTrailerDetails(taskId: number) {
    return this.http.get('/WeighBridge/GetWeighTrailerDetailsByTaskId?taskId=' + taskId).then(res => res);
  }
  
  // Save weigh trailer data
  saveWeighTrailerData(model: any) {
    return this.http.post('/WeighBridge/SaveWeighTrailerData', model).then(res => res);
  }
  
  // Get raise issues details by task ID
  getRaiseIssuesDetails(taskId: number) {
    return this.http.get('/WeighBridge/GetRaiseIssuesDetailsByTaskId?taskId=' + taskId).then(res => res);
  }
  
  // Save raise issues data
  saveRaiseIssuesData(model: any) {
    return this.http.post('/WeighBridge/SaveRaiseIssuesData', model).then(res => res);
  }

}
