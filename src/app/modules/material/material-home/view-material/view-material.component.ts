import { Component, OnInit } from '@angular/core';
import { MaterialService } from '../../material.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Location } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-material',
  templateUrl: './view-material.component.html',
  styleUrls: ['./view-material.component.css']
})
export class ViewMaterialComponent implements OnInit {
  materialList: any | any[] = [];
  activeMaterial: any;
  viewMaterialRecord: any | any[] = [];
  searchValue: any;
  pageNumber = 1
  length = 200; // Total items
  pageSize = 10; // Items per page
  currentPage = 1; // Default first page
  totalPages = Math.ceil(this.length / this.pageSize); // Total pages
  sortList: any[] = [];
  sortCode: any = 'Newest to Oldest date';
  logedInUser:any
  permissions: any;

  constructor(public materialServ: MaterialService, public routes: Router, public dialog: MatDialog, public utilSer: UtilityService, public location: Location) { }
  ngOnDestroy(): void {
    // this.materialServ.editmaterialRecord = null
  }

  ngOnInit(): void {
     let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
    this.permissions = this.materialServ.permissions;
    this.getMaterialsList();
    this.activeMaterial = this.materialServ.viewMaterialIndex ? this.materialServ.viewMaterialIndex : 0;
    //console.log(this.activeMaterial);
    //console.log(this.materialList);
    
  }
  clear(){
    this.searchValue = '';
    this.getMaterialsList();
  }
  getIndex() {
    for (let i = 0; i < this.materialList.length; i++) {
      if (this.materialList[i].materialID == this.viewMaterialRecord.materialID) {
        //console.log(i);
        this.activeMaterial = i
      }
    }
  }
   onPageChange(event: PageEvent) {
      //console.log(event);
      this.pageNumber = Number(event.pageIndex) + 1
      this.pageSize = event.pageSize
      this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
      this.totalPages = Math.ceil(event.length / event.pageSize);
      this.materialServ.searchMaterialBySort('',this.sortCode, '',this.pageNumber,this.pageSize).then((res: any) => {
        //console.log(res);
        this.materialList = res.data;
      });
    }
  changematerialView(record: any, index: any) {
    this.activeMaterial = index
    this.materialServ.viewMaterialIndex = index
    this.viewMaterialRecord = record;
    //console.log(this.viewMaterialRecord);
  }

  editMaterial() {
    this.materialServ.editMaterialRecord = this.viewMaterialRecord
    this.routes.navigateByUrl('/home/material/addMeterial');
    this.materialServ.viewMaterialRecord = null;
    this.getMaterialsList();
  }

  back() {
    this.location.back()
  }
  getMaterialsList() {
    this.materialServ.searchMaterialBySort('',this.sortCode, '',this.pageNumber,this.pageSize).then(res => {
      //console.log(res);
      this.materialList = res.data;
      this.viewMaterialRecord = this.materialServ.viewMaterialRecord ? this.materialServ.viewMaterialRecord : this.materialList[this.activeMaterial];
    //console.log(this.viewMaterialRecord);
    this.getIndex()
    this.changematerialView(this.viewMaterialRecord, this.activeMaterial)
    })
  }
  filteredUsersList(event: any) {
    //console.log(event.target.value);
    this.searchValue = event.target.value;

    if(event.target.value.length > 1){
      this.activeMaterial = 0;
      this.materialServ.searchMaterialBySort(event.target.value, this.sortCode, '',this.pageNumber,this.pageSize).then(res=>{
        //console.log(res);
        this.materialList = res.data;
        this.viewMaterialRecord = this.materialList[this.activeMaterial];
      })
    }else {
      this.getMaterialsList();
    }
  }

  deleteMaterial() {

    // let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
    //   width: '480px',
    //   height: 'auto',
    //   data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this Material ?', title: 'Are you sure?' },
    //   disableClose: true,
    //   autoFocus: false,
    //   panelClass: 'custom-msg-box'
    // })
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.materialServ.materialList.splice(this.viewMaterialRecord.viewUserId, 1);

    //     // this.router.navigateByUrl('/home/users/list')
    //     this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Material deleted successfully.' })
    //     this.back()
    //   }
    // })
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '505px',
      height: 'auto',
      data: {
        title: 'Remove product',
        message: 'Do you wish to remove the product? All the material data will be deleted and cannot be restored again.',
        value: this.viewMaterialRecord.materialName,
        placeholder: 'Enter the product name'
      },
      disableClose: true,
      autoFocus: false,
      panelClass: 'deletePopup'
    })
    dialogRef.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        this.materialServ.deleteMaterialById(this.viewMaterialRecord.materialID).then(res=>{
          //console.log(res);
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Product removed successfully.' })
        this.back()
        })
      }
    })

  }

}
