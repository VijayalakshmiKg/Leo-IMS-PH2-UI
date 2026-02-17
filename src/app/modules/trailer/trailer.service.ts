import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class TrailerService {
  TrailersList:any;
  // TrailersList:any | any[] = [
  //   {
  //     "organization": "Haulage Exchange",
  //     "trailerNumber": "A123 4567",
  //     "licensePlate": "RX69GXH",
  //     "trailerType": "Tanker",
  //     "axleCount": "2",
  //     "weightLevel": "6",
  //     "bedLength": "2323",
  //     "cargoVolume": "2323",
  //     "interiorVolume": "33",
  //     "Length": "2323",
  //     "Height": "434",
  //     "Width": "4235"
  // }
 
  // ]
  AvailInSiteList:any | any[] = [
    {
      "organization": "Haulage Exchange",
      "trailerNumber": "B23 9874",
      "licensePlate": "RX69GXH",
      "trailerType": "Tanker",
      "axleCount": "2",
      "weightLevel": "6",
      "bedLength": "2323",
      "cargoVolume": "2323",
      "interiorVolume": "33",
      "Length": "2323",
      "Height": "434",
      "Width": "4235"
  }
 
  ]

  editTrailerRecord:any

  viewTrailerIndex:any = 0
 viewTrailer:any;
  permissions:any;

  constructor(public http:CustomHttpService) { }
  getAxilCounts(){
    return this.http.get("/Master/GetAxilCounts").then(res => res);
  }
  addUpdateTrailer(trailerModel:any){
    return this.http.post("/TransportManager/AddUpdateTrailers",trailerModel).then(res => res);
  }
  getAllTrailer(){
    return this.http.get("/TransportManager/GetAllTrailers").then(res => res);
  }
  getTrailerById(trailerId:any){
    return this.http.get("/TransportManager/GetTrailersById?trailerID="+trailerId).then(res => res);
  }
  deleteTrailerById(trailerId:any){
    return this.http.get("/TransportManager/DeleteTrailersById?trailerID="+trailerId).then(res => res);
  }
  getSearchAndSortedBy(search:any,sort:any, status:any,pageNumber:any,pageSize:any){
    return this.http.get("/TransportManager/GetTrailersBySearchAndSort?searchKey="+search+"&sortKey="+sort+"&statusfilter="+status+"&pageNumber="+pageNumber+"&pageSize="+pageSize).then(res => res);
    // return this.http.get("/TransportManager/GetTrailersBySearchAndSort?searchKey="+search+"&sortKey="+sort+"&statusfilter="+status).then(res => res);

  }
  getAllTrailerTypes(){
    return this.http.get("/Master/GetAllTrailerType").then(res => res);
  }

  // trailerHistory
  getTrailerHistory(trailerId:any){
    return this.http.get("/TransportManager/GetTrailerOrderHistory?Trailerid="+trailerId).then(res=>res)
  }
}
