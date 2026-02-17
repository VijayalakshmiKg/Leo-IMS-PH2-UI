import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ConsignorService } from '../../consignor.service';
import { Location } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-consignor',
  templateUrl: './view-consignor.component.html',
  styleUrls: ['./view-consignor.component.css']
})
export class ViewConsignorComponent implements OnInit {
  consignorList:any | any[] = []
  activeConsignor :any
  viewConsignorRecord:any | any[] = [];
  searchValue:any;
  pageNumber = 1
  length = 200; // Total items
  pageSize = 10; // Items per page
  currentPage = 1; // Default first page
  totalPages = Math.ceil(this.length / this.pageSize); // Total pages
  sortCode:any = '';
  sortList: any[] = [];
  permissions: any;

  constructor(public consignorServ:ConsignorService, public routes:Router , public dialog:MatDialog,public utilSer:UtilityService, public location:Location) { }
  ngOnDestroy(): void {
    // this.consignorServ.editconsignorRecord = null
  }
  get loggedInUser() {
    let user:any = localStorage.getItem('loggedInUser')
    return JSON.parse(user)
  }
  ngOnInit(): void {
    this.permissions = this.consignorServ.permissions;
    this.getSortList();
    this.getConsignorList();
    this.activeConsignor =  this.consignorServ.viewConsignorIndex ? this.consignorServ.viewConsignorIndex : 0;
    //console.log(this.activeConsignor);
    //console.log(this.viewConsignorRecord);
  }
  clear(){
    this.searchValue = '';
    this.getConsignorList();
  }
  onPageChange(event: PageEvent) {
    //console.log(event);
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.consignorServ.searchConsignorBySort('','A to Z',this.pageNumber,this.pageSize).then((res: any) => {
      //console.log(res);
      this.consignorList = res.data;
    });
  }
  getIndex() {
    for (let i = 0; i < this.consignorList.length; i++) {
      if (this.consignorList[i].consignorID == this.viewConsignorRecord.consignorID) {
        //console.log(i);
        this.activeConsignor = i
      }
    }
  }
  changeconsignorView(record: any, index:any){
    this.activeConsignor = index
    this.consignorServ.viewConsignorIndex = index
    this.viewConsignorRecord = record;
    //console.log(this.viewConsignorRecord);
    
  }

  editConsignor(){
    this.consignorServ.editConsignorRecord = this.viewConsignorRecord
    this.routes.navigateByUrl('/home/consignor/addConsignor');
    this.consignorServ.viewConsignorRecord = null;
    this.getConsignorList()
    
  }

  back(){
    this.location.back()
  }
  getConsignorList() {
    this.consignorServ.searchConsignorBySort('', 'A to Z', this.pageNumber,this.pageSize).then(res => {
      //console.log(res);
      this.consignorList = res.data;
      this.viewConsignorRecord = this.consignorServ.viewConsignorRecord ? this.consignorServ.viewConsignorRecord : this.consignorList[this.activeConsignor];
    //console.log(this.viewConsignorRecord);
    this.getIndex()
    this.changeconsignorView(this.viewConsignorRecord, this.activeConsignor)
    }).catch((err:any)=>{
      //console.log(err);
      if(err){
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
      }
    });
  }
  getSortList() {
    this.consignorServ.getSortLits().then(res=>{
      //console.log(res);
      this.sortList = res
        })
  }
  sortByValue(sortValue:any){
    //console.log(sortValue);
    this.sortCode = sortValue;
    this.consignorServ.searchConsignorBySort('', this.sortCode,this.pageNumber,this.pageSize).then(res=>{
      //console.log(res);
      this.consignorList =  res.data;
      this.viewConsignorRecord = this.consignorList[this.activeConsignor];
    }).catch((err:any)=>{
      //console.log(err);
      if(err){
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
      }
    });
    }
  filteredUsersList(event:any){
    //console.log(event.target.value);
    this.searchValue = event.target.value;
    if(event.target.value.length > 1){
      this.activeConsignor = 0;
      this.consignorServ.searchConsignorBySort(event.target.value, '',this.pageNumber,this.pageSize).then(res=>{
        //console.log(res);
        this.consignorList = res;
        this.viewConsignorRecord = this.consignorList[this.activeConsignor];
      }).catch((err:any)=>{
        //console.log(err);
        if(err){
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
        }
      });
    }else {
      this.getConsignorList();
    }
  }

  deleteConsignor(){

    // let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
    //   width: '480px',
    //   height: 'auto',
    //   data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this Consignor ?', title: 'Are you sure?' },
    //   disableClose: true,
    //   autoFocus: false,
    //   panelClass: 'custom-msg-box'
    // })
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.consignorServ.consignorList.splice(this.viewConsignorRecord.viewUserId, 1);
        
    //     // this.router.navigateByUrl('/home/users/list')
    //     this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Consignor deleted successfully.' })
    //     this.back()
    //   }
    // })
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '505px',
      height: 'auto',
      data: {title: 'Remove consignor', 
             message: 'Do you wish to remove the consignor? All the consignor data will be deleted and cannot be restored again.', 
             value:this.viewConsignorRecord.consignorName,
             placeholder:'Enter the consignor Name'},
      disableClose: true,
      autoFocus: false,
      panelClass: 'deletePopup'
    })
    dialogRef.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        this.consignorServ.deleteConsignorById(this.viewConsignorRecord.consignorID).then(res=>{
          //console.log(res);
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Consignor removed successfully.' })
        this.back()
        }).catch((err:any)=>{
          //console.log(err);
          if(err){
            this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Internal server error!' });
          }
        });
      }
    })
   
  }

}
