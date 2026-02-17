import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerTrailerOutTypeService {
  customerTrailerOutTypeList: any
  editCustomerTrailerOutTypeRecord: any;
  selectedCustomerTrailerOutTypeRecord: any;
  viewCustomerTrailerOutTypeId: any;
  viewCustomerTrailerOutTypeIndex: any;
  viewDetail: any;
  permissions: any;

  constructor(public http: CustomHttpService) { }

  getAllCustomerTrailerOutTypes() {
    return this.http.get("/Master/GetAllCustomerTrailerOutTypes").then(res => res);
  }

  deleteCustomerTrailerOutType(ctotMappingId: any) {
    return this.http.get("/Master/DeleteCustomerTrailerOutTypeById?ctotMappingId=" + ctotMappingId).then(res => res);
  }

  getSearchAndSortBy(search: any, sort: any, status: any, pageSize: any, pageNumber: any) {
    return this.http.get("/Master/GetCustomerTrailerOutTypesBySearchAndSort?searchKey=" + search + "&sortKey=" + sort + "&statusfilter=" + status + "&pageSize=" + pageSize + "&pageNumber=" + pageNumber).then(res => res);
  }

  addUpdateCustomerTrailerOutType(customerTrailerOutTypeModel: any) {
    return this.http.post("/Master/AddUpdateCustomerTrailerOutType", customerTrailerOutTypeModel).then(res => res);
  }

  getCustomerTrailerOutTypeHistory(ctotMappingId: any) {
    return this.http.get("/Master/GetCustomerTrailerOutTypeHistory?ctotMappingId=" + ctotMappingId).then(res => res);
  }

  getAllClients() {
    return this.http.get("/Master/GetAllCustomers").then(res => res);
  }

  getAllTrailerTypes() {
    return this.http.get("/Master/GetAllTrailerTypes").then(res => res);
  }

  validateCustomerTrailerOutTypeUniqueness(clientId: any, trailerId: any) {
    return this.http.get('/Master/ValidateCustomerTrailerOutTypeUniqueness?customerId=' + clientId + '&trailerTypeId=' + trailerId).then(res => res);
  }
}
