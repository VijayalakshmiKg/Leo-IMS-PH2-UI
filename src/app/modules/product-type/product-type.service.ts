import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {
  ProductTypesList: any | any[] = []
  editProductTypeRecord: any;
  viewDetail: any;
  viewProductTypeIndex: any = 0;
  permissions: any;

  constructor(public http: CustomHttpService) { }
  
  getAllProductType() {
    return this.http.get("/Master/GetAllProductTypes").then(res => res)
  }
  
  deleteProductType(ProductTypeID: any) {
    return this.http.get("/Master/DeleteProductTypeById?productTypeId=" + ProductTypeID).then(res => res);
  }
  
  getSearchAndSortBy(search: any, sort: any, status: any, pageNumber: any, pageSize: any) {
    return this.http.get("/Master/GetProductTypesBySearchAndSort?searchKey=" + search + "&sortkey=" + sort + "&statusfilter=" + status + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize).then(res => res);
  }
  
  addUpdateProductType(productTypeModel: any) {
    return this.http.post("/Master/AddUpdateProductType", productTypeModel).then(res => res);
  }
  
  // ProductType history
  getProductTypeHistory(ProductTypeID: any) {
    return this.http.get("/Master/GetProductTypeOrderHistory?ProductTypeid=" + ProductTypeID).then(res => res)
  }
}
