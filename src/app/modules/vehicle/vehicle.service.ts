import { Injectable } from '@angular/core';

import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  VehiclesList:any | any[] = []
  editVehicleRecord:any;
  viewDetail:any;
  viewVehicleIndex:any = 0;
  permissions:any;


  constructor(public http:CustomHttpService) { }
  getAllVehicle(){
    return this.http.get("/Master/GetAllVehicles").then(res => res)
  }
  deleteVehicle(VehicleID:any){
    return this.http.get("/Master/DeleteVehicleById?vehicleId="+VehicleID).then(res => res);
  }
  getSearchAndSortBy(search:any,sort:any, status:any,pageNumber:any,pageSize:any){
    //console.log("/TransportManager/GetTrucksBySearchAndSort?searchKey="+search+"&sortkey="+sort+"&statusfilter="+status + "&pageNumber="+pageNumber+"&pageSize="+pageSize);
    
    return this.http.get("/Master/GetVehiclesBySearchAndSort?searchKey="+search+"&sortkey="+sort+"&statusfilter="+status + "&pageNumber="+pageNumber+"&pageSize="+pageSize).then(res => res);
    // return this.http.get("/TransportManager/GetTrucksBySearchAndSort?searchKey="+search+"&sortkey="+sort+"&statusfilter="+status).then(res => res);
  }
  addUpdateVehicle(vehicleModel:any){
    return this.http.post("/Master/AddUpdateVehicle",vehicleModel).then(res => res);
  }
  getAllVehicleTypes() {
    return this.http.get("/Master/GetAllVehicleTypes").then(res => res);
  }
  // Vehicle histroy
  getVehicleHistory(VehicleID:any){
    return this.http.get("/Master/GetVehicleOrderHistory?VehicleID="+VehicleID).then(res=>res)
  }
}
