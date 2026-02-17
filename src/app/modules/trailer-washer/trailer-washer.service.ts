import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';
import { trailerWasher } from './trailer-washer-home/trailerWasherModel/trailerWasherModel';

@Injectable({
  providedIn: 'root'
})
export class TrailerWasherService {

  trailerWasherList: any | any[] = []

  editTrailerWasherRecord: any = null

  viewTrailerWasherIndex: any = 0;
  viewWasherId: any;
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
  getAllWasherList() {
    return this.http.get("/PlantSiteManager/GetAllTrailerWashers").then(res => res);
  }
  viewWasherDetail(washerId: any) {
    return this.http.get("/PlantSiteManager/GetTrailerWashersById?trailerWasherId=" + washerId).then(res => res);
  }
  markStatus(washerId: any) {
    return this.http.get("/PlantSiteManager/DeleteTrailerWasherById?trailerWasherId=" + washerId).then(res => res);
  }
  addUpdateWasher(model: trailerWasher) {
    return this.http.post('/PlantSiteManager/AddUpdateTrailerWasher', model).then(res => res)
  }
  trailerWasherPhoto(id: any, file: any) {
    return this.http.postfile("/Master/AzureFileUpload?id=" + id + "&Path=TrailerWasher/TrailerWasherPhoto", file).then(res => res);
  }

  searchAndSortbyWasher(search: any, sort: any,pageNumber:any,pageSize:any) {
    return this.http.get("/PlantSiteManager/GetAllTrailerWasherSearchSort?searchKey="+ search +"&sortKey="+ sort +"&pageNumber="+pageNumber+"&pageSize="+pageSize).then(res => res);
    // return this.http.get("/PlantSiteManager/GetAllTrailerWasherSearchSort?searchKey=" + search + "&sortKey=" + sort).then(res => res);
  }
  getWasherHistory(washerId:any){
    return this.http.get("/PlantSiteManager/GetAllTrailerWasherHistory?trailerWasherId="+washerId).then(res =>res)
  }

  trailerWasherRemove(id:any){
    return this.http.get("/PlantSiteManager/RemoveTrailerWasher?TrailerWasherId="+id).then(res => res)
  }

  Checkexits(email: any, mobileNum: any) {
    return this.http.get('/TransportManager/ValidateDriverUniqueness?email=' + email + '&phoneNumber=' + mobileNum).then(res => res)
  }
  getSortLits() {
    return this.http.get("/Master/GetSortings").then(res => res);
  }
}
