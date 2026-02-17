import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerTrailerInTypeService {
  customerTrailerInTypeList: any
  editCustomerTrailerInTypeRecord: any;
  selectedCustomerTrailerInTypeRecord: any;
  viewCustomerTrailerInTypeId: any;
  viewCustomerTrailerInTypeIndex: any;
  viewDetail: any;
  permissions: any;

  constructor(public http: CustomHttpService) { }

  getAllCustomerTrailerInTypes() {
    return this.http.get("/Master/GetAllCustomerTrailerInTypes").then(res => res);
  }

  deleteCustomerTrailerInType(ctitMappingId: any) {
    return this.http.get("/Master/DeleteCustomerTrailerInTypeById?ctitMappingId=" + ctitMappingId).then(res => res);
  }

  getSearchAndSortBy(search: any, sort: any, status: any, pageSize: any, pageNumber: any) {
    return this.http.get("/Master/GetCustomerTrailerInTypesBySearchAndSort?searchKey=" + search + "&sortKey=" + sort + "&statusfilter=" + status + "&pageSize=" + pageSize + "&pageNumber=" + pageNumber).then(res => res);
  }

  addUpdateCustomerTrailerInType(customerTrailerInTypeModel: any) {
    return this.http.post("/Master/AddUpdateCustomerTrailerInType", customerTrailerInTypeModel).then(res => res);
  }

  getCustomerTrailerInTypeHistory(ctitMappingId: any) {
    return this.http.get("/Master/GetCustomerTrailerInTypeHistory?ctitMappingId=" + ctitMappingId).then(res => res);
  }

  getAllClients() {
    return this.http.get("/Master/GetAllCustomers").then(res => res);
  }

  getAllTrailerTypes() {
    return this.http.get("/Master/GetAllTrailerTypes").then(res => res);
  }

  validateCustomerTrailerInTypeUniqueness(clientId: any, trailerId: any) {
    return this.http.get('/Master/ValidateCustomerTrailerInTypeUniqueness?customerId=' + clientId + '&trailerTypeId=' + trailerId).then(res => res);
  }
}
