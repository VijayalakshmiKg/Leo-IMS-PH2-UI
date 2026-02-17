import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'})
export class CustomerLocationService {

  selectedCustomerLocationRecord: any;
  editCustomerLocationRecord: any;
  viewDetail: any;
  viewCustomerLocationIndex: number = 0;
  permissions: any;

  constructor(private http: CustomHttpService) { }

  getAllCustomerLocations(pageNumber?: number, itemsPerPage?: number) {
    return this.http.get(`/Master/GetAllCustomerLocations?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`).then(res => res);
  }

  deleteCustomerLocation(clMappingId: number) {
    return this.http.get(`/Master/DeleteCustomerLocationById?clMappingId=${clMappingId}`).then(res => res);
  }

  getSearchAndSortBy(searchTerm: string, sortBy: any, status: string, pageNumber?: number, itemsPerPage?: number) {
    return this.http.get(`/Master/GetCustomerLocationsBySearchAndSort?searchTerm=${searchTerm}&sortBy=${sortBy}&status=${status}&pageNumber=${pageNumber}&pageSize=${itemsPerPage}`).then(res => res);
  }

  addUpdateCustomerLocation(customerLocationData: any) {
    return this.http.post(`/Master/AddUpdateCustomerLocation`, customerLocationData).then(res => res);
  }

  getCustomerLocationHistory(clMappingId: number) {
    return this.http.get(`/Master/GetCustomerLocationHistory?clMappingId=${clMappingId}`).then(res => res);
  }

  getAllClients() {
    return this.http.get(`/Master/GetAllCustomers`).then(res => res);
  }

  getAllLocations() {
    return this.http.get(`/Master/GetAllLocations`).then(res => res);
  }

  validateCustomerLocationUniqueness(clientId: number, locationId: number) {
    return this.http.get(`/Master/ValidateCustomerLocationUniqueness?customerId=${clientId}&locationId=${locationId}`).then(res => res);
  }
}
