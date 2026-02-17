import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ConsigneeService } from '../../consignee.service';
import { Location } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-consignee',
  templateUrl: './view-consignee.component.html',
  styleUrls: ['./view-consignee.component.css']
})
export class ViewConsigneeComponent implements OnInit {
  consigneeList:any | any[] = []
  activeConsignee :any
  viewConsigneeRecord:any | any[] = [];
  searchValue:any;
  pageNumber = 1
  length = 200; // Total items
  pageSize = 10; // Items per page
  currentPage = 1; // Default first page
  totalPages = Math.ceil(this.length / this.pageSize); // Total pages
  sortList: any[] = [];
  sortCode:any = 'A to Z';
  logedInUser:any
  permissions: any;

  constructor(public consigneeServ:ConsigneeService, public routes:Router , public dialog:MatDialog,public utilSer:UtilityService, public location:Location) { }
  ngOnDestroy(): void {
    // this.consigneeServ.editconsigneeRecord = null
  }

  ngOnInit(): void {
     let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
    this.permissions = this.consigneeServ.permissions;
    this.getConsigneeList();
    this.activeConsignee =  this.consigneeServ.viewConsigneeIndex ? this.consigneeServ.viewConsigneeIndex : 0;
    //console.log(this.activeConsignee);
    //console.log(this.viewConsigneeRecord);
  }

  clear(){
    this.searchValue = '';
    this.getConsigneeList();
  }
  getIndex() {
    for (let i = 0; i < this.consigneeList.length; i++) {
      if (this.consigneeList[i].consigneeID == this.viewConsigneeRecord.consigneeID) {
        //console.log(i);
        this.activeConsignee = i
      }
    }
  }
  changeconsigneeView(record: any, index:any){
    this.activeConsignee = index
    this.consigneeServ.viewConsigneeIndex = index
    this.viewConsigneeRecord = record;
    //console.log(this.viewConsigneeRecord);
    
  }

  editConsignee(){
    this.consigneeServ.editConsigneeRecord = this.viewConsigneeRecord
    this.routes.navigateByUrl('/home/consignee/addConsignee');
    this.consigneeServ.viewConsigneeRecord = null;
    this.getConsigneeList()
  }

  back(){
    this.location.back()
  }
  getConsigneeList() {
    this.consigneeServ.searchConsigneeBySort('',this.sortCode, this.pageNumber,this.pageSize).then(res => {
      //console.log(res);
      this.consigneeList = res.data;
      this.viewConsigneeRecord = this.consigneeServ.viewConsigneeRecord ? this.consigneeServ.viewConsigneeRecord : this.consigneeList[this.activeConsignee];
    //console.log(this.viewConsigneeRecord);
    this.getIndex()
    this.changeconsigneeView(this.viewConsigneeRecord, this.activeConsignee)
    })
  }
  onPageChange(event: PageEvent) {
    //console.log(event);
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.consigneeServ.searchConsigneeBySort('',this.sortCode, this.pageNumber,this.pageSize).then((res: any) => {
      //console.log(res);
      this.consigneeList = res.data;
    });
  }
  filteredUsersList(event:any){
    //console.log(event.target.value);
    this.searchValue = event.target.value;
    if(event.target.value.length > 1){
      this.activeConsignee = 0;
      this.consigneeServ.searchConsigneeBySort(event.target.value, this.sortCode, this.pageNumber,this.pageSize).then(res=>{
        //console.log(res);
        this.consigneeList = res.data;
        this.viewConsigneeRecord = this.consigneeList[this.activeConsignee];
      })
    }else {
      this.getConsigneeList();
    }
  }

  deleteConsignee(){

    // let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
    //   width: '480px',
    //   height: 'auto',
    //   data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this Consignee ?', title: 'Are you sure?' },
    //   disableClose: true,
    //   autoFocus: false,
    //   panelClass: 'custom-msg-box'
    // })
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.consigneeServ.consigneeList.splice(this.viewConsigneeRecord.viewUserId, 1);
        
    //     // this.router.navigateByUrl('/home/users/list')
    //     this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Consignee deleted successfully.' })
    //     this.back()
    //   }
    // })
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '505px',
      height: 'auto',
      data: {title: 'Remove consignee', 
             message: 'Do you wish to remove the consignee? All the consignee data will be deleted and cannot be restored again.', 
             value:this.viewConsigneeRecord.consigneeName,
             placeholder:'Enter the consignee Name'},
      disableClose: true,
      autoFocus: false,
      panelClass: 'deletePopup'
    })
    dialogRef.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        this.consigneeServ.deleteConsigneeById(this.viewConsigneeRecord.consigneeID).then(res=>{
          //console.log(res);
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Consignee removed successfully.' })
        this.back()
        })
      }
    })
   
  }


}
