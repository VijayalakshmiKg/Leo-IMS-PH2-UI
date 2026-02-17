import { Injectable } from '@angular/core';
import { retry } from 'rxjs/operators';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(public http: CustomHttpService) { } 
  // Bin
  getAllBin() {
    return this.http.get("/Master/GetAllBin").then(res => res);
  }
  getBinById(binId: any) {
    return this.http.get("/Master/GetBinById?binId=" + binId).then(res => res);
  }
  deleteBinById(binId: any) {
    return this.http.get("/Master/DeleteBin?binId=" + binId).then(res => res);
  }
  addUpdateBin(binModel: any) {
    return this.http.post("/Master/AddUpdateBin", binModel).then(res => res);
  }
  // Trailer
  addUpdateTrailer(trailerModel: any) {
    return this.http.post("/Master/AddUpdateTrailerType", trailerModel).then(res => res);
  }
  getAllTrailer() {
    return this.http.get("/Master/GetAllTrailerType").then(res => res);

  }
  deleteTrailer(trailerId: any) {
    return this.http.get("/Master/DeleteTrailerType?trailerTypeId=" + trailerId).then(res => res);
  }
  // material
  getAllMaterial() {
    return this.http.get("/Master/GetAllMaterialTypes").then(res => res);
  }
  deleteMaterial(materialId: any) {
    return this.http.get("/Master/DeleteMaterialType?matId=" + materialId).then(res => res);
  }
  addUpdateMaterial(materialModel:any){
    return this.http.post("/Master/AddUpdateMaterialType",materialModel).then(res => res);
  }
  // Units
  addUpdateUnit(unitModel: any) {
    return this.http.post("/Master/AddUpdateUnits", unitModel).then(res => res);
  }
  getAllUnits() {
    return this.http.get("/Master/GetAllUnits").then(res => res);
  }
  getUnitById(unitId: any) {
    return this.http.get("/Master/GetUnitsById?unitId=" + unitId).then(res => res);
  }
  deleteUnit(unitId: any) {
    return this.http.get("/Master/DeleteUnits?unitId=" + unitId).then(res => res);
  }
  // Gender
  getAllGender() {
    return this.http.get("/Master/GetAllGender").then(res => res);
  }
  addUpdateGender(genderModel: any) {
    return this.http.post("/Master/AddUpdateGender", genderModel).then(res => res);
  }
  deleteGenderById(genderId: any) {
    return this.http.get("/Master/DeleteGenders?genderId=" + genderId).then(res => res);
  }
  // Status
  addUpdateStatus(statusModel: any) {
    return this.http.post("/Master/AddUpdateDriverStatus", statusModel).then(res => res);
  }
  getAllStatusList() {
    return this.http.get("/Master/GetAllDriverStatus").then(res => res);
  }
  deleteStatusById(statusId: any) {
    return this.http.get("/Master/DeleteDriverStatus?Statusid=" + statusId).then(res => res);
  }
  // Vendor

  addUpdateVendor(vendorModel: any) {
    return this.http.post("/Master/AddUpdateVendors", vendorModel).then(res => res);
  }
  getAllVendor() {
    return this.http.get("/Master/GetAllVendors").then(res => res);
  }
  deleteVendor(vendorId: any) {
    return this.http.get("/Master/DeleteVendor?venId=" + vendorId).then(res => res);
  }
  // CountryState
  getStateCityCountyList(zipCode: any) {
    return this.http.get("/Master/GetCityStateCountyByZipCodebysearchkey?Searchkey=" + zipCode).then(res => res);
  }
  getCountryList() {
    return this.http.get("/Master/GetCountryCodes").then(res => res);
  }
  // vehicleType
  addUpdateVehicleType(vehicleModel: any) {
    return this.http.post("/Master/AddUpdateVehicleType", vehicleModel).then(res => res);
  }
  getAllVehicle() {
    return this.http.get("/Master/GetAllVehicleTypes").then(res => res);
  }
  deleteVehicle(vehicleId: any) {
    return this.http.get("/Master/DeleteVehicleType?vehiTypeId=" + vehicleId).then(res => res);
  }
// category

addUpdateCategory(categoryModel:any){
  return this.http.post("/Master/AddUpdateCategoryType",categoryModel).then(res => res);
}
getAllCategory(){
  return this.http.get("/Master/GetAllCategoryType").then(res => res);
}
deleteCategory(categoryId:any){
  return this.http.get("/Master/DeleteCategoryType?Categoryid="+categoryId).then(res => res);
}
// Temperature
addUpdateTemperature(temperatureModel:any){
  return this.http.post("/Master/AddUpdateTemperature",temperatureModel).then(res => res);
}
getAllTemperature(){
  return this.http.get("/Master/GetAllTemperatures").then(res => res);
}
deleteTemperature(tempId:any){
  return this.http.get("/Master/DeleteTemperature?Tempid="+tempId).then(res => res);
}
}
