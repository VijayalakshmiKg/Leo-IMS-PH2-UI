import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerProductTypeService {
  customerProductTypeList: any
  editCustomerProductTypeRecord: any;
  selectedCustomerProductTypeRecord: any;
  viewCustomerProductTypeId: any;
  viewCustomerProductTypeIndex: any;
  viewDetail: any;
  permissions: any;

  constructor(public http: CustomHttpService) { }

  getAllCustomerProductTypes() {
    return this.http.get("/Master/GetAllCustomerProductTypes").then(res => res);
  }

  deleteCustomerProductType(cptMappingId: any) {
    return this.http.get("/Master/DeleteCustomerProductTypeById?cptMappingId=" + cptMappingId).then(res => res);
  }

  getSearchAndSortBy(search: any, sort: any, status: any, pageSize: any, pageNumber: any) {
    return this.http.get("/Master/GetCustomerProductTypesBySearchAndSort?searchKey=" + search + "&sortKey=" + sort + "&statusfilter=" + status + "&pageSize=" + pageSize + "&pageNumber=" + pageNumber).then(res => res);
  }

  addUpdateCustomerProductType(customerProductTypeModel: any) {
    return this.http.post("/Master/AddUpdateCustomerProductType", customerProductTypeModel).then(res => res);
  }

  getCustomerProductTypeHistory(cptMappingId: any) {
    return this.http.get("/Master/GetCustomerProductTypeHistory?cptMappingId=" + cptMappingId).then(res => res);
  }

  getAllClients() {
    return this.http.get("/Master/GetAllCustomers").then(res => res);
  }

  getAllProductTypes() {
    return this.http.get("/Master/GetAllProductTypes").then(res => res);
  }

  validateCustomerProductTypeUniqueness(customerId: any, productTypeId: any) {
    return this.http.get('/Master/ValidateCustomerProductTypeUniqueness?customerId=' + customerId + '&productTypeId=' + productTypeId).then(res => res);
  }
}
