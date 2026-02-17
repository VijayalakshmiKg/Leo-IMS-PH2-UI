import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';
import { shunterModel } from './shunter-driver-home/shunterDriverModel/shunterDriverModel';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShunterDriverService {

  shunterDriversList: any | any[] = []

  editShunDriverRecord: any = null

  viewShuntDriverIndex: any = 0;
  viewDriverId: any;
  subject = new Subject<boolean>();
  permissions:any;

  constructor(public http: CustomHttpService) { }

  getZipCodes(zipCode: any) {
    return this.http.get("/Master/GetCityStateCountyByZipCodebysearchkey?Searchkey=" + zipCode).then(res => res);
  }
  getCountryList() {
    return this.http.get("/Master/GetCountryCodes").then(res => res);
  }

  // Get profile Info
  getProfile(mail: any) {
    return this.http.get('/User/GetEmployeeProfileByEmail?email=' + mail).then(res => res)
  }
  getAllDriverList() {
    return this.http.get("/PlantSiteManager/GetAllShunterDriver").then(res => res);
  }
  viewDriverDetail(driverId: any) {
    return this.http.get("/PlantSiteManager/GetShunterDriverById?shunterDriverId=" + driverId).then(res => res);
  }
  activeShunterstatus(driverId: any) {
    return this.http.get("/PlantSiteManager/DeleteShunterDriver?shunterDriverId=" + driverId).then(res => res);
  }
  addUpdateShunter(model: shunterModel) {
    return this.http.post('/PlantSiteManager/AddUpdateShunterDrivers', model).then(res => res)
  }
  shunterDriverPhoto(id: any, file: any) {
    return this.http.postfile("/Master/AzureFileUpload?id=" + id + "&Path=ShunterDriver/ShunterDriverPhoto", file).then(res => res);
  }
  shunterDriverLicense(id: any, file: any) {
    //console.log('/Master/AzureFileUpload?id=' + id + '&Path=ShunterDriver/ShunterDriverLicense', file);
    
    return this.http.postfile('/Master/AzureFileUpload?id=' + id + '&Path=ShunterDriver/ShunterDriverLicense', file).then(res => res)
  }

  searchAndSortbyDriver(search: any, sort: any, status: any,pageNumber:any,pageSize:any) {
    return this.http.get("/PlantSiteManager/GetAllShunterDriverSearchSort?searchKey="+ search +"&sortKey="+ sort +"&statusFilter="+ status+"&pageNumber="+pageNumber+"&pageSize=" + pageSize).then(res => res);
    // return this.http.get("/PlantSiteManager/GetAllShunterDriverSearchSort?searchKey=" + search + "&sortKey=" + sort + "&statusFilter=" + status).then(res => res);
  }
  shunterHistory(id: any) {
    return this.http.get('/PlantSiteManager/GetAllShunterDriverHistory?shunterId=' + id).then(res => res)
  }

  shunterDuplicate(email: any, mobile: any) {
    return this.http.get("/TransportManager/ValidateDriverUniqueness?email=" + email + "&phoneNumber=" + mobile).then(res => res)
  }

  resendEmail(email:any){
    return this.http.get('/TransportManager/ShunterDriverMail?senderEmail='+email).then(res=>res)
  }
  removeShunterDriver(id:any){
    return this.http.get('/PlantSiteManager/RemoveShunterDriver?ShunterDriverID='+id).then(res=>res)
  }
  getSortLits() {
    return this.http.get("/Master/GetSortings").then(res => res);
  }
}
