import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  // don't remove the subjects beacause it's reponsible for all toast, loader and more

  //toaster
  toaster: Subject<{ type: number, message: string, duration?: number }> = new Subject();
  notificationToaster: Subject<{ message: string, duration?: number }> = new Subject();

  //loader
  isLoadingImg = new Subject<boolean>();


  unreadList: any[] = [
    // {message:'Driver Alex Venus has started collecting the order. You will get notifications regarding the order status.!', time:new Date(), read:false},
    // {message:'Driver Alex Venus has collected the order. Please ready for weighing.', time:new Date(), read:true},
    // {message:'Driver Alex Venus has reached the site. Please avail the shunter driver.!', time:new Date(), read:true},
    // {message:'Driver John Paul has finished the tipping. The bin is ready for quality checking.!', time:new Date(), read:false},
  ];
  allNotifications: any[] = [
    // {message:'Driver Alex Venus has started collecting the order. You will get notifications regarding the order status.!', time:new Date(), read:true},
    // {message:'Driver John Paul has finished the tipping. The bin is ready for quality checking.!', time:new Date(), read:true},
    // {message:'Driver Alex Venus has started collecting the order. You will get notifications regarding the order status.!', time:new Date(), read:true},
    // {message:'Driver Alex Venus has started collecting the order. You will get notifications regarding the order status.!', time:new Date(), read:true},
    // {message:'Driver John Paul has finished the tipping. The bin is ready for quality checking.!', time:new Date(), read:true},
    // {message:'New Vehicle added successfully', time:new Date(), read:true},
    // {message:'New Driver added successfully', time:new Date(), read:true},
    // {message:'New Material added successfully', time:new Date(), read:true},
    // {message:'New Vehicle added successfully', time:new Date(), read:true},
    // {message:'New Driver added successfully', time:new Date(), read:true},
  ];


  ordersAndTask: any | any[] = [
    //   {
    //     "CheckBox": false,
    //     "Order no": 1,
    //     "Collection date": new Date(),
    //     "Consignor": "Omega Proteins Ltd",
    //     "Consignee": "Leo Group Ltd",
    //     "Vehicle": "",
    //     "Trailer": "A123 4567",
    //     "Driver": "HannaBaker",
    //     "Material": "Processed Meat",
    //     "Time tipped": "",
    //     "Net weight": "",
    //     "Shunter driver": "",
    //     "Bin no": "",
    //     "Ticket no": "",
    //     "Mov doc no": "",
    //     "Operator": "",
    //     "Quantity": "2",
    //     "Progress": "Assigned",
    //     "totalFormData": {
    //         "orderDateAndTime": new Date(),
    //         "consigner": "Omega Proteins Ltd",
    //         "consignee": "Leo Group Ltd",
    //         "notes": "12312",
    //         "quantity": "2",
    //         "materialTYpe": "Processed Meat",
    //         "grossVolume": "",
    //         "description": "4234",
    //         "grossWeight": "",
    //         "grossDateTime": "",
    //         "tareWeight": "",
    //         "tareWeightDateTime": "",
    //         "temperature": "",
    //         "water": "",
    //         "totalWater": "",
    //         "netWater": "",
    //         "temperatureNotes": "",
    //         "shuntDriverName": "",
    //         "regNo": "",
    //         "vehicleType": "",
    //         "vehicleNo": "",
    //         "binNo": "",
    //         "binName": "",
    //         "pickupPoint": "",
    //         "infoShunterDriver": "",
    //         "driver": "HannaBaker",
    //         "vechile": {
    //             "vehicleNumber": "545454",
    //             "vehicleModel": "Toyota Camry",
    //             "vehicleMake": "Toyota",
    //             "vehicleType": "Sedan",
    //             "engineNumber": "221253345",
    //             "chassisNumber": "1313124",
    //             "trailerNumber": "00119"
    //         },
    //         "triler": "A123 4567"
    //     },
    //     "Quality check": "Pending",
    //     "more": ""
    // },
    //   {
    //     "CheckBox": false,
    //     "Order no": 2,
    //     "Collection date": new Date(),
    //     "Consignor": "Omega Proteins Ltd",
    //     "Consignee": "Leo Group Ltd",
    //     "Vehicle": "",
    //     "Trailer": "A123 4567",
    //     "Driver": "HannaBaker",
    //     "Material": "Processed Meat",
    //     "Time tipped": "",
    //     "Net weight": "",
    //     "Shunter driver": "",
    //     "Bin no": "",
    //     "Ticket no": "",
    //     "Mov doc no": "",
    //     "Operator": "",
    //     "Quantity": "2",
    //     "Progress": "Weighed",
    //     "totalFormData": {
    //         "orderDateAndTime": new Date(),
    //         "consigner": "Omega Proteins Ltd",
    //         "consignee": "Leo Group Ltd",
    //         "notes": "12312",
    //         "quantity": "2",
    //         "materialTYpe": "Processed Meat",
    //         "grossVolume": "",
    //         "description": "4234",
    //         "grossWeight": "",
    //         "grossDateTime": "",
    //         "tareWeight": "",
    //         "tareWeightDateTime": "",
    //         "temperature": "",
    //         "water": "",
    //         "totalWater": "",
    //         "netWater": "",
    //         "temperatureNotes": "",
    //         "shuntDriverName": "",
    //         "regNo": "",
    //         "vehicleType": "",
    //         "vehicleNo": "",
    //         "binNo": "",
    //         "binName": "",
    //         "pickupPoint": "",
    //         "infoShunterDriver": "",
    //         "driver": "HannaBaker",
    //         "vechile": {
    //             "vehicleNumber": "545454",
    //             "vehicleModel": "Toyota Camry",
    //             "vehicleMake": "Toyota",
    //             "vehicleType": "Sedan",
    //             "engineNumber": "221253345",
    //             "chassisNumber": "1313124",
    //             "trailerNumber": "00119"
    //         },
    //         "triler": "A123 4567"
    //     },
    //     "Quality check": "Pending",
    //     "more": ""
    // },
    //   {
    //     "CheckBox": false,
    //     "Order no": 3,
    //     "Collection date": new Date(),
    //     "Consignor": "Omega Proteins Ltd",
    //     "Consignee": "Leo Group Ltd",
    //     "Vehicle": "",
    //     "Trailer": "A123 4567",
    //     "Driver": "HannaBaker",
    //     "Material": "Processed Meat",
    //     "Time tipped": "",
    //     "Net weight": "",
    //     "Shunter driver": "",
    //     "Bin no": "",
    //     "Ticket no": "",
    //     "Mov doc no": "",
    //     "Operator": "",
    //     "Quantity": "2",
    //     "Progress": "Bin Assigned",
    //     "totalFormData": {
    //         "orderDateAndTime": new Date(),
    //         "consigner": "Omega Proteins Ltd",
    //         "consignee": "Leo Group Ltd",
    //         "notes": "12312",
    //         "quantity": "2",
    //         "materialTYpe": "Processed Meat",
    //         "grossVolume": "",
    //         "description": "4234",
    //         "grossWeight": "",
    //         "grossDateTime": "",
    //         "tareWeight": "",
    //         "tareWeightDateTime": "",
    //         "temperature": "",
    //         "water": "",
    //         "totalWater": "",
    //         "netWater": "",
    //         "temperatureNotes": "",
    //         "shuntDriverName": "",
    //         "regNo": "",
    //         "vehicleType": "",
    //         "vehicleNo": "",
    //         "binNo": "",
    //         "binName": "",
    //         "pickupPoint": "",
    //         "infoShunterDriver": "",
    //         "driver": "HannaBaker",
    //         "vechile": {
    //             "vehicleNumber": "545454",
    //             "vehicleModel": "Toyota Camry",
    //             "vehicleMake": "Toyota",
    //             "vehicleType": "Sedan",
    //             "engineNumber": "221253345",
    //             "chassisNumber": "1313124",
    //             "trailerNumber": "00119"
    //         },
    //         "triler": "A123 4567"
    //     },
    //     "Quality check": "Pending",
    //     "more": ""
    // },
    //   {
    //     "CheckBox": false,
    //     "Order no": 4,
    //     "Collection date": new Date(),
    //     "Consignor": "Omega Proteins Ltd",
    //     "Consignee": "Leo Group Ltd",
    //     "Vehicle": "",
    //     "Trailer": "A123 4567",
    //     "Driver": "HannaBaker",
    //     "Material": "Processed Meat",
    //     "Time tipped": "",
    //     "Net weight": "",
    //     "Shunter driver": "",
    //     "Bin no": "",
    //     "Ticket no": "",
    //     "Mov doc no": "",
    //     "Operator": "",
    //     "Quantity": "2",
    //     "Progress": "Checked",
    //     "totalFormData": {
    //         "orderDateAndTime": new Date(),
    //         "consigner": "Omega Proteins Ltd",
    //         "consignee": "Leo Group Ltd",
    //         "notes": "12312",
    //         "quantity": "2",
    //         "materialTYpe": "Processed Meat",
    //         "grossVolume": "",
    //         "description": "4234",
    //         "grossWeight": "",
    //         "grossDateTime": "",
    //         "tareWeight": "",
    //         "tareWeightDateTime": "",
    //         "temperature": "",
    //         "water": "",
    //         "totalWater": "",
    //         "netWater": "",
    //         "temperatureNotes": "",
    //         "shuntDriverName": "",
    //         "regNo": "",
    //         "vehicleType": "",
    //         "vehicleNo": "",
    //         "binNo": "",
    //         "binName": "",
    //         "pickupPoint": "",
    //         "infoShunterDriver": "",
    //         "driver": "HannaBaker",
    //         "vechile": {
    //             "vehicleNumber": "545454",
    //             "vehicleModel": "Toyota Camry",
    //             "vehicleMake": "Toyota",
    //             "vehicleType": "Sedan",
    //             "engineNumber": "221253345",
    //             "chassisNumber": "1313124",
    //             "trailerNumber": "00119"
    //         },
    //         "triler": "A123 4567"
    //     },
    //     "Quality check": "Pending",
    //     "more": ""
    // },
    //   {
    //     "CheckBox": false,
    //     "Order no": 5,
    //     "Collection date": new Date(),
    //     "Consignor": "Omega Proteins Ltd",
    //     "Consignee": "Leo Group Ltd",
    //     "Vehicle": "",
    //     "Trailer": "A123 4567",
    //     "Driver": "HannaBaker",
    //     "Material": "Processed Meat",
    //     "Time tipped": "",
    //     "Net weight": "",
    //     "Shunter driver": "",
    //     "Bin no": "",
    //     "Ticket no": "",
    //     "Mov doc no": "",
    //     "Operator": "",
    //     "Quantity": "2",
    //     "Progress": "Collected",
    //     "totalFormData": {
    //         "orderDateAndTime": new Date(),
    //         "consigner": "Omega Proteins Ltd",
    //         "consignee": "Leo Group Ltd",
    //         "notes": "12312",
    //         "quantity": "2",
    //         "materialTYpe": "Processed Meat",
    //         "grossVolume": "",
    //         "description": "4234",
    //         "grossWeight": "",
    //         "grossDateTime": "",
    //         "tareWeight": "",
    //         "tareWeightDateTime": "",
    //         "temperature": "",
    //         "water": "",
    //         "totalWater": "",
    //         "netWater": "",
    //         "temperatureNotes": "",
    //         "shuntDriverName": "",
    //         "regNo": "",
    //         "vehicleType": "",
    //         "vehicleNo": "",
    //         "binNo": "",
    //         "binName": "",
    //         "pickupPoint": "",
    //         "infoShunterDriver": "",
    //         "driver": "HannaBaker",
    //         "vechile": {
    //             "vehicleNumber": "545454",
    //             "vehicleModel": "Toyota Camry",
    //             "vehicleMake": "Toyota",
    //             "vehicleType": "Sedan",
    //             "engineNumber": "221253345",
    //             "chassisNumber": "1313124",
    //             "trailerNumber": "00119"
    //         },
    //         "triler": "A123 4567"
    //     },
    //     "Quality check": "Pending",
    //     "more": ""
    // },
    //   {
    //     "CheckBox": false,
    //     "Order no": 6,
    //     "Collection date": new Date(),
    //     "Consignor": "Omega Proteins Ltd",
    //     "Consignee": "Leo Group Ltd",
    //     "Vehicle": "",
    //     "Trailer": "A123 4567",
    //     "Driver": "HannaBaker",
    //     "Material": "Processed Meat",
    //     "Time tipped": "",
    //     "Net weight": "",
    //     "Shunter driver": "",
    //     "Bin no": "",
    //     "Ticket no": "",
    //     "Mov doc no": "",
    //     "Operator": "",
    //     "Quantity": "2",
    //     "Progress": "Material in-Transit",
    //     "totalFormData": {
    //         "orderDateAndTime": new Date(),
    //         "consigner": "Omega Proteins Ltd",
    //         "consignee": "Leo Group Ltd",
    //         "notes": "12312",
    //         "quantity": "2",
    //         "materialTYpe": "Processed Meat",
    //         "grossVolume": "",
    //         "description": "4234",
    //         "grossWeight": "",
    //         "grossDateTime": "",
    //         "tareWeight": "",
    //         "tareWeightDateTime": "",
    //         "temperature": "",
    //         "water": "",
    //         "totalWater": "",
    //         "netWater": "",
    //         "temperatureNotes": "",
    //         "shuntDriverName": "",
    //         "regNo": "",
    //         "vehicleType": "",
    //         "vehicleNo": "",
    //         "binNo": "",
    //         "binName": "",
    //         "pickupPoint": "",
    //         "infoShunterDriver": "",
    //         "driver": "HannaBaker",
    //         "vechile": {
    //             "vehicleNumber": "545454",
    //             "vehicleModel": "Toyota Camry",
    //             "vehicleMake": "Toyota",
    //             "vehicleType": "Sedan",
    //             "engineNumber": "221253345",
    //             "chassisNumber": "1313124",
    //             "trailerNumber": "00119"
    //         },
    //         "triler": "A123 4567"
    //     },
    //     "Quality check": "Pending",
    //     "more": ""
    // },
    //   {
    //     "CheckBox": false,
    //     "Order no": 7,
    //     "Collection date": new Date(),
    //     "Consignor": "Omega Proteins Ltd",
    //     "Consignee": "Leo Group Ltd",
    //     "Vehicle": "",
    //     "Trailer": "A123 4567",
    //     "Driver": "HannaBaker",
    //     "Material": "Processed Meat",
    //     "Time tipped": "",
    //     "Net weight": "",
    //     "Shunter driver": "",
    //     "Bin no": "",
    //     "Ticket no": "",
    //     "Mov doc no": "",
    //     "Operator": "",
    //     "Quantity": "2",
    //     "Progress": "In Transit",
    //     "totalFormData": {
    //         "orderDateAndTime": new Date(),
    //         "consigner": "Omega Proteins Ltd",
    //         "consignee": "Leo Group Ltd",
    //         "notes": "12312",
    //         "quantity": "2",
    //         "materialTYpe": "Processed Meat",
    //         "grossVolume": "",
    //         "description": "4234",
    //         "grossWeight": "",
    //         "grossDateTime": "",
    //         "tareWeight": "",
    //         "tareWeightDateTime": "",
    //         "temperature": "",
    //         "water": "",
    //         "totalWater": "",
    //         "netWater": "",
    //         "temperatureNotes": "",
    //         "shuntDriverName": "",
    //         "regNo": "",
    //         "vehicleType": "",
    //         "vehicleNo": "",
    //         "binNo": "",
    //         "binName": "",
    //         "pickupPoint": "",
    //         "infoShunterDriver": "",
    //         "driver": "HannaBaker",
    //         "vechile": {
    //             "vehicleNumber": "545454",
    //             "vehicleModel": "Toyota Camry",
    //             "vehicleMake": "Toyota",
    //             "vehicleType": "Sedan",
    //             "engineNumber": "221253345",
    //             "chassisNumber": "1313124",
    //             "trailerNumber": "00119"
    //         },
    //         "triler": "A123 4567"
    //     },
    //     "Quality check": "Pending",
    //     "more": ""
    // },
    //   {
    //     "CheckBox": false,
    //     "Order no": 8,
    //     "Collection date": new Date(),
    //     "Consignor": "Omega Proteins Ltd",
    //     "Consignee": "Leo Group Ltd",
    //     "Vehicle": "",
    //     "Trailer": "A123 4567",
    //     "Driver": "HannaBaker",
    //     "Material": "Processed Meat",
    //     "Time tipped": "",
    //     "Net weight": "",
    //     "Shunter driver": "",
    //     "Bin no": "",
    //     "Ticket no": "",
    //     "Mov doc no": "",
    //     "Operator": "",
    //     "Quantity": "2",
    //     "Progress": "Arrived",
    //     "totalFormData": {
    //         "orderDateAndTime": new Date(),
    //         "consigner": "Omega Proteins Ltd",
    //         "consignee": "Leo Group Ltd",
    //         "notes": "12312",
    //         "quantity": "2",
    //         "materialTYpe": "Processed Meat",
    //         "grossVolume": "",
    //         "description": "4234",
    //         "grossWeight": "",
    //         "grossDateTime": "",
    //         "tareWeight": "",
    //         "tareWeightDateTime": "",
    //         "temperature": "",
    //         "water": "",
    //         "totalWater": "",
    //         "netWater": "",
    //         "temperatureNotes": "",
    //         "shuntDriverName": "",
    //         "regNo": "",
    //         "vehicleType": "",
    //         "vehicleNo": "",
    //         "binNo": "",
    //         "binName": "",
    //         "pickupPoint": "",
    //         "infoShunterDriver": "",
    //         "driver": "HannaBaker",
    //         "vechile": {
    //             "vehicleNumber": "545454",
    //             "vehicleModel": "Toyota Camry",
    //             "vehicleMake": "Toyota",
    //             "vehicleType": "Sedan",
    //             "engineNumber": "221253345",
    //             "chassisNumber": "1313124",
    //             "trailerNumber": "00119"
    //         },
    //         "triler": "A123 4567"
    //     },
    //     "Quality check": "Pending",
    //     "more": ""
    // },
    //   {
    //     "CheckBox": false,
    //     "Order no": "00001",
    //     "Collection date": new Date(),
    //     "Consignor": "Omega Proteins Ltd",
    //     "Consignee": "Leo Group Ltd",
    //     "Vehicle": "",
    //     "Trailer": "A123 4567",
    //     "Driver": "HannaBaker",
    //     "Material": "Processed Meat",
    //     "Time tipped": "",
    //     "Net weight": "",
    //     "Shunter driver": "",
    //     "Bin no": "",
    //     "Ticket no": "",
    //     "Mov doc no": "",
    //     "Operator": "",
    //     "Quantity": "2",
    //     "Progress": "In progress",
    //     "totalFormData": {
    //         "orderDateAndTime": new Date(),
    //         "consigner": "Omega Proteins Ltd",
    //         "consignee": "Leo Group Ltd",
    //         "notes": "12312",
    //         "quantity": "2",
    //         "materialTYpe": "Processed Meat",
    //         "grossVolume": "",
    //         "description": "4234",
    //         "grossWeight": "",
    //         "grossDateTime": "",
    //         "tareWeight": "",
    //         "tareWeightDateTime": "",
    //         "temperature": "",
    //         "water": "",
    //         "totalWater": "",
    //         "netWater": "",
    //         "temperatureNotes": "",
    //         "shuntDriverName": "",
    //         "regNo": "",
    //         "vehicleType": "",
    //         "vehicleNo": "",
    //         "binNo": "",
    //         "binName": "",
    //         "pickupPoint": "",
    //         "infoShunterDriver": "",
    //         "driver": "HannaBaker",
    //         "vechile": {
    //             "vehicleNumber": "545454",
    //             "vehicleModel": "Toyota Camry",
    //             "vehicleMake": "Toyota",
    //             "vehicleType": "Sedan",
    //             "engineNumber": "221253345",
    //             "chassisNumber": "1313124",
    //             "trailerNumber": "00119"
    //         },
    //         "triler": "A123 4567"
    //     },
    //     "Quality check": "Pending",
    //     "more": ""
    // },
    //   {
    //     "CheckBox": false,
    //     "Order no": 9,
    //     "Collection date": new Date(),
    //     "Consignor": "Omega Proteins Ltd",
    //     "Consignee": "Leo Group Ltd",
    //     "Vehicle": "",
    //     "Trailer": "A123 4567",
    //     "Driver": "HannaBaker",
    //     "Material": "Processed Meat",
    //     "Time tipped": "",
    //     "Net weight": "",
    //     "Shunter driver": "",
    //     "Bin no": "",
    //     "Ticket no": "",
    //     "Mov doc no": "",
    //     "Operator": "",
    //     "Quantity": "2",
    //     "Progress": "Reached Site",
    //     "totalFormData": {
    //         "orderDateAndTime": new Date(),
    //         "consigner": "Omega Proteins Ltd",
    //         "consignee": "Leo Group Ltd",
    //         "notes": "12312",
    //         "quantity": "2",
    //         "materialTYpe": "Processed Meat",
    //         "grossVolume": "",
    //         "description": "4234",
    //         "grossWeight": "",
    //         "grossDateTime": "",
    //         "tareWeight": "",
    //         "tareWeightDateTime": "",
    //         "temperature": "",
    //         "water": "",
    //         "totalWater": "",
    //         "netWater": "",
    //         "temperatureNotes": "",
    //         "shuntDriverName": "",
    //         "regNo": "",
    //         "vehicleType": "",
    //         "vehicleNo": "",
    //         "binNo": "",
    //         "binName": "",
    //         "pickupPoint": "",
    //         "infoShunterDriver": "",
    //         "driver": "HannaBaker",
    //         "vechile": {
    //             "vehicleNumber": "545454",
    //             "vehicleModel": "Toyota Camry",
    //             "vehicleMake": "Toyota",
    //             "vehicleType": "Sedan",
    //             "engineNumber": "221253345",
    //             "chassisNumber": "1313124",
    //             "trailerNumber": "00119"
    //         },
    //         "triler": "A123 4567"
    //     },
    //     "Quality check": "Pending",
    //     "more": ""
    // },
    //   {
    //     "CheckBox": false,
    //     "Order no": 10,
    //     "Collection date": new Date(),
    //     "Consignor": "Omega Proteins Ltd",
    //     "Consignee": "Leo Group Ltd",
    //     "Vehicle": "",
    //     "Trailer": "A123 4567",
    //     "Driver": "HannaBaker",
    //     "Material": "Processed Meat",
    //     "Time tipped": "",
    //     "Net weight": "",
    //     "Shunter driver": "",
    //     "Bin no": "",
    //     "Ticket no": "",
    //     "Mov doc no": "",
    //     "Operator": "",
    //     "Quantity": "2",
    //     "Progress": "Arrived",
    //     "totalFormData": {
    //         "orderDateAndTime": new Date(),
    //         "consigner": "Omega Proteins Ltd",
    //         "consignee": "Leo Group Ltd",
    //         "notes": "12312",
    //         "quantity": "2",
    //         "materialTYpe": "Processed Meat",
    //         "grossVolume": "",
    //         "description": "4234",
    //         "grossWeight": "",
    //         "grossDateTime": "",
    //         "tareWeight": "",
    //         "tareWeightDateTime": "",
    //         "temperature": "",
    //         "water": "",
    //         "totalWater": "",
    //         "netWater": "",
    //         "temperatureNotes": "",
    //         "shuntDriverName": "",
    //         "regNo": "",
    //         "vehicleType": "",
    //         "vehicleNo": "",
    //         "binNo": "",
    //         "binName": "",
    //         "pickupPoint": "",
    //         "infoShunterDriver": "",
    //         "driver": "HannaBaker",
    //         "vechile": {
    //             "vehicleNumber": "545454",
    //             "vehicleModel": "Toyota Camry",
    //             "vehicleMake": "Toyota",
    //             "vehicleType": "Sedan",
    //             "engineNumber": "221253345",
    //             "chassisNumber": "1313124",
    //             "trailerNumber": "00119"
    //         },
    //         "triler": "A123 4567"
    //     },
    //     "Quality check": "Pending",
    //     "more": ""
    // },
    //   {
    //     "CheckBox": false,
    //     "Order no": 11,
    //     "Collection date": new Date(),
    //     "Consignor": "Omega Proteins Ltd",
    //     "Consignee": "Leo Group Ltd",
    //     "Vehicle": "",
    //     "Trailer": "A123 4567",
    //     "Driver": "HannaBaker",
    //     "Material": "Processed Meat",
    //     "Time tipped": "",
    //     "Net weight": "",
    //     "Shunter driver": "",
    //     "Bin no": "",
    //     "Ticket no": "",
    //     "Mov doc no": "",
    //     "Operator": "",
    //     "Quantity": "2",
    //     "Progress": "Tipped",
    //     "totalFormData": {
    //         "orderDateAndTime": new Date(),
    //         "consigner": "Omega Proteins Ltd",
    //         "consignee": "Leo Group Ltd",
    //         "notes": "12312",
    //         "quantity": "2",
    //         "materialTYpe": "Processed Meat",
    //         "grossVolume": "",
    //         "description": "4234",
    //         "grossWeight": "",
    //         "grossDateTime": "",
    //         "tareWeight": "",
    //         "tareWeightDateTime": "",
    //         "temperature": "",
    //         "water": "",
    //         "totalWater": "",
    //         "netWater": "",
    //         "temperatureNotes": "",
    //         "shuntDriverName": "",
    //         "regNo": "",
    //         "vehicleType": "",
    //         "vehicleNo": "",
    //         "binNo": "",
    //         "binName": "",
    //         "pickupPoint": "",
    //         "infoShunterDriver": "",
    //         "driver": "HannaBaker",
    //         "vechile": {
    //             "vehicleNumber": "545454",
    //             "vehicleModel": "Toyota Camry",
    //             "vehicleMake": "Toyota",
    //             "vehicleType": "Sedan",
    //             "engineNumber": "221253345",
    //             "chassisNumber": "1313124",
    //             "trailerNumber": "00119"
    //         },
    //         "triler": "A123 4567"
    //     },
    //     "Quality check": "Pending",
    //     "more": ""
    // },
    //   {
    //     "CheckBox": false,
    //     "Order no": 12,
    //     "Collection date": new Date(),
    //     "Consignor": "Omega Proteins Ltd",
    //     "Consignee": "Leo Group Ltd",
    //     "Vehicle": "",
    //     "Trailer": "A123 4567",
    //     "Driver": "HannaBaker",
    //     "Material": "Processed Meat",
    //     "Time tipped": "",
    //     "Net weight": "",
    //     "Shunter driver": "",
    //     "Bin no": "",
    //     "Ticket no": "",
    //     "Mov doc no": "",
    //     "Operator": "",
    //     "Quantity": "2",
    //     "Progress": "In progress",
    //     "totalFormData": {
    //         "orderDateAndTime": new Date(),
    //         "consigner": "Omega Proteins Ltd",
    //         "consignee": "Leo Group Ltd",
    //         "notes": "12312",
    //         "quantity": "2",
    //         "materialTYpe": "Processed Meat",
    //         "grossVolume": "",
    //         "description": "4234",
    //         "grossWeight": "",
    //         "grossDateTime": "",
    //         "tareWeight": "",
    //         "tareWeightDateTime": "",
    //         "temperature": "",
    //         "water": "",
    //         "totalWater": "",
    //         "netWater": "",
    //         "temperatureNotes": "",
    //         "shuntDriverName": "",
    //         "regNo": "",
    //         "vehicleType": "",
    //         "vehicleNo": "",
    //         "binNo": "",
    //         "binName": "",
    //         "pickupPoint": "",
    //         "infoShunterDriver": "",
    //         "driver": "HannaBaker",
    //         "vechile": {
    //             "vehicleNumber": "545454",
    //             "vehicleModel": "Toyota Camry",
    //             "vehicleMake": "Toyota",
    //             "vehicleType": "Sedan",
    //             "engineNumber": "221253345",
    //             "chassisNumber": "1313124",
    //             "trailerNumber": "00119"
    //         },
    //         "triler": "A123 4567"
    //     },
    //     "Quality check": "Pending",
    //     "more": ""
    // },

  ]


  logedInUser: any
  filteredOrders: any | any[] = [];
  constructor(public http: CustomHttpService) {

    let user: any = localStorage.getItem('loggedInUser')

    let parsedData: any = null;
    try {
      if (user && user !== 'null' && user !== 'undefined') {
        parsedData = JSON.parse(user);
      }
    } catch (error) {
      console.warn('Invalid JSON in loggedInUser localStorage:', user);
      // Clear invalid data
      localStorage.removeItem('loggedInUser');
    }
    
    this.logedInUser = parsedData?.roleName
    //console.log(parsedData);


    let status: any = 'Pending'
    //     if(this.logedInUser == 'Transportation Manager'){
    //       status = 'Assigned'
    //     }
    //     else if(this.logedInUser== 'Weighbridge operator'){
    //  status = 'Weighed'
    //     }
    //     else if(this.logedInUser == 'Plant Site Manager'){
    //       status = 'Bin assigned'
    //     }




    // this.ordersAndTask.forEach((order:any) => {
    //   if (this.logedInUser == 'Transportation Manager' && order.Progress === "Assigned") {
    //     //console.log("Processing an assigned order:", order);
    //     this.filteredOrders.push(order)
    //     //console.log(this.filteredOrders);
    //     // Add your logic for "Assigned" status
    //   }
    //    if(order.Progress === "Assigned" || order.Progress === "Weighed"){
    //     //console.log("Processing an assigned order:", order);

    //     // this.filteredOrders.push(order)
    //     // //console.log(this.filteredOrders);

    //   }
    //    else if (order.Progress === "Weighed") {
    //     //console.log("Processing a weighed order:", order);
    //     // Add your logic for "Weighed" status
    //   } else if (order.Progress === "Bin Assigned") {
    //     //console.log("Processing a bin-assigned order:", order);
    //     // Add your logic for "Bin Assigned" status
    //   } else if (order.Progress === "Checked") {
    //     //console.log("Processing a checked order:", order);
    //     // Add your logic for "Checked" status
    //   } else if (order.Progress === "Collected") {
    //     //console.log("Processing a collected order:", order);
    //     // Add your logic for "Collected" status
    //   } else if (order.Progress === "In Transit") {
    //     //console.log("Processing an in-transit order:", order);
    //     // Add your logic for "In Transit" status
    //   } else {
    //     //console.log("Unhandled order status:", order.Progress);
    //     // Add fallback logic for unhandled statuses
    //   }
    // });


    // setTimeout(() => {
    //   //console.log('tigger');
    //   if( this.logedInUser === 'Weighbridge operator'){
    //     //console.log('Weighbridge operator');
    //     const interval = setInterval(() => {
    //       let allUpdated = true;

    //       // First loop: Update "Assigned" to "In Transit"
    //       this.ordersAndTask.forEach((order: any) => {
    //         if (order.Progress === "Assigned") {
    //           order.Progress = "In Transit";
    //           //console.log(`Order updated to "In Transit":`, order);
    //           allUpdated = false; // Some orders are still being updated
    //         }
    //       });


    //       //console.log(this.ordersAndTask);

    //       // Delay second loop by 5 seconds
    //       setTimeout(() => {
    //         this.ordersAndTask.forEach((order: any,index:any) => {

    //           setTimeout(() => {
    //             if (order.Progress === "In Transit") {
    //               order.Progress = "Reached Site";
    //               //console.log(`Order updated to "Reached Site":`, order);
    //               allUpdated = false;
    //             }
    //           }, 500 * index);

    //         });

    //         //console.log(this.ordersAndTask);

    //         // Delay third loop by another 5 seconds
    //         setTimeout(() => {
    //           this.ordersAndTask.forEach((order: any,index :any) => {
    //             setTimeout(() => {
    //               if (order.Progress === "Reached Site") {
    //                 order.Progress = "Collected";
    //                 //console.log(`Order updated to "Collected":`, order);
    //                 allUpdated = false;
    //               }
    //             }, 500 * index);


    //           });

    //           //console.log(this.ordersAndTask);

    //           // Delay fourth loop by another 5 seconds
    //           setTimeout(() => {
    //             this.ordersAndTask.forEach((order: any,index:any) => {

    //               setTimeout(() => {
    //                 if (order.Progress === "Collected") {
    //                   order.Progress = "Material in-Transit";
    //                   //console.log(`Order updated to "Material in-Transit":`, order);
    //                   allUpdated = false;
    //                 }
    //               }, 500 * index);


    //             });

    //             //console.log(this.ordersAndTask);

    //             // Clear interval if all updates are complete
    //             if (allUpdated) {
    //               clearInterval(interval);
    //               //console.log("All orders have been updated.");
    //             }
    //           }, 5000); // 5 seconds delay for fourth loop
    //         }, 5000); // 5 seconds delay for third loop
    //       }, 5000)
    //     }, 5000); 

    //      }
    //   if( this.logedInUser === 'Plant Site Manager'){
    //    //console.log('Plant site manager');

    //     const interval = setInterval(() => {
    //       let allUpdated = true;
    //       // Delay second loop by 5 seconds
    //       setTimeout(() => {
    //         this.ordersAndTask.forEach((order: any,index:any) => {

    //           setTimeout(() => {
    //             if (order.Progress === "Weighed") {
    //               order.Progress = "Arrived";
    //               //console.log(`Order updated to "Reached Site":`, order);
    //               allUpdated = false;
    //             }
    //           }, 500 * index);

    //         });

    //         //console.log(this.ordersAndTask);

    //         // Delay third loop by another 5 seconds
    //         setTimeout(() => {
    //           this.ordersAndTask.forEach((order: any,index :any) => {
    //             setTimeout(() => {
    //               if (order.Progress === "Bin assigned") {
    //                 order.Progress = "Tipped";
    //                 //console.log(`Order updated to "Collected":`, order);
    //                 allUpdated = false;
    //               }
    //             }, 500 * index);


    //           });

    //           //console.log(this.ordersAndTask);

    //           // Delay fourth loop by another 5 seconds
    //           setTimeout(() => {
    //             this.ordersAndTask.forEach((order: any,index:any) => {

    //               setTimeout(() => {
    //                 if (order.Progress === "Tipped") {
    //                   order.Progress = "Material in-Transit";
    //                   //console.log(`Order updated to "Material in-Transit":`, order);
    //                   allUpdated = false;
    //                 }
    //               }, 500 * index);


    //             });

    //             //console.log(this.ordersAndTask);

    //             // Clear interval if all updates are complete
    //             if (allUpdated) {
    //               clearInterval(interval);
    //               //console.log("All orders have been updated.");
    //             }
    //           }, 5000); // 5 seconds delay for fourth loop
    //         }, 5000); // 5 seconds delay for third loop
    //       }, 5000)
    //     }, 5000); 

    //      }
    // },10)


  }

  //it will enable the loader
  show() {
    this.isLoadingImg.next(true);
  }

  //it will disable the loader
  hide() {
    this.isLoadingImg.next(false);
  }

  // USer details
  getUserDetails(email: any) {
    return this.http.get('/User/GetUserbyEmail?Email=' + email).then(res => res)
  }

  getProfile(mail: any) {
    return this.http.get('/User/GetEmployeeProfileByEmail?email=' + mail).then(res => res)
  }


  // sort 
  getSortLits() {
    return this.http.get("/Master/GetSortings").then(res => res);
  }

}
