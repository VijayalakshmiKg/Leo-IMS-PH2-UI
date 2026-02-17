import { Component, OnInit } from '@angular/core';
import { TrailerService } from '../../trailer.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Location } from '@angular/common';
import { trailerModel } from '../../trailerModel/trailerModel';
import { iif } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';

@Component({
  selector: 'app-add-trailer',
  templateUrl: './add-trailer.component.html',
  styleUrls: ['./add-trailer.component.css']
})
export class AddTrailerComponent implements OnInit {

  TrailerForm!: FormGroup
  unit: any = 'cm'
  saveBtnText: any = 'Add'
  imageUrl: any
  selectedFile: any
  imageUrlProfile: any
  selectedFileProfile: any


  trailerType: any;

  axleCount: any | any[] = []
  trailerId: number = 0;
  trailerModel: trailerModel = new trailerModel();
  vehicleMakes = [
    "UNITED","DENNISON","CLAYTON","WHALE","FRUEHAUF","KNAPEN","SDC","CARTWRIGHT","LAMBERET","GRAY ADAMS","MONTRACON","SCHMITZ","STAS","NEWTON","SAYERS","ROTHDEAN","TITAN","DENISON","PLOWMAN"

  ];
  constructor(public fb: FormBuilder, public sanitizer: DomSanitizer, public dialog: MatDialog, public TrailerServ: TrailerService, public location: Location, public utilSer: UtilityService) { }

  ngOnInit(): void {

    this.TrailerForm = this.fb.group({
      trailerMake: ['', Validators.required],
      trailerNumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      licensePlate: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      trailerType: ['', Validators.required],
      // axleCount: [],
      weightLevel: ['', Validators.required],
      // bedLength: ['', Validators.required],
      // cargoVolume: ['', Validators.required],
      // interiorVolume: ['', Validators.required],
      // length: ['', Validators.required],
      // height: ['', Validators.required],
      // width: ['', Validators.required],
      // temperature: [],
    });

    // //console.log(this.TrailerServ.viewTrailerIndex);
    this.getTrailer();
    this.getTrailerTypes();
    if (this.TrailerServ.editTrailerRecord) {
      // //console.log(this.TrailerServ.editTrailerRecord);
      this.trailerId = this.TrailerServ.editTrailerRecord.trailerID;
      this.setTrailerDetails()
    }
  }

  setTrailerDetails() {
    this.imageUrl = this.TrailerServ?.editTrailerRecord?.TrailerLicensePhoto
    this.imageUrlProfile = this.TrailerServ?.editTrailerRecord?.profileImage
    this.selectedFile = this.TrailerServ?.editTrailerRecord?.selectedFileTrailerLicense;

    this.TrailerForm.patchValue(this.TrailerServ.editTrailerRecord);
    // this.TrailerForm.get("organization")?.setValue(this.TrailerServ.editTrailerRecord.trailerMake);
  }

  getTrailer() {
    this.TrailerServ.getAxilCounts().then((res: any) => {
      // //console.log(res);
      this.axleCount = res;
    })
  }
  getTrailerTypes() {
    this.TrailerServ.getAllTrailerTypes().then((res: any) => {
      // //console.log(res);
      this.trailerType = res;
    })
  }
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0].name;
      this.TrailerForm.get('selectedFileTrailerLicense')?.setValue(this.selectedFile.name)
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrl = reader.result as string;
        // Set the raw data URL in the form control
        this.TrailerForm.get('TrailerLicensePhoto')?.setValue(imageDataUrl);
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
        this.TrailerForm.get('profileImage')?.setValue(imageDataUrlProfile);
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
        this.TrailerServ.editTrailerRecord = null;
        this.location.back()
      }
    })
  }

  onSubmitandClose(): void {
    // //console.log(this.TrailerForm.value);
    // //console.log(this.TrailerServ.viewTrailerIndex);
    // this.trailerModel.AxleCount = this.TrailerForm.value.axleCount;
    // this.trailerModel.BedLength = this.TrailerForm.value.bedLength;
    // this.trailerModel.CargoVolume = this.TrailerForm.value.cargoVolume;
    // this.trailerModel.Height = this.TrailerForm.value.height;
    // this.trailerModel.InteriorVolume = this.TrailerForm.value.interiorVolume;
    // this.trailerModel.Length = this.TrailerForm.value.length;
    this.trailerModel.LicensePlate = this.TrailerForm.value.licensePlate;
    this.trailerModel.TrailerMake = this.TrailerForm.value.trailerMake;
    // this.trailerModel.Temperature = this.TrailerForm.value.Temperature;
    this.trailerModel.TrailerID = this.trailerId ? this.trailerId : 0;
    this.trailerModel.TrailerNumber = this.TrailerForm.value.trailerNumber;
    this.trailerModel.TrailerType = this.TrailerForm.value.trailerType;
    this.trailerModel.WeightLevel = this.TrailerForm.value.weightLevel;
    // this.trailerModel.Width = this.TrailerForm.value.width;
    this.trailerModel.Payload = 0;
    this.trailerModel.LastMaintenanceDate = new Date();
    this.trailerModel.Description = "";
    this.trailerModel.Status = "Available";
    if (this.TrailerForm.valid) {
      let toastMessage = this.TrailerServ.editTrailerRecord ? 'Trailer edited successfully.' : 'Trailer added successfully.';
      this.TrailerServ.addUpdateTrailer(this.trailerModel).then(res => {
        // //console.log(res);
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: toastMessage })
          this.location.back()
        }
      })
    }
    else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.TrailerForm.markAllAsTouched();
      return
    }
  }
  onSubmitandAddAnother(): void {
    // //console.log(this.TrailerForm.value);
    if (this.TrailerForm.valid) {
      // //console.log(this.TrailerForm.value);
      this.trailerModel.AxleCount = this.TrailerForm.value.axleCount;
      this.trailerModel.BedLength = this.TrailerForm.value.bedLength;
      this.trailerModel.CargoVolume = this.TrailerForm.value.cargoVolume;
      this.trailerModel.Height = this.TrailerForm.value.height;
      this.trailerModel.InteriorVolume = this.TrailerForm.value.interiorVolume;
      this.trailerModel.Length = this.TrailerForm.value.length;
      this.trailerModel.LicensePlate = this.TrailerForm.value.licensePlate;
      this.trailerModel.TrailerMake = this.TrailerForm.value.trailerMake;
      this.trailerModel.Temperature = '';
      this.trailerModel.TrailerID = this.trailerId ? this.trailerId : 0;
      this.trailerModel.TrailerNumber = this.TrailerForm.value.trailerNumber;
      this.trailerModel.TrailerType = this.TrailerForm.value.trailerType;
      this.trailerModel.WeightLevel = this.TrailerForm.value.weightLevel;
      this.trailerModel.Width = this.TrailerForm.value.width;
      this.trailerModel.Payload = 0;
      this.trailerModel.LastMaintenanceDate = new Date();
      this.trailerModel.Description = "";
      this.trailerModel.Status = "Available";
      // //console.log(this.trailerModel);
      this.TrailerServ.addUpdateTrailer(this.trailerModel).then((res: any) => {
        // //console.log(res);
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Trailer added successfully.' })
          this.TrailerForm.reset()
        }
      })
      // this.TrailerServ.TrailersList.push(this.TrailerForm.value)
      // this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Trailer added successfully.' })
      // Process the form submission here

    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.TrailerForm.markAllAsTouched();
      return
    }

    // //console.log(this.TrailerServ);

  }

  deleteLicensePhoto() {
    this.selectedFile = null
    this.imageUrl = null
  }

  // onPaste(event: ClipboardEvent): void {
  //   // Access clipboard data directly from the event object
  //   const clipboardData = event.clipboardData;
  //   const pastedText = clipboardData?.getData('text') || '';

  //   // Validate if the pasted content is a valid number
  //   if (!/^\d*\.?\d+$/.test(pastedText)) {
  //     event.preventDefault(); // Prevent invalid content from being pasted
  //   }
  // }
  avoidSpecialChar() {
    this.TrailerForm.get('trailerNumber')?.setValue(this.TrailerForm.value.trailerNumber.replace(/[^a-zA-Z0-9 ]/g, ''));
    this.TrailerForm.get('licensePlate')?.setValue(this.TrailerForm.value.licensePlate.replace(/[^a-zA-Z0-9 ]/g, ''));
  }
}
