import { Component, OnDestroy, OnInit } from '@angular/core';
import { TasksService } from '../tasks.service';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OrdersService } from '../../orders/orders.service';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-tasks-home',
  templateUrl: './tasks-home.component.html',
  styleUrls: ['./tasks-home.component.css']
})
export class TasksHomeComponent implements OnInit ,OnDestroy{
  tasksList:any;

  filteredTasksList:any | any[] = [];
  filterstatus:any;
  rowData:any;
  // columnDefs = [
    
  //   {headerName: '',  checkboxSelection: true, resizable: true,sortable: true,maxWidth: 50},
  //   {headerName: 'Order no', field: 'Order no', resizable: true, headerClass: 'custom-header-class',sortable: true,maxWidth: 100},
  //   {headerName: 'Collection date', field: 'Collection date', maxWidth: 150, resizable: true, },
  //   {headerName: 'Consignor', field: 'Consignor', resizable: true,maxWidth: 130},
  //   {headerName: 'Vehicle', field: 'Vehicle', resizable: true,maxWidth: 130},
  //   {headerName: 'Trailer', field: 'Trailer', resizable: true,sortable: true,maxWidth: 130},
  //   {headerName: 'Driver', field: 'Driver', resizable: true,sortable: true,maxWidth: 130},
  //   {headerName: 'Material', field: 'Material', resizable: true,sortable: true,maxWidth: 150},
  //   {headerName: 'Time tipped', field: 'Time tipped' , resizable: true,maxWidth: 150,sortable: true},
  //   {headerName: 'Net weight', field: 'Net weight', resizable: true,maxWidth: 150},
  //   {headerName: 'Ticket no', field: 'Ticket no', resizable: true,maxWidth:150},
  //   {headerName: 'Mov Doc No.', field: 'Mov Doc No.', resizable: true,maxWidth: 150},
  //   {headerName: 'Operator', resizable: true,maxWidth: 150},
  //   // {headerName: 'Progress', field: 'Progress', resizable: true,maxWidth: 110, cellClassRules: {
  //   //   'completed': (params: any) => params.value == 'In transit',
  //   //   'Inprogress': (params: any) => params.value == 'Weighed',
  //   //   'pending': (params: any) => params.value == 'Reached site',
  //   // }},
  //   {
  //     headerName: 'Progress',
  //     field: 'Progress',
  //     resizable: true,
  //     maxWidth: 160,
  //     cellClassRules: {
  //       'weighed': (params: any) => params.value == 'Weighed',
  //       'pending': (params: any) => params.value == 'Pending',
  //       'completed': (params: any) => params.value == 'Collected',
  //       'Inprogress': (params: any) => params.value == 'In transit',
  //       'ReachedSite': (params: any) => params.value == 'Reached Site',
  //     }
  //   },
   
  // ];

  logedInUser:any

  orderKeys:any | any[] =[ 
    "CheckBox",
    "Collection date",
    "Mov Doc No.",
    "Supplier",
    "Consignee",
    "Vehicle",
    "Trailer",
    "Driver",
    "Material",
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

    intervalId:any

    length = 200; // Total items
    pageSize = 10; // Items per page
    pageNumber = 1
    currentPage = 1; // Default first page
    totalPages = Math.ceil(this.length / this.pageSize); // Total pages
  permissions: any;

  constructor(public taskServ: TasksService, public route: Router,public utilServ:UtilityService,public ordersServ:OrdersService) { }

  ngOnInit(): void {
    sessionStorage.setItem('refreshed', 'false');
    this.tasksList = this.taskServ.taskList;
    this.rowData = this.taskServ.taskList
    // this.orderKeys = Object.keys(this.tasksList[0]);
    // this.filteredTasksList = [...this.tasksList];

    let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
for(var i=0;i<parsedData.rootMenu.length;i++){
if(parsedData.rootMenu[i].rootMenuName.toLowerCase() == 'movement documents'){
  this.permissions = parsedData.rootMenu[i];
  this.taskServ.permissions = this.permissions
}
}
//console.log(this.permissions);
    this.utilServ.ordersAndTask.forEach((order:any) => {
      // if (this.logedInUser == 'Transportation Manager' && order.Progress === "Assigned") {
      //   //console.log("Processing an assigned order:", order);
      //   this.filteredTasksList.push(order)
      //   //console.log(this.filteredTasksList);
       
      // }
       if(this.logedInUser == 'Weighbridge operator' && (order.Progress === "Collected" || order.Progress === "Material in-Transit" || order.Progress === "In Transit" || order.Progress === "Reached Site") ){
        //console.log("Processing an assigned order:", order);
 
        this.filteredTasksList.push(order)
        //console.log(this.filteredTasksList);
        
      }
       if(this.logedInUser == 'Plant Site Manager' && (order.Progress === "Collected" || order.Progress === "Material in-Transit" || order.Progress === "In Transit" || order.Progress === "Reached Site" ||  order.Progress === "Assigned" || order.Progress === "Weighed" || order.Progress === "Arrived") ){
        //console.log("Processing an assigned order:", order);
 
        this.filteredTasksList.push(order)
        //console.log(this.filteredTasksList);
        
      }
       if((this.logedInUser == 'Production Manager' || this.logedInUser == 'Quality Manager') && (order.Progress === "Collected" || order.Progress === "Material in-Transit" || order.Progress === "In Transit" || order.Progress === "Reached Site" ||  order.Progress === "Assigned" || order.Progress === "Weighed" || order.Progress === "Arrived" || order.Progress === "Bin Assigned" || order.Progress === "Tipped" ) ){
        //console.log("Processing an assigned order:", order);
 
        this.filteredTasksList.push(order)
        //console.log(this.filteredTasksList);
        
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
        "Trailer",
        "Driver",
        // "Pickup trailer no",
        "Product",
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
        "more"
    ]
    }
    else if(this.logedInUser == 'Plant Site Manager'){
      this.orderKeys = [
        // "CheckBox",
        "Collection date",
        "Mov Doc No.",
        "Supplier",
        "Consignee",
        "Vehicle",
        "Driver",
        "Trailer",
      //  "Pickup trailer no",
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
        "more"
    ]
    }
    else if(this.logedInUser == 'Transportation Manager'){
      this.orderKeys = [
        "CheckBox",
        "Collection date",
        "Mov Doc No.",
        "Supplier",
        "Consignee",
        "Vehicle",
        "Pickup trailer no",
        "Trailer",
        "Driver",
        "Product",
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
        "more"
    ]
    }
    if(this.logedInUser == 'Production Manager' || this.logedInUser == 'Quality Manager'){
      this.orderKeys = [
        // "CheckBox",
        "Collection date",
        "Mov Doc No.",
        "Supplier",
        "Consignee",
        "Vehicle",
        "Pickup trailer no",
        "Trailer",
        "Driver",
        "Product",
        "Product quantity",
        // "Time tipped",
        "Net weight",
        "Shunter driver",
        "Bin no",
        // "Ticket no",
        // "Mov Doc No.",
        // "Operator",
        // "Quantity",
        "Quality check",
        "Progress",
        "more"
    ]
    }

    this.getStatus()
    this.getSortList()
this.filteredTasksList = this.taskServ.taskList

    this.getAllTask()

    this.intervalId =  setInterval(() => {
    this.getAllTask()
    },10000)

    
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null; // Avoid memory leaks
    }
  }

  onPageChange(event: PageEvent) {
    //console.log(event);
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
    this.totalPages = Math.ceil(event.length / event.pageSize);
    this.getAllTask()
  }

  status:any | any[] = []

  getStatus(){
    this.taskServ.getAllStatus().then(res => {
      //console.log(res);
      if(res){
        this.status = res
      }
      
    })
   }

   sortList:any | any[] = []
   getSortList() {
    this.utilServ.getSortLits().then((res: any) => {
      //console.log(res);
      this.sortList = res;
    })
  }

  sort:any = 'Newest to Oldest date'
  sortByValue(code:any){
    this.sort = code
    this.getAllTask()
  }

  filter:any = ''
  sortByName:any = 'Status'
  sortByValueOrders(code:any){
    this.filter = code;
    //console.log(code);
    this.sortByName = code
    //console.log(this.filter);
    this.getAllTask()
  }

  getAllTask(){
    let roleRecord:any | any[] = localStorage.getItem('userData')
    let role :any | any[] = JSON.parse(roleRecord)
    //console.log();
    // if(this.logedInUser == 'Weighbridge operator'){
      this.taskServ.getAllWeighBridgeManagerTasks(role.roleId,this.sort,this.filter,this.pageNumber,this.pageSize).then(res => {
        //console.log(res);
        if(res){
          this.totalPages = res.totalRecords
          this.filteredTasksList = res.transportAssignmentModels
          this.totalPages = res.totalRecords
      this.filteredTasksList = this.filteredTasksList.map((item:any) => ({ ...item, checked: false }));
      this.taskServ.taskList = this.filteredTasksList
      //console.log(this.filteredTasksList);
      

        }
      })
    // }
  }




  toastMsg: string = '';
  toastColor: string = '';
  toastBackground: string = '';
  toastBorderColor: string = ''
  toasterDuration: number = 0;
  show: boolean = false;

  listenToast(data:any,text:any) {
    //console.log(data,'listenToast');
    
   
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

  viewOrders(index:any,data:any){
    //console.log(data);
    //console.log(this.currentPage);
    
    //console.log(index);

    if(data.status == 'Material verified' && this.logedInUser == 'Plant Site Manager'){
      this.taskServ.sort = this.sort
      this.taskServ.filter = this.filter
      this.taskServ.pageNumber = this.pageNumber
      this.taskServ.pageSize = this.pageSize
      this.taskServ.viewTasksIndex = index
      this.taskServ.editTaskRecord = data
      this.taskServ.currentPage = this.currentPage
      this.route.navigateByUrl('/home/tasks/viewTasks')
    }
    else{
      if(this.logedInUser == 'Weighbridge operator' && data.status === 'Load arrived'){
        this.tasksList.viewOrdersIndex = index
        this.taskServ.editTaskRecord = data
        this.route.navigateByUrl('/home/tasks/addTasks')
      }
      if(this.logedInUser == 'Plant Site Manager' && (data.status === 'Material arrived' || data.status === 'Material Delivered' || data.status === 'Material delivered')){
        this.tasksList.viewOrdersIndex = index
        this.taskServ.editTaskRecord = data
        this.route.navigateByUrl('/home/tasks/addTasks')
      }
      if(this.logedInUser == 'Quality Manager' && data.status === 'Tipped'){
        this.tasksList.viewOrdersIndex = index
        this.taskServ.editTaskRecord = data
        // this.route.navigateByUrl('/home/orders/addOrders')
        this.qualityTask()
      }
    }

    // this.ordersServ.orderNo = data[index]["Order no"]

  

  }

      // Status Filter Method
      filterStatus(status: string) {
        this.filterstatus = status
        if (!this.filterstatus) {
            this.filteredTasksList = [...this.tasksList];
        } else {
            this.filteredTasksList = this.tasksList.filter((order:any) => order.Progress === this.filterstatus);
        }
    }

    // route functionality
    // onRowClicked(event: any) {
    //   const rowData = event.data; // Get the data of the clicked row
    //   this.route.navigate(['/home/orders/addOrders'], { queryParams: { id: rowData.id } });
    // }

    qualityTask() {
      this.route.navigate(['/home/tasks/qualityTask']);
    }

    allChecked:boolean = false
     // Function to toggle all checkboxes
     toggleAll() {
      this.filteredTasksList = this.filteredTasksList.map((item:any) => ({
        ...item,
        checked: this.allChecked
      }));
      this.getCheckedIds()
      //console.log(this.filteredTasksList);
      
    }

    allTemplateId:any | any[] = []

    getCheckedIds() {
      this.allTemplateId = this.filteredTasksList
        .filter((item:any) => item.checked)
        .map((item:any) => item.orderID);
      //console.log(this.allTemplateId); // Output the array of checked IDs
    }
  
      // Function to update master checkbox state
 updateMasterCheckbox(event: MouseEvent | any,data:any) {
  //console.log(data);
  
  event.stopPropagation(); // Stop the click from propagating to the <tr>

  this.allChecked = this.filteredTasksList.every((item:any) => item.checked);
  this.getCheckedIds();
}

toggleParticular(event: MouseEvent | any,data:any) {
  //console.log(data);
  
  event.stopPropagation(); // Stop the click from propagating to the <tr>

  // Debugging output for the whole list
  //console.log('Template List:', this.filteredTasksList);

  // Step 1: Filter checked templates
  const checkedTemplates = this.filteredTasksList.filter((template: any) => template.checked == true);

  // Debugging output for filtered templates
  //console.log('Checked Templates:', checkedTemplates);

  // Step 2: Map to get only the IDs
  const checkedIds = checkedTemplates.map((template: any) => template.orderID);

  // Debugging output for checked IDs
  //console.log('Checked IDs:', checkedIds);
}

}
