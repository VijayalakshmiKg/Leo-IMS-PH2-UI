import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OrdersService } from '../../orders.service';
import { map } from 'rxjs/operators';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { DocumentViewerComponent } from 'src/app/shared/components/document-viewer/document-viewer.component';
import { PageEvent } from '@angular/material/paginator';
import { TasksService } from 'src/app/modules/tasks/tasks.service';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class ViewOrdersComponent implements OnInit {

  ordersList: any | any[] = []
  activeOrders: any
  viewOrdersRecord: any | any[] = []
  viewMode: any = 'order details'
  selectedOption: string = 'Supplier';
  logedInUser: any
  totalPages: any = 100
  length = 10; // Total items
  pageSize = 10; // Items per page
  pageNumber = 1; // page  number
  currentPage = 1; // Default first page
  permissions: any;
  constructor(public ordersServ: OrdersService, public routes: Router, public dialog: MatDialog, public utilSer: UtilityService, public location: Location, public taskSer: TasksService) { }
  ngOnDestroy(): void {
    // this.ordersServ.editordersRecord = null
  }

  ngOnInit(): void {
    this.getStatus()
    this.getSortList()
    // this.ordersList = this.ordersServ.getOrders()


    let user: any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
    this.permissions = this.ordersServ.permissions;
//console.log(this.permissions);


    this.utilSer.ordersAndTask.forEach((order: any) => {
      if (this.logedInUser == 'Transportation Manager' && order.Progress === "Assigned") {
        //console.log("Processing an assigned order:", order);
        this.ordersList.push(order)
        //console.log(this.ordersList);
        // Add your logic for "Assigned" status
      }
      if (this.logedInUser == 'Weighbridge operator' && order.Progress === "Weighed") {
        //console.log("Processing an assigned order:", order);

        this.ordersList.push(order)
        //console.log(this.ordersList);

      }
      if (this.logedInUser == 'Plant Site Manager' && order.Progress === "Bin Assigned") {
        //console.log("Processing an assigned order:", order);

        this.ordersList.push(order)
        //console.log(this.ordersList);

      }
      if ((this.logedInUser == 'Production Manager' || this.logedInUser == 'Quality Manager') && order.Progress === "Checked") {
        //console.log("Processing an assigned order:", order);

        this.ordersList.push(order)
        //console.log(this.ordersList);

      }
    })

    //console.log(this.ordersList);
    this.activeOrders = this.ordersServ.viewOrdersIndex ? this.ordersServ.viewOrdersIndex : 0;
    //console.log(this.activeOrders);
    this.viewOrdersRecord = this.ordersList[this.ordersServ.viewOrdersIndex]
    //console.log(this.viewOrdersRecord);

    this.sortCode = this.ordersServ.sort
    this.filter = this.ordersServ.filter
    this.pageNumber = this.ordersServ.pageNumber
    this.currentPage = this.ordersServ.pageNumber
    this.pageSize = this.ordersServ.pageSize

    if (this.logedInUser == 'Weighbridge operator') {
      this.getAllWieghBridgeRecords()
    }
    else if (this.logedInUser == 'Plant Site Manager') {
      this.getAllPlantSiteRecords()
    }
    else if (this.logedInUser == 'Admin') {
      this.getAllAdminRecords()
    }
    else if (this.logedInUser == 'Quality Manager') {
      this.getAllQualityCheckRecords()
    }
    else if (this.logedInUser == 'Transportation Manager') {
      this.getAllRecords()
    }



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
    if (this.logedInUser == 'Weighbridge operator') {
      this.getAllWieghBridgeRecords()
    }
    else if (this.logedInUser == 'Plant Site Manager') {
      this.getAllPlantSiteRecords()
    }
    else if (this.logedInUser == 'Admin') {
      this.getAllAdminRecords()
    }
    else if (this.logedInUser == 'Quality Manager') {
      this.getAllQualityCheckRecords()
    }
    else if (this.logedInUser == 'Transportation Manager') {
      this.getAllRecords()

    }
  }


  onPageChange(event: PageEvent | any) {
    //console.log(event);
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
    this.totalPages = Math.ceil(event.length / event.pageSize);
    if (this.logedInUser == 'Weighbridge operator') {
      this.getAllWieghBridgeRecords()
    }
    else if (this.logedInUser == 'Plant Site Manager') {
      this.getAllPlantSiteRecords()
    }
    else if (this.logedInUser == 'Admin') {
      this.getAllAdminRecords()
    }
    else if (this.logedInUser == 'Quality Manager') {
      this.getAllQualityCheckRecords()
    }
    else if (this.logedInUser == 'Quality Manager') {
      this.getAllQualityCheckRecords()
    }
    else if (this.logedInUser == 'Transportation Manager') {
      this.getAllRecords()

    }
  }


  // Function to get IDs of checked items
  getCheckedIds() {
    this.allOrderId = this.ordersList
      .filter((item: any) => item.checked)
      .map((item: any) => item.orderID);
    //console.log(this.allOrderId); // Output the array of checked IDs
    //console.log(this.allChecked); // Output the array of checked IDs
  }

  getAllRecords() {
    let data = localStorage.getItem('userData');
    if (data) {
      //console.log(data);
      var parsed = JSON.parse(data)

    } else {
      console.error('No userData found in localStorage');
    }
    this.ordersServ.getAllOrders(parsed.employeeId, this.filter, this.sortCode, this.pageNumber, this.pageSize).then(res => {
      //console.log(res);
      if (res) {
        this.totalPages = res.totalRecords
        this.ordersList = res.transportAssignmentModels
        this.ordersList = this.ordersList.map((item: any) => ({ ...item, checked: false }));
        this.activeOrders = this.ordersServ.viewOrdersIndex ? this.ordersServ.viewOrdersIndex : 0
        //console.log(this.activeOrders);
        //console.log(this.ordersList);
        //console.log(this.ordersServ.viewOrdersIndex);

        this.viewOrdersRecord = this.activeOrders ? this.ordersList[this.activeOrders] : this.ordersList[0];
        //console.log(this.viewOrdersRecord);
        this.documentsFromDriverApp()

      }
    })
  }

  getAllQualityCheckRecords() {
    //console.log(this.filter);
    let data = localStorage.getItem('userData');
    if (data) {
      //console.log(data);
      var parsed = JSON.parse(data)

    } else {
      console.error('No userData found in localStorage');
    }
    this.ordersServ.getQualityCheckOrdersRecord(parsed.employeeId, this.filter, this.pageNumber, this.pageSize).then(res => {
      //console.log(res);
      if (res) {
        this.totalPages = res.totalRecords
        this.ordersList = res.qualityCheckFormModels
        this.totalPages = res.totalRecords
        this.ordersList = this.ordersList.map((item: any) => ({ ...item, checked: false }));
        //console.log(this.ordersList);
        this.viewOrdersRecord = this.ordersList[this.ordersServ.viewOrdersIndex || 0]

        this.ordersServ.ordersList = this.ordersList
        this.documentsFromDriverApp()

      }
    })
  }

  getAllWieghBridgeRecords() {
    //console.log('slfjksjfkasjf');

    let data = localStorage.getItem('userData');
    if (data) {
      //console.log(data);
      var parsed = JSON.parse(data)

    } else {
      console.error('No userData found in localStorage');
    }
    this.ordersServ.getAllWeighbridgeRecords(parsed.employeeId, this.sortCode, this.filter, this.pageNumber, this.pageSize).then(res => {
      //console.log(res);
      this.totalPages = res.totalRecords
      this.ordersList = res.getweighbridgedata
      this.ordersList = this.ordersList.map((item: any) => ({ ...item, checked: false }));
      this.activeOrders = this.ordersServ.viewOrdersIndex
      //console.log(this.activeOrders);
      this.viewOrdersRecord = this.ordersList[this.ordersServ.viewOrdersIndex || 0]
      //console.log(this.viewOrdersRecord);
      this.documentsFromDriverApp()

    })
  }

  getAllPlantSiteRecords() {
    //console.log('aslfdjaksjfdkaj');

    let data = localStorage.getItem('userData');
    if (data) {
      //console.log(data);
      var parsed = JSON.parse(data)

    } else {
      console.error('No userData found in localStorage');
    }
    this.ordersServ.getAllPlantSiteRecords(parsed.employeeId, this.sortCode, this.pageNumber, this.pageSize).then(res => {
      //console.log(res);
      this.totalPages = res.totalRecords
      this.ordersList = res.plansiteManagerModels
      this.ordersList = this.ordersList.map((item: any) => ({ ...item, checked: false }));
      this.activeOrders = this.ordersServ.viewOrdersIndex
      //console.log(this.activeOrders);
      this.viewOrdersRecord = this.ordersList[this.ordersServ.viewOrdersIndex || 0]
      //console.log(this.viewOrdersRecord);
      this.documentsFromDriverApp()

    })
  }
  getAllAdminRecords() {
    //console.log('aslfdjaksjfdkaj');

    let data = localStorage.getItem('userData');
    if (data) {
      //console.log(data);
      var parsed = JSON.parse(data)

    } else {
      console.error('No userData found in localStorage');
    }
    this.ordersServ.getAllAdminRecords(parsed.roleId, this.filter, this.sortCode, this.pageNumber, this.pageSize).then(res => {
      //console.log(res);
      this.totalPages = res.totalRecords
      this.ordersList = res.transportAssignmentModels
      this.ordersList = this.ordersList.map((item: any) => ({ ...item, checked: false }));
      this.activeOrders = this.ordersServ.viewOrdersIndex
      //console.log(this.activeOrders);
      this.viewOrdersRecord = this.ordersList[this.ordersServ.viewOrdersIndex || 0]
      //console.log(this.viewOrdersRecord);
      this.documentsFromDriverApp()

    })
  }

  deleteTemplates() {
    this.ordersServ.deleteOrderByOrderID(this.allOrderId).then(res => {
      //console.log(res);
      if (res) {
        this.getAllRecords()
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
    if (this.logedInUser == 'Weighbridge operator') {
      this.getAllWieghBridgeRecords()
    }
    else if (this.logedInUser == 'Plant Site Manager') {
      this.getAllPlantSiteRecords()
    }
    else if (this.logedInUser == 'Admin') {
      this.getAllAdminRecords()
    }
    else if (this.logedInUser == 'Quality Manager') {
      this.getAllQualityCheckRecords()
    }
    
    else if (this.logedInUser == 'Transportation Manager') {
      this.getAllRecords()

    }
   
  }


  addOrders() {
    this.ordersServ.orderNo = null
    this.ordersServ.editOrdersRecord = null
    this.ordersServ.viewOrdersIndex = null
    this.routes.navigateByUrl('/home/orders/addOrders')
  }

  changeordersView(index: any) {
    this.activeOrders = index
    this.ordersServ.viewOrdersIndex = index
    this.viewOrdersRecord = this.ordersList[index]
    //console.log(this.viewOrdersRecord);
    this.documentsFromDriverApp()
  }

  editOrders() {
    this.ordersServ.orderNo = null
    //console.log(this.utilSer.ordersAndTask[this.ordersServ.editOrdersIndex - 1]);

    this.ordersServ.editOrdersRecord = this.viewOrdersRecord
    this.routes.navigateByUrl('/home/orders/addOrders')
    if (this.logedInUser == 'Quality Manager') {
      this.taskSer.editTaskRecord = this.viewOrdersRecord
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
    if (value == 'documents') {
    }
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
  viewFile(file: any) {
    //console.log(file);

    var dailogRef = this.dialog.open(DocumentViewerComponent, {
      width: '580px',
      height: '440px',
      data: file,
      disableClose: true,
      autoFocus: false,
      panelClass: 'document-viewer'
    })
  }

  docList: any | any[] = []
  supplierDocList: any | any[] = []
  consineeDocList: any | any[] = []

  documentsFromDriverApp() {
    this.ordersServ.getAllDocuments(this.viewOrdersRecord?.orderID, this.viewOrdersRecord?.driverID).then(res => {
      //console.log(res);
      if (res) {
        this.docList = res[0]
        this.supplierDocList = res[0].driverSitestopDocs
        this.consineeDocList = res[0].driverFinishstopDocs
      }
    })
  }

}
