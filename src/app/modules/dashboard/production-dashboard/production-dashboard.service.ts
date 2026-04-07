import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductionDashboardService {

  constructor(public http: CustomHttpService) { }

  // Get production overview count for dashboard cards
  getProductionCount() {
    return this.http.get('/ProductionManager/GetTotalOrderCountForProductionDashBoard').then(res => res);
  }

  // Get production trailer card counts for overview cards
  getProductionTrailerCardCounts() {
    return this.http.get('/ProductionManager/GetTrailerCardCountsForProductionDashBoard').then(res => res);
  }

  // Get production task table data with search, filter and pagination
  getProductionTaskTable(searchKey: string, filterKey: string, pageNumber: number, pageSize: number) {
    return this.http.get('/ProductionManager/GetWeighbridgeOperatorAllTaskforDashBoard?searchKey=' + searchKey + '&filterKey=' + filterKey + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize).then(res => res);
  }

  // Get production task table by employee ID
  getProductionTaskTableByEmpId(employeeId : any) {
    return this.http.get('/ProductionManager/GetProdMgrDashoboardListByEmpId?employeeId=' + employeeId).then(res => res);
  }

  

  // Get production tracks list with pagination
  getProductionTracksList(pageNumber: number, pageSize: number) {
    return this.http.get('/ProductionManager/GetInTransitTrucksByPagination?pageNumber=' + pageNumber + '&pageSize=' + pageSize).then(res => res);
  }

  // Get production dashboard list
  getProductionList(overviewModel: any) {
    return this.http.post('/ProductionManager/GetWeighBridgeDashBoard', overviewModel).then(res => res);
  }

  // Add or update to-do list for production manager
  addUpdateToDoList(model: any) {
    return this.http.post('/ProductionManager/AddUpdateToDoListForWeighbridgeManager', model).then(res => res);
  }

  // Get to-do list by manager ID
  getToDoList(roleId: number, pageNo: number, pageSize: number) {
    return this.http.get('/ProductionManager/GetAllNotesbyManagerid?managerId=' + roleId + '&pageNumber=' + pageNo + '&pageSize=' + pageSize).then(res => res);
  }

  // Update to-do list (mark as completed)
  updateToDoList(noteId: string) {
    return this.http.get('/ProductionManager/CompletedNotes?ids=' + noteId).then(res => res);
  }

  // Get order graph data for production dashboard
  getOrderGraph(viewMode: string, dateFrom: string, dateTo: string) {
    return this.http.get('/ProductionManager/GetAllWeighedOrdersForDashBoard?viewMode=' + viewMode + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo).then(res => res);
  }
  
  // Get weigh trailer details by task ID
  getWeighTrailerDetails(taskId: number) {
    return this.http.get('/ProductionManager/GetWeighTrailerDetailsByTaskId?taskId=' + taskId).then(res => res);
  }
  
  // Save weigh trailer data
  saveWeighTrailerData(model: any) {
    return this.http.post('/ProductionManager/SaveWeighTrailerData', model).then(res => res);
  }
  
  // Get raise issues details by task ID
  getRaiseIssuesDetails(taskId: number) {
    return this.http.get('/ProductionManager/GetRaiseIssuesDetailsByTaskId?taskId=' + taskId).then(res => res);
  }
  
  // Save raise issues data
  saveRaiseIssuesData(model: any) {
    return this.http.post('/ProductionManager/SaveRaiseIssuesData', model).then(res => res);
  }

  // Get all shunter drivers for dropdown
  getShunterDriverList() {
    return this.http.get('/PlantSiteManager/GetAllShunterDriver').then(res => res);
  }

  // Update shunter assignment for a task
  updateTaskShunter(model: any) {
    return this.http.post('/ProductionManager/UpdateTaskShunter', model).then(res => res);
  }

  // Get all bins for dropdown
  getBinList() {
    return this.http.get('/Master/GetAllBin').then(res => res);
  }

  // Get bins by product ID from product-bin mapping
  getBinsByProductId(productId: any) {
    return this.http.get('/Master/GetBinsByProductId?productId=' + productId).then(res => res);
  }

  // Update bin assignment for a task
  updateTaskBin(model: any) {
    return this.http.post('/ProductionManager/UpdateTaskBin', model).then(res => res);
  }

  // Assign task with shunter and bin
  assignTask(model: any) {
    return this.http.post('/ProductionManager/AssignTask', model).then(res => res);
  }

  // Re-assign task with updated shunter and bin
  reAssignTask(model: any) {
    return this.http.post('/ProductionManager/ReAssignTask', model).then(res => res);
  }

  // Get approve task details by single task ID and employee ID
  getApproveTaskDetails(taskId: number, employeeId: number) {
    return this.http.get('/ProductionManager/GetApproveTaskDetails?taskId=' + taskId + '&employeeId=' + employeeId).then(res => res);
  }

  // Approve or reject task
  approveTask(model: any) {
    return this.http.post('/ProductionManager/ApproveTask', model).then(res => res);
  }

  // Get untipped trailers by date
  getUntippedTrailers(date: string) {
    return this.http.get('/ProductionManager/GetUntippedTrailers?date=' + date).then(res => res);
  }

  // Get product net weight for untipped tasks
  getProductNetWeight(employeeId: any) {
    return this.http.get('/ProductionManager/GetProductNetWeight?employeeId=' + employeeId).then(res => res);
  }

  // Get trailers over 2 hrs by date
  getTrailersOver2Hrs(date: string) {
    return this.http.get('/ProductionManager/GetTrailersOver2Hrs?date=' + date).then(res => res);
  }

  // Get clean trailers by date
  getCleanTrailers(date: string) {
    return this.http.get('/ProductionManager/GetCleanTrailers?date=' + date).then(res => res);
  }

  // Get dirty trailers by date
  getDirtyTrailers(date: string) {
    return this.http.get('/ProductionManager/GetDirtyTrailers?date=' + date).then(res => res);
  }

  // Get in-transit trailers by date and employee ID
  getInTransitTrailers(date: string, employeeId: any) {
    return this.http.get('/ProductionManager/GetInTransitTrailers?date=' + date + '&employeeId=' + employeeId).then(res => res);
  }

}
