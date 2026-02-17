import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerTrailerOutService {
  customerTrailerOutList: any
  editCustomerTrailerOutRecord: any;
  selectedCustomerTrailerOutRecord: any;
  viewCustomerTrailerOutId: any;
  viewCustomerTrailerOutIndex: any;
  viewDetail: any;
  permissions: any;

  constructor(public http: CustomHttpService) { }

  getAllCustomerTrailerOuts(pageNumber?: number, itemsPerPage?: number) {
    return this.http.get(`/Master/GetAllCustomerTrailerOuts?pageNumber=${pageNumber}&pageSize=${itemsPerPage}`).then(res => res);
  }

  deleteCustomerTrailerOut(ctoMappingId: number) {
    return this.http.get(`/Master/DeleteCustomerTrailerOutById?ctoMappingId=${ctoMappingId}`).then(res => res);
  }

  getSearchAndSortBy(search: any, sort: any, status: any, pageSize: any, pageNumber: any) {
    return this.http.get("/Master/GetCustomerTrailerOutsBySearchAndSort?searchKey=" + search + "&sortKey=" + sort + "&statusfilter=" + status + "&pageSize=" + pageSize + "&pageNumber=" + pageNumber).then(res => res);
  }

  addUpdateCustomerTrailerOut(customerTrailerOutData: any) {
    return this.http.post(`/Master/AddUpdateCustomerTrailerOut`, customerTrailerOutData).then(res => res);
  }

  getCustomerTrailerOutHistory(ctoMappingId: number) {
    return this.http.get(`/Master/GetCustomerTrailerOutHistory?ctoMappingId=${ctoMappingId}`).then(res => res);
  }

  getAllClients() {
    return this.http.get(`/Master/GetAllCustomers`).then(res => res);
  }

  getAllTrailers() {
    return this.http.get(`/TransportManager/GetAllTrailers`).then(res => res);
  }

  validateCustomerTrailerOutUniqueness(clientId: number, trailerId: number) {
    return this.http.get(`/Master/ValidateCustomerTrailerOutUniqueness?customerId=${clientId}&trailerId=${trailerId}`).then(res => res);
  }
}
