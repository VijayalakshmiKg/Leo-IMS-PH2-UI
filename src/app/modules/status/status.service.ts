import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  statusList: any
  editStatusRecord: any;
  viewStatusId: any;
  viewStatusIndex: any;
  permissions: any;

  constructor(public http: CustomHttpService) { }

  getAllStatus() {
    return this.http.get("/Master/GetAllStatus").then(res => res);
  }

  deleteStatus(statusId: any) {
    return this.http.get("/Master/DeleteStatusById?statusId=" + statusId).then(res => res);
  }

  getSearchAndSortBy(search: any, sort: any, status: any, pageSize: any, pageNumber: any) {
    return this.http.get("/Master/GetStatusBySearchAndSort?searchKey=" + search + "&sortKey=" + sort + "&statusfilter=" + status + "&pageSize=" + pageSize + "&pageNumber=" + pageNumber).then(res => res);
  }

  addUpdateStatus(statusModel: any) {
    return this.http.post("/Master/AddUpdateStatus", statusModel).then(res => res);
  }

  getStatusHistory(statusId: any) {
    return this.http.get("/Master/GetStatusHistory?Statusid=" + statusId).then(res => res);
  }

  validateStatusUniqueness(statusName: any) {
    return this.http.get('/Master/ValidateStatusUniqueness?statusName=' + statusName).then(res => res);
  }
}
