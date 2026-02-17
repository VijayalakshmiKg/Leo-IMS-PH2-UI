import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';
import { templateModel } from './module/addUpdateTemplate';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  templateList: any | any[] = []
  editTemplateRecord: any
  viewTemplateIndex: any;
  sort = 'Newest to Oldest date'
  filter = 'All'
  pageNumber = 1
  pageSize = 10
  totalpages = 10;
  permissions:any;

  constructor(public http: CustomHttpService) { }


  addUpdateTemplates(model: templateModel) {
    return this.http.post("/TransportManager/AddUpdateOrderTemplate", model).then(res => res)
  }

  getTemplateByTemID(temID: any) {
    return this.http.get("/Planner/GetTemplateById?templateID=" + temID).then(res => res)
  }

  getAllTemplates(empID: any, filter: any, sort: any, pageNumber: any, pageSize: any) {
    // return this.http.get("/TransportManager/GetOrderTemplateByEmployeeId?EmployeeId="+empID).then(res => res)
    return this.http.get("/TransportManager/GetOrderTemplateDetailsBySortandFilter?filter=" + filter + "&Sort=" + sort + "&empID=" + empID + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize).then(res => res)
  }
  

  getConsigneeDetailsBySearch(searchKey: any) {
    return this.http.get('/TransportManager/GetConsigneeDetailsBySearch?searchKey=' + searchKey).then(res => res)
  }
  getConsignorDetailsBySearch(searchKey: any) {
    return this.http.get('/TransportManager/GetConsignorDetailsBySearch?searchKey=' + searchKey).then(res => res)
  }

  getMaterialsDetailsBySearch(searchKey: any) {
    return this.http.get('/TransportManager/GetAllMaterialsDetailsBySearch?searchKey=' + searchKey).then(res => res)
  }
  getDriversBySearch(searchKey: any) {
    return this.http.get('/TransportManager/GetAllDriversBySearch?searchKey=' + searchKey).then(res => res)
  }
  getTrailersBySearch(searchKey: any) {
    return this.http.get('/TransportManager/GetAllTrailersBySearch?searchKey=' + searchKey).then(res => res)
  }
  getTrucksBySearch(searchKey: any) {
    return this.http.get('/TransportManager/GetAllTrucksBySearch?searchKey=' + searchKey).then(res => res)
  }
  deleteTemplatesByTemID(temId: any) {
    return this.http.post('/TransportManager/DeleteOrderTemplate?templateID=', temId).then(res => res)
  }

  getAllTemplatesByEmployeeId(employeeId: any) {
    return this.http.get('/Planner/GetAllTemplatesByEmployeeId?employeeId=' + employeeId).then(res => res)
  } 
  
  validateTemplateName(templateName: string) {
    return this.http.get('/Planner/ValidateTemplateName?templateName=' + encodeURIComponent(templateName)).then(res => res)
  }

  saveTemplateWithDetails(model: any) {
    return this.http.post('/Planner/SaveTemplateWithDetails', model).then(res => res)
  }

  // Customer-dependent mapping APIs
  getCustomerProducts(customerId: any) {
    return this.http.get('/Planner/GetProductsByCustomerId?customerId=' + customerId).then(res => res)
  }

  getCustomerLocations(customerId: any) {
    return this.http.get('/Planner/GetLocationsByCustomerId?customerId=' + customerId).then(res => res)
  }

  getCustomerDrivers(customerId: any) {
    return this.http.get('/Planner/GetDriversByCustomerId?customerId=' + customerId).then(res => res)
  }

  getCustomerTrailerIns(customerId: any) {
    return this.http.get('/Planner/GetTrailerInsByCustomerId?customerId=' + customerId).then(res => res)
  }

  getCustomerTrailerInTypes(customerId: any) {
    return this.http.get('/Planner/GetTrailerInTypesByCustomerId?customerId=' + customerId).then(res => res)
  }

  getCustomerTrailerOuts(customerId: any) {
    return this.http.get('/Planner/GetTrailerOutsByCustomerId?customerId=' + customerId).then(res => res)
  }

  getCustomerTrailerOutTypes(customerId: any) {
    return this.http.get('/Planner/GetTrailerOutTypesByCustomerId?customerId=' + customerId).then(res => res)
  }

  // Master data APIs (not customer-dependent)
  getAllVehicles() {
    return this.http.get('/Planner/GetAllVehicles').then(res => res)
  }

  getAllStatuses() {
    return this.http.get('/Planner/GetAllStatuses').then(res => res)
  }

  getAllProductTypes() {
    return this.http.get('/Planner/GetAllProductTypes').then(res => res)
  }

  getAllPlanners() {
    return this.http.get('/Planner/GetAllPlanners').then(res => res)
  }

  getAllCustomers() {
    return this.http.get('/Planner/GetAllCustomers').then(res => res)
  }

  savePlannerWithDetails(model: any) {
    return this.http.post('/Planner/SavePlannerWithDetails', model).then(res => res)
  }

  validatePlannerSheetName(sheetName: string) {
    return this.http.get('/Planner/ValidatePlannerSheetName?sheetName=' + encodeURIComponent(sheetName)).then(res => res)
  }

  assignTasks(model: any) {
    return this.http.post('/Planner/AssignTasks', model).then(res => res)
  }

  getAllPlannerSheets() {
    return this.http.get('/Planner/GetAllPlannerSheets').then(res => res)
  }

  GetAllPlannerSheetsByEmpId(employeeId: any) {
    return this.http.get('/Planner/GetAllPlannerSheetsByEmpId?employeeId=' + employeeId).then(res => res)
  }
  getActivePlannerSheets() {
    return this.http.get('/Planner/GetActivePlannerSheets').then(res => res)
  }

  getPlannerSheetById(plannerSheetId: number) {
    return this.http.get('/Planner/GetPlannerSheetById?plannerSheetId=' + plannerSheetId).then(res => res)
  }

  deletePlannerSheet(plannerSheetId: number) {
    return this.http.get('/Planner/DeletePlannerSheet?plannerSheetId=' + plannerSheetId, {}).then(res => res)
  }

  // Master data APIs for dropdowns
  getAllDrivers() {
    return this.http.get('/TransportManager/GetAllDrivers').then(res => res)
  }

  getAllTrailers() {
    return this.http.get('/TransportManager/GetAllTrailers').then(res => res)
  }

  getAllTrailerTypes() {
    return this.http.get('/Master/GetAllTrailerTypes').then(res => res)
  }
  
  getAllDeliveryLocations() {
    return this.http.get('/Master/getAllDeliveryLocations').then(res => res)
  }

  getAllChangeoverLocations() {
    return this.http.get('/Master/getAllChangeoverLocations').then(res => res)
  }

}