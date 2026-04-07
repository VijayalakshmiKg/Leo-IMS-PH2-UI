import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductBinService {
  productBinList: any;
  editProductBinRecord: any;
  selectedProductBinRecord: any;
  viewProductBinId: any;
  viewProductBinIndex: any;
  viewDetail: any;
  permissions: any;

  constructor(public http: CustomHttpService) { }

  getAllProductBins() {
    return this.http.get("/Master/GetAllProductBinMappings").then(res => res);
  }

  deleteProductBin(pbMappingId: any) {
    return this.http.get("/Master/DeleteProductBinMapping?mappingId=" + pbMappingId).then(res => res);
  }

  getSearchAndSortBy(search: any, sort: any, status: any, pageSize: any, pageNumber: any) {
    return this.http.get("/Master/GetProductBinsBySearchAndSort?searchKey=" + search + "&sortKey=" + sort + "&statusfilter=" + status + "&pageSize=" + pageSize + "&pageNumber=" + pageNumber).then(res => res);
  }

  addUpdateProductBin(productBinModel: any) {
    return this.http.post("/Master/AddUpdateProductBinMapping", productBinModel).then(res => res);
  }

  getProductBinHistory(pbMappingId: any) {
    return this.http.get("/Master/GetProductBinHistory?pbMappingId=" + pbMappingId).then(res => res);
  }

  getAllProducts() {
    return this.http.get("/Master/GetAllProducts").then(res => res);
  }

  getAllBins() {
    return this.http.get("/Master/GetAllBin").then(res => res);
  }

  validateProductBinUniqueness(productId: any, binId: any) {
    return this.http.get('/Master/ValidateProductBinUniqueness?productId=' + productId + '&binId=' + binId).then(res => res);
  }
}
