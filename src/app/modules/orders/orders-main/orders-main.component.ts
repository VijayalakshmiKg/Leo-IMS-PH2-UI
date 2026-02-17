import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-orders-main',
  templateUrl: './orders-main.component.html',
  styleUrls: ['./orders-main.component.css']
})
export class OrdersMainComponent implements OnInit {

  logedInUser:any
  filteredOrders: any | any[] = [];
 constructor(public utility:UtilityService) {

   let user:any = localStorage.getItem('loggedInUser')

   let parsedData = JSON.parse(user)
   this.logedInUser = parsedData?.roleName
   //console.log(parsedData);


   let status :any = 'Pending'
//     if(this.logedInUser == 'Transportation Manager'){
//       status = 'Assigned'
//     }
//     else if(this.logedInUser== 'Weighbridge operator'){
//  status = 'Weighed'
//     }
//     else if(this.logedInUser == 'Plant Site Manager'){
//       status = 'Bin assigned'
//     }




   this.utility.ordersAndTask.forEach((order:any) => {
     if (this.logedInUser == 'Transportation Manager' && order.Progress === "Assigned") {
       //console.log("Processing an assigned order:", order);
       this.filteredOrders.push(order)
       //console.log(this.filteredOrders);
       // Add your logic for "Assigned" status
     }
      if(this.logedInUser == 'Transportation Manager' && (order.Progress === "Assigned" || order.Progress === "Weighed")){
       //console.log("Processing an assigned order:", order);

       this.filteredOrders.push(order)
       //console.log(this.filteredOrders);
       
     }
      else if (order.Progress === "Weighed") {
       //console.log("Processing a weighed order:", order);
       // Add your logic for "Weighed" status
     } else if (order.Progress === "Bin Assigned") {
       //console.log("Processing a bin-assigned order:", order);
       // Add your logic for "Bin Assigned" status
     } else if (order.Progress === "Checked") {
       //console.log("Processing a checked order:", order);
       // Add your logic for "Checked" status
     } else if (order.Progress === "Collected") {
       //console.log("Processing a collected order:", order);
       // Add your logic for "Collected" status
     } else if (order.Progress === "In Transit") {
       //console.log("Processing an in-transit order:", order);
       // Add your logic for "In Transit" status
     } else {
       //console.log("Unhandled order status:", order.Progress);
       // Add fallback logic for unhandled statuses
     }
   });
   
  }

 ngOnInit(): void {
 }

}
