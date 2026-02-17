import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SupplierService } from '../../supplier.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-supplier-view',
  templateUrl: './supplier-view.component.html',
  styleUrls: ['./supplier-view.component.css']
})
export class SupplierViewComponent implements OnInit {

  supplierList:any | any[] = []
  activeSupplier :any
  viewSupplierRecord:any | any[] = []
  viewMode:any = 'Overview'
  sortByText:any = 'All'
  intakeList:any | any[] = []
  summaryList:any | any[] = []
logedInUser:any
  permissions: any;
  constructor(public supplierServ:SupplierService, public routes:Router , public dialog:MatDialog,public utilSer:UtilityService, public location:Location) { }
  ngOnDestroy(): void {
    // this.supplierServ.editsupplierRecord = null
  }

  ngOnInit(): void {

     let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
this.permissions = this.supplierServ.permissions;
    this.supplierList = this.supplierServ.supplierList
    //console.log(this.supplierList);
    
    this.activeSupplier =  this.supplierServ.viewSupplierIndex
    //console.log(this.activeSupplier);
    this.viewSupplierRecord = this.supplierList[this.supplierServ.viewSupplierIndex]
    //console.log(this.viewSupplierRecord);

    this.intakeList = this.supplierServ.intakeSheetList
    this.summaryList = this.supplierServ.summaryTabelList
  }

  changesupplierView(index:any){
    this.activeSupplier = index
    this.supplierServ.viewSupplierIndex = index
    this.viewSupplierRecord = this.supplierList[index]
    //console.log(this.viewSupplierRecord);
    
  }

  editSupplier(){
    //console.log('alfklajf');
    
    this.supplierServ.editSupplierRecord = this.viewSupplierRecord
    this.routes.navigateByUrl('/home/supplier/addEditSupplier')
  }

  back(){
    this.location.back()
  }

  changeView(value:any){
    this.viewMode= value

  }


  filteredUsersList(event:any){

  }

  deleteSupplier(){

    // let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
    //   width: '480px',
    //   height: 'auto',
    //   data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this Supplier ?', title: 'Are you sure?' },
    //   disableClose: true,
    //   autoFocus: false,
    //   panelClass: 'custom-msg-box'
    // })
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.supplierServ.supplierList.splice(this.viewSupplierRecord.viewUserId, 1);
        
    //     // this.router.navigateByUrl('/home/users/list')
    //     this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Supplier deleted successfully.' })
    //     this.back()
    //   }
    // })
    //console.log('s;ljfaksjfasj');
    
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '505px',
      height: 'auto',
      data: {title: 'Remove supplier', 
             message: 'Do you wish to remove the supplier? All the supplier data will be deleted and cannot be restored again.', 
             value:this.viewSupplierRecord.supplierName,
             placeholder:'Enter the supplier name'},
      disableClose: true,
      autoFocus: false,
      panelClass: 'deletePopup'
    })
    dialogRef.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        this.supplierServ.supplierList.splice(this.viewSupplierRecord.viewUserId, 1); // delete Your record
        this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Supplier removed successfully.'})
      this.back()
      }
    })
   
  }


  deleteSupplierList(index?:any){
    
    let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
      width: '480px',
      height: 'auto',
      data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this order ?', title: 'Remove order ?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.supplierServ.supplierList.splice(this.viewSupplierRecord.viewUserId, 1); // delete Your record
        this.supplierList =  this.supplierServ.supplierList

    
    this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Order deleted successfully' });
      }
    })
  }

  changeSortBY(value:any){
    this.sortByText = value
  }

}
