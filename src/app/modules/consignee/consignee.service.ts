import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';
import { addConsigneeModel } from './consigneeModel/consigneeModel';


@Injectable({
  providedIn: 'root'
})
export class ConsigneeService {

  viewConsigneeIndex: any
  editConsigneeRecord: any
  consigneeList: any | any[] = [];
  viewConsigneeRecord: any;
  permissions:any;



  constructor(public http: CustomHttpService) { }

  getZipCodes(zipCode: any) {
    return this.http.get("/Master/GetCityStateCountyByZipCodebysearchkey?Searchkey=" + zipCode).then(res => res);
  }
  getCountryList() {
    return this.http.get("/Master/GetCountryCodes").then(res => res);
  }

  addUpdateConsignee(consigneeModel: addConsigneeModel) {
    return this.http.post('/TransportManager/AddUpdateConsignee', consigneeModel).then(res => res)
  }
  getAllConsignees() {
    return this.http.get('/TransportManager/GetConsignees').then(res => res)
  }

  getConsigneeById(consigneeID: any) {
    return this.http.get('/TransportManager/GetConsigneeById?ConsigneeID=' + consigneeID).then(res => res)
  }

  deleteConsigneeById(consigneeID: any) {
    return this.http.get('/TransportManager/DeleteConsignee?ConsigneeID=' + consigneeID).then(res => res)
  }

  searchConsigneeBySort(searchValue: any, sort: any,pageNumber:any,pageSize:any) {
    return this.http.get("/TransportManager/GetConsigneeDetailsBySearchAndSort?searchKey="+ searchValue + "&sortKey="+sort+"&pageNumber="+pageNumber+"&pageSize="+pageSize)
    // return this.http.get('/TransportManager/GetConsigneeDetailsBySearchAndSort?searchKey=' + searchValue + '&sortKey=' + sort).then(res => res)
  }
  getSortLits() {
    return this.http.get("/Master/GetSortings").then(res => res);
  }
}
