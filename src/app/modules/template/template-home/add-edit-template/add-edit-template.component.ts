import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AddVehicleDriverComponent } from 'src/app/modules/orders/orders-home/add-orders/add-vehicle-driver/add-vehicle-driver.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TemplateService } from '../../template.service';
import { DatePipe, Location } from '@angular/common';
import { TimePickerComponent } from 'src/app/shared/components/time-picker/time-picker.component';
import { ConsigneeService } from 'src/app/modules/consignee/consignee.service';
import { MaterialService } from 'src/app/modules/material/material.service';
import { ConsignorService } from 'src/app/modules/consignor/consignor.service';
import { templateModel } from '../../module/addUpdateTemplate';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';




@Component({
  selector: 'app-add-edit-template',
  templateUrl: './add-edit-template.component.html',
  styleUrls: ['./add-edit-template.component.css']
})

export class AddEditTemplateComponent implements OnInit {
  templateForm!: FormGroup
  minDate:any = new Date();
  saveBtnText: any = 'Save'
  imageUrl: any
  selectedFile: any
  imageUrlProfile: any
  selectedFileProfile: any
  vicheclesDrivers: any | any[] = []

  productCategories = ['Category A', 'Category B', 'Category C'];
  organizations = ['Organization 1', 'Organization 2', 'Organization 3'];
  organizationCodes = ['Code 1', 'Code 2', 'Code 3'];
  consigneeAddress:any


  consigners: any | any[] = [
    // {
    //   id: 1,
    //   name: "John Doe",
    //   company: "Doe Logistics",
    //   contact: "+1-234-567-890",
    //   email: "john.doe@example.com",
    //   address: "123 Maple Street, New York, NY",
    //   itemsConsigned: 50,
    // },
    // {
    //   id: 2,
    //   name: "Jane Smith",
    //   company: "Smith Cargo",
    //   contact: "+1-987-654-321",
    //   email: "jane.smith@example.com",
    //   address: "456 Oak Avenue, Los Angeles, CA",
    //   itemsConsigned: 30,
    // },
    // {
    //   id: 3,
    //   name: "David Lee",
    //   company: "Lee Shipping Co.",
    //   contact: "+1-555-666-777",
    //   email: "david.lee@example.com",
    //   address: "789 Pine Road, Chicago, IL",
    //   itemsConsigned: 75,
    // },
    // {
    //   id: 4,
    //   name: "Emily Clark",
    //   company: "Clark Freight Services",
    //   contact: "+1-333-444-555",
    //   email: "emily.clark@example.com",
    //   address: "101 Elm Street, Houston, TX",
    //   itemsConsigned: 60,
    // },
    // {
    //   id: 5,
    //   name: "Michael Brown",
    //   company: "Brown Haulers",
    //   contact: "+1-888-999-000",
    //   email: "michael.brown@example.com",
    //   address: "202 Birch Lane, Miami, FL",
    //   itemsConsigned: 40,
    // },
  ];


  consignees: any | any[] = [
    // {
    //   id: 1,
    //   name: "Alice Green",
    //   company: "Green Retailers",
    //   contact: "+1-555-123-456",
    //   email: "alice.green@example.com",
    //   address: "987 Oak Street, San Francisco, CA",
    //   goodsReceived: 120,
    // },
    // {
    //   id: 2,
    //   name: "Robert Taylor",
    //   company: "Taylor Supplies",
    //   contact: "+1-222-333-444",
    //   email: "robert.taylor@example.com",
    //   address: "654 Pine Avenue, Seattle, WA",
    //   goodsReceived: 80,
    // },
    // {
    //   id: 3,
    //   name: "Sophia Martinez",
    //   company: "Martinez Supermarket",
    //   contact: "+1-777-888-999",
    //   email: "sophia.martinez@example.com",
    //   address: "321 Elm Boulevard, Austin, TX",
    //   goodsReceived: 150,
    // },
    // {
    //   id: 4,
    //   name: "James White",
    //   company: "White Wholesale",
    //   contact: "+1-444-555-666",
    //   email: "james.white@example.com",
    //   address: "789 Birch Drive, Denver, CO",
    //   goodsReceived: 95,
    // },
    // {
    //   id: 5,
    //   name: "Olivia Brown",
    //   company: "Brown Mart",
    //   contact: "+1-999-000-111",
    //   email: "olivia.brown@example.com",
    //   address: "123 Maple Court, Orlando, FL",
    //   goodsReceived: 110,
    // },
  ];

  materialTypes: any | any[] = [
    // {
    //   id: 1,
    //   type: "Steel",
    //   description: "Strong and durable material used in construction and manufacturing.",
    //   properties: {
    //     density: "7.85 g/cm³",
    //     meltingPoint: "1370°C",
    //     tensileStrength: "400 MPa",
    //   },
    //   category: "Metal",
    // },
    // {
    //   id: 2,
    //   type: "Plastic",
    //   description: "Lightweight and flexible material used in packaging and containers.",
    //   properties: {
    //     density: "0.90–2.20 g/cm³",
    //     meltingPoint: "120–250°C",
    //     tensileStrength: "30 MPa",
    //   },
    //   category: "Polymer",
    // },
    // {
    //   id: 3,
    //   type: "Wood",
    //   description: "Natural material commonly used in furniture and construction.",
    //   properties: {
    //     density: "0.5–0.9 g/cm³",
    //     moistureContent: "12–15%",
    //     tensileStrength: "50 MPa",
    //   },
    //   category: "Natural",
    // },
    // {
    //   id: 4,
    //   type: "Aluminum",
    //   description: "Lightweight and corrosion-resistant metal used in aerospace and transportation.",
    //   properties: {
    //     density: "2.7 g/cm³",
    //     meltingPoint: "660°C",
    //     tensileStrength: "90 MPa",
    //   },
    //   category: "Metal",
    // },
    // {
    //   id: 5,
    //   type: "Glass",
    //   description: "Transparent and brittle material used in windows and containers.",
    //   properties: {
    //     density: "2.5 g/cm³",
    //     meltingPoint: "1400–1600°C",
    //     tensileStrength: "33 MPa",
    //   },
    //   category: "Ceramic",
    // },
  ];

  driver:any | any[] = []
  track:any | any[] = []
  trailer:any | any[] = []


  shunterDrivers = [
    {
      id: 1,
      name: "John Smith",
      regNo: "SH12345",
      vehicleType: "Truck",
      vehicleNumber: "AB-123-CD",
    },
    {
      id: 2,
      name: "Emily Johnson",
      regNo: "SH67890",
      vehicleType: "Trailer",
      vehicleNumber: "EF-456-GH",
    },
    {
      id: 3,
      name: "Michael Brown",
      regNo: "SH11223",
      vehicleType: "Forklift",
      vehicleNumber: "IJ-789-KL",
    },
    {
      id: 4,
      name: "Sophia Davis",
      regNo: "SH44556",
      vehicleType: "Van",
      vehicleNumber: "MN-012-OP",
    },
    {
      id: 5,
      name: "James Wilson",
      regNo: "SH77889",
      vehicleType: "Flatbed",
      vehicleNumber: "QR-345-ST",
    },
  ];

  days: { name: string; index: number, text: string }[] = [
    { name: 'M', index: 1, text: 'MON' },
    { name: 'T', index: 2, text: 'TUE' },
    { name: 'W', index: 3, text: 'WED' },
    { name: 'T', index: 4, text: 'THU' },
    { name: 'F', index: 5, text: 'FRI' },
    { name: 'S', index: 6, text: 'SAT' },
    { name: 'S', index: 0, text: 'SUN' },

  ];
  selectedDays: number[] = []; // Store the indexes of selected days
  selectedDayNames: string[] = [];
  consigneeID:any

  consignorID: any;
  consignorAddress: any;
  materialID: any;
  formattedTime:any
  isDaySelected(dayIndex: number): boolean {
    return this.selectedDays.includes(dayIndex);
  }

  getSelectedDayTexts(): string[] {
    return this.selectedDays.map((dayIndex) => {
      const day = this.days.find((d) => d.index === dayIndex);
      return day ? day.text : ''; // Return the 'text' value if the day is found
    });
  }
  orderTime: any;
  constructor(public dialog: MatDialog, public fb: FormBuilder, public sanitizer: DomSanitizer, public datePipe: DatePipe, public templateServ: TemplateService, public location: Location, public utilSer: UtilityService,
    public materialServ: MaterialService, public conginerServ: ConsignorService, public consigServ: ConsigneeService) {
  
  }

  noLeadingSpaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value?.startsWith(' ')) {
        control.value.trim('')
        return { leadingSpace: true }; // Validation error (not actually needed for auto-trim)
      }
      return null; // Valid input
    };
  }
  employeeId:any;
  ngOnInit(): void {

    this.templateForm = this.fb.group({
      templateName: ['' ,[Validators.required,this.noLeadingSpaceValidator()]],
      date: [new Date(),Validators.required],
      time: [new Date(),Validators.required],
      repeatMode: [false],
      consigner: ['', Validators.required],
      consignee: ['', Validators.required],
      notes: [''],
      quantity: [''],
      materialTYpe: ['',Validators.required],
      grossVolume: [''],
      trailerQuantity: ['',Validators.required],
      selectedDays: [],
      selectedDaysIndex: [],
      driver: [],
      triler: [],
      vechile: [],

    });
var user: any = localStorage.getItem("userData");
    this.employeeId = JSON.parse(user);
    this.templateForm.get('templateName')?.valueChanges.subscribe(value => {
      if (value && value.startsWith(' ') && value.trim().length > 0) {
        this.templateForm.get('templateName')?.setValue(value.trimStart(), { emitEvent: false });
      }
    });

    //console.log(this.templateServ.viewTemplateIndex);

    this.templateForm.get('templateId')?.disable()


    if (this.templateServ.editTemplateRecord) {
      //console.log(this.templateServ.editTemplateRecord);
      this.saveBtnText = 'Update'
      this.getTemRecordById(this.templateServ.editTemplateRecord.orderTemplateID)
      // this.settemplateDetails()
    }

    this.setFormattedTime()

    // Check if user has already visited this page before
    if (!sessionStorage.getItem('visited')) {
      sessionStorage.setItem('visited', 'true'); // First visit, mark as visited
      return; // Do nothing on first load
    }

    // If refreshed, redirect
    if (sessionStorage.getItem('refreshed') === 'true') {
      sessionStorage.removeItem('refreshed'); // Clear refresh flag
     this.location.back() // Redirect after refresh
    }
  }

 // Detect Refresh (before page unloads)
 @HostListener('window:beforeunload', ['$event'])
 onBeforeUnload(event: any) {
   sessionStorage.setItem('refreshed', 'true'); // Mark refresh
 }


  private setFormattedTime(): void {
    setTimeout(() => {
      //console.log('tigger');
      
      const timeValue = this.templateForm.get('time')?.value || new Date();
      if (timeValue) {
        this.formattedTime = this.formatTime(timeValue);
      }
    });
  }

  private formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }

 

  getTemRecordById(temId:any){
    //console.log(temId);
    this.templateServ.getTemplateByTemID(temId).then(res => {
      //console.log(res);
      this.settemplateDetails(res[0])
    })
    
  }

  getConsigneeDetailsBySearch(searchKey?:any){
    //console.log(searchKey.value);
    this.templateServ.getConsigneeDetailsBySearch(searchKey.value).then(res => {
      //console.log(res);
      if(res){
        this.consignees = res
      }
    })
  }

  onConsigneeSelect(value:any){
    //console.log(value);
    this.consigneeID = value.consigneeID
    //console.log(this.consigneeID);
    this.consigneeAddress = value;


  }
  getConsignorDetailsBySearch(searchKey?:any){
    //console.log(searchKey.value);
    this.templateServ.getConsignorDetailsBySearch(searchKey.value).then(res => {
      //console.log(res);
      if(res){
        this.consigners = res;
      }
    })
  }

  onConsignorSelect(value:any){
    //console.log(value);
    this.consignorID = value.consignorID
    //console.log(this.consignorID);
    this.consignorAddress = value;

    
  }
  getMaterialDetailsBySearch(searchKey?:any){
    //console.log(searchKey.value);
    this.templateServ.getMaterialsDetailsBySearch(searchKey.value).then(res => {
      //console.log(res);
      if(res){
        this.materialTypes = res
      }
    })
  }

  onMaterialSelect(value:any){
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

  getOffsetDate(date: Date, minutesOffset: number): Date {
    //console.log(date,minutesOffset,'params');
    
    let newDate = new Date(date.getTime() + minutesOffset * 60000);
    //console.log(newDate,'newDate');
    
    return newDate;
  }
  
  
  

  settemplateDetails(response:any) {
    this.minDate = null
    this.templateForm.patchValue(this.templateServ.editTemplateRecord)
    this.templateForm.get('templateName')?.setValue(response.orderTemplateName)
    this.templateForm.get('date')?.setValue(response.orderTemplateDate)
   // Assuming response is the object you're receiving
// const adjustedDate = new Date(response.orderTemplateDate);
// adjustedDate.setHours(adjustedDate.getHours() - 6);
// adjustedDate.setMinutes(adjustedDate.getMinutes() - 30);

// Now, set the adjusted date to the form control
this.templateForm.get('time')?.setValue(response.orderTemplateDate);  // Or you can use adjustedDate.toString() if needed




    this.setFormattedTime()
    this.templateForm.get('repeatMode')?.setValue(response.repeatOrder)
    this.templateForm.get('consigner')?.setValue(response.consignorName)
    this.templateForm.get('consignee')?.setValue(response.consigneeName)
    this.templateForm.get('notes')?.setValue(response.notes)
    // this.templateForm.get('quantity')?.setValue(response)
    this.templateForm.get('materialTYpe')?.setValue(response.materialTypeName)
    this.templateForm.get('trailerQuantity')?.setValue(response.trilerQuantity)
    this.templateForm.get('driver')?.setValue({firstName:response.driverName,driverID:response.driverID})
    this.templateForm.get('triler')?.setValue({trailerNumber:response.trailerNumber,trailerID:response.trailerID})
    this.templateForm.get('vechile')?.setValue({truckID:response.truckID,vechicleNumber:response.truckName})
    this.consigneeID = response.consigneeID
    this.consignorID = response.consignorID
    this.materialID = response.materialID
    this.consigneeAddress = {address1:response.consigneeAddress,city:response.consigneeCity,pincode:response?.consigneePincode,country:response.consigneeCountry,state:response.consigneeState}
    this.consignorAddress = {address1:response.consignorAddress,city:response.consignorCity,pincode:response?.consignorPincode,country:response.consignorCountry,state:response.consignorState}

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
const dayIndexes = dayAbbreviations.map((day:any) => dayIndexMap[day]);

//console.log("Day Indexes:", dayIndexes);
    this.selectedDays = dayIndexes

  }

  

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0].name;
      this.templateForm.get('selectedFiletemplateLicense')?.setValue(this.selectedFile.name)
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrl = reader.result as string;
        // Set the raw data URL in the form control
        this.templateForm.get('templateLicensePhoto')?.setValue(imageDataUrl);
        // Set the sanitized URL for display only
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(imageDataUrl) as SafeUrl;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onFileSelectedProfile(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFileProfile = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrlProfile = reader.result as string;
        // Set the raw data URL in the form control
        this.templateForm.get('profileImage')?.setValue(imageDataUrlProfile);
        // Set the sanitized URL for display only
        this.imageUrlProfile = this.sanitizer.bypassSecurityTrustUrl(imageDataUrlProfile) as SafeUrl;
      };
      reader.readAsDataURL(this.selectedFileProfile);
    }
  }



  deleteProfile() {
    this.selectedFileProfile = null
    this.imageUrlProfile = null
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
          this.location.back()
        }
      })
    }

  onSubmitandClose(): void {

    const selectedDayTexts = this.getSelectedDayTexts();

    //console.log(selectedDayTexts);
    this.templateForm.get('selectedDays')?.setValue(selectedDayTexts)
    this.templateForm.get('selectedDaysIndex')?.setValue(this.selectedDays)

    //console.log(this.templateForm.value);
    const formValues = this.templateForm.getRawValue();
    if (this.templateForm.valid) {
      //console.log('if');

      if (this.templateServ.editTemplateRecord != null) {
        //console.log(this.templateForm.value);
        const orderObject = {
          CheckBox: false, // Default value as not present in the form
          "Order no": formValues.templateId,
          "Collection date": formValues.orderDateAndTime,
          "Consignor": formValues.consigner,
          "Consignee": formValues.consignee,
          "Vehicle": formValues.vehicleNo,
          "Trailer": formValues.triler,
          "Driver": formValues.driver,
          "Material": formValues.materialTYpe,
          "Time tipped": "", // Empty value
          "Net weight": "", // Empty value
          "Shunter driver": formValues.shuntDriverName,
          "Bin no": formValues.binNo,
          "Ticket no": "", // Empty value
          "Mov Doc No.": "", // Empty value
          "Operator": "", // Empty value
          "Quantity": formValues.quantity,
          "Progress": "In progress", // Default value
          "more": "", // Empty value
          "selectedIndex": this.selectedDays
        };
        //console.log(orderObject);


        this.templateServ.templateList.splice(this.templateServ.viewTemplateIndex, 1, this.templateForm.value)
        this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Template edited successfully.' })
        this.back()
        // Process the form submission here
      } else {
        //console.log('else');
        //console.log(this.templateForm.value);
        const orderObject = {
          CheckBox: false, // Default value as not present in the form
          "Order no": '000' + this.templateServ.templateList.length + 1,
          "Collection date": formValues.orderDateAndTime,
          "Consignor": formValues.consigner,
          "Consignee": formValues.consignee,
          "Vehicle": formValues.vehicleNo,
          "Trailer": formValues.triler,
          "Driver": formValues.driver,
          "Material": formValues.materialTYpe,
          "Time tipped": "", // Empty value
          "Net weight": "", // Empty value
          "Shunter driver": formValues.shuntDriverName,
          "Bin no": formValues.binNo,
          "Ticket no": "", // Empty value
          "Mov Doc No.": "", // Empty value
          "Operator": "", // Empty value
          "Quantity": formValues.quantity,
          "Progress": "In progress", // Default value
          "more": "" // Empty value
        };
        //console.log(orderObject);

        this.templateServ.templateList.push(this.templateForm.value)

        this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Template added successfully.' })
        this.back()
      }
    }
    else {

      //console.log('Form is not valid');

    }




    //console.log(this.templateServ);

  }
  onSubmitandAddAnother(): void {
    //console.log(this.templateForm.value);


    if (this.templateForm.valid) {
      //console.log(this.templateForm.value);
      this.templateServ.templateList.push(this.templateForm.value)
      this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Template added successfully.' })

      // Process the form submission here
      this.templateForm.reset()
    } else {
      //console.log('Form is not valid');
    }

    //console.log(this.templateServ);

  }

  // getSelectedDayTexts(): string[] {
  //   return this.selectedDays.map((dayIndex) => {
  //     const day = this.days.find((d) => d.index === dayIndex);
  //     return day ? day.text : ''; // Return the 'text' value if the day is found
  //   });
  // }

  saveUpdateTemplates(){

   
    //console.log(this.selectedDays);
    
    let templateModels:templateModel = new templateModel()
    const formValues = this.templateForm.value;
    //console.log(formValues);
    //console.log(formValues.triler);

    // Parse the date and time
const datePart = new Date(formValues.date);
const timePart = new Date(formValues.time);
//console.log(datePart,timePart);

// Combine date and time
// const combinedDateTime = new Date(
//   datePart.getUTCFullYear(),
//   datePart.getUTCMonth(),
//   datePart.getUTCDate(),
//   timePart.getUTCHours(),
//   timePart.getUTCMinutes(),
//   timePart.getUTCSeconds()
// )
// //console.log(combinedDateTime);
const combinedDateTime = new Date(
  datePart.getFullYear(),  
  datePart.getMonth(),
  datePart.getDate(),
  timePart.getHours(),
  timePart.getMinutes(),
  timePart.getSeconds()
);


// const combinedDateTimeString = combinedDateTime;
// //console.log(new Date(combinedDateTimeString) );


//  let utcNow = combinedDateTime;
//  //console.log(utcNow,'utc');
 
//  let localTime = this.getOffsetDate(utcNow, -utcNow.getTimezoneOffset()); 
//  //console.log(localTime,'localTime');


// //console.log(combinedDateTimeString);

// const formattedDate = this.datePipe.transform(combinedDateTime, 'dd/MM/yyyy hh:mm:ss a');
// //console.log(formattedDate);



    //console.log(this.getSelectedDayTexts());

    // console.log(combinedDateTime.getFullYear() + '-' +
    // String(combinedDateTime.getMonth() + 1).padStart(2, '0') + '-' +
    // String(combinedDateTime.getDate()).padStart(2, '0') + 'T' +
    // String(combinedDateTime.getHours()).padStart(2, '0') + ':' +
    // String(combinedDateTime.getMinutes()).padStart(2, '0') + ':' +
    // String(combinedDateTime.getSeconds()).padStart(2, '0'));
    
    
    
    if(this.templateForm.valid){
      templateModels.OrderTemplateID = this.templateServ?.editTemplateRecord?.orderTemplateID || 0
      templateModels.OrderTemplateName = formValues.templateName
      // templateModels.OrderTemplateDate = combinedDateTime.toISOString();
      const formattedLocalDate = combinedDateTime.getFullYear() + '-' +
  String(combinedDateTime.getMonth() + 1).padStart(2, '0') + '-' +
  String(combinedDateTime.getDate()).padStart(2, '0') + 'T' +
  String(combinedDateTime.getHours()).padStart(2, '0') + ':' +
  String(combinedDateTime.getMinutes()).padStart(2, '0') + ':' +
  String(combinedDateTime.getSeconds()).padStart(2, '0');

templateModels.OrderTemplateDate = formattedLocalDate;
//console.log(templateModels.OrderTemplateDate);

// const combinedDateTimeUTC = new Date(Date.UTC(
//   combinedDateTime.getFullYear(),
//   combinedDateTime.getMonth(),
//   combinedDateTime.getDate(),
//   combinedDateTime.getHours(),
//   combinedDateTime.getMinutes(),
//   combinedDateTime.getSeconds()
// ));

// templateModels.OrderTemplateDate = combinedDateTimeUTC.toISOString();
//console.log(templateModels.OrderTemplateDate);

      templateModels.RepeatOrder  = formValues.repeatMode 
      templateModels.ConsignorID = Number(this.consignorID )
      templateModels.ConsigneeID = Number(this.consigneeID )
      templateModels.MaterialID = Number(this.materialID )
      templateModels.TruckID  = formValues.vechile?.truckID
      templateModels.DriverID  = formValues.driver?.driverID
      templateModels.TrailerID = formValues.triler?.trailerID
      templateModels.TrilerQuantity = Number(formValues.trailerQuantity) 
      templateModels.RepeatDays = formValues.repeatMode ? this.getSelectedDayTexts().toString().startsWith(",") ? this.getSelectedDayTexts().toString().substring(1) : this.getSelectedDayTexts().toString() : ''
      templateModels.EmployeeId  = this.employeeId.employeeId;
      templateModels.Notes = formValues.notes 
//console.log(templateModels);

      this.templateServ.addUpdateTemplates(templateModels).then(res => {
        //console.log(res);
        if(res){
          if(this.templateServ?.editTemplateRecord){
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Template edited successfully.' })
          }
          else{
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Template added successfully.' })
          }
          this.location.back()
        }
      })

    }
    else{

    }
  }

  deleteLicensePhoto() {
    this.selectedFile = null
    this.imageUrl = null
  }


  addVicheclsAndDrivers(data?: any, index?: any) {
    var dia = this.dialog.open(AddVehicleDriverComponent, {
      panelClass: 'add-bin',
      position: { right: "0" },
      height: "100vh",
      disableClose: true,
      data:  {vechile:this.templateForm.value.vechile || '',driver:this.templateForm.value.driver || '',trailer:this.templateForm.value.triler || ''},
    })


    dia.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        //console.log(res);
        this.vicheclesDrivers = res
        this.templateForm.get('vechile')?.setValue(this.vicheclesDrivers.vehicle)
        this.templateForm.get('triler')?.setValue(this.vicheclesDrivers.trailer)
        this.templateForm.get('driver')?.setValue(this.vicheclesDrivers.driver)

        // this.binList = this.settingServ.binRecords
      }

    })
  }

  selectedShunterDriver(driver: any) {
    this.templateForm.get('vehicleNo')?.setValue(driver.vehicleNumber)
    this.templateForm.get('vehicleType')?.setValue(driver.vehicleType)
    this.templateForm.get('regNo')?.setValue(driver.regNo)
  }

  // TimePicker conditions
  openTimePicker(controlName?: any) {
    const dialog: MatDialogRef<TimePickerComponent, any> = this.dialog.open(TimePickerComponent, {
      width: "350px",
      height: 'auto',
      data: this.templateForm.get(controlName)?.value ? this.datePipe.transform(this.templateForm.get(controlName)?.value, "hh:mm a") : '',
      panelClass: 'time-picker-container',
      autoFocus: false,
      disableClose: true
    })
    dialog.afterClosed().subscribe((res) => {
      //console.log(res);

      if (res && !(Date.parse(this.templateForm.get(controlName)?.value) == Date.parse(res))) {
        this.orderTime = res;
        if (this.datePipe.transform(this.templateForm.get(controlName)?.value, "h:mm a") != res) {
          let dateTime: any = this.datePipe.transform(new Date())?.concat(' ' + res);
          setTimeout(() => {
            this.templateForm.get(controlName)?.setValue(new Date(dateTime));
          this.setFormattedTime()

          }, 0);
        }

      }
    })

  }
}
