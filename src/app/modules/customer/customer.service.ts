import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  customersList: any
  editCustomerRecord: any;
  viewCustomerId: any;
  viewCustomerIndex: any;
  permissions: any;

  constructor(public http: CustomHttpService) { }

  getAllCustomers() {
    return this.http.get("/Master/GetAllCustomers").then(res => res);
  }

  deleteCustomer(customerId: any) {
    return this.http.get("/Master/DeleteCustomerById?customerId=" + customerId).then(res => res);
  }

  getSearchAndSortBy(search: any, sort: any, status: any, pageSize: any, pageNumber: any) {
    return this.http.get("/Master/GetCustomersBySearchAndSort?searchKey=" + search + "&sortKey=" + sort + "&statusfilter=" + status + "&pageSize=" + pageSize + "&pageNumber=" + pageNumber).then(res => res);
  }

  addUpdateCustomer(customerModel: any) {
    return this.http.post("/Master/AddUpdateCustomer", customerModel).then(res => res);
  }

  getCustomerHistory(customerId: any) {
    return this.http.get("/Master/GetCustomerOrderHistory?Customerid=" + customerId).then(res => res);
  }

  getCountryList() {
    return this.http.get("/Master/GetCountryCodes").then(res => res);
  }

  getStateList() {
    return this.http.get("/Master/GetStateCodes").then(res => res);
  }

  getCityStateCountyByZipCode(zipCode: any) {
    return this.http.get("/Master/GetCityStateCountyByZipCodebysearchkey?Searchkey=" + zipCode).then(res => res);
  }

  validateCustomerUniqueness(email: any, phone: any, customerCode: any) {
    return this.http.get('/Master/ValidateCustomerUniqueness?email=' + email + '&phoneNumber=' + phone + '&customerCode=' + customerCode).then(res => res);
  }
}
