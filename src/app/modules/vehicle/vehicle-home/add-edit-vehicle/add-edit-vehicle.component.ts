import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { VehicleService } from '../../vehicle.service';
import { Location } from '@angular/common';
import { vehicleModel } from '../../vehicleModel/vehicleModel';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';

@Component({
  selector: 'app-add-edit-vehicle',
  templateUrl: './add-edit-vehicle.component.html',
  styleUrls: ['./add-edit-vehicle.component.css']
})
export class AddEditVehicleComponent implements OnInit {
  vehicleForm!: FormGroup
  vehicleStatus: any = 'Available';
  saveBtnText: any = 'Add'
  imageUrl: any
  selectedFile: any
  imageUrlProfile: any
  selectedFileProfile: any
  truckModel: vehicleModel = new vehicleModel();
  vehicleData: any
  vehicleModels = [
    "SteelDrive Motors",
    "HeavyHaul Trucks",
    "Titan Truckworks",
    "MaxTorque Trucks",
    "PowerFleet Trucks",
    "Duramax Manufacturing",
    "IronHorse Truck Co.",
    "Vanguard Truckworks",
    "RoadKing Motors",
    "BigRig Industries",
    "Mighty Haulers",
    "AllRoad Trucking",
    "Endurance Motors",
    "LoadMaster Trucks",
    "ProFleet Manufacturing",
    "TurboTorque Trucks",
    "Fortress Motors",
    "PrimePath Truckworks",
    "Reliant Truckmakers",
    "Skyline Hauling Systems"
  ];


  vehicleMakes = [
   "LF 180 FA","FA LF45","LF250 FA","CF85.410V","ATEGO","1824L","AROCS","MERC 18","ATEGO 816","ACTROS","ATEGO 1221","1022","AXOR"

  ];

  vehicleTypes: any[] = [
    // "Sedan",
    // "SUV",
    // "Hatchback",
    // "Coupe",
    // "Convertible",
    // "Truck",
    // "Van",
    // "Minivan",
    // "Wagon",
    // "Crossover",
    // "Electric",
    // "Hybrid",
    // "Diesel",
    // "Motorcycle",
    // "Pickup",
  ];
  truckId: number = 0;
  vehicleNumberExists: boolean = false;
  constructor(public fb: FormBuilder, public sanitizer: DomSanitizer, public dialog: MatDialog, public VehiclesServ: VehicleService, public location: Location, public utilSer: UtilityService) {

  }

  ngOnInit(): void {

    this.vehicleForm = this.fb.group({
      vechicleNumber: ['', Validators.required],
      vehicleModel: ['', Validators.required],
      vehicleMake: ['', Validators.required],
      vechicleType: ['', Validators.required],
      // engineNumber: [''],
      chassisNumber: ['', Validators.required],
      // trailerNumber: ['']
    });

    // //console.log(this.VehiclesServ.editVehicleRecord);
    this.getVehicleTypes()

    if (this.VehiclesServ.editVehicleRecord) {
      // //console.log(this.VehiclesServ.editVehicleRecord);
      this.truckId = this.VehiclesServ.editVehicleRecord.truckID;
      this.setVehiclesDetails()
    }
    this.getAllTrucksList();
  }

  setVehiclesDetails() {
    this.imageUrl = this.VehiclesServ?.editVehicleRecord?.VehiclesLicensePhoto
    this.imageUrlProfile = this.VehiclesServ?.editVehicleRecord?.profileImage
    this.selectedFile = this.VehiclesServ?.editVehicleRecord?.selectedFileVehiclesLicense
    this.vehicleForm.patchValue(this.VehiclesServ.editVehicleRecord);
    this.vehicleStatus = this.VehiclesServ.editVehicleRecord.status;
  }

  getVehicleTypes() {
    this.VehiclesServ.getAllVehicleTypes().then(res => {
      // //console.log(res);
      this.vehicleTypes = res;
    })
  }
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0].name;
      this.vehicleForm.get('selectedFileVehiclesLicense')?.setValue(this.selectedFile.name)
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrl = reader.result as string;
        // Set the raw data URL in the form control
        this.vehicleForm.get('VehiclesLicensePhoto')?.setValue(imageDataUrl);
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
        this.vehicleForm.get('profileImage')?.setValue(imageDataUrlProfile);
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
        this.VehiclesServ.editVehicleRecord = null
        this.location.back()
      }
    });
  }

  getAllTrucksList() {
    this.VehiclesServ.getAllVehicle().then((res: any) => {
      this.vehicleData = res || [];
    });
  }

  vehicleNumber() {
    const enteredNumber = this.vehicleForm.get('vechicleNumber')?.value?.trim()?.toLowerCase();
    this.vehicleNumberExists = this.vehicleData.some((vehicle: any) =>
      vehicle.vechicleNumber?.trim()?.toLowerCase() === enteredNumber  // make sure field name matches API!
    );
    if (this.vehicleNumberExists) {
      this.utilSer.toaster.next({ type: customToaster.infoToast, message: 'Vehicle number already exists!' })
    }
  }

  onSubmitandClose(): void {
    // //console.log(this.vehicleForm.value);
    this.truckModel.BatteryCapacity = "";
    this.truckModel.ChassisNumber = this.vehicleForm.value.chassisNumber;
    this.truckModel.Description = "";
    this.truckModel.Dimension = 0;
    // this.truckModel.EngineNumber = this.vehicleForm.value.engineNumber;
    this.truckModel.FuelTankCapacity = 0;
    this.truckModel.LastMaintenanceDate = new Date();
    this.truckModel.Milage = 0;
    this.truckModel.Name = "";
    this.truckModel.PayLoad = 0;
    this.truckModel.RegistrationNo = "";
    this.truckModel.Status = this.vehicleStatus;
    // this.truckModel.TrailerNumber = this.vehicleForm.value.trailerNumber;
    this.truckModel.TruckID = this.truckId ? this.truckId : 0;
    this.truckModel.VehicleNo = this.vehicleForm.value.vechicleNumber;
    this.truckModel.VechicleType = this.vehicleForm.value.vechicleType;
    this.truckModel.VehicleMake = this.vehicleForm.value.vehicleMake;
    this.truckModel.VehicleModel = this.vehicleForm.value.vehicleModel;
     this.truckModel.VehicleName = this.vehicleForm.value.vechicleNumber;
    if (this.vehicleForm.valid) {
      let toastMessage = this.VehiclesServ.editVehicleRecord ? 'Vehicle edited successfully.' : 'Vehicle added successfully.';
      this.VehiclesServ.addUpdateVehicle(this.truckModel).then(res => {
        // //console.log(res);
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: toastMessage })
          this.location.back()
        }
      })
    }
    else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.vehicleForm.markAllAsTouched();
      return
    }
  }
  onSubmitandAddAnother(): void {
    // //console.log(this.vehicleForm.value);
    if (this.vehicleForm.valid) {
      // //console.log(this.vehicleForm.value);
      this.truckModel.BatteryCapacity = "";
      this.truckModel.ChassisNumber = this.vehicleForm.value.chassisNumber;
      this.truckModel.Description = "";
      this.truckModel.Dimension = 0;
      // this.truckModel.EngineNumber = this.vehicleForm.value.engineNumber;
      this.truckModel.FuelTankCapacity = 0;
      this.truckModel.LastMaintenanceDate = new Date();
      this.truckModel.Milage = 0;
      this.truckModel.Name = "";
      this.truckModel.PayLoad = 0;
      this.truckModel.RegistrationNo = "";
      this.truckModel.Status = this.vehicleStatus;
      // this.truckModel.TrailerNumber = this.vehicleForm.value.trailerNumber;
      this.truckModel.TruckID = this.truckId ? this.truckId : 0;
      this.truckModel.VehicleNo = this.vehicleForm.value.vechicleNumber;
      this.truckModel.VechicleType = this.vehicleForm.value.vechicleType;
      this.truckModel.VehicleMake = this.vehicleForm.value.vehicleMake;
      this.truckModel.VehicleModel = this.vehicleForm.value.vehicleModel;
      // //console.log(this.truckModel);
      this.VehiclesServ.addUpdateVehicle(this.truckModel).then((res: any) => {
        // //console.log(res);
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Vehicles added successfully.' });
          this.vehicleForm.reset();
        }
      })
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.vehicleForm.markAllAsTouched();
      return
    }
  }

  deleteLicensePhoto() {
    this.selectedFile = null
    this.imageUrl = null
  }

}
