import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { trailerWasher } from '../trailerWasherModel/trailerWasherModel';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Country } from 'country-state-city';
import { startWith, map } from 'rxjs/operators';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TrailerWasherService } from '../../trailer-washer.service';

@Component({
  selector: 'app-add-edit-trailer-washer',
  templateUrl: './add-edit-trailer-washer.component.html',
  styleUrls: ['./add-edit-trailer-washer.component.css']
})
export class AddEditTrailerWasherComponent implements OnInit {

  trailerWasherForm!: FormGroup
  formData: FormData = new FormData();
  saveBtnText: any = 'Add'
  imageUrl: any
  selectedFile: any
  imageUrlProfile: any
  selectedFileProfile: any
  zipCodes: any | any[] = []
  countries: any | any[] = [];
  washerId: number = 0;
  trailerWasherModel: trailerWasher = new trailerWasher();
  filteredTel: any;
  telOptions: any[] = [];
  prefixmobile = new FormControl('+44', Validators.required);
  userDetails: any
  userDetailsdata: any
  photoImg: any;
  selectedProfileFile: any;
  emailExits: boolean = false;
  mobileNumberexits: boolean = false;
  washerData:any


  constructor(public fb: FormBuilder, public dialog: MatDialog, public sanitizer: DomSanitizer, public trailerWasherServ: TrailerWasherService, public location: Location, public utilSer: UtilityService) {
    this.getCountryCode();
    this.filteredTel = this.prefixmobile?.valueChanges.pipe(
      startWith(''), map((value: any) => this._filter(value))
    );
  }

  ngOnInit(): void {
    this.selectedFileProfile = null;
    this.selectedProfileFile = null;
    this.imageUrlProfile = null;
    let userCred: any = localStorage.getItem('userDetails')
    this.userDetails = JSON.parse(userCred);
    this.getUserDetails();
    this.trailerWasherForm = this.fb.group({
      profileImage: [''], // This can be used for handling the profile image upload
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, this.isValidEmail.bind(this)]],
      contactDetails: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      employeeId: [''],
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      state: [''],
      zipCode: [''],
      country: [''],

      // washerLicensePhoto: [''],
      // selectedFileDriverLicense:['']
    });
    this.getCountries()
    //console.log(this.trailerWasherServ.viewTrailerWasherIndex);
    if (this.trailerWasherServ.editTrailerWasherRecord) {
      //console.log(this.trailerWasherServ.editTrailerWasherRecord);
      this.saveBtnText = 'Update';
      this.washerId = this.trailerWasherServ.editTrailerWasherRecord.trailerWasherId;
      this.setWasherDetails()
    } else {
      this.prefixmobile?.setValue("+44");
      this.saveBtnText = 'Add';
    }
  }
  // Get user details
  getUserDetails() {
    this.trailerWasherServ.getProfile(this.userDetails.email).then(data => {
      //console.log(data);
      this.userDetailsdata = data[0];
    })
  }
  private _filter(value: string): string[] {
    const filterValue = value;
    //console.log(value);

    return this.telOptions.filter((option: any) => option.includes(filterValue));
  }
  setWasherDetails() {
    this.trailerWasherServ.viewWasherDetail(this.washerId).then((res: any) => {
      //console.log(res);
      this.washerData = res;
      this.trailerWasherForm.get("firstName")?.setValue(res.trailerWasherFirstName);
      this.trailerWasherForm.get("lastName")?.setValue(res.trailerWasherLastName);
      this.trailerWasherForm.get("email")?.setValue(res.email);
      this.trailerWasherForm.get("contactDetails")?.setValue(res.contactDetails);
      this.trailerWasherForm.get("employeeId")?.setValue(res.employeeNo);
      this.trailerWasherForm.get("addressLine1")?.setValue(res.addressLine1);
      this.trailerWasherForm.get("addressLine2")?.setValue(res.addressLine2);
      this.trailerWasherForm.get("city")?.setValue(res.city);
      this.trailerWasherForm.get("state")?.setValue(res.state);
      this.trailerWasherForm.get("zipCode")?.setValue(res.pincode);
      this.trailerWasherForm.get("country")?.setValue(res.country);
      this.prefixmobile?.setValue(res.phoneCountryCode);
      this.imageUrlProfile = res.trailerWasherPhoto?.length > 0 ? res.trailerWasherPhoto[0]?.url : null;
    })
  }
  getCountryCode() {
    Country.getAllCountries().map((res: any) => {
      this.telOptions.push(res.phonecode.includes("+") ? res.phonecode : '+' + res.phonecode);
      // this.faxOptions.push(res.phonecode.includes("+") ? res.phonecode : '+' + res.phonecode);
    });
  }
  getCountryCodeFilter(event: any) {
    //console.log(event.keyCode);
    if (event.keyCode > 47 || event.keyCode <= 57) {
      //console.log(event.keyCode > 47 || event.keyCode <= 57);
      return
    }
    //console.log("dgdj");
    //console.log(event.keyCode > 47 || event.keyCode <= 57, 'false');
    return
  }

  getCountries() {
    this.trailerWasherServ.getCountryList().then(res => {
      //console.log(res);
      this.countries = res;
    })
  }

  getStateCountryCity(res: any) {
    this.trailerWasherForm.get("country")?.setValue(res.countryName);
    this.trailerWasherForm.get("state")?.setValue(res.state);
    this.trailerWasherForm.get("city")?.setValue(res.city);
  }
  getZipCode(event: any) {
    //console.log(event.target.value);
    this.trailerWasherServ.getZipCodes(event.target.value).then((res: any) => {
      //console.log(res);
      this.zipCodes = res;
    })
  }

  // onFileSelected(event: Event) {
  //   const fileInput = event.target as HTMLInputElement;
  //   if (fileInput.files && fileInput.files.length > 0) {
  //     this.selectedFile = fileInput.files[0].name;
  //     this.trailerWasherForm.get('selectedFileDriverLicense')?.setValue(this.selectedFile.name)
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const imageDataUrl = reader.result as string;
  //       // Set the raw data URL in the form control
  //       this.trailerWasherForm.get('washerLicensePhoto')?.setValue(imageDataUrl);
  //       // Set the sanitized URL for display only
  //       this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(imageDataUrl) as SafeUrl;
  //     };
  //     reader.readAsDataURL(this.selectedFile);
  //   }
  // }

  onFileSelectedProfile(event: any) {
    this.formData = new FormData();
    // const fileInput = event.target as HTMLInputElement;
    //console.log('profile', event.target.files);
    //console.log(event.target.files[0].size);
    if (event.target.files[0].size > 1024000) {
      this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'File is too large, maximum file size is 1MB' })
    } else if (event.target.files[0].size < 1024000 && event.target.files.length > 0) {
      // this.selectedFileProfile = fileInput.files[0];
      // const reader = new FileReader();
      // reader.onload = () => {
      //   const imageDataUrlProfile = reader.result as string;
      //   // Set the raw data URL in the form control
      //   this.washerForm.get('profileImage')?.setValue(imageDataUrlProfile);
      //   // Set the sanitized URL for display only
      //   this.imageUrlProfile = this.sanitizer.bypassSecurityTrustUrl(imageDataUrlProfile) as SafeUrl;
      // };
      // reader.readAsDataURL(this.selectedFileProfile);

      this.selectedProfileFile = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        // //console.log(event);
        this.photoImg = event.target.result;
        //console.log('dsds');
        this.imageUrlProfile = event.target.result;
        this.formData.append('file', this.selectedProfileFile);

      }
    }
  }


  deleteProfile() {
    this.selectedFileProfile = null;
    this.selectedProfileFile = null;
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
        this.trailerWasherServ.editTrailerWasherRecord = null;
        this.location.back();
      }
    })
  }
  washerDuplicateEmail() {
    if (this.trailerWasherForm.value.email?.trim("") != this.washerData?.email) {
      this.trailerWasherServ.Checkexits(this.trailerWasherForm.value.email, '').then(res => {
        //console.log(res);
        if (!res.isUnique) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: res.message})
          this.emailExits = true
        }
        else {
          this.emailExits = false
        }
      })
    }
  }
  washerDuplicateMobile() {
    if (this.trailerWasherForm.value.contactDetails?.trim("") != this.washerData?.contactDetails) {
      this.trailerWasherServ.Checkexits('', this.trailerWasherForm.value.contactDetails).then(res => {
        //console.log(res);
        if (!res.isUnique) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: res.message})
          this.mobileNumberexits = true;
          
        }
        else {
          this.mobileNumberexits = false
        }
      })
    }
  }
  onSubmitandClose(): void {
    //console.log(this.trailerWasherForm.value);
    this.trailerWasherModel.TrailerWasherId = this.trailerWasherServ.editTrailerWasherRecord ? this.trailerWasherServ.editTrailerWasherRecord.trailerWasherId : 0;
    this.trailerWasherModel.EmployeeId = this.userDetailsdata.employeeId;
    this.trailerWasherModel.TrailerWasherFirstName = this.trailerWasherForm.value.firstName;
    this.trailerWasherModel.TrailerWasherLastName = this.trailerWasherForm.value.lastName;
    this.trailerWasherModel.Email = this.trailerWasherForm.value.email;
    this.trailerWasherModel.EmployeeNo = this.trailerWasherForm.value.employeeId;
    this.trailerWasherModel.PhoneCountryCode = this.prefixmobile.value;
    this.trailerWasherModel.ContactDetails = this.trailerWasherForm.value.contactDetails;
    this.trailerWasherModel.AddressLine1 = this.trailerWasherForm.value.addressLine1;
    this.trailerWasherModel.AddressLine2 = this.trailerWasherForm.value.addressLine2;
    this.trailerWasherModel.City = this.trailerWasherForm.value.city;
    this.trailerWasherModel.State = this.trailerWasherForm.value.state;
    this.trailerWasherModel.Pincode = this.trailerWasherForm.value.zipCode;
    this.trailerWasherModel.Country = this.trailerWasherForm.value.country;
    this.trailerWasherModel.Status = this.trailerWasherServ.editTrailerWasherRecord ? this.trailerWasherServ.editTrailerWasherRecord.status : 'Available';
    if (this.trailerWasherForm.valid) {
      //console.log(this.trailerWasherModel);
      let toastMessage = this.trailerWasherServ.editTrailerWasherRecord ? 'Trailer washer edited successfully.' : 'Trailer washer added successfully.';
      this.trailerWasherServ.addUpdateWasher(this.trailerWasherModel).then(res => {
        //console.log(res);
        if (res) {
          if (this.selectedProfileFile) {
            //console.log(res.trailerWasherId, this.formData);

            this.trailerWasherServ.trailerWasherPhoto(res.trailerWasherId, this.formData).then((val: any) => {
            })
          }
          this.utilSer.toaster.next({ type: customToaster.successToast, message: toastMessage })
          this.location.back()
        }
      })
    }
    else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
    }
  }
  onSubmitandAddAnother(): void {
    //console.log(this.trailerWasherForm.value);
    this.trailerWasherModel.TrailerWasherId = 0;
    this.trailerWasherModel.EmployeeId = this.userDetailsdata.employeeId;
    this.trailerWasherModel.TrailerWasherFirstName = this.trailerWasherForm.value.firstName;
    this.trailerWasherModel.TrailerWasherLastName = this.trailerWasherForm.value.lastName;
    this.trailerWasherModel.Email = this.trailerWasherForm.value.email;
    this.trailerWasherModel.EmployeeNo = this.trailerWasherForm.value.employeeId;
    this.trailerWasherModel.PhoneCountryCode = this.prefixmobile.value;
    this.trailerWasherModel.ContactDetails = this.trailerWasherForm.value.contactDetails;
    this.trailerWasherModel.AddressLine1 = this.trailerWasherForm.value.addressLine1;
    this.trailerWasherModel.AddressLine2 = this.trailerWasherForm.value.addressLine2;
    this.trailerWasherModel.City = this.trailerWasherForm.value.city;
    this.trailerWasherModel.State = this.trailerWasherForm.value.state;
    this.trailerWasherModel.Pincode = this.trailerWasherForm.value.zipCode;
    this.trailerWasherModel.Country = this.trailerWasherForm.value.country;
    if (this.trailerWasherForm.valid) {
      //console.log(this.trailerWasherModel);
      this.trailerWasherServ.addUpdateWasher(this.trailerWasherModel).then(res => {
        //console.log(res);
        if (res) {
          if (this.selectedProfileFile) {
            this.trailerWasherServ.trailerWasherPhoto(res.trailerWasherId, this.formData).then((val: any) => {
            })
          }
          let toastMessage = this.trailerWasherServ.editTrailerWasherRecord ? 'Trailer washer edited successfully.' : 'Trailer washer added successfully.';
          this.utilSer.toaster.next({ type: customToaster.successToast, message: toastMessage })
          this.trailerWasherForm.get('profileImage')?.setValue(null);
          this.imageUrl = null;
          this.imageUrlProfile = null;
          this.selectedFile = null;
          this.trailerWasherForm.reset();
        }
      })
    }
    else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
    }

  }
  //email validation
  isValidEmail(controls: AbstractControl): ValidationErrors | null | any {
    const value = controls.value;
    const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
    if (value?.length > 0) {
      return emailReg.test(value) ? null : { isEmail: true }
    }
    return null
  }

}
