import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class DriversService {
  driversList: any


  editDriverRecord: any;

  viewDriverId: any;
  viewDriverIndex: any;
  permissions:any;
  constructor(public http: CustomHttpService) { }
  getStateList() {
    return this.http.get("/Master/GetStateCodes").then(res => res);
  }
  getZipCode() {
    return this.http.get("/Master/GetPostalCodes").then(res => res);
  }
  // getStateCityCountyList(zipCode:any){
  //   return this.http.get("/Master/GetCityStateCountyByZipCode?zipCode="+zipCode).then(res => res);
  // }
  getStateCityCountyList(zipCode: any) {
    //console.log("/Master/GetCityStateCountyByZipCodebysearchkey?Searchkey=" + zipCode);

    return this.http.get("/Master/GetCityStateCountyByZipCodebysearchkey?Searchkey=" + zipCode).then(res => res);
  }
  getCountryList() {
    return this.http.get("/Master/GetCountryCodes").then(res => res);
  }
  getVendorList() {
    return this.http.get("/Tenant/GetAllVendors").then(res => res);
  }
  addUpdateDriver(driverModel: any) {
    return this.http.post("/TransportManager/AddUpdateDrivers", driverModel).then(res => res);
  }
  getAllDriverList() {
    return this.http.get("/TransportManager/GetAllDrivers").then(res => res);
  }
  viewDriverDetail(driverId: any) {
    return this.http.get("/TransportManager/GetDriversById?driverId=" + driverId).then(res => res);
  }
  markAsActive(driverId: any) {
    return this.http.get("/TransportManager/DeleteDrivers?driverId=" + driverId).then(res => res);
  }
  searchAndSortbyDriver(search: any, sort: any, status: any,pageSize:any,pageNumber:any) {
    return this.http.get("/TransportManager/GetDriverSearchAndSort?searchKey=" + search +"&sortKey="+ sort + "&statusfilter="+ status+"&pageSize="+pageNumber+"&pageNumber="+pageSize).then(res => res);
    // return this.http.get("/TransportManager/GetDriverSearchAndSort?searchKey=" + search + " &sortKey=" + sort + "&statusfilter=" + status).then(res => res);
  }
  getSortLits() {
    return this.http.get("/Master/GetSortings").then(res => res);
  }
  driverPhoto(id: any, file: any) {
    //console.log("/Master/AzureFileUpload?id=" + id + "&Path=Driver/DriverPhoto", file);

    return this.http.postfile("/Master/AzureFileUpload?id=" + id + "&Path=Driver/DriverPhoto", file).then(res => res);
  }

  // license
  licensePhoto(id: any, file: any) {
    //console.log("/Master/AzureFileUpload?id=" + id + "&Path=Driver/DriverLicense", file);

    return this.http.postfile("/Master/AzureFileUpload?id=" + id + "&Path=Driver/DriverLicense", file).then(res => res);
  }
  // Order history
  getOrderHistory(driverID: any) {
    return this.http.get("/TransportManager/GetDriverOrderHistory?driverId=" + driverID).then(res => res);
  }

  Checkexits(email: any, mobileNum: any) {
    return this.http.get('/TransportManager/ValidateDriverUniqueness?email=' + email + '&phoneNumber=' + mobileNum).then(res => res)
  }
  resendEmail(email: any) {
    return this.http.get('/TransportManager/DriverMail?senderEmail=' + email).then(res => res)
  }

  removeDriver(driverId:any){
    return this.http.get("/TransportManager/RemoveDriver?Driverid="+driverId).then(res => res);
  }
}
