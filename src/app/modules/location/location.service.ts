import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  locationList: any
  editLocationRecord: any;
  selectedLocationRecord: any;
  viewLocationId: any;
  viewLocationIndex: any;
  viewDetail: any;
  permissions: any;

  constructor(public http: CustomHttpService) { }

  getAllLocations() {
    return this.http.get("/Master/GetAllLocations").then(res => res);
  }

  deleteLocation(locationId: any) {
    return this.http.get("/Master/DeleteLocationById?locationId=" + locationId).then(res => res);
  }

  getSearchAndSortBy(search: any, sort: any, status: any, pageSize: any, pageNumber: any) {
    return this.http.get("/Master/GetLocationsBySearchAndSort?searchKey=" + search + "&sortKey=" + sort + "&statusfilter=" + status + "&pageSize=" + pageSize + "&pageNumber=" + pageNumber).then(res => res);
  }

  addUpdateLocation(locationModel: any) {
    return this.http.post("/Master/AddUpdateLocation", locationModel).then(res => res);
  }

  getLocationHistory(locationId: any) {
    return this.http.get("/Master/GetLocationHistory?Locationid=" + locationId).then(res => res);
  }

  validateLocationUniqueness(locationName: any) {
    return this.http.get('/Master/ValidateLocationUniqueness?locationName=' + locationName).then(res => res);
  }
}
