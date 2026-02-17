import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OrdersService } from '../../orders.service';
import { DatePipe, Location } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddVehicleDriverComponent } from './add-vehicle-driver/add-vehicle-driver.component';
import { ConsigneeService } from 'src/app/modules/consignee/consignee.service';
import { ConsignorService } from 'src/app/modules/consignor/consignor.service';
import { MaterialService } from 'src/app/modules/material/material.service';
import { ImportTemplateComponent } from './import-template/import-template.component';
import { TemplateService } from 'src/app/modules/template/template.service';
import { TimePickerComponent } from 'src/app/shared/components/time-picker/time-picker.component';
import { TrailerService } from 'src/app/modules/trailer/trailer.service';
import { addUpdateOrderModel, statusUpadte, transitModel } from '../order-model/addUpdateOrderModel';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { weighbridgeModel } from 'src/app/modules/tasks/tasks-home/task-model/weighbridgeModel';
import { TasksService } from 'src/app/modules/tasks/tasks.service';
import { platsiteManagerModel } from 'src/app/modules/tasks/tasks-home/task-model/platsiteManager';
import { CanComponentDeactivate } from 'src/app/shared/guard/can-deactivate.guard';
import { from, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-add-orders',
  templateUrl: './add-orders.component.html',
  styleUrls: ['./add-orders.component.css'],
})
export class AddOrdersComponent implements OnInit, CanComponentDeactivate {
  ordersForm!: FormGroup
  minDate: any = new Date();
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
  isClickable: boolean = false
  days: { name: string; index: number, text: string }[] = [
    { name: 'M', index: 1, text: 'MON' },
    { name: 'T', index: 2, text: 'TUE' },
    { name: 'W', index: 3, text: 'WED' },
    { name: 'T', index: 4, text: 'THU' },
    { name: 'F', index: 5, text: 'FRI' },
    { name: 'S', index: 6, text: 'SAT' },
    { name: 'S', index: 0, text: 'SUN' },

  ];
  trailers: any | any[] = []


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

  filteredConsigners: any
  filteredConsignee: any
  shunterDrivers: any | any[] = [
    // {
    //   id: 1,
    //   name: "John Paul",
    //   regNo: "SH12345",
    //   vehicleType: "Truck",
    //   vehicleNumber: "AB-123-CD",
    // },
    // {
    //   id: 2,
    //   name: "Emily Johnson",
    //   regNo: "SH67890",
    //   vehicleType: "Trailer",
    //   vehicleNumber: "EF-456-GH",
    // },
    // {
    //   id: 3,
    //   name: "Michael Brown",
    //   regNo: "SH11223",
    //   vehicleType: "Forklift",
    //   vehicleNumber: "IJ-789-KL",
    // },
    // {
    //   id: 4,
    //   name: "Sophia Davis",
    //   regNo: "SH44556",
    //   vehicleType: "Van",
    //   vehicleNumber: "MN-012-OP",
    // },
    // {
    //   id: 5,
    //   name: "James Wilson",
    //   regNo: "SH77889",
    //   vehicleType: "Flatbed",
    //   vehicleNumber: "QR-345-ST",
    // },
  ];
  selectedDays: number[] = [];

  logedInUser: any | any[] = [];
  templateServ: any;
  consigneeID: any;
  consignorID: any;
  consignorAddress: any;
  consigneeAddress: any;
  materialID: any;
  userProfile: any;
  formattedTime: any
  isDraft: boolean = false
  isAssignedText = 'Save & Assign to driver';
  invalidConsignor: boolean = false;
  invalidConsignee: boolean = false;
  invalidProduct: boolean = false;
  isDaySelected(dayIndex: number): boolean {
    return this.selectedDays.includes(dayIndex);
  }

  getSelectedDayTexts(): string[] | string | any {
    return this.selectedDays?.map((dayIndex) => {
      const day = this.days.find((d) => d.index === dayIndex);
      return day ? day.text : ''; // Return the 'text' value if the day is found
    });
  }
  orderStatus: any;


  constructor(public triServ: TrailerService, public materialServ: MaterialService, public tempSer: TemplateService, public conginerServ: ConsignorService, public consigServ: ConsigneeService, public dialog: MatDialog, public fb: FormBuilder, public sanitizer: DomSanitizer, public ordersServ: OrdersService, public location: Location,
    public utilSer: UtilityService, public datePipe: DatePipe, public taskServ: TasksService) {
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

  noLeadingSpaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && control.value.startsWith(' ')) {
        return { leadingSpace: true };
      }
      return null;
    };
  }



  trailerNumberValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const pickUpTrailerNoControl = formGroup.get('pickUpTrailerNo');
      const trilerControl = formGroup.get('triler');

      if (!pickUpTrailerNoControl || !trilerControl) {
        return null;
      }

      const pickUpTrailerNo = pickUpTrailerNoControl.value;
      const trailer = trilerControl.value;

      if (pickUpTrailerNo && trailer?.trailerNumber && pickUpTrailerNo === trailer.trailerNumber) {
        pickUpTrailerNoControl.setErrors({ ...pickUpTrailerNoControl.errors, trailerNumberMismatch: true });
      } else {
        if (pickUpTrailerNoControl.hasError('trailerNumberMismatch')) {
          const errors = { ...pickUpTrailerNoControl.errors };
          delete errors.trailerNumberMismatch;
          pickUpTrailerNoControl.setErrors(Object.keys(errors).length ? errors : null);
        }
      }

      return null;
    };
  }



  ngOnInit(): void {

    //console.log(this.tempSer.templateList);
    this.ordersForm = this.fb.group({
      ordersId: [''],
      // orderDateAndTime: [''],
      date: ['', Validators.required],
      movDocEnddate: [],
      time: [new Date(), Validators.required],
      consigner: ['', {
        validators: [Validators.required],
        asyncValidators: [this.customValidation(this.ordersServ)],
        updateOn: 'change'
      }],
      consignee: ['', {
        validators: [Validators.required],
        asyncValidators: [this.consigneeValidation(this.ordersServ)],
        updateOn: 'change'
      }],
      pickUpTrailerNotes: [''],
      pickUpTrailerNo: ['', [Validators.required, this.noLeadingSpaceValidator(),]],
      notes: [''],
      repeatMode: [false],
      trailerQuantity: ['', Validators.required],
      materialTYpe: ['', {
        validators: [Validators.required],
        asyncValidators: [this.productValidation(this.ordersServ)],
        updateOn: 'change'
      }],
      grossVolume: [''],
      description: [''],
      grossWeight: [''],
      grossDateTime: [''],
      tareWeight: [''],
      tareWeightDateTime: [''],
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
      weighbridgeOperator: [],
      ticketNo: [],
      movementDocno: [],
      tareTime: [],
      tareDate: [],
      grossTime: [],
      grossDate: [''],
      tareWeightDate: [''],


    },
      { validators: this.trailerNumberValidator() });

    this.ordersForm.get('consigner')?.valueChanges.subscribe((res: any) => {
      if (!res) {
        this.ordersServ.getConsignorDetailsBySearch(" ").then((res: any) => {
          //console.log(res);
          if (res) {
            this.consigners = res
          }
        })
      }
    })
    this.ordersForm.get('consignee')?.valueChanges.subscribe((res: any) => {
      if (!res) {
        this.ordersServ.getConsigneeDetailsBySearch(" ").then((res: any) => {
          //console.log(res);
          if (res) {
            this.consignees = res
          }
        })
      }
    })
    this.ordersForm.get('materialTYpe')?.valueChanges.subscribe((res: any) => {
      if (!res) {
        this.ordersServ.getMaterialsDetailsBySearch(" ").then((res: any) => {
          //console.log(res);
          if (res) {
            this.materialTypes = res
          }
        })
      }
    })

    this.ordersForm.get('repeatMode')?.valueChanges.subscribe((repeatMode: boolean) => {
      const movDocEnddateControl = this.ordersForm.get('movDocEnddate');

      if (repeatMode) {
        movDocEnddateControl?.setValidators([Validators.required]);
      } else {
        movDocEnddateControl?.clearValidators();
      }

      movDocEnddateControl?.updateValueAndValidity();
    });

    // Get suppliers and consignee list starts
    this.ordersServ.getConsignorDetailsBySearch(" ").then((res: any) => {
      //console.log(res);
      if (res) {
        this.consigners = res
      }
    })
    this.ordersServ.getConsigneeDetailsBySearch(" ").then((res: any) => {
      //console.log(res);
      if (res) {
        this.consignees = res
      }
    })
    this.ordersServ.getMaterialsDetailsBySearch(" ").then((res: any) => {
      //console.log(res);
      if (res) {
        this.materialTypes = res
      }
    })
    // Ends here

    this.ordersForm.get('date')?.setValue(new Date())

    //console.log(this.ordersServ.viewOrdersIndex);

    this.ordersForm.get('ordersId')?.disable()
    let Data: any = localStorage.getItem("userData");
    this.userProfile = JSON.parse(Data);
    //console.log(this.ordersServ.editOrdersRecord)

    if (this.ordersServ?.editOrdersRecord?.status == 'Draft') {
      //console.log('if');

      this.ordersForm.get('triler')?.setValidators([Validators.required])
      this.ordersForm.get('vechile')?.setValidators([Validators.required])
      this.ordersForm.get('driver')?.setValidators([Validators.required])
      this.ordersForm.get('date')?.enable()
      //console.log('update');

      this.ordersForm.get('triler')?.updateValueAndValidity()
      this.ordersForm.get('vechile')?.updateValueAndValidity()
      this.ordersForm.get('driver')?.updateValueAndValidity()
    }
    if (this.ordersServ?.editOrdersRecord == null) {
      //console.log('else');

      this.ordersForm.get('triler')?.clearValidators()
      this.ordersForm.get('vechile')?.clearValidators()
      this.ordersForm.get('driver')?.clearValidators()
      this.ordersForm.updateValueAndValidity()
    }

    if (this.ordersServ.editOrdersRecord?.orderID) {
      this.orderStatus = this.ordersServ.editOrdersRecord?.status;
      this.isDraft = true
      //console.log(this.ordersServ.editOrdersRecord);
      this.saveBtnText = 'Update'
      // if (this.ordersServ?.editOrdersRecord) {
      //   this.isAssignedText = this.ordersServ?.editOrdersRecord.status == 'Draft' ? 'Save & Assign to driver' : 'Update'
      // }
      if (this.logedInUser === 'Weighbridge operator') {
        this.getWeighbridgeRecordWeighID(this.ordersServ.editOrdersRecord.weighbridgeRecordID)
      }
      else if (this.logedInUser === 'Plant Site Manager') {
        this.getPlantSiteRecordByAssignId(this.ordersServ.editOrdersRecord.binAssignmentID)
      }
      else {
        this.getOrdersRecordByOrderID(this.ordersServ.editOrdersRecord.orderID)
      }



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
        'infoShunterDriver'
      ];

      Object.keys(this.ordersForm.controls).forEach(field => {
        const control = this.ordersForm.get(field);

        if (control) {
          if (fieldsToUpdate.includes(field)) {
            // Add required validators for the specified fields
            control.setValidators([Validators.required]);
            control.enable(); // Ensure the field is enabled
          } else {
            // Disable all other fields
            control.clearValidators(); // Clear any existing validators
            control.disable(); // Disable the field
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

          if (fieldsToEnable.includes(field)) {
            control.enable();
          }
          else {
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
    // if (sessionStorage.getItem('refreshed') === 'true') {
    //   sessionStorage.removeItem('refreshed');
    //   this.location.back()
    // }
    if (sessionStorage.getItem('refreshed') === 'true') {
      sessionStorage.removeItem('refreshed'); // Clear the flag
      this.location.back() // Redirect after refresh
    }





  }

  // @HostListener('window:beforeunload', ['$event'])
  // onBeforeUnload(event: any) {
  //   event.returnValue = 'Are you sure you want to refresh? You will be redirected.';
  // }

  // @HostListener('window:unload', ['$event'])
  // onUnload(event: any) {
  //   sessionStorage.setItem('refreshed', 'true'); 
  // }

  isSaving: boolean = false
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


  getShuntDriver(event: any) {
    this.taskServ.getShuntDriverBYSearch(event.value).then(res => {
      //console.log(res);
      if (res) {
        this.shunterDrivers = res
      }
    })
  }

  shuntDriverID: any
  getShuntDriverDetails(data: any) {
    this.shuntDriverID = data.shunterDriverID
  }

  binList: any | any[] = []

  getBin() {
    this.taskServ.getBin().then(res => {
      //console.log(res);
      if (res) {
        this.binList = res
      }
    })
  }
  private setFormattedTime(): void {
    setTimeout(() => {
      //console.log('tigger');

      const timeValue = this.ordersForm.get('time')?.value || new Date();
      if (timeValue) {
        this.formattedTime = this.formatTime(timeValue);
      }
    });
  }

  private formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }


  editResponseTasks: any | any = []

  getOrdersRecordByOrderID(id: any) {
    this.ordersServ.getOrderByOrderID(id).then(res => {
      //console.log(res);
      if (res) {
        this.editResponseTasks = res
        this.setOrderDetails(res)

      }
    })
  }
  getWeighbridgeRecordWeighID(id: any) {
    this.ordersServ.getWeighbridgeRecordsByWeighbridgeId(id).then(res => {
      //console.log(res);
      if (res) {
        this.editResponseTasks = res
        this.setOrderDetails(res)

      }
    })
  }

  getPlantSiteRecordByAssignId(id: any) {
    //console.log(id);

    this.ordersServ.getPlantSiteRecordByBinAssignedId(id).then(res => {
      //console.log(res);
      if (res) {
        this.editResponseTasks = res
        this.setOrderDetails(res)

      }
    })
  }

  setOrderDetails(response: any) {

    this.ordersForm.get('date')?.setValue(response.orderDate);
    if (response.status == 'Draft' && this.logedInUser == 'Transportation Manager') {
      this.ordersForm.get('date')?.enable();
    }
    else {
      this.ordersForm.get('date')?.disable();
    }
    this.ordersForm.get('ordersId')?.setValue(response.orderID)
    this.ordersForm.get('time')?.setValue(response.orderDate)
    this.setFormattedTime()
    this.ordersForm.get('repeatMode')?.setValue(response.repeatOrder)
    this.ordersForm.get('consigner')?.setValue(response.consignorName)
    this.ordersForm.get('consignee')?.setValue(response.consigneeName)
    this.ordersForm.get('notes')?.setValue(response.notes)
    // this.ordersForm.get('quantity')?.setValue(response)
    this.ordersForm.get('materialTYpe')?.setValue(response.materialType)
    this.ordersForm.get('trailerQuantity')?.setValue(response.quantity)
    this.ordersForm.get('pickUpTrailerNotes')?.setValue(response.pickupTrailerNotes)
    this.ordersForm.get('pickUpTrailerNo')?.setValue(response.pickupTrailerNo)
    this.ordersForm.get('grossDate')?.setValue(response.grossWeightDateTime)
    this.ordersForm.get('grossTime')?.setValue(response.grossWeightDateTime)
    this.ordersForm.get('grossWeight')?.setValue(response.grossWeight)
    this.ordersForm.get('tareDate')?.setValue(response.tareWeightDateTime)
    this.ordersForm.get('tareTime')?.setValue(response.tareWeightDateTime)
    this.ordersForm.get('tareWeight')?.setValue(response.tareWeight)
    this.ordersForm.get('movementDocno')?.setValue(response.orderNo)
    this.ordersForm.get('ticketNo')?.setValue(response.weighbridgeTicketno || response.ticketNo)
    this.ordersForm.get('weighbridgeOperator')?.setValue(response.weighBridgeOperator)
    this.ordersForm.get('infoShunterDriver')?.setValue(response.comment)
    this.ordersForm.get('binName')?.setValue(response.binID)
    this.ordersForm.get('shuntDriverName')?.setValue(response.shunterDriverName)
    if (response.driverName || response.driverID) {
      this.ordersForm.get('driver')?.setValue({ firstName: response.driverName, driverID: response.driverID })
    }
    if (response.trailerNumber || response.trailerID) {
      this.ordersForm.get('triler')?.setValue({ trailerNumber: response.trailerNumber, trailerID: response.trailerID })
    }
    if (response.truckID || response.truckNumber) {
      this.ordersForm.get('vechile')?.setValue({ truckID: response.truckID, vechicleNumber: response.truckNumber })
    }
    this.consigneeID = response.consigneeID
    this.consignorID = response.consignorID
    this.materialID = response.materialID
    this.consignorAddress = { address1: response.consignorAddress1, city: response.consignorCity, pincode: response?.consignorPincode, country: response.consignorCounty, state: response.consignorState }
    this.consigneeAddress = { address1: response.consigneeAddress1, city: response.consigneeCity, pincode: response?.consigneePincode, country: response.consigneeCountry, state: response.consigneeState }
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
    const dayAbbreviations = response.repeatDays?.split(",");

    // Map each abbreviation to its index
    const dayIndexes = dayAbbreviations?.map((day: any) => dayIndexMap[day]);

    //console.log("Day Indexes:", dayIndexes);
    this.selectedDays = dayIndexes

  }

  getConsigneeDetailsBySearch(searchKey?: any) {
    //console.log(searchKey.value);
    this.ordersServ.getConsigneeDetailsBySearch(searchKey.value).then((res: any) => {
      //console.log(res);
      if (res.length > 0) {
        this.invalidConsignee = false;
        this.consignees = res
      } else {
        this.consignees = [];
        this.invalidConsignee = true;
      }
    })
  }

  onConsigneeSelect(value: any) {
    //console.log(value);
    this.consigneeID = value.consigneeID
    this.consigneeAddress = value
    //console.log(this.consigneeID);

  }
  getConsignorDetailsBySearch(searchKey?: any) {
    //console.log(searchKey.value);
    this.ordersServ.getConsignorDetailsBySearch(searchKey.value).then((res: any) => {
      // this.consigners = res.length ? res : [];
      if (res.length) {
        this.invalidConsignor = false;

        this.consigners = res;
        // this.ordersForm.get('consigner')?.setAsyncValidators(this.customVAlidation());
        this.ordersForm.get('consigner')?.updateValueAndValidity()
      }
      else {
        this.consigners = res;
        this.invalidConsignor = true;
        // this.ordersForm.get('consigner')?.setValue('');
        // this.ordersForm.get('consigner')?.setAsyncValidators(this.customVAlidation());
        this.ordersForm.get('consigner')?.updateValueAndValidity()

      }

    })
  }

  // //email validation
  customValidation(ordersServ: OrdersService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value ? control.value : ' ';
      //console.log(value);

      return from(ordersServ.getConsignorDetailsBySearch(value)).pipe(
        map((res: any[]) => {
          this.consigners = res;
          return res.length ? null : { noFound: true };
        }),
        catchError(() => of(null))
      );
    };
  }
  consigneeValidation(ordersServ: OrdersService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return from(ordersServ.getConsigneeDetailsBySearch(control.value)).pipe(
        map((res: any[]) => {
          this.consignees = res;
          return res.length ? null : { noFound: true };
        }),
        catchError(() => of(null))
      );
    };
  }
  productValidation(ordersServ: OrdersService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return from(ordersServ.getMaterialsDetailsBySearch(control.value)).pipe(
        map((res: any[]) => {
          this.materialTypes = res;
          return res.length ? null : { noFound: true };
        }),
        catchError(() => of(null))
      );
    };
  }

  get conValue() {
    return this.ordersForm?.get('consigner')?.value;
  }

  onConsignorSelect(value: any) {
    //console.log(value);
    this.supplierID = value.consignorID
    this.consignorID = value.consignorID
    //console.log(this.consignorID);
    this.consignorAddress = value
    this.getWashedTrailers()
  }
  getMaterialDetailsBySearch(searchKey?: any) {
    //console.log(searchKey.value);
    this.ordersServ.getMaterialsDetailsBySearch(searchKey.value).then((res: any) => {
      //console.log(res);
      if (res.length > 0) {
        this.invalidProduct = false;
        this.materialTypes = res
      } else {
        this.materialTypes = [];
        this.invalidProduct = true;
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
    this.imageUrl = this.ordersServ?.editOrdersRecord?.ordersLicensePhoto
    this.imageUrlProfile = this.ordersServ?.editOrdersRecord?.profileImage
    this.selectedFile = this.ordersServ?.editOrdersRecord?.selectedFileordersLicense
    this.selectedDays = this.ordersServ?.editOrdersRecord?.totalFormData?.selectedDaysIndex
    this.ordersForm.setValue({
      ordersId: this.ordersServ?.editOrdersRecord["Order no"] || '', // No matching key in JSON
      // orderDateAndTime: this.ordersServ?.editOrdersRecord["Collection date"] || '',
      date: this.ordersServ?.editOrdersRecord["Collection date"] || '',
      time: this.ordersServ?.editOrdersRecord["time"] || new Date(),
      repeatMode: this.ordersServ?.editOrdersRecord?.totalFormData.repeatMode || false,
      selectedDays: this.ordersServ?.editOrdersRecord?.totalFormData.selectedDays,
      selectedDaysIndex: this.ordersServ?.editOrdersRecord?.totalFormData.selectedDaysIndex,
      consigner: this.ordersServ?.editOrdersRecord["Consignor"] || '',
      consignee: this.ordersServ?.editOrdersRecord["Consignee"] || '',
      notes: '', // No matching key in JSON
      trailerQuantity: this.ordersServ?.editOrdersRecord["Material quantity"] || '',
      pickUpTrailerNotes: this.ordersServ?.editOrdersRecord["pickUpTrailerNotes"] || '',
      pickUpTrailerNo: this.ordersServ?.editOrdersRecord["Pickup trailer no"] || '',
      materialTYpe: this.ordersServ?.editOrdersRecord["Material"] || '',
      grossVolume: '', // No matching key in JSON
      description: '', // No matching key in JSON
      grossWeight: '', // No matching key in JSON
      grossDateTime: '', // No matching key in JSON
      tareWeight: '', // No matching key in JSON
      tareWeightDateTime: '', // No matching key in JSON
      temperature: '', // No matching key in JSON
      water: '', // No matching key in JSON
      totalWater: '', // No matching key in JSON
      netWater: this.ordersServ?.editOrdersRecord["Net weight"] || '',
      temperatureNotes: '', // No matching key in JSON
      shuntDriverName: this.ordersServ?.editOrdersRecord["Shunter driver"] || '',
      regNo: '', // No matching key in JSON
      vehicleType: '', // No matching key in JSON
      vehicleNo: this.ordersServ?.editOrdersRecord["Vehicle"] || '',
      binNo: this.ordersServ?.editOrdersRecord["Bin no"] || '',
      binName: '', // No matching key in JSON
      pickupPoint: '', // No matching key in JSON
      infoShunterDriver: '', // No matching key in JSON
      driver: this.ordersServ?.editOrdersRecord["Driver"] || '',
      vechile: this.ordersServ?.editOrdersRecord.totalFormData.vechile || '',
      triler: this.ordersServ?.editOrdersRecord["Trailer"] || '',
      // repeatMode: this.ordersServ.editOrdersRecord["repeatMode"]
    });

    this.setValuesOrders()

  }

  setValuesOrders() {

  }


  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0].name;
      this.ordersForm.get('selectedFileordersLicense')?.setValue(this.selectedFile.name)
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrl = reader.result as string;
        // Set the raw data URL in the form control
        this.ordersForm.get('ordersLicensePhoto')?.setValue(imageDataUrl);
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
        this.ordersForm.get('profileImage')?.setValue(imageDataUrlProfile);
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
        this.isSaving = true
        this.location.back()
      }
    })
  }

  trailerDropID: any
  getTrailerDropId(trailerDropId: any) {
    this.trailerDropID = trailerDropId
  }


  onSubmitandClose(Status?: any): void {
    if (this.ordersForm.valid) {
      this.ordersForm.markAllAsTouched()
    }
    //console.log(Status, 'fjaoifiasfhui');

    if (this.logedInUser == 'Weighbridge operator') {
      this.updateWeighBridge()
    }
    else if (this.logedInUser == 'Plant Site Manager') {
      this.addUpdatePlatSiteManager()
    }
    else {

      if (Status == 'Assigned') {
        //console.log(this.ordersForm.valid);

        this.ordersForm.get('triler')?.setValidators([Validators.required])
        this.ordersForm.get('vechile')?.setValidators([Validators.required])
        this.ordersForm.get('driver')?.setValidators([Validators.required])
        this.ordersForm.get('pickUpTrailerNo')?.setValidators([Validators.required, this.noLeadingSpaceValidator()])
        //console.log('update');

        this.ordersForm.get('triler')?.updateValueAndValidity()
        this.ordersForm.get('vechile')?.updateValueAndValidity()
        this.ordersForm.get('driver')?.updateValueAndValidity()


        const formInvalid = this.ordersForm.invalid;
        const trailerInvalid = this.ordersForm.get('trailer')?.invalid;
        const driverInvalid = this.ordersForm.get('driver')?.invalid;
        const vehicleInvalid = this.ordersForm.get('vehicle')?.invalid; // Fixed typo from 'vechile' to 'vehicle'

        // First, check if any fields other than trailer, driver, and vehicle are invalid
        const otherFieldsInvalid = Object.keys(this.ordersForm.controls)
          .filter(key => !['triler', 'driver', 'vechile'].includes(key)) // Fixed typo from 'triler' to 'trailer'
          .some(key => this.ordersForm.get(key)?.invalid);

        if (otherFieldsInvalid) {
          this.utilSer.toaster.next({
            type: customToaster.errorToast,
            message: 'Please enter all the required fields!'
          });
          this.ordersForm.markAllAsTouched();
          return;
        }

        // If only trailer, driver, or vehicle are invalid, show a different message
        if (trailerInvalid || driverInvalid || vehicleInvalid) {
          this.utilSer.toaster.next({
            type: customToaster.errorToast,
            message: 'Please select the Trailer, Driver, and Vehicle!'
          });
          this.ordersForm.markAllAsTouched();
          return;
        }
        //console.log(this.ordersForm.valid);
      }
      if (Status == 'Draft') {
        //console.log(this.ordersForm.valid);

        this.ordersForm.get('triler')?.clearValidators()
        this.ordersForm.get('vechile')?.clearValidators()
        this.ordersForm.get('driver')?.clearValidators()
        this.ordersForm.get('pickUpTrailerNo')?.clearValidators()
        this.ordersForm.get('pickUpTrailerNo')?.updateValueAndValidity()
        this.ordersForm.get('triler')?.updateValueAndValidity()
        this.ordersForm.get('vechile')?.updateValueAndValidity()
        this.ordersForm.get('driver')?.updateValueAndValidity()


        const formInvalid = this.ordersForm.invalid;
        const trailerInvalid = this.ordersForm.get('trailer')?.invalid;
        const driverInvalid = this.ordersForm.get('driver')?.invalid;
        const vehicleInvalid = this.ordersForm.get('vehicle')?.invalid;

        // Get all form controls excluding trailer, driver, and vehicle
        const otherFieldsInvalid = Object.keys(this.ordersForm.controls)
          .filter(key => !['triler', 'driver', 'vechile'].includes(key))
          .some(key => this.ordersForm.get(key)?.invalid);

        if (otherFieldsInvalid) {
          // alert('Form is invalid! Please check all required fields.');
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Please enter all the required fields!' })

          this.ordersForm.markAllAsTouched();
          return;
        }

        if (trailerInvalid || driverInvalid || vehicleInvalid) {
          // alert('Please fill in the required fields: Trailer, Driver, and Vehicle.');
          // this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Movement document has been assigned to driver' })
          // 
          // this.ordersForm.markAllAsTouched();
          // return;
        }

        //console.log(this.ordersForm.valid);
      }

      let toastMsg: any = '';
      //console.log(this.ordersForm.valid);
      let status: any = 'Pending'

      const selectedDayTexts = this.getSelectedDayTexts();

      this.ordersForm.get('selectedDays')?.setValue(selectedDayTexts)
      this.ordersForm.get('selectedDaysIndex')?.setValue(this.selectedDays)
      const formValues = this.ordersForm.getRawValue();


      // Parse the date and time
      const datePart = new Date(formValues.date);
      const timePart = new Date(formValues.time);

      // Combine date and time
      const combinedDateTime = new Date(
        datePart.getFullYear(),
        datePart.getMonth(),
        datePart.getDate(),
        timePart.getHours(),
        timePart.getMinutes(),
        timePart.getSeconds()
      );

      // Convert to ISO string or desired format
      const combinedDateTimeString = combinedDateTime;

      const formattedLocalDate = combinedDateTime.getFullYear() + '-' +
        String(combinedDateTime.getMonth() + 1).padStart(2, '0') + '-' +
        String(combinedDateTime.getDate()).padStart(2, '0') + 'T' +
        String(combinedDateTime.getHours()).padStart(2, '0') + ':' +
        String(combinedDateTime.getMinutes()).padStart(2, '0') + ':' +
        String(combinedDateTime.getSeconds()).padStart(2, '0');

      //console.log(combinedDateTimeString);
      //console.log(this.ordersForm.valid);
      if (this.ordersForm.valid) {
        this.isClickable = true

        //console.log('salfjakhfjiashfjashfakjodhahdajihs');

        let orderModel: addUpdateOrderModel = new addUpdateOrderModel()
        //console.log(Status);


        orderModel.OrderID = this.ordersServ?.editOrdersRecord?.orderID || 0
        orderModel.OrderNo = this.ordersServ?.editOrdersRecord?.orderNo || ''
        orderModel.ConsignorID = Number(this.consignorID)
        orderModel.ConsigneeID = Number(this.consigneeID)
        orderModel.MaterialID = Number(this.materialID)
        orderModel.TruckID = Number(formValues.vechile?.truckID) || null
        orderModel.DriverID = Number(formValues.driver?.driverID) || null
        orderModel.TrailerID = Number(formValues.triler?.trailerID) || null
        orderModel.AssignedBy = this.userProfile.employeeId;
        orderModel.DepartureDateTime = new Date()
        orderModel.ArrivalDateTime = new Date()
        orderModel.Status = Status ? Status : this.orderStatus;
        orderModel.OrderDate = formattedLocalDate
        orderModel.ConfirmedByDriver = false
        orderModel.TotalDistance = ''
        orderModel.Notes = formValues.notes
        orderModel.TicketNo = ''
        orderModel.RepeatOrder = formValues.repeatMode
        orderModel.Quantity = formValues.trailerQuantity.toString() || ''
        orderModel.RepeatDays = formValues.repeatMode ? this.getSelectedDayTexts().toString().startsWith(",") ? this.getSelectedDayTexts().toString().substring(1) : this.getSelectedDayTexts().toString() : ''
        orderModel.PickupTrailerNotes = formValues.pickUpTrailerNotes
        orderModel.PickupTrailerNo = formValues.pickUpTrailerNo
        //console.log(orderModel);

        let statusUpadtes: statusUpadte = new statusUpadte()
        statusUpadtes.DriverID = Number(formValues.driver?.driverID)
        statusUpadtes.TruckID = Number(formValues.vechile?.truckID)
        statusUpadtes.TrailerID = Number(formValues.triler?.trailerID)
        statusUpadtes.Status = Status ? Status : this.orderStatus
        statusUpadtes.TrailerDropId = this.trailerDropID ? this.trailerDropID : 0

        //console.log(statusUpadtes);

        this.ordersServ.changeStatusFor(statusUpadtes).then(res => {
          //console.log(res);

        })


        this.ordersServ.addUpdateOrdersByOrderModel(orderModel).then(res => {
          //console.log(res);
          // this.transitStatusChanges(res)
          //console.log(this.ordersServ.viewOrdersIndex);

          if (res) {
            this.isSaving = true
            if (res.status == 'Assigned') {
              //console.log('1');

              this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Movement document has been assigned to driver' })
              this.location.back()
            }
            else if (this.ordersServ.editOrdersRecord && res.status == 'Assigned') {
              this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Movement document has been updated succesfully' })
              this.location.back()

            }

            else if (res.status == 'Draft' && this.ordersServ.viewOrdersIndex == null) {
              //console.log('3');

              this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Movement document has been added to drafts' })
              this.location.back()
            }
            else if (res.status == 'Draft') {
              //console.log('2');

              this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Movement document has been updated to drafts' })
              this.location.back()
            }

            else if (this.ordersServ.viewOrdersIndex) {
              //console.log('4');

              //console.log('tigger', this.ordersServ.viewOrdersIndex);

              this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Movement document edited successfully' })
              this.location.back()
            }
            else {
              //console.log('5');

              //console.log('tigger', this.ordersServ.viewOrdersIndex);

              this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Movement document added successfully' })
              this.location.back()
            }
          }
        }).catch((error: any) => {
          //console.log(error);
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Something was added incorrectly' })
        })




      }
      else {

      }
    }




  }

  updateWeighBridge() {
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
    if (this.ordersForm.valid) {
      this.isClickable = true

      let weighbridgeModels: weighbridgeModel = new weighbridgeModel()
      weighbridgeModels.WeighbridgeRecordID = this.editResponseTasks.weighbridgeRecordID || 0
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
          if (res) {
            this.isSaving = true
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Weigh details updated successfully.' })
            this.location.back()

          }
          else {

          }
          //   else if(res.status == 'Assigned'){
          //     this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Movement document has been assigned to driver' })
          //       this.location.back()
          //   }
          //   else if(this.taskServ.viewOrdersIndex){
          //       this.utilSer.toaster.next({ type: customToaster.successToast, message: ' Movement document edited successfully' })
          //       this.location.back()
          //   }
          //   else{
          //     this.utilSer.toaster.next({ type: customToaster.successToast, message: ' Movement document added successfully' })
          //     this.location.back()
          //   }
          // }
        }
      })

    }
    else {

    }






  }



  addUpdatePlatSiteManager() {

    let model: platsiteManagerModel = new platsiteManagerModel()


    // shuntDriverName: [''],
    // regNo: [''],
    // vehicleType: [''],
    // vehicleNo: [''],
    // binNo: [''],
    // binName: [''],
    // pickupPoint: [''],
    // infoShunterDriver: [''],

    model.BinAssignmentID = this.editResponseTasks.binAssignmentID || 0
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

    if (this.ordersForm.valid) {
      this.isClickable = true

      this.taskServ.addUpdatePlatSiteManager(model).then(res => {
        //console.log(res);
        if (res) {
          this.isSaving = true
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Bin updated succesfully.' })

          this.location.back()
        }
      })
    }

  }


  transitStatusChanges(response: any) {
    let transitModels: transitModel = new transitModel()

    transitModels.OrderID = response.orderID
    transitModels.Status = response.status
    transitModels.TransitId = 0

    this.ordersServ.changeTransit(transitModels).then(res => {
      //console.log(res);
    })
  }

  onSubmitandAddAnother(): void {
    //console.log(this.ordersForm.value);


    if (this.ordersForm.valid) {
      //console.log(this.ordersForm.value);
      this.ordersServ.ordersList.push(this.ordersForm.value)
      this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Movement document added successfully.' })

      // Process the form submission here
      this.ordersForm.reset()
    } else {
      //console.log('Form is not valid');
    }

    //console.log(this.ordersServ);

  }

  deleteLicensePhoto() {
    this.selectedFile = null
    this.imageUrl = null
  }


  addVicheclsAndDrivers(data?: any, index?: any) {
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
        //console.log(this.ordersForm.get('triler')?.value);

        // this.binList = this.settingServ.binRecords
      }

    })
  }

  selectedShunterDriver(driver: any) {
    this.ordersForm.get('vehicleNo')?.setValue(driver.vehicleNumber)
    this.ordersForm.get('vehicleType')?.setValue(driver.vehicleType)
    this.ordersForm.get('regNo')?.setValue(driver.regNo)
  }


  alreadyTemplateImported: boolean = false

  checkTemplateIsImported() {

    if (this.alreadyTemplateImported) {
      let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
        width: '480px',
        height: 'auto',
        data: { type: messageBox.cancelMessageBox, message: 'If you import a new template, the old template will be replaced by the new template and all your unsaved changes will be discarded. Do you wish to import the template?', title: 'Note' },
        disableClose: true,
        autoFocus: false,
        panelClass: 'custom-msg-box'
      })
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.importTemplate()
        }
      })
    }
    else {
      this.importTemplate()
    }

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
        this.isSaving = false
        this.alreadyTemplateImported = true
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
    // this.ordersForm.get('date')?.setValue(this.importData.orderTemplateDate);
    // this.ordersForm.get('time')?.setValue(this.importData.orderTemplateDate);
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
    this.ordersForm.get('vechile')?.setValue({ truckID: this.importData.truckID, vechicleNumber: this.importData.truckName })
    this.ordersForm.get('repeatMode')?.setValue(this.importData?.repeatOrder);
    this.selectedDays = dayIndexes;
    this.consigneeID = this.importData.consigneeID
    this.supplierID = this.consigneeID
    this.getWashedTrailers()
    this.consignorID = this.importData.consignorID
    this.consignorAddress = { address1: this.importData.consignorAddress, city: this.importData.consignorCity, pincode: this.importData?.consignorPincode, country: this.importData.consignorCountry }
    this.consigneeAddress = { address1: this.importData.consigneeAddress, city: this.importData.consigneeCity, pincode: this.importData?.consigneePincode, country: this.importData.consigneeCountry }
    this.materialID = this.importData.materialID
    // this.selectedDaysIndex    = this.importData.selectedDays;

  }


  // TimePicker conditions
  openTimePicker(controlName?: any) {
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

  supplierID: any
  supplierTrailers: any | any[] = []
  getWashedTrailers(searchKey?: any) {
    this.ordersServ.getAllWashedTrailers(this.supplierID, searchKey?.value || '').then(res => {
      //console.log(res);
      if (res) {
        this.supplierTrailers = res
      }
    })
  }



}
