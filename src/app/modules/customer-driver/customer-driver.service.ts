import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerDriverService {

  selectedCustomerDriverRecord: any;
  editCustomerDriverRecord: any;
  viewDetail: any;
  viewCustomerDriverIndex: number = 0;
  permissions: any;

  constructor(private http: CustomHttpService) { }

  getAllCustomerDrivers(pageNumber?: number, itemsPerPage?: number) {
    return this.http.get(`/Master/GetAllCustomerDrivers?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`).then(res => res);
  }

  deleteCustomerDriver(cpMappingId: number) {
    return this.http.get(`/Master/DeleteCustomerDriverById?cdMappingId=${cpMappingId}`).then(res => res);
  }

  getSearchAndSortBy(searchTerm: string, sortBy: any, status: string, pageNumber?: number, itemsPerPage?: number) {
    return this.http.get(`/Master/GetCustomerDriversBySearchAndSort?searchTerm=${searchTerm}&sortBy=${sortBy}&status=${status}&pageNumber=${pageNumber}&pageSize=${itemsPerPage}`).then(res => res);
  }

  addUpdateCustomerDriver(customerDriverData: any) {
    return this.http.post(`/Master/AddUpdateCustomerDriver`, customerDriverData).then(res => res);
  }

  getCustomerDriverHistory(cpMappingId: number) {
    return this.http.get(`/Master/GetCustomerDriverHistory?cdMappingId=${cpMappingId}`).then(res => res);
  }

  getAllClients() {
    return this.http.get(`/Master/GetAllCustomers`).then(res => res);
  }

  getAllDrivers() {
    return this.http.get(`/TransportManager/GetAllDrivers`).then(res => res);
  }

  validateCustomerDriverUniqueness(clientId: number, driverId: number) {
    return this.http.get(`/Master/ValidateCustomerDriverUniqueness?customerId=${clientId}&driverId=${driverId}`).then(res => res);
  }

}
