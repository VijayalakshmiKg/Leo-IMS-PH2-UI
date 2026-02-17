import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';
import { addMaterialModel } from './materialModel/addMaterialModel';


@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  materialList: any | any[] = []
  viewMaterialIndex: any
  editMaterialRecord: any;
  viewMaterialRecord: any;
  permissions:any;



  constructor(public http: CustomHttpService) { }

  getConsignors() {
    return this.http.get('/TransportManager/GetConsignors').then(res => res)
  }

  addUpdateMaterial(materialModel: addMaterialModel) {
    return this.http.post('/TransportManager/AddUpdateMaterialsDetails', materialModel).then(res => res)
  }

  getAllMaterials() {
    return this.http.get('/TransportManager/GetAllMaterialsDetails').then(res => res)
  }

  getMaterialById(materialID: any) {
    return this.http.get('/TransportManager/GetMaterialsDetailsByMaterialId?MaterialID=' + materialID).then(res => res)
  }

  deleteMaterialById(materialID: any) {
    return this.http.get('/TransportManager/DeleteMaterialsDetailsByMaterialId?MaterialId=' + materialID).then(res => res)
  }

  searchMaterialBySort(searchValue: any, sort: any, materialType:any,pageNumber:any,pageSize:any) {
    return this.http.get("/TransportManager/GetMaterialsDetailsBySearchAndSort?searchKey="+searchValue+"&sortKey=" + sort+"&materiaiType="+materialType+"&pageNumber="+pageNumber+"&pageSize="+pageSize).then(res => res);
    // return this.http.get('/TransportManager/GetMaterialsDetailsBySearchAndSort?searchKey=' + searchValue + '&sortKey=' + sort+'&materiaiType='+materialType).then(res => res)
  }
  getSortLits(){
    return this.http.get("/Master/GetSortings").then(res => res);
  }
   // material type
   getAllMaterial() {
    return this.http.get("/Master/GetAllMaterialTypes").then(res => res);
  }
   // Category type
   getAllCategory() {
    return this.http.get("/Master/GetAllCategoryType").then(res => res);
  }
}
