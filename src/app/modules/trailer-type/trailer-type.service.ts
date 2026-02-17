import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class TrailerTypeService {
  TrailerTypesList: any | any[] = []
  editTrailerTypeRecord: any;
  viewDetail: any;
  viewTrailerTypeIndex: any = 0;
  permissions: any;

  constructor(public http: CustomHttpService) { }

  getAllTrailerTypes() {
    return this.http.get("/Master/GetAllTrailerTypes").then(res => res)
  }

  deleteTrailerType(TrailerTypeID: any) {
    return this.http.get("/Master/DeleteTrailerTypeById?trailerTypeId=" + TrailerTypeID).then(res => res);
  }

  getSearchAndSortBy(search: any, sort: any, status: any, pageNumber: any, pageSize: any) {
    return this.http.get("/Master/GetTrailerTypesBySearchAndSort?searchKey=" + search + "&sortkey=" + sort + "&statusfilter=" + status + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize).then(res => res);
  }

  addUpdateTrailerType(trailerTypeModel: any) {
    return this.http.post("/Master/AddUpdateTrailerType", trailerTypeModel).then(res => res);
  }

  getTrailerTypeHistory(TrailerTypeID: any) {
    return this.http.get("/Master/GetTrailerTypeHistory?trailerTypeId=" + TrailerTypeID).then(res => res)
  }

  validateTrailerTypeUniqueness(trailerTypeName: any) {
    return this.http.get('/Master/ValidateTrailerTypeUniqueness?trailerTypeName=' + trailerTypeName).then(res => res);
  }
}
