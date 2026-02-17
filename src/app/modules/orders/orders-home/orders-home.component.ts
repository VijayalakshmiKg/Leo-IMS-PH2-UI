import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdersService } from '../orders.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { PageEvent } from '@angular/material/paginator';
import { TasksService } from '../../tasks/tasks.service';

@Component({
  selector: 'app-orders-home',
  templateUrl: './orders-home.component.html',
  styleUrls: ['./orders-home.component.css']
})
export class OrdersHomeComponent implements OnInit,OnDestroy {

    ordersList:any | any[] = []
    sortList: any[] = [{name:'Oldest to Latest',element:'oldest first'}, {name:'Latest to Oldest',element:'newest first'},{name:'z-a',element:'z-a'},{name:'a-z',element:'a-z'}];
    // status = 'Status'
    orderKeys:any | any[] =[ 
      "CheckBox",
      "Collection date",
      "Mov Doc No.",
      "Supplier",
      "Consignee",
      "Vehicle",
      "Trailer",
      "Driver",
      "Product",
      "Pickup trailer no",
      "Product quantity",
      // "Time tipped",
      // "Net weight",
      // "Shunter driver",
      // "Bin no",
      // "Ticket no",
      // "Mov Doc No.",
      // "Operator",
      // "Quantity",
      "Progress",
      "more"]

 
    

    logedInUser:any | any[] = []
    status:any | any[] = []

    sort:any= 'Newest to Oldest date'
    filter:string = '';
  sortByName:string = 'Status';
  intervalId:any

  length = 10; // Total items
  pageSize = 10; // Items per page
  pageNumber = 1; // page  number
  currentPage = 1; // Default first page
  totalPages = Math.ceil(this.length / this.pageSize); // Total pages
  permissions: any;
  ngOnInit(): void {
    sessionStorage.setItem('refreshed', 'false');

    //console.log(this.orderserv.ordersList);
    // this.ordersList = this.orderserv.ordersList
    // this.orderKeys = Object.keys(this.ordersList[0]);
this.ordersList = this.orderserv.ordersList
    //console.log(this.orderKeys);
    
    let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
    for(var i=0;i<parsedData.rootMenu.length;i++){
if(parsedData.rootMenu[i].rootMenuName.toLowerCase() == 'movement documents'){
  this.permissions = parsedData.rootMenu[i];
  this.orderserv.permissions = this.permissions
}
}
//console.log(this.permissions);


    this.utilServ.ordersAndTask.forEach((order:any) => {
      if (this.logedInUser == 'Transportation Manager' && order.Progress === "Assigned") {
        //console.log("Processing an assigned order:", order);
        this.ordersList.push(order)
        //console.log(this.ordersList);
        // Add your logic for "Assigned" status
      }
       if(this.logedInUser == 'Weighbridge operator' && order.Progress === "Weighed" ){
        //console.log("Processing an assigned order:", order);
 
        this.ordersList.push(order)
        //console.log(this.ordersList);
        
      }
       if(this.logedInUser == 'Plant Site Manager' &&( order.Progress === "Bin Assigned" || order.Progress === "Tipped" || order.Progress === 'Completed') ){
        //console.log("Processing an assigned order:", order);
 
        this.ordersList.push(order)
        //console.log(this.ordersList);
        
      }
       if((this.logedInUser == 'Production Manager' || this.logedInUser == 'Quality Manager') && (order.Progress === "Checked" || order.Progress === 'Completed') ){
        //console.log("Processing an assigned order:", order);
 
        this.ordersList.push(order)
        //console.log(this.ordersList);
        
      }
       
    });


  if(this.logedInUser == 'Weighbridge operator'){
    this.orderKeys = [
      // "CheckBox",
      "Collection date",
      "Mov Doc No.",
      "Supplier",
      "Consignee",
      "Vehicle",
      "Driver",
      "Trailer",
      // "Pickup trailer no",
      "Product",
      "Product quantity",
      // "Time tipped",
      "Net weight",
      // "Shunter driver",
      // "Bin no",
      "Ticket no",
      // "Mov Doc No.",
      "Operator",
      // "Quantity",
      "Progress",
      // "more"
  ]
  }
  else if(this.logedInUser == 'Plant Site Manager' || this.logedInUser ==  'Admin'){
    this.orderKeys = [
    //  "CheckBox",
     "Collection date",
      "Mov Doc No.",
      "Supplier",
      "Consignee",
      "Vehicle",
      "Driver",
      // "Pickup trailer no",
      "Trailer",
      "Product",
      "Product quantity",
      "Net weight",
      "Ticket no",
      "Shunter driver",
      "Bin no",
      // "Mov Doc No.",
      // "Operator",
      // "Quantity",
      // "Quality check",
      "Time tipped",
      "Progress",
      // "more"
  ]
  }
  else if(this.logedInUser == 'Transportation Manager'){
    this.orderKeys = [
      // "CheckBox",
      "Mov Doc No.",
      "Mov doc date",
      "Supplier",
      "Consignee",
      "Vehicle",
      "Trailer",
      "Driver",
      "Product",
      "Product quantity",
      "Pickup trailer no",
      // "Time tipped",
      // "Net weight",
      // "Shunter driver",
      // "Bin no",
      // "Ticket no",
      // "Mov Doc No.",
      // "Operator",
      // "Quantity",
      "Progress",
      // "more"
  ]
  }
  if(this.logedInUser == 'Production Manager' || this.logedInUser == 'Quality Manager'){
    this.orderKeys = [
      // "CheckBox",
      "Collection date",
      "Mov Doc No.",
      "Supplier",
      // "Consignee",
      "Vehicle",
      // "Pickup trailer no",
      "Trailer",
      "Driver",
      "Product",
      // "Product quantity",
      "Time tipped",
      "Net weight",
      "Shunter driver",
      "Bin no",
      // "Ticket no",
      // "Mov Doc No.",
      // "Operator",
      // "Quantity",
      "Quality check",
      "Progress",
      // "more"
  ]
  }

 
  if(this.logedInUser == 'Weighbridge operator'){
    this.getAllWieghBridgeRecords()
    //console.log('kljij');
    
  }
  else if(this.logedInUser == 'Plant Site Manager'){
    this.getAllPlantSiteRecords()
    //console.log('kljij');

  }
  else if(this.logedInUser ==  'Admin'){
    this.getAllAdminRecords()
    //console.log('kljij');

  }
  else if(this.logedInUser == 'Quality Manager'){
    this.getAllQualityCheckRecords()
    //console.log('kljij');

  }
  else if(this.logedInUser == 'Transportation Manager'){
    this.getAllRecords()
    //console.log('kljij');


  }

  this.intervalId = setInterval(() => {
  if(this.logedInUser == 'Weighbridge operator'){
    this.getAllWieghBridgeRecords()
  }
  else if(this.logedInUser == 'Plant Site Manager'){
    this.getAllPlantSiteRecords()
  }
  else if(this.logedInUser ==  'Admin'){
    this.getAllAdminRecords()
  }
  else if(this.logedInUser == 'Quality Manager'){
    this.getAllQualityCheckRecords()
  }
  else if(this.logedInUser == 'Transportation Manager'){
    this.getAllRecords()
    //console.log('kljij');


  }
 },10000)
  this.getSortList()
  this.getStatus()
  }

  allTemplateId:any | any[] = []
  allChecked:Boolean =false

  constructor(public route:Router,public orderserv:OrdersService,public dialog:MatDialog, public utilServ:UtilityService,public taskServ:TasksService) {
   
  //console.log(this.filter,"filter");
  
   }

   onPageChange(event: PageEvent | any) {
    //console.log(event);
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
    this.totalPages = Math.ceil(event.length / event.pageSize);
    if(this.logedInUser == 'Weighbridge operator'){
      this.getAllWieghBridgeRecords()
    }
    else if(this.logedInUser == 'Plant Site Manager'){
      this.getAllPlantSiteRecords()
    }
    else if(this.logedInUser ==  'Admin'){
      this.getAllAdminRecords()
    }
    else if(this.logedInUser == 'Quality Manager'){
      this.getAllQualityCheckRecords()
    }
    else if(this.logedInUser == 'Transportation Manager'){
    this.getAllRecords()
    //console.log('kljij');


  }
  }

   ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null; // Avoid memory leaks
    }
  }

   

   getStatus(){
    this.orderserv.getAllStatus().then(res => {
      //console.log(res);
      if(res){
        this.status = res
      }
      
    })
   }

   getSortList() {
    this.utilServ.getSortLits().then((res: any) => {
      //console.log(res);
      this.sortList = res;
    })
  }

  sortByValue(code:any){
    this.sort = code
     if(this.logedInUser == 'Weighbridge operator'){
      this.getAllWieghBridgeRecords()
     }
     else if(this.logedInUser == 'Plant Site Manager'){
      this.getAllPlantSiteRecords()
     }
     else if(this.logedInUser ==  'Admin'){
      this.getAllAdminRecords()
     }
     else if(this.logedInUser == 'Quality Manager'){
      this.getAllQualityCheckRecords()
    }
     else if(this.logedInUser == 'Transportation Manager'){
    this.getAllRecords()
    //console.log('kljij');


  }
  }

  sortByValueOrders(code:any){
    this.filter = code;
    //console.log(code);
    this.sortByName = code
    //console.log(this.filter);
     if(this.logedInUser == 'Weighbridge operator'){
      this.getAllWieghBridgeRecords()
     }
     else if(this.logedInUser == 'Plant Site Manager'){
      this.getAllPlantSiteRecords()
     }
     else if(this.logedInUser ==  'Admin'){
      this.getAllAdminRecords()
     }
     else if(this.logedInUser == 'Quality Manager'){
      this.getAllQualityCheckRecords()
    }
     else if(this.logedInUser == 'Transportation Manager'){
    this.getAllRecords()
    //console.log('kljij');


  }
  }

  totalRecords : any

  getAllRecords(){
    //console.log(this.filter);
    let data = localStorage.getItem('userData');
    if (data) {
      //console.log(data);
      var parsed = JSON.parse(data)
     
    } else {
      console.error('No userData found in localStorage');
    }
    
    this.orderserv.getAllOrders(parsed.employeeId,this.filter,this.sort,this.pageNumber,this.pageSize).then(res => {
      //console.log(res);
      if(res)
      {
        this.totalPages = res.totalRecords
        this.ordersList =res.transportAssignmentModels
        this.totalPages = res.totalRecords
        this.totalRecords = res.totalRecords
        this.ordersList = this.ordersList.map((item:any) => ({ ...item, checked: false }));
        //console.log(this.ordersList);
        this.orderserv.ordersList = this.ordersList
      }
    })
   }

   getAllQualityCheckRecords(){
    //console.log(this.filter);
    let data = localStorage.getItem('userData');
    if (data) {
      //console.log(data);
      var parsed = JSON.parse(data)
     
    } else {
      console.error('No userData found in localStorage');
    }
    this.orderserv.getQualityCheckOrdersRecord(parsed.employeeId,this.sort,this.pageNumber,this.pageSize).then(res => {
      //console.log(res);
     if(res){
      this.totalPages = res.totalRecords
      this.ordersList =res.qualityCheckFormModels
      this.totalPages = res.totalRecords
      this.totalRecords = res.totalRecords

      this.ordersList = this.ordersList.map((item:any) => ({ ...item, checked: false }));
      //console.log(this.ordersList);
      this.orderserv.ordersList = this.ordersList
     }
    })
   }

   getAllWieghBridgeRecords(){
    let data = localStorage.getItem('userData');
    if (data) {
      //console.log(data);
      var parsed = JSON.parse(data)
     
    } else {
      console.error('No userData found in localStorage');
    }
    this.orderserv.getAllWeighbridgeRecords(parsed.employeeId,this.sort,this.filter,this.pageNumber,this.pageSize).then(res =>{
      //console.log(res);
    
      if(res){
      this.totalPages = res.totalRecords
      this.ordersList =res.getweighbridgedata
      this.totalPages = res.totalRecords
      this.totalRecords = res.totalRecords

      this.ordersList = this.ordersList.map((item:any) => ({ ...item, checked: false }));
      this.orderserv.ordersList = this.ordersList
    }
    })
   }

   getAllPlantSiteRecords(){
    let data = localStorage.getItem('userData');
    if (data) {
      //console.log(data);
      var parsed = JSON.parse(data)
     
    } else {
      console.error('No userData found in localStorage');
    }
    this.orderserv.getAllPlantSiteRecords(parsed.employeeId,this.sort,this.pageNumber,this.pageSize).then(res =>{
      //console.log(res);
      if(res){
        this.totalPages = res.totalRecords
      this.ordersList =res.plansiteManagerModels
      this.totalPages = res.totalRecords
      this.totalRecords = res.totalRecords

      this.ordersList = this.ordersList.map((item:any) => ({ ...item, checked: false }));
      this.orderserv.ordersList = this.ordersList
      }
    })
   }
   getAllAdminRecords(){
    let data = localStorage.getItem('userData');
    if (data) {
      //console.log(data);
      var parsed = JSON.parse(data)
     //console.log(parsed);
     
    } else {
      console.error('No userData found in localStorage');
    }
    this.orderserv.getAllAdminRecords(parsed.roleId,this.filter,this.sort,this.pageNumber,this.pageSize).then(res =>{
      //console.log(res);
      if(res){
        this.totalPages = res.totalRecords
      this.ordersList =res.transportAssignmentModels
      this.totalPages = res.totalRecords
      this.totalRecords = res.totalRecords

      this.ordersList = this.ordersList.map((item:any) => ({ ...item, checked: false }));
      this.orderserv.ordersList = this.ordersList
      }
    })
   }

   deleteTemplates(){
    this.orderserv.deleteOrderByOrderID(this.allTemplateId).then(res => {
      //console.log(res);
      if(res){
        this.getAllRecords()
        this.allTemplateId = []
        this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Movement document deleted successfully.' })
      }
    })
  }

  deleteParticularOrder(deleteId:any){
    this.orderserv.deleteOrderByOrderID([deleteId]).then(res => {
      //console.log(res);
      if(res){
        this.getAllRecords()
        this.allTemplateId = []
        this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Movement document deleted successfully.' })
      }
    })
  }

    // Function to toggle all checkboxes
    toggleAll() {
      this.ordersList = this.ordersList.map((item:any) => ({
        ...item,
        checked: this.allChecked
      }));
      this.getCheckedIds()
    }
  
    toggleParticular(event: MouseEvent) {
      event.stopPropagation(); // Stop the click from propagating to the <tr>
  
      // Debugging output for the whole list
      //console.log('Template List:', this.ordersList);
  
      // Step 1: Filter checked templates
      const checkedTemplates = this.ordersList.filter((template: any) => template.checked == true);
  
      // Debugging output for filtered templates
      //console.log('Checked Templates:', checkedTemplates);
  
      // Step 2: Map to get only the IDs
      const checkedIds = checkedTemplates.map((template: any) => template.orderID);
  
      // Debugging output for checked IDs
      //console.log('Checked IDs:', checkedIds);
  }

  // Function to update master checkbox state
 updateMasterCheckbox(event: MouseEvent | any) {
  event.stopPropagation(); // Stop the click from propagating to the <tr>

  this.allChecked = this.ordersList.every((item:any) => item.checked);
  this.getCheckedIds();
}


   // Function to get IDs of checked items
   getCheckedIds() {
    this.allTemplateId = this.ordersList
      .filter((item:any) => item.checked)
      .map((item:any) => item.orderID);
    //console.log(this.allTemplateId); // Output the array of checked IDs
  }


   toastMsg: string = '';
  toastColor: string = '';
  toastBackground: string = '';
  toastBorderColor: string = ''
  toasterDuration: number = 0;
  show: boolean = false;

  listenToast(data:any,text:any) {
    //console.log(data);
    
   
        this.toastMsg = text ;
        this.toastColor = '#FFF';
        this.toastBackground = ' #64748B';
        this.toastBorderColor = '#64748B';
        this.toasterDuration = 3000
        this.createToast()
      
  }

    //create a custom toast based on the BehaviorSubject 
    createToast() {
      let parentNode = document.querySelector('.notifies')
      let createNode: any;
      createNode = document.querySelector('.master-notification')?.cloneNode(true);
      createNode?.classList.add("notification");
      createNode.style.backgroundColor = this.toastBackground;
      createNode.style.border = '1px solid ' + this.toastBorderColor;
      createNode?.classList.remove('master-notification');
      let text: any = createNode?.querySelector('.notify-msg');
      text.textContent = this.toastMsg;
      text.style.color = this.toastColor
      createNode.querySelector('.close-icon i').classList.add('fa-solid', 'fa-xmark')
      createNode.classList.remove('hide-toast')
      createNode.classList.add('slide-in-slide-out')
      createNode.querySelector('.close-icon').addEventListener("click", function () {
        createNode.remove()
      })
      parentNode?.appendChild(createNode);
      setTimeout(() => {
        createNode.remove();
      }, this.toasterDuration);
    }



  filteredUsersList(event:any){

  }



  addOrders(){
    this.orderserv.orderNo = null
    this.orderserv.editOrdersRecord = null
    this.orderserv.viewOrdersIndex = null
    this.route.navigateByUrl('/home/orders/addOrders')
  }

  
  viewOrders(index:any,data:any | any[],event?:any)
  {
    event?.stopPropagation(); 
    //console.log(data?.['Order no']);
    this.orderserv.sort =this.sort
  this.orderserv.filter =this.filter
  this.orderserv.pageNumber =this.pageNumber
  this.orderserv.pageSize =this.pageSize
  this.orderserv.currentPage = this.currentPage
    
    //console.log(index);
    this.orderserv.viewOrdersIndex = index
    this.orderserv.editOrdersIndex = data?.["Order no"]
    this.route.navigateByUrl('/home/orders/viewOrders')

  }

  deleteOrdersList(index:any,id:any){


    this.orderserv.deleteOrderByOrderID(id).then(res => {
      //console.log(res);
      
    })





    let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
      width: '480px',
      height: 'auto',
      data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this  Movement document ?', title: 'Remove  Movement document ?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.ordersList.splice(index,1)
    
    this.utilServ.toaster.next({ type: customToaster.successToast, message: ' Movement document deleted successfully' });
      }
    })
  }

  editOrders(index:any,data:any){
    //console.log(index);
    //console.log(data);
    // this.orderserv.orderNo = null
    this.orderserv.editOrdersRecord = data[index]
    
    this.route.navigateByUrl('/home/orders/addOrders')
    if(data[index].qualityCheckID){
      this.taskServ.editTaskRecord = data[index]
      this.qualityTask()
    }
  }

  qualityTask() {
    this.route.navigate(['/home/tasks/qualityTask']);
  }

}
