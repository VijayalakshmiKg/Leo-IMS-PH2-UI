import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';
import { addConsignorModel } from './consignorModel/consignorModel';

@Injectable({
  providedIn: 'root'
})
export class ConsignorService {

  viewConsignorIndex: any
  editConsignorRecord: any
  consignorList: any | any[] = [];
  viewConsignorRecord: any;
  permissions:any;


  constructor(public http: CustomHttpService) { }

  getZipCodes(zipCode: any) {
    return this.http.get("/Master/GetCityStateCountyByZipCodebysearchkey?Searchkey=" + zipCode).then(res => res);
  }
  getCountryList() {
    return this.http.get("/Master/GetCountryCodes").then(res => res);
  }

  addUpdateConsignor(consignorModel: addConsignorModel) {
    return this.http.post('/TransportManager/AddUpdateConsignor', consignorModel).then(res => res)
  }

  getAllConsignors() {
    return this.http.get('/TransportManager/GetConsignors').then(res => res)
  }

  getConsignorById(consignorID: any) {
    return this.http.get('/TransportManager/GetConsignorById?ConsignorID=' + consignorID).then(res => res)
  }

  deleteConsignorById(consignorID: any) {
    return this.http.get('/TransportManager/DeleteConsignor?ConsignorID=' + consignorID).then(res => res)
  }

  searchConsignorBySort(searchValue: any, sort: any,pageNumber:any,pageSize:any) {
    return this.http.get("/ProductionManager/GetConsignorDetailsBySearchAndSort?searchKey=" + searchValue +"&sortKey="+ sort+"&pageNumber="+pageNumber+"&pageSize="+pageSize).then(res => res)
    // return this.http.get('/TransportManager/GetConsignorDetailsBySearchAndSort?searchKey=' + searchValue + '&sortKey=' + sort).then(res => res)
  }
  getSortLits() {
    return this.http.get("/Master/GetSortings").then(res => res);
  }
}