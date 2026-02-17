import { Component, OnInit } from '@angular/core';
import { MaterialService } from '../material.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-material-home',
  templateUrl: './material-home.component.html',
  styleUrls: ['./material-home.component.css']
})
export class MaterialHomeComponent implements OnInit {

  materialList: any | any[] = []
  sortList: any[] = [];
  sortCode: any = 'Newest to Oldest date';
  materialTypeList:any[] = [];
  filter:any = '';
  filterType:any = 'All';
  searchKey:any = '';
  searchValue: any;
  logedInUser: any;
  pageNumber = 1
  length = 200; // Total items
  pageSize = 10; // Items per page
  currentPage = 1; // Default first page
  totalPages = Math.ceil(this.length / this.pageSize); // Total pages
  permissions:any;


  constructor(public route: Router, public materialerv: MaterialService) { }

  ngOnInit(): void {
     let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
     let childmenu = parsedData.rootMenu[parsedData.rootMenu.length - 1];
    for (var i = 0; i < childmenu.subMenus.length; i++) {
      if (childmenu.subMenus[i].subMenuName.toLowerCase() == 'pproducts') {
        this.permissions = childmenu.subMenus[i];
        this.materialerv.permissions = this.permissions;
      }
    }
    //console.log(this.permissions);
    this.getAllMaterialType()
    this.getSortList();
    this.getMaterialsList();
    //console.log(this.materialerv.materialList);
  }
  clear(){
    this.searchValue = '';
    this.getMaterialsList();
  }
  getAllMaterialType() {
    this.materialerv.getAllMaterial().then(res=> {
      //console.log(res);
      this.materialTypeList = res;
    })
  }
  getMaterialsList() {
    this.materialerv.searchMaterialBySort('',this.sortCode, this.filter,this.pageNumber,this.pageSize).then(res => {
      //console.log(res);
      this.materialList = res.data;
    })
  }
  getSortList() {
    this.materialerv.getSortLits().then(res => {
      //console.log(res);
      this.sortList = res
    })
  }
  sortByType(code:any) {
    this.filter = code;
    //console.log(code);
    this.filterType = code
    //console.log(this.filter);
    this.getFilteredMaterials()
  }

  sortByValue(sortValue: any) {
    //console.log(sortValue);
    this.sortCode = sortValue;
    this.getFilteredMaterials()
  }

  filteredUsersList(event: any) {
    //console.log(event.target.value);
    this.searchValue = event.target.value;

    if (event.target.value.length > 1) {
      this.searchKey = event.target.value;
      this.getFilteredMaterials();
    } else {
      this.searchKey = ''
      this.getMaterialsList();
    }
  }
  onPageChange(event: PageEvent) {
    //console.log(event);
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.materialerv.searchMaterialBySort('',this.sortCode, this.filter,this.pageNumber,this.pageSize).then((res: any) => {
      //console.log(res);
      this.materialList = res.data;
    });
  }
  getFilteredMaterials(){
    this.materialerv.searchMaterialBySort(this.searchKey, this.sortCode, this.filter,this.pageNumber,this.pageSize).then(res => {
      //console.log(res);
      this.materialList = res.data;
    })
  }


  addmaterial() {
    this.materialerv.editMaterialRecord = null
    this.route.navigateByUrl('/home/material/addMeterial')
    
  }
  viewmaterial(value: any, index: any) {
    if(this.permissions?.viewAccess){
    //console.log(value);
    //console.log(index);
    this.materialerv.viewMaterialIndex = index;
    this.materialerv.viewMaterialRecord = value;

    this.route.navigateByUrl('/home/material/viewMeterial')
  }
}
}
