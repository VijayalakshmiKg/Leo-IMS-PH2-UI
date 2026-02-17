import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerProductService {
  customerProductList: any
  editCustomerProductRecord: any;
  selectedCustomerProductRecord: any;
  viewCustomerProductId: any;
  viewCustomerProductIndex: any;
  viewDetail: any;
  permissions: any;

  constructor(public http: CustomHttpService) { }

  getAllCustomerProducts() {
    return this.http.get("/Master/GetAllCustomerProducts").then(res => res);
  }

  deleteCustomerProduct(cpMappingId: any) {
    return this.http.get("/Master/DeleteCustomerProductById?cpMappingId=" + cpMappingId).then(res => res);
  }

  getSearchAndSortBy(search: any, sort: any, status: any, pageSize: any, pageNumber: any) {
    return this.http.get("/Master/GetCustomerProductsBySearchAndSort?searchKey=" + search + "&sortKey=" + sort + "&statusfilter=" + status + "&pageSize=" + pageSize + "&pageNumber=" + pageNumber).then(res => res);
  }

  addUpdateCustomerProduct(customerProductModel: any) {
    return this.http.post("/Master/AddUpdateCustomerProduct", customerProductModel).then(res => res);
  }

  getCustomerProductHistory(cpMappingId: any) {
    return this.http.get("/Master/GetCustomerProductHistory?cpMappingId=" + cpMappingId).then(res => res);
  }

  getAllClients() {
    return this.http.get("/Master/GetAllCustomers").then(res => res);
  }

  getAllProducts() {
    return this.http.get("/Master/GetAllProducts").then(res => res);
  }

  validateCustomerProductUniqueness(clientId: any, productId: any) {
    return this.http.get('/Master/ValidateCustomerProductUniqueness?customerId=' + clientId + '&productId=' + productId).then(res => res);
  }
}
