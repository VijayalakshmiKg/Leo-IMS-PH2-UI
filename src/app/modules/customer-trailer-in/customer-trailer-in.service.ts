import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerTrailerInService {
  customerTrailerInList: any
  editCustomerTrailerInRecord: any;
  selectedCustomerTrailerInRecord: any;
  viewCustomerTrailerInId: any;
  viewCustomerTrailerInIndex: any;
  viewDetail: any;
  permissions: any;

  constructor(public http: CustomHttpService) { }

  getAllCustomerTrailerIns() {
    return this.http.get("/Master/GetAllCustomerTrailerIns").then(res => res);
  }

  deleteCustomerTrailerIn(ctiMappingId: any) {
    return this.http.get("/Master/DeleteCustomerTrailerInById?ctiMappingId=" + ctiMappingId).then(res => res);
  }

  getSearchAndSortBy(search: any, sort: any, status: any, pageSize: any, pageNumber: any) {
    return this.http.get("/Master/GetCustomerTrailerInsBySearchAndSort?searchKey=" + search + "&sortKey=" + sort + "&statusfilter=" + status + "&pageSize=" + pageSize + "&pageNumber=" + pageNumber).then(res => res);
  }

  addUpdateCustomerTrailerIn(customerTrailerInModel: any) {
    return this.http.post("/Master/AddUpdateCustomerTrailerIn", customerTrailerInModel).then(res => res);
  }

  getCustomerTrailerInHistory(ctiMappingId: any) {
    return this.http.get("/Master/GetCustomerTrailerInHistory?ctiMappingId=" + ctiMappingId).then(res => res);
  }

  getAllClients() {
    return this.http.get("/Master/GetAllCustomers").then(res => res);
  }

  getAllTrailers() {
    return this.http.get("/TransportManager/GetAllTrailers").then(res => res);
  }

  validateCustomerTrailerInUniqueness(clientId: any, trailerId: any) {
    return this.http.get('/Master/ValidateCustomerTrailerInUniqueness?customerId=' + clientId + '&trailerId=' + trailerId).then(res => res);
  }
  
}
