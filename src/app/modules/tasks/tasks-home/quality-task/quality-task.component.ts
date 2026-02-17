import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TasksService } from '../../tasks.service';
import { DatePipe, Location } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TimePickerComponent } from 'src/app/shared/components/time-picker/time-picker.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { Router } from '@angular/router';
import { qualityManagerModel } from '../task-model/qualityManager';

@Component({
  selector: 'app-quality-task',
  templateUrl: './quality-task.component.html',
  styleUrls: ['./quality-task.component.css']
})
export class QualityTaskComponent implements OnInit {

  stage: any = 'stage1'
  active1: boolean = true;
  active2: boolean = false;
  active3: boolean = false;
  check1: boolean = false;
  check2: boolean = false;
  check3: boolean = false;
  orderDetailForm!: FormGroup;
  hygieneCheckForm!: FormGroup;
  rawMaterialsForm!: FormGroup;
  cat3: any = '';
  paperWork: any = '';
  twistLocks: any = '';
  lights: any = '';
  doorSeal: any = '';
  trailerIntegrity: any = '';
  bibClean: any = '';
  centerBarCheck: any = '';
  drainTap: any = '';
  trailerClean: any = '';
  tippingShed: any = '';
  orderDetails: any;
  orderTime: any;
  RawMaterialsLists: any[] = [
    // { name: 'Poultry offal', id: 1 },
    // { name: 'Poultry heads & feet', id: 2 },
    // { name: 'Fat', id: 3 },
    // { name: 'Poultry carcass', id: 4 },
    // { name: 'Lamb', id: 5 },
    // { name: 'Bones', id: 6 },
    // { name: 'Poultry viscera', id: 7 },
    // { name: 'Pork', id: 8 },
    // { name: 'Feathers', id: 9 },
    // { name: 'Mixed mammallian', id: 10 },
  ]
  binSelectionList: any[] = [
    // { name: 'Poultry bin 1', id: 1 },
    // { name: 'Poultry bin 2', id: 2 },
    // { name: 'PAP bin 1', id: 3 },
    // { name: 'PAP bin 2', id: 4 },
    // { name: 'New line bin 1', id: 5 },
    // { name: 'New line bin 2', id: 6 },
    // { name: 'batch cooker bin 1', id: 7 },
  ]
  freshnessCheck: any = 0;
  contaminationTrailer: any = '';
  contaminationBin: any = '';
  supplierRequired: any = '';
  qualityCheckID : any = 0
  userProfile:any | any[] = []

  orderNo:any = 'OR001'

  btnText='Continue'

  constructor(public route: Router, public dialog: MatDialog, public utilServ: UtilityService, public fb: FormBuilder, public datePipe: DatePipe, public taskServ: TasksService, public utilSer: UtilityService, public location: Location) { }

  ngOnInit(): void {
    // this.orderDetails = this.taskServ.taskList[0];
    // Stage 1 Form
    this.orderDetailForm = this.fb.group({
      banksMan: [''],
      operative: [''],
      orderNo: ['', Validators.required],
      orderDate: ['', Validators.required],
      orderTime: [new Date(), Validators.required],
      consignor: ['', Validators.required],
      materialDescription: ['', Validators.required],
      materialQuantity: ['', Validators.required],
    })

    // Stage 2 Form
    this.hygieneCheckForm = this.fb.group({

    })
    // Stage 3 Form
    this.rawMaterialsForm = this.fb.group({
      rawMaterial: ['', Validators.required],
      binSelection: ['', Validators.required],
      temperature: ['', Validators.required],
      comments: [''],
    })

    //console.log(this.taskServ.editTaskRecord);
      if(this.taskServ.editTaskRecord?.qualityCheckID){
        // this.btnText = 'Update'
        this.getOrdersRecord(this.taskServ.editTaskRecord?.qualityCheckID)
    }
    else{
      this.setValuesTask()

    }

    let Data: any = localStorage.getItem("userData");
    this.userProfile = JSON.parse(Data);
    this.getAllMaterials()

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

  getOrdersRecord(id:any){
    this.taskServ.getOrderForQualityManagerRecordById(id).then(res => {
      //console.log(res);
      if(res){
        this.setValuesFromApi(res)

      }
      
    })
  }

  getAllMaterials(){
    this.taskServ.getAllMaterials().then(res => {
      //console.log(res );
      if(res){
        this.RawMaterialsLists = res
      }
      
    })
  }
  getAllBin(){
    this.taskServ.getAllBin().then(res => {
      //console.log(res );
      if(res){
        this.binSelectionList = res
      }
      
    })
  }

  back(){
    this.location.back()
  }



  setValuesTask() {
    this.getAllBin()

    //console.log('salfjakjfkash');
    
    this.qualityCheckID = this.taskServ.editTaskRecord?.qualityCheckID
    //console.log(new Date(this.taskServ.editTaskRecord?.['Collection date']));
    this.orderNo = this.taskServ.editTaskRecord?.orderNo
    this.orderDetailForm.get('orderNo')?.setValue(this.taskServ.editTaskRecord?.orderID)
    this.orderDetailForm.get('orderDate')?.setValue(new Date(this.taskServ.editTaskRecord?.orderDate))
    this.orderDetailForm.get('orderTime')?.setValue(new Date(this.taskServ.editTaskRecord?.orderDate))
    this.rawMaterialsForm.get('rawMaterial')?.setValue(this.taskServ.editTaskRecord?.materialID)
    this.rawMaterialsForm.get('binSelection')?.setValue(this.taskServ.editTaskRecord?.binID)
    this.setFormattedTime()
    this.orderDetailForm.get('consignor')?.setValue(this.taskServ.editTaskRecord?.consigneeID)
    this.orderDetailForm.get('materialDescription')?.setValue(this.taskServ.editTaskRecord?.materialType)
    this.orderDetailForm.get('materialQuantity')?.setValue(this.taskServ.editTaskRecord?.quantity)

    this.orderDetailForm.get('orderNo')?.disable()
    this.orderDetailForm.get('orderDate')?.disable()
    this.orderDetailForm.get('orderTime')?.disable()
    this.orderDetailForm.get('consignor')?.disable()
    this.orderDetailForm.get('materialDescription')?.disable()
    this.orderDetailForm.get('materialQuantity')?.disable()


    this.orderDetails = this.taskServ.editTaskRecord
  }


  setValuesFromApi(data:any){
    this.getAllBin()

    this.qualityCheckID = data.qualityCheckID
    this.orderNo= data.orderNo
    this.orderDetailForm.get('operative')?.setValue(data.operative)
    this.orderDetailForm.get('banksMan')?.setValue(data.banksMan)
    this.orderDetailForm.get('orderNo')?.setValue(data.orderNo)
    this.orderDetailForm.get('orderDate')?.setValue(new Date(data.orderDate))
    this.orderDetailForm.get('orderTime')?.setValue(new Date(data.orderDate))
    this.rawMaterialsForm.get('binSelection')?.setValue(data.binId)
    this.rawMaterialsForm.get('rawMaterial')?.setValue(new Date(data.materialID))
    this.setFormattedTime()
    this.orderDetailForm.get('consignor')?.setValue(data.consignorName)
    this.orderDetailForm.get('materialDescription')?.setValue(data.materialDescription || data.materialType)
    this.orderDetailForm.get('materialQuantity')?.setValue(data.quantity)

    this.orderDetailForm.get('orderNo')?.disable()
    this.orderDetailForm.get('orderDate')?.disable()
    this.orderDetailForm.get('orderTime')?.disable()
    this.orderDetailForm.get('consignor')?.disable()
    this.orderDetailForm.get('materialDescription')?.disable()
    this.orderDetailForm.get('materialQuantity')?.disable()

    this.orderDetails = data

    this.cat3 = data.catMaterials ? 'Yes' : 'No'
    this.paperWork = data.paperworkMatchesProduct ? 'Yes' : 'No'
    this.twistLocks = data.twistLocks ? 'Yes' : 'No'
    this.lights = data.lights ? 'Yes' : 'No'
    this.doorSeal = data.doorSeal ? 'Yes' : 'No'
    this.trailerIntegrity = data.trailerIntegrity ? 'Yes' : 'No'
    this.bibClean = data.sheetAndBibClean ? 'Yes' : 'No'
    this.centerBarCheck = data.centerBarCheck ? 'Yes' : 'No'
    this.drainTap = data.drainTap ? 'Yes' : 'No'
    this.trailerClean = data.trailerCleanInsideAndOut ? 'Yes' : 'No'
    this.tippingShed = data.tippingShedFloorAndBinLidClean ? 'Yes' : 'No'
    this.contaminationBin = data.contaminationsBinCheck ? 'Yes' : 'No'
    this.contaminationTrailer = data.contaminationsTrailerCheck ? 'Yes' : 'No'
    this.supplierRequired = data.supplierNonConformance ? 'Yes' : 'No'

    this.rawMaterialsForm.get('comments')?.setValue(data.comments)
    this.rawMaterialsForm.get('temperature')?.setValue(data.temperature)
    this.rawMaterialsForm.get('rawMaterial')?.setValue(data.materialId)

    this.freshnessCheck = data.freshnessCheck
  }

  formattedTareTime: any
  formattedTime: any
  formattedGrossTime: any

  private setFormattedTime(): void {
    setTimeout(() => {
      //console.log('tigger');

      const timeValue = this.orderDetailForm.get('orderTime')?.value || new Date();
      // const tareTimeValue = this.orderDetailForm.get('tareTime')?.value || new Date();
      // const grossTimeValue = this.orderDetailForm.get('grossTime')?.value || new Date();
      if (timeValue) {
        this.formattedTime = this.formatTime(timeValue);
      }
      // if (tareTimeValue) {
      //   this.formattedTareTime = this.formatTime(tareTimeValue);
      // }
      // if (grossTimeValue) {
      //   this.formattedGrossTime = this.formatTime(grossTimeValue);
      // }
    });
  }


  private formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  next(step: any) {
    this.stage = step;
    if (this.stage == 'stage1') {
      this.active1 = true;
      this.active2 = false;
      this.active3 = false;
        this.btnText = 'Continue'

    } else if (this.stage == 'stage2') {
      this.active1 = false;
      this.active2 = true;
      this.active3 = false;
        this.btnText = 'Continue'

    } else if (this.stage == 'stage3') {
      this.active1 = false;
      this.active2 = false;
      this.active3 = true;
    }
  }
  getRawMaterial(event: any) {
    //console.log(event);

    //console.log(this.rawMaterialsForm.value);

  }
  continue(level: any) {
    //console.log(level);
    if (level === 'stage1') {
      if (this.orderDetailForm.valid && this.cat3 && this.paperWork) {
        this.check1 = true;
        this.active2 = true;
        this.stage = 'stage2';
        this.btnText = 'Continue'
      } else {
        this.utilServ.toaster.next({ type: customToaster.warningToast, message: 'Please complete the order details check!' });
      }
    } else if (level === 'stage2') {
      if (this.twistLocks && this.lights && this.doorSeal && this.trailerIntegrity && this.bibClean && this.centerBarCheck && this.drainTap && this.trailerClean && this.tippingShed) {
        this.check2 = true;
        this.active3 = true;
        this.stage = 'stage3';
        if(this.taskServ.editTaskRecord?.qualityCheckID){
          this.btnText = 'Update'
        }
      } else {
        this.utilServ.toaster.next({ type: customToaster.warningToast, message: 'Please complete the trailer & hygiene check!' });
      }
    } else if (level === 'stage3') {
      if (this.rawMaterialsForm.valid && this.freshnessCheck > 0 && this.contaminationTrailer && this.contaminationBin && this.supplierRequired) {
        this.check3 = true;
        this.onSubmitandClose()
        // this.route.navigateByUrl('/home/orders')
      } else {
        this.utilServ.toaster.next({ type: customToaster.warningToast, message: 'Please complete the raw materials & bin selection check!' });
      }
    }

  }
  // TimePicker conditions
  openTimePicker(controlName?: any) {
    const dialog: MatDialogRef<TimePickerComponent, any> = this.dialog.open(TimePickerComponent, {
      width: "350px",
      height: 'auto',
      data: this.orderDetailForm.get(controlName)?.value ? this.datePipe.transform(this.orderDetailForm.get(controlName)?.value, "hh:mm a") : '',
      panelClass: 'time-picker-container',
      autoFocus: false,
      disableClose: true
    })
    dialog.afterClosed().subscribe((res) => {
      //console.log(res);

      if (res && !(Date.parse(this.orderDetailForm.get(controlName)?.value) == Date.parse(res))) {
        this.orderTime = res;
        if (this.datePipe.transform(this.orderDetailForm.get(controlName)?.value, "h:mm a") != res) {
          let dateTime: any = this.datePipe.transform(new Date())?.concat(' ' + res);
          setTimeout(() => {
            this.orderDetailForm.get(controlName)?.setValue(new Date(dateTime));
          }, 0);
        }

      }
    })

  }



  onSubmitandClose(): void {
    //console.log(this.rawMaterialsForm.value);
    let status: any = 'Pending'

    let qualityModel:qualityManagerModel = new qualityManagerModel()

    const orderDetailsValues = this.orderDetailForm.getRawValue();
    const rawMaterialsValues = this.rawMaterialsForm.getRawValue();
    //console.log(rawMaterialsValues);
    
    if (this.rawMaterialsForm.valid) {
      //console.log(this.taskServ.editTaskRecord, 'if');


  qualityModel.QualityCheckID  = this.qualityCheckID || 0
  qualityModel.OrderID = this.taskServ.editTaskRecord?.orderID
  qualityModel.IntakeFormID = 0
  qualityModel.QualityManagerID   = this.userProfile.employeeId
  qualityModel.Comments = rawMaterialsValues.comments
  qualityModel.DigitalSignOff = false
  qualityModel.VerificationDate = new Date()
  qualityModel.BanksMan = orderDetailsValues.banksMan
  qualityModel.Operative = orderDetailsValues.operative
  qualityModel.CatMaterials = this.cat3 == 'Yes' ? true : false 
  qualityModel.PaperworkMatchesProduct = this.paperWork == 'Yes' ? true : false 
  qualityModel.TwistLocks = this.twistLocks == 'Yes' ? true : false
  qualityModel.Lights = this.lights == 'Yes' ? true : false
  qualityModel.DoorSeal = this.doorSeal == 'Yes' ? true : false
  qualityModel.TrailerIntegrity = this.trailerIntegrity == 'Yes' ? true : false
  qualityModel.SheetAndBibClean = this.bibClean == 'Yes' ? true : false
  qualityModel.CenterBarCheck = this.centerBarCheck == 'Yes' ? true : false
  qualityModel.DrainTap = this.drainTap == 'Yes' ? true : false
  qualityModel.TrailerCleanInsideAndOut = this.trailerClean == 'Yes' ? true : false
  qualityModel.TippingShedFloorAndBinLidClean = this.tippingShed == 'Yes' ? true : false
  qualityModel.FreshnessCheck = this.freshnessCheck.toString()
  qualityModel.ContaminationsTrailerCheck = this.contaminationTrailer == 'Yes' ? true : false
  qualityModel.ContaminationsBinCheck = this.contaminationBin == 'Yes' ? true : false
  qualityModel.Temperature = rawMaterialsValues.temperature
  qualityModel.SupplierNonConformance = this.supplierRequired == 'Yes' ? true : false
  qualityModel.BinId = Number(rawMaterialsValues.binSelection) || 0
  qualityModel.MaterialId = Number(rawMaterialsValues.rawMaterial) || 0

this.taskServ.addUpdateQualityManagerTask(qualityModel).then(res => {
  //console.log(res);
  if(res){
    this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Intake sheet has been updated successfully.' })
    this.location.back()
  }
})




  //     if (this.taskServ.editTaskRecord != null) {
  //       //console.log(this.rawMaterialsForm.value);
  //       //console.log(formValues.ordersId);

  //       const orderObject = {
  //   CheckBox: false, // Default value as not present in the form
  //   "Order no": formValues.orderNo,
  //   "OrderTime": formValues.orderTime,
  //   "Collection date": formValues.orderDate,
  //   "Consignor": formValues.consignor,
  //   "Consignee": this.taskServ.editTaskRecord["Consignee"],
  //   "Vehicle": this.taskServ.editTaskRecord["Vehicle"],
  //   "Trailer": this.taskServ.editTaskRecord["Trailer"],
  //   "Driver": this.taskServ.editTaskRecord["Driver"],
  //   "Material": this.taskServ.editTaskRecord["Material"],
  //   "Time tipped": "", // Empty value
  //   "Net weight": this.taskServ.editTaskRecord["Net weight"],
  //   "Shunter driver": this.taskServ.editTaskRecord["Shunter driver"],
  //   "Bin no": '',
  //   "Ticket no": "", // Empty value
  //   "Mov doc no": "", // Empty value
  //   "Operator": "", // Empty value
  //   "Quantity": this.taskServ.editTaskRecord["Quantity"],
  //   "Progress": 'Completed', // Default value
  //   "totalFormData":this.taskServ.editTaskRecord?.totalFormData,
  //   "Quality check" : 'Checked',
  //   "Material quantity" : this.taskServ.editTaskRecord["Material quantity"],
  //   "Pickup trailer no" : this.taskServ.editTaskRecord["Pickup trailer no"],
  //   rawMaterialsForm:this.rawMaterialsForm.value,
  //   hygieneCheckForm:this.hygieneCheckForm.value,
  //   orderDetailForm:this.orderDetailForm.value,
  //   "more": "" // Empty value
  // };
  // //console.log(orderObject);

  // //console.log(Number(formValues.orderNo || 0) );

  // const index = this.utilSer.ordersAndTask.findIndex((order:any) => order["Order no"] === formValues.ordersId);

  // //console.log(index,'index')

  //       // this.taskServ.ordersList.splice(this.taskServ.viewOrdersIndex,1,orderObject ) 
  //       this.utilSer.ordersAndTask.splice(Number(formValues.orderNo || 0) -1,1,orderObject) 
  // this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Task edited successfully.' })
  //       // Process the form submission here
  //     }

  // this.location.back()
}
  }
  
  



}


