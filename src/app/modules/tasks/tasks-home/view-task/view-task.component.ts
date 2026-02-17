import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { OrdersService } from 'src/app/modules/orders/orders.service';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { DocumentViewerComponent } from 'src/app/shared/components/document-viewer/document-viewer.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TasksService } from '../../tasks.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {

  ordersList: any | any[] = []
  activeOrders: any
  viewOrdersRecord: any | any[] = []
  viewMode: any = 'order details'
  selectedOption: string = 'Supplier';
  logedInUser:any
  totalPages:any = 100
  length = 10; // Total items
  pageSize = 10; // Items per page
  pageNumber = 1; // page  number
  currentPage = 1; // Default first page
  permissions: any;
  constructor(public ordersServ:OrdersService, public routes:Router , public dialog:MatDialog,public utilSer:UtilityService, public location:Location,public taskServ:TasksService) { }
  ngOnDestroy(): void {
    // this.ordersServ.editordersRecord = null
  }

  ngOnInit(): void {

    this.sort =  this.taskServ.sort
    this.filter =  this.taskServ.filter
    this.pageNumber =  this.taskServ.pageNumber
    this.currentPage =  this.taskServ.pageNumber
    this.pageSize =  this.taskServ.pageSize

    this.getStatus()
    this.getSortList()
    // this.ordersList = this.ordersServ.getOrders()


    let user: any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);

    this.permissions = this.taskServ.permissions;


    //console.log(this.ordersList);
    // this.activeOrders = this.taskServ.viewTasksIndex ? this.taskServ.viewTasksIndex : 0;
    // //console.log(this.activeOrders);
    // this.viewOrdersRecord = this.ordersList[this.activeOrders]
    this.pageNumber = this.taskServ.currentPage
    this.pageSize = this.taskServ.pageSize
    // this.totalPages = this.ordersServ.
    this.currentPage = this.taskServ.currentPage
    //console.log(this.currentPage);
    
    //console.log(this.viewOrdersRecord);

   
    // if (this.logedInUser == 'Plant Site Manager') {
      this.getAllTask()
    // }
  }

  sort:any
  getAllTask(){
    let roleRecord:any | any[] = localStorage.getItem('userData')
    let role :any | any[] = JSON.parse(roleRecord)
    //console.log();
    // if(this.logedInUser == 'Weighbridge operator'){
      this.taskServ.getAllWeighBridgeManagerTasks(role.roleId,this.sortCode,this.filter,this.pageNumber,this.pageSize).then(res => {
        //console.log(res);
        if(res){
          this.totalPages = res.totalRecords
          this.ordersList = res.transportAssignmentModels
          // this.ordersList = this.ordersList.map((item: any) => ({ ...item, checked: false }));
          this.activeOrders = this.taskServ.viewTasksIndex ? this.taskServ.viewTasksIndex : 0;
          //console.log(this.activeOrders);
          this.viewOrdersRecord = this.ordersList[this.activeOrders]
      //console.log(this.viewOrdersRecord);
      

        }
      })
    // }
  }

  signOff(){

     
    const dialogRef = this.dialog.open(CustomMessageBoxComponent, {
      width: '480px',
      height: 'auto',
      data: {
        type: messageBox.cancelMessageBox,
        message: 'Are you sure you want to sign off? If you continue, this movement document will be completed, and you cannot make any changes further to this movement document.',
        title: 'Sign off'
      },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    });

    dialogRef.afterClosed().subscribe(res => {
      //console.log(res);
      if(res){
        let roleRecord:any | any[] = localStorage.getItem('userData')
    let role :any | any[] = JSON.parse(roleRecord)
    this.taskServ.signOff(role.employeeId,this.viewOrdersRecord.orderID).then(res => {
      //console.log(res);
      if(res){
        this.utilSer.toaster.next({ type: customToaster.successToast, message: 'The movement document has been signed off successfully.' })
        this.location.back()
      }
    })
      }
    })

    
  }

  setOption(option: string) {
    this.selectedOption = option;
  }

  allOrderId: any | any[] = []
  allChecked: any | any[] = []

  // Function to update master checkbox state
  updateMasterCheckbox(event: MouseEvent | any) {
    event.stopPropagation(); // Stop the click from propagating to the <tr>

    this.allChecked = this.ordersList.every((item: any) => item.checked);
    this.getCheckedIds();
  }

  sortList: any | any[] = []

  getSortList() {
    this.utilSer.getSortLits().then((res: any) => {
      //console.log(res);
      this.sortList = res;
    })
  }
  sortCode: any = 'Newest to Oldest date'

  sortByValue(code: any) {
    this.sortCode = code
    this.getAllTask()
  }


  onPageChange(event: PageEvent | any) {
    //console.log(event);
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.getAllTask()
  }


  // Function to get IDs of checked items
  getCheckedIds() {
    this.allOrderId = this.ordersList
      .filter((item: any) => item.checked)
      .map((item: any) => item.orderID);
    //console.log(this.allOrderId); // Output the array of checked IDs
    //console.log(this.allChecked); // Output the array of checked IDs
  }

 

  deleteTemplates() {
    this.ordersServ.deleteOrderByOrderID(this.allOrderId).then(res => {
      //console.log(res);
      if (res) {
        this.getAllTask()
        this.allChecked = []
        this.allOrderId = []
        this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Order deleted successfully.' })
      }
    })
  }

  status: any | any[] = []

  getStatus() {
    this.ordersServ.getAllStatus().then(res => {
      //console.log(res);
      if (res) {
        this.status = res
      }

    })
  }

  filter: any = ''

  sortByValueOrders(code: any) {
    this.filter = code
   
      this.getAllTask()


  }


  addOrders() {
    this.ordersServ.orderNo = null
    this.ordersServ.editOrdersRecord = null
    this.taskServ.viewTasksIndex = null
    this.routes.navigateByUrl('/home/orders/addOrders')
  }

  changeordersView(index: any) {
    this.activeOrders = index
    this.taskServ.viewTasksIndex = index
    this.viewOrdersRecord = this.ordersList[index]
    //console.log(this.viewOrdersRecord);
  }

  editOrders() {
    this.ordersServ.orderNo = null
    //console.log(this.utilSer.ordersAndTask[this.ordersServ.editOrdersIndex - 1]);

    this.ordersServ.editOrdersRecord = this.viewOrdersRecord
    this.routes.navigateByUrl('/home/orders/addOrders')
    if(this.logedInUser == 'Quality Manager'){
      this.taskServ.editTaskRecord = this.viewOrdersRecord
      this.qualityTask()
    }
  }

  qualityTask() {
    this.routes.navigate(['/home/orders/qualityTask']);
  }

  back() {
    this.location.back()
  }

  changeView(value: any) {
    this.viewMode = value

  }


  filteredUsersList(event: any) {

  }

  deleteOrders() {

    // let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
    //   width: '480px',
    //   height: 'auto',
    //   data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this Orders ?', title: 'Are you sure?' },
    //   disableClose: true,
    //   autoFocus: false,
    //   panelClass: 'custom-msg-box'
    // })
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.ordersServ.ordersList.splice(this.viewOrdersRecord.viewUserId, 1);

    //     // this.router.navigateByUrl('/home/users/list')
    //     this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Orders deleted successfully.' })
    //     this.back()
    //   }
    // })
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '505px',
      height: 'auto',
      data: {
        title: 'Remove orders',
        message: 'Do you wish to remove the orders? All the orders data will be deleted and cannot be restored again.',
        value: this.viewOrdersRecord.ordersName,
        placeholder: 'Enter the orders Name'
      },
      disableClose: true,
      autoFocus: false,
      panelClass: 'deletePopup'
    })
    dialogRef.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        this.ordersServ.ordersList.splice(this.viewOrdersRecord.viewUserId, 1); // delete Your record
        this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Orders removed successfully.' })
        this.back()
      }
    })

  }


  deleteOrdersList(index?: any) {
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
        this.ordersServ.ordersList.splice(this.viewOrdersRecord.viewUserId, 1); // delete Your record

        this.ordersServ.deleteOrderByOrderID([this.viewOrdersRecord?.orderID]).then(res => {
          //console.log(res);
          if (res) {
            this.back()
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Order deleted successfully' });

          }
        })

        // this.ordersList =  this.ordersServ.ordersList


      }
    })
  }
  viewFile() {
    var dailogRef = this.dialog.open(DocumentViewerComponent, {
      width: '580px',
      height: '440px',
      data: this.viewOrdersRecord,
      disableClose: true,
      autoFocus: false,
      panelClass: 'document-viewer'
    })
  }
}
