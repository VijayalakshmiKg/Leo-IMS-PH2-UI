import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  ProductsList: any | any[] = []
  editProductRecord: any;
  viewDetail: any;
  viewProductIndex: any = 0;
  permissions: any;

  constructor(public http: CustomHttpService) { }
  
  getAllProduct() {
    return this.http.get("/Master/GetAllProducts").then(res => res)
  }
  
  deleteProduct(ProductID: any) {
    return this.http.get("/Master/DeleteProductById?productId=" + ProductID).then(res => res);
  }
  
  getSearchAndSortBy(search: any, sort: any, status: any, pageNumber: any, pageSize: any) {
    return this.http.get("/Master/GetProductsBySearchAndSort?searchKey=" + search + "&sortkey=" + sort + "&statusfilter=" + status + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize).then(res => res);
  }
  
  addUpdateProduct(productModel: any) {
    return this.http.post("/Master/AddUpdateProduct", productModel).then(res => res);
  }
  
  getAllProductTypes() {
    return this.http.get("/Master/GetAllProductTypes").then(res => res);
  }
  
  // Product history
  getProductHistory(ProductID: any) {
    return this.http.get("/Master/GetProductOrderHistory?Productid=" + ProductID).then(res => res)
  }
}
