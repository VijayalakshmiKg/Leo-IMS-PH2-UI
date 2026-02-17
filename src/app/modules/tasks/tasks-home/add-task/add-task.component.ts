import { DatePipe, Location } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConsigneeService } from 'src/app/modules/consignee/consignee.service';
import { ConsignorService } from 'src/app/modules/consignor/consignor.service';
import { MaterialService } from 'src/app/modules/material/material.service';
import { AddVehicleDriverComponent } from 'src/app/modules/orders/orders-home/add-orders/add-vehicle-driver/add-vehicle-driver.component';
import { ImportTemplateComponent } from 'src/app/modules/orders/orders-home/add-orders/import-template/import-template.component';
import { addUpdateOrderModel } from 'src/app/modules/orders/orders-home/order-model/addUpdateOrderModel';
import { TemplateService } from 'src/app/modules/template/template.service';
import { TrailerService } from 'src/app/modules/trailer/trailer.service';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { TimePickerComponent } from 'src/app/shared/components/time-picker/time-picker.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TasksService } from '../../tasks.service';
import { weighbridgeModel } from '../task-model/weighbridgeModel';
import { platsiteManagerModel } from '../task-model/platsiteManager';
import { Observable, of } from 'rxjs';
import { CanComponentDeactivate, CanDeactivateGuard } from 'src/app/shared/guard/can-deactivate.guard';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit,CanComponentDeactivate {

  ordersForm!: FormGroup

  saveBtnText: any = 'Save'
  imageUrl: any
  selectedFile: any
  imageUrlProfile: any
  selectedFileProfile: any
  vicheclesDrivers: any | any[] = [];
  importData: any;
  orderTime: any;
  date = new Date();
  productCategories = ['Category A', 'Category B', 'Category C'];
  organizations = ['Organization 1', 'Organization 2', 'Organization 3'];
  organizationCodes = ['Code 1', 'Code 2', 'Code 3'];

  days: { name: string; index: number, text: string }[] = [
    { name: 'S', index: 0, text: 'SUN' },
    { name: 'M', index: 1, text: 'MON' },
    { name: 'T', index: 2, text: 'TUE' },
    { name: 'W', index: 3, text: 'WED' },
    { name: 'T', index: 4, text: 'THU' },
    { name: 'F', index: 5, text: 'FRI' },
    { name: 'S', index: 6, text: 'SAT' },
  ];
  trailers: any | any[] = []


  consigners: any | any[] = [];


  consignees: any | any[] = [];

  materialTypes: any | any[] = [];

  filteredConsigners: any
  filteredConsignee: any
  shunterDrivers: any | any[] = [];
  selectedDays: number[] = [];

  logedInUser: any | any[] = [];
  templateServ: any;
  consigneeID: any;
  consignorID: any;
  consignorAddress: any;
  consigneeAddress: any;
  materialID: any;
  userProfile: any | any[] = [];
  formattedTime: any
  formattedTareTime: any
  formattedGrossTime: any
  isDaySelected(dayIndex: number): boolean {
    return this.selectedDays.includes(dayIndex);
  }

  getSelectedDayTexts(): string[] {
    return this.selectedDays.map((dayIndex) => {
      const day = this.days.find((d) => d.index === dayIndex);
      return day ? day.text : ''; // Return the 'text' value if the day is found
    });
  }



  constructor(public taskServ: TasksService, public triServ: TrailerService, public materialServ: MaterialService, public tempSer: TemplateService, public conginerServ: ConsignorService, public consigServ: ConsigneeService, public dialog: MatDialog, public fb: FormBuilder, public sanitizer: DomSanitizer, public location: Location,
    public utilSer: UtilityService, public datePipe: DatePipe) {
    // this.consignees = consigServ.consigneeList
    // //console.log(this.consignees, 'consignee');

    // this.consigners = conginerServ.consignorList
    // //console.log(this.consigners, 'consigner');

    // this.materialTypes = materialServ.materialList
    // //console.log(this.materialTypes, 'materialList');

    let user: any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
    this.trailers = triServ.AvailInSiteList

  }






  ngOnInit(): void {

    //console.log(this.tempSer.templateList);

    this.ordersForm = this.fb.group({
      ordersId: [''],
      // orderDateAndTime: [''],
      date: [new Date(), Validators.required],
      time: [new Date(), Validators.required],
      consigner: ['', Validators.required],
      consignee: ['', Validators.required],
      pickUpTrailerNotes: [''],
      pickUpTrailerNo: [''],
      notes: [''],
      repeatMode: [false],
      trailerQuantity: ['', Validators.required],
      materialTYpe: ['', Validators.required],
      grossVolume: [''],
      description: [''],
      grossWeight: [''],
     
      tareWeight: [''],
      temperature: [''],
      water: [''],
      totalWater: [''],
      netWater: [''],
      temperatureNotes: [''],
      shuntDriverName: [''],
      regNo: [''],
      vehicleType: [''],
      vehicleNo: [''],
      binNo: [''],
      binName: [''],
      pickupPoint: [''],
      infoShunterDriver: [''],
      driver: ['', Validators.required],
      vechile: ['', Validators.required],
      triler: ['', Validators.required],
      selectedDays: [],
      selectedDaysIndex: [],
      weighbridgeOperator:[],
      ticketNo:[],
      movementDocno:[],
      tareTime:[new Date()],
      tareDate:[new Date()],
      grossTime:[new Date()],
      grossDate: [new Date()],
      tareWeightDate: [''],

    });



    this.ordersForm.get('ordersId')?.disable()
    let Data: any = localStorage.getItem("userData");
    this.userProfile = JSON.parse(Data);

    if (this.taskServ.editTaskRecord) {
      //console.log(this.taskServ.editTaskRecord);
      this.saveBtnText = 'Update'
      this.getOrdersRecordByOrderID(this.taskServ.editTaskRecord.orderID)

    }

    let user: any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
    if (this.logedInUser === 'Plant Site Manager') {
      //console.log('trigger');

      const fieldsToUpdate = [
        'shuntDriverName',
        'regNo',
        'vehicleType',
        'vehicleNo',
        'binNo',
        'binName',
        'pickupPoint',
        // 'infoShunterDriver'
      ];
      const fieldsToEnable = [
        'shuntDriverName',
        'regNo',
        'vehicleType',
        'vehicleNo',
        'binNo',
        'binName',
        'pickupPoint',
        'infoShunterDriver'
      ]

      Object.keys(this.ordersForm.controls).forEach(field => {
        const control = this.ordersForm.get(field);

        if (control) {
          if (fieldsToUpdate.includes(field)) {
            // Add required validators for the specified fields
            control.setValidators([Validators.required]);
            // control.enable(); // Ensure the field is enabled
          } else {
            // Disable all other fields
            control.clearValidators(); // Clear any existing validators
            // control.disable(); // Disable the field
          }
          if(fieldsToEnable.includes(field)){
            control.enable();
          }
          else{
            control.disable();
          }

          // Update the validity of the control
          control.updateValueAndValidity();
        }
      });
    }

    if (this.logedInUser === 'Weighbridge operator') {
      //console.log('trigger');

      const fieldsToUpdate = [
        'grossWeight',
        'grossDate',
        'tareWeight',
        'tareDate',
        'ticketNo',
        'tareTime',
        'grossTime',

      ];

      const fieldsToEnable = [
        'grossWeight',
        'grossDate',
        'tareWeight',
        'tareDate',
        'ticketNo',
        'tareTime',
        'grossTime',
        'weighbridgeOperator',
        // 'movementDocno',
      ]

      // Loop over all controls in the form
      Object.keys(this.ordersForm.controls).forEach(field => {
        const control = this.ordersForm.get(field);

        if (control) {
          if (fieldsToUpdate.includes(field)) {
            // Add required validators and enable the control
            control.setValidators([Validators.required]);
            // control.enable(); // Ensure the field is enabled
          } else {
            // Clear validators and disable the control for all other fields
            control.clearValidators();
            // control.disable();
          }

          if(fieldsToEnable.includes(field)){
            control.enable();
          }
          else{
            control.disable()
          }

          // Update the validity of the control
          control.updateValueAndValidity();
        }
      });

      this.ordersForm.setValidators(this.tareLessThanGross());
      this.ordersForm.updateValueAndValidity();
    }
    this.setFormattedTime()
    this.getBin()
     // If refreshed, redirect
      //  if (sessionStorage.getItem('refreshed') === 'true') {
      //    sessionStorage.removeItem('refreshed'); // Clear refresh flag
      //   this.location.back() // Redirect after refresh
      //  }
     }

     @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: any) {
    event.preventDefault();  // Standard way to prevent refresh
    event.returnValue = '';  // Some browsers require this
  }
   
   

   isSaving:boolean = false
    canDeactivate(): Observable<boolean> {
      //console.log('askdfalpskfdokjad');
    //console.log(this.isSaving);
      
      if (this.isSaving) {
        return of(true); // Allow navigation if saving
      }
  
      return new Observable<boolean>(observer => {
        //console.log('sz,fmksjfkasjfiasj');
        
        const dialogRef = this.dialog.open(CustomMessageBoxComponent, {
          width: '480px',
          height: 'auto',
          data: {
            type: messageBox.cancelMessageBox,
            message: 'Are you sure you want to leave? Your unsaved changes will be discarded.',
            title: 'Leave this page?'
          },
          disableClose: true,
          autoFocus: false,
          panelClass: 'custom-msg-box'
        });
  
        dialogRef.afterClosed().subscribe(res => {
          observer.next(res); // Allow navigation if confirmed
          observer.complete();
        });
      });
    }

  tareLessThanGross(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const tareWeight = control.get('tareWeight')?.value;
      const grossWeight = control.get('grossWeight')?.value;
  
      if (tareWeight && grossWeight && tareWeight >= grossWeight) {
        return { tareGreaterThanGross: true }; // Validation error
      }
      return null; // No error
    };
  }

  private setFormattedTime(): void {
    setTimeout(() => {
      //console.log('tigger');

      const timeValue = this.ordersForm.get('time')?.value || new Date();
      const tareTimeValue = this.ordersForm.get('tareTime')?.value || new Date();
      const grossTimeValue = this.ordersForm.get('grossTime')?.value || new Date();
      if (timeValue) {
        this.formattedTime = this.formatTime(timeValue);
      }
      if (tareTimeValue) {
        this.formattedTareTime = this.formatTime(tareTimeValue);
      }
      if (grossTimeValue) {
        this.formattedGrossTime = this.formatTime(grossTimeValue);
      }
    });
  }

  private formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  editResponseTasks: any | any[] = []


  getOrdersRecordByOrderID(id: any) {
    this.taskServ.getTaskByOrderID(id).then(res => {
      //console.log(res);
      if (res) {
        this.editResponseTasks = res
        this.setOrderDetails(res)
      }
    })
  }

  setOrderDetails(response: any) {

    this.ordersForm.get('date')?.setValue(response.orderDate)
    this.ordersForm.get('ordersId')?.setValue(response.orderID)
    this.ordersForm.get('time')?.setValue(response.orderDate)
    this.setFormattedTime()
    this.ordersForm.get('repeatMode')?.setValue(response.repeatOrder)
    this.ordersForm.get('consigner')?.setValue(response.consignorName)
    this.ordersForm.get('consignee')?.setValue(response.consigneeName)
    this.ordersForm.get('notes')?.setValue(response.notes)
    // this.ordersForm.get('quantity')?.setValue(response)
    this.ordersForm.get('materialTYpe')?.setValue(response.materialType)
    this.ordersForm.get('movementDocno')?.setValue(this.taskServ.editTaskRecord.orderNo)
    this.ordersForm.get('trailerQuantity')?.setValue(response.quantity)
    this.ordersForm.get('pickUpTrailerNotes')?.setValue(response.pickupTrailerNotes)
    this.ordersForm.get('pickUpTrailerNo')?.setValue(response.pickupTrailerNo)
    this.ordersForm.get('driver')?.setValue({ firstName: response.driverName, driverID: response.driverID })
    this.ordersForm.get('triler')?.setValue({ trailerNumber: response.trailerNumber, trailerID: response.trailerID })
    this.ordersForm.get('vechile')?.setValue({ truckID: response.truckID, vechicleNumber: response.truckNumber })
    this.consignorAddress = { address1: response.consignorAddress1, city: response.consignorCity, pincode: response?.consignorPincode, country: response.consignorCounty,state:response.consignorState }
    this.consigneeAddress = { address1: response.consigneeAddress1, city: response.consigneeCity, pincode: response?.consigneePincode, country: response.consigneeCountry,state:response.consigneeState }

    this.consigneeID = response.consigneeID
    this.consignorID = response.consignorID
    this.materialID = response.materialID

    const dayIndexMap: { [key: string]: number } = {
      SUN: 0,
      MON: 1,
      TUE: 2,
      WED: 3,
      THU: 4,
      FRI: 5,
      SAT: 6
    };


    // Split the string into an array
    const dayAbbreviations = response.repeatDays.split(",");

    // Map each abbreviation to its index
    const dayIndexes = dayAbbreviations.map((day: any) => dayIndexMap[day]);

    //console.log("Day Indexes:", dayIndexes);
    this.selectedDays = dayIndexes

  }

  getConsigneeDetailsBySearch(searchKey?: any) {
    //console.log(searchKey.value);
    this.taskServ.getConsigneeDetailsBySearch(searchKey.value).then((res: any) => {
      //console.log(res);
      if (res) {
        this.consignees = res
      }
    })
  }

  onConsigneeSelect(value: any) {
    //console.log(value);
    this.consigneeID = value.consigneeID
    this.consigneeAddress = value.address1
    //console.log(this.consigneeID);

  }
  getConsignorDetailsBySearch(searchKey?: any) {
    //console.log(searchKey.value);
    this.taskServ.getConsignorDetailsBySearch(searchKey.value).then((res: any) => {
      //console.log(res);
      if (res) {
        this.consigners = res

      }
    })
  }

  getShuntDriver(event:any){
    this.taskServ.getShuntDriverBYSearch(event.value).then(res => {
      //console.log(res);
      if(res){
        this.shunterDrivers = res
      }
    })
  }

  shuntDriverID:any
  getShuntDriverDetails(data:any){
    this.shuntDriverID = data.shunterDriverID
  }

  binList:any | any[] = []

  getBin(){
    this.taskServ.getBin().then(res => {
      //console.log(res);
      if(res){
        this.binList = res
      }
    })
  }

  onConsignorSelect(value: any) {
    //console.log(value);
    this.consignorID = value.consignorID
    //console.log(this.consignorID);
    this.consignorAddress = value.address1

  }
  getMaterialDetailsBySearch(searchKey?: any) {
    //console.log(searchKey.value);
    this.taskServ.getMaterialsDetailsBySearch(searchKey.value).then((res: any) => {
      //console.log(res);
      if (res) {
        this.materialTypes = res
      }
    })
  }

  onMaterialSelect(value: any) {
    //console.log(value);
    this.materialID = value.materialID
    //console.log(this.materialID);
  }

  toggleDaySelection(dayIndex: number): void {
    const index = this.selectedDays.indexOf(dayIndex);
    if (index === -1) {
      this.selectedDays.push(dayIndex); // Add index if not selected
    } else {
      this.selectedDays.splice(index, 1); // Remove index if already selected
    }
  }
  dtime: any;
  setordersDetails() {
    this.imageUrl = this.taskServ?.editTaskRecord?.ordersLicensePhoto
    this.imageUrlProfile = this.taskServ?.editTaskRecord?.profileImage
    this.selectedFile = this.taskServ?.editTaskRecord?.selectedFileordersLicense
    this.selectedDays = this.taskServ?.editTaskRecord?.totalFormData?.selectedDaysIndex
    this.ordersForm.setValue({
      ordersId: this.taskServ?.editTaskRecord["Order no"] || '', // No matching key in JSON
      // orderDateAndTime: this.taskServ?.editTaskRecord["Collection date"] || '',
      date: this.taskServ?.editTaskRecord["Collection date"] || '',
      time: this.taskServ?.editTaskRecord["time"] || new Date(),
      repeatMode: this.taskServ?.editTaskRecord?.totalFormData.repeatMode || false,
      selectedDays: this.taskServ?.editTaskRecord?.totalFormData.selectedDays,
      selectedDaysIndex: this.taskServ?.editTaskRecord?.totalFormData.selectedDaysIndex,
      consigner: this.taskServ?.editTaskRecord["Consignor"] || '',
      consignee: this.taskServ?.editTaskRecord["Consignee"] || '',
      notes: '', // No matching key in JSON
      trailerQuantity: this.taskServ?.editTaskRecord["Material quantity"] || '',
      pickUpTrailerNotes: this.taskServ?.editTaskRecord["pickUpTrailerNotes"] || '',
      pickUpTrailerNo: this.taskServ?.editTaskRecord["Pickup trailer no"] || '',
      materialTYpe: this.taskServ?.editTaskRecord["Material"] || '',
      grossVolume: '', // No matching key in JSON
      description: '', // No matching key in JSON
      grossWeight: '', // No matching key in JSON
      grossDateTime: '', // No matching key in JSON
      tareWeight: '', // No matching key in JSON
      tareWeightDateTime: '', // No matching key in JSON
      temperature: '', // No matching key in JSON
      water: '', // No matching key in JSON
      totalWater: '', // No matching key in JSON
      netWater: this.taskServ?.editTaskRecord["Net weight"] || '',
      temperatureNotes: '', // No matching key in JSON
      shuntDriverName: this.taskServ?.editTaskRecord["Shunter driver"] || '',
      regNo: '', // No matching key in JSON
      vehicleType: '', // No matching key in JSON
      vehicleNo: this.taskServ?.editTaskRecord["Vehicle"] || '',
      binNo: this.taskServ?.editTaskRecord["Bin no"] || '',
      binName: '', // No matching key in JSON
      pickupPoint: '', // No matching key in JSON
      infoShunterDriver: '', // No matching key in JSON
      driver: this.taskServ?.editTaskRecord["Driver"] || '',
      vechile: this.taskServ?.editTaskRecord.totalFormData.vechile || '',
      triler: this.taskServ?.editTaskRecord["Trailer"] || '',
      // repeatMode: this.taskServ.editTaskRecord["repeatMode"]
    });

    this.setValuesOrders()

  }

  setValuesOrders() {

  }




  back() {
    let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
      width: '480px',
      height: 'auto',
      data: { type: messageBox.cancelMessageBox, message: 'Are you sure want to skip? If you leave, your unsaved changes will be discarded', title: 'Leave this page?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.isSaving = true
        this.location.back()
      }
    })
  }
  onSubmitandClose(Status: any): void {
if(this.logedInUser == 'Weighbridge operator'){
  this.addUpdateWeighBridge()
}
else if(this.logedInUser == 'Plant Site Manager'){
  this.addUpdatePlatSiteManager()
}


  }

  addUpdateWeighBridge(){
    
   


    const selectedDayTexts = this.getSelectedDayTexts();

    this.ordersForm.get('selectedDays')?.setValue(selectedDayTexts)
    this.ordersForm.get('selectedDaysIndex')?.setValue(this.selectedDays)
    const formValues = this.ordersForm.getRawValue();

    //console.log(formValues);

    // Parse the date and time
    const grossDatePart = new Date(formValues.grossDate);
    const grossTimePart = new Date(formValues.grossTime);
    const taraTimePart = new Date(formValues.tareTime);
    const taraDatePart = new Date(formValues.tareDate);

    // Combine date and time
    const grossCombinedDateTime = new Date(
      grossDatePart.getFullYear(),
      grossDatePart.getMonth(),
      grossDatePart.getDate(),
      grossTimePart.getHours(),
      grossTimePart.getMinutes(),
      grossTimePart.getSeconds()
    );
    const taraCombinedDateTime = new Date(
      taraDatePart.getFullYear(),
      taraDatePart.getMonth(),
      taraDatePart.getDate(),
      taraTimePart.getHours(),
      taraTimePart.getMinutes(),
      taraTimePart.getSeconds()
    );

    // Convert to ISO string or desired format
    const grossCombinedDateTimeString = grossCombinedDateTime;
    const taraCombinedDateTimeString = taraCombinedDateTime;

    //console.log(grossCombinedDateTimeString);
    //console.log(taraCombinedDateTimeString);
    //console.log(this.ordersForm.value.grossWeight - this.ordersForm.value.tareWeight);
    
    if (this.ordersForm.valid) {
      //console.log(this.ordersForm.value.grossWeight - this.ordersForm.value.tareWeight);

      let weighbridgeModels: weighbridgeModel = new weighbridgeModel()
  weighbridgeModels.WeighbridgeRecordID = 0
  weighbridgeModels.OrderID = this.editResponseTasks.orderID
  weighbridgeModels.TruckID = this.editResponseTasks.truckID
  weighbridgeModels.WeighedBy = this.userProfile.employeeId
  weighbridgeModels.NetWeight = Math.round(this.ordersForm.value.grossWeight - this.ordersForm.value.tareWeight)
  weighbridgeModels.ReceiptNumber = ''
  weighbridgeModels.WeighTimestamp = new Date()
  weighbridgeModels.TicketIssued = true
  weighbridgeModels.DigitalSignOff = false
  weighbridgeModels.ReportLocationURl = ''
  weighbridgeModels.MovementdocNo = this.ordersForm.value.movementDocno
  weighbridgeModels.GrossWeight = this.ordersForm.value.grossWeight
  weighbridgeModels.TareWeight = this.ordersForm.value.tareWeight
  weighbridgeModels.Temperature = ''
  weighbridgeModels.Water = ''
  weighbridgeModels.TotalWater = ''
  weighbridgeModels.NetWithoutWater = ''
  weighbridgeModels.Notes = ''
  weighbridgeModels.TicketNo = this.ordersForm.value.ticketNo
  weighbridgeModels.GrossWeightDateTime = grossCombinedDateTimeString
  weighbridgeModels.TareWeightDateTime = taraCombinedDateTimeString
  weighbridgeModels.WeighBridgeOperator = this.ordersForm.value.weighbridgeOperator



 this.taskServ.addUpdateWeighbridgeTasks(weighbridgeModels).then(res => {
    //console.log(res);
    if (res) {
      if(res){ 
        this.isSaving = true
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Material weighed successfully.' })
          this.location.back()

      }
    
    
    }})

}
else {

}

  }

  addUpdatePlatSiteManager(){

    let model:platsiteManagerModel = new platsiteManagerModel()


    // shuntDriverName: [''],
    // regNo: [''],
    // vehicleType: [''],
    // vehicleNo: [''],
    // binNo: [''],
    // binName: [''],
    // pickupPoint: [''],
    // infoShunterDriver: [''],

    model.BinAssignmentID = 0
    model.BinID = Number(this.ordersForm.value.binName)
    model.ShunterDriverID = Number(this.shuntDriverID)
    model.OrderID = this.editResponseTasks.orderID
    model.AssignmentDate = new Date()
    model.PlantSiteManagerID = this.userProfile.employeeId
    model.PickUpPoint = this.ordersForm.value.pickupPoint
    model.Comment = this.ordersForm.value.infoShunterDriver
    model.Status = ''
    model.DigitalSignOff = false

    //console.log(model);

    this.taskServ.addUpdatePlatSiteManager(model).then(res => {
      //console.log(res);
      if(res){
        this.isSaving = true
        this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Bin assigned successfully.' })

        this.location.back()
      }
    })
    
  }


deleteLicensePhoto() {
  this.selectedFile = null
  this.imageUrl = null
}


addVicheclsAndDrivers(data ?: any, index ?: any) {
  //console.log({ vechile: this.ordersForm.value.vechile, driver: this.ordersForm.value.driver, trailer: this.ordersForm.value.triler });

  var dia = this.dialog.open(AddVehicleDriverComponent, {
    panelClass: 'add-bin',
    position: { right: "0", top: '52px' },
    height: "100vh",
    disableClose: true,
    data: { vechile: this.ordersForm.value.vechile, driver: this.ordersForm.value.driver, trailer: this.ordersForm.value.triler },
  })


  dia.afterClosed().subscribe(res => {
    //console.log(res);
    if (res) {
      //console.log(res);
      this.vicheclesDrivers = res
      this.ordersForm.get('vechile')?.setValue(this.vicheclesDrivers.vehicle)
      this.ordersForm.get('triler')?.setValue(this.vicheclesDrivers.trailer)
      this.ordersForm.get('driver')?.setValue(this.vicheclesDrivers.driver)
      //console.log(this.ordersForm.get('vechile')?.value);

      // this.binList = this.settingServ.binRecords
    }

  })
}

selectedShunterDriver(driver: any) {
  this.ordersForm.get('vehicleNo')?.setValue(driver.vehicleNumber)
  this.ordersForm.get('vehicleType')?.setValue(driver.vehicleType)
  this.ordersForm.get('regNo')?.setValue(driver.regNo)
}


importTemplate() {
  var dialogRef = this.dialog.open(ImportTemplateComponent, {
    panelClass: 'importTemplate',
    data: this.tempSer.templateList,
    width: '558px',
    height: 'auto',
    disableClose: true
  })
  dialogRef.afterClosed().subscribe(res => {
    //console.log(res);
    if (res) {
      this.importData = res
      this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Template has been imported successfully' })

      this.setValuesData();

    }

  })
}

setValuesData() {
  //console.log(this.importData);


  const dayIndexMap: { [key: string]: number } = {
    SUN: 0,
    MON: 1,
    TUE: 2,
    WED: 3,
    THU: 4,
    FRI: 5,
    SAT: 6
  };


  // Split the string into an array
  const dayAbbreviations = this.importData.repeatDays.split(",");

  // Map each abbreviation to its index
  const dayIndexes = dayAbbreviations.map((day: any) => dayIndexMap[day]);

  const formattedDate = this.date.toISOString().split('T')[0]; // "2025-01-08"
  const formattedTime = this.date.toTimeString().split(' ')[0].substring(0, 5)
  // this.ordersForm.get('ordersId')?.setValue('1')

  this.ordersForm.get('selectedDays')?.setValue(this.importData.repeatDays)
  this.ordersForm.get('selectedDaysIndex')?.setValue(dayIndexes)
  this.ordersForm.get('date')?.setValue(this.importData.orderTemplateDate);
  this.ordersForm.get('time')?.setValue(this.importData.orderTemplateDate);
  setTimeout(() => {
    //console.log('tigger');

    const timeValue = this.ordersForm.get('time')?.value || new Date();
    if (timeValue) {
      this.formattedTime = this.formatTime(timeValue);
    }
  });
  // this.setFormattedTime()
  this.ordersForm.get('consigner')?.setValue(this.importData.consignorName)
  this.ordersForm.get('consignee')?.setValue(this.importData.consigneeName)
  this.ordersForm.get('notes')?.setValue(this.importData.notes)
  this.ordersForm.get('trailerQuantity')?.setValue(this.importData.trilerQuantity)
  this.ordersForm.get('materialTYpe')?.setValue(this.importData.materialTypeName)
  this.ordersForm.get('driver')?.setValue({ firstName: this.importData.driverName, driverID: this.importData.driverID })
  this.ordersForm.get('triler')?.setValue({ trailerNumber: this.importData.trailerNumber, trailerID: this.importData.trailerID })
  this.ordersForm.get('vechile')?.setValue({ truckID: this.importData.truckID, name: this.importData.truckName })
  this.ordersForm.get('repeatMode')?.setValue(this.importData?.repeatOrder);
  this.selectedDays = dayIndexes;
  this.consigneeID = this.importData.consigneeID
  this.consignorID = this.importData.consignorID
  this.materialID = this.importData.materialID
  // this.selectedDaysIndex    = this.importData.selectedDays;

}


// TimePicker conditions
openTimePicker(controlName ?: any) {
  const dialog: MatDialogRef<TimePickerComponent, any> = this.dialog.open(TimePickerComponent, {
    width: "350px",
    height: 'auto',
    data: this.ordersForm.get(controlName)?.value ? this.datePipe.transform(this.ordersForm.get(controlName)?.value, "hh:mm a") : '',
    panelClass: 'time-picker-container',
    autoFocus: false,
    disableClose: true
  })
  dialog.afterClosed().subscribe((res) => {
    //console.log(res);

    if (res && !(Date.parse(this.ordersForm.get(controlName)?.value) == Date.parse(res))) {
      this.orderTime = res;
      if (this.datePipe.transform(this.ordersForm.get(controlName)?.value, "h:mm a") != res) {
        let dateTime: any = this.datePipe.transform(new Date())?.concat(' ' + res);
        setTimeout(() => {
          this.ordersForm.get(controlName)?.setValue(new Date(dateTime));
          this.setFormattedTime()
        }, 0);
      }

    }
  })

}

// search customer name and details function
searchConsignor(event: any) {
  const value = event.target.value
  this.filteredConsigners = this.consigners.filter((customer: any) => {
    const match = customer.consignorName?.toLowerCase().includes(value.toLowerCase());
    return match;
  });
}
searchConsignee(event: any) {
  const value = event.target.value
  this.filteredConsignee = this.consignees.filter((customer: any) => {
    const match = customer.consigneeName?.toLowerCase().includes(value.toLowerCase());
    return match;
  });
}

}
