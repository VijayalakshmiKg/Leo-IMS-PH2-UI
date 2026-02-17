import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DriversService } from '../../drivers.service';
import { Location } from '@angular/common';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { driverModel } from '../../driverModel/driverModel';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { map, startWith } from 'rxjs/operators';
import { Country } from 'country-state-city';


@Component({
  selector: 'app-add-edit-drivers',
  templateUrl: './add-edit-drivers.component.html',
  styleUrls: ['./add-edit-drivers.component.css']
})
export class AddEditDriversComponent implements OnInit {

  driverForm!: FormGroup
  driverStatus: any = 'Available'
  saveBtnText: any;
  imageUrl: any
  selectedFile: any
  imageUrlProfile: any
  selectedFileProfile: any
  employeeId: any;

  citys: any | any[] = []

  states: any | any = []


  zipCodes: any | any[] = []

  countries: any | any[] = []

  vendors: any[] = []
  todayDate: Date = new Date();
  driverId: number = 0;
  driverModel: driverModel = new driverModel();
  formData: FormData = new FormData();
  photoImg: any;
  licenseformData: FormData = new FormData();
  selectedProfileFile: any;
  licenseFile: any;
  filteredTel: any;
  telOptions: any[] = [];;
  prefixmobile = new FormControl('+44', [Validators.required, Validators.pattern(/^\+\d+$/)]);
  mobileNumberexits: boolean = false;
  emailExits: boolean = false;
  constructor(public fb: FormBuilder, public sanitizer: DomSanitizer, public dialog: MatDialog, public driverServ: DriversService, public location: Location, public utilSer: UtilityService) {
    this.getVendorList();
    this.getCountryCode();
    this.filteredTel = this.prefixmobile.valueChanges.pipe(
      startWith(''), map((value: any) => this._filter(value))
    );

  }

  ngOnInit(): void {
    this.selectedFileProfile = null;

    this.selectedProfileFile = null;
    this.imageUrlProfile = null;
    this.driverForm = this.fb.group({
      profileImage: [''], // This can be used for handling the profile image upload
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
      email: ['', [Validators.required, this.isValidEmail.bind(this)]],
      mobileNumber: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      vendor: [''],
      employeeId: [''],
      licenseNumber: ['' ],
      licenseIssuedDate: [''],
      validityDate: [''],
      addressLine1: [''],
      addressLine2: [''],
      city: ['' ],
      state: [''],
      zipCode: [''],
      country: [''],
      driverLicensePhoto: [''],
      selectedFileDriverLicense: ['']
    });

    var user: any = localStorage.getItem("userData");
    this.employeeId = JSON.parse(user);
    //console.log(this.driverServ.viewDriverId);
    this.getCountry();
    this.driverForm.get('vendor')?.setValue('Haulage holdings');


    if (this.driverServ.editDriverRecord) {
      //console.log(this.saveBtnText);
      this.saveBtnText = 'Update';
      this.driverId = this.driverServ.editDriverRecord.driverID;
      //console.log(this.saveBtnText);
      this.setDriverDetails();
    } else {
      this.driverForm.get("country")?.setValue('United Kingdom');
      this.driverForm.get('licenseIssuedDate')?.setValue(new Date)
      this.prefixmobile?.setValue("+44");
      this.saveBtnText = 'Add';
    }
  }
  private _filter(value: string): string[] {
    const filterValue = value;
    //console.log(value);

    return this.telOptions.filter((option: any) => option.includes(filterValue));
  }
  getCountryCode() {
    Country.getAllCountries().map((res: any) => {
      this.telOptions.push(res.phonecode.includes("+") ? res.phonecode : '+' + res.phonecode);
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
  setDriverDetails() {
    // this.imageUrl = this.driverServ?.editDriverRecord?.driverLicensePhoto
    // this.imageUrlProfile = this.driverServ?.editDriverRecord?.profileImage
    // this.selectedFile = this.driverServ?.editDriverRecord?.selectedFileDriverLicense
    // this.driverForm.patchValue(this.driverServ.editDriverRecord)
    //console.log("sdfsdjg");

    this.driverServ.viewDriverDetail(this.driverId).then((res: any) => {
      //console.log(res, "output");

      this.driverStatus = res.status
      this.driverForm.get("firstName")?.setValue(res.firstName);
      this.driverForm.get("lastName")?.setValue(res.lastName);
      this.driverForm.get("email")?.setValue(res.email);
      this.driverForm.get("mobileNumber")?.setValue(res.contactDetails);
      this.driverForm.get("vendor")?.setValue(res.vendor);
      this.driverForm.get("employeeId")?.setValue(res.employeeNo);
      this.driverForm.get("licenseNumber")?.setValue(res.licenseNumber);
      this.driverForm.get("licenseIssuedDate")?.setValue(res.licenceIssuedDate);
      this.driverForm.get("validityDate")?.setValue(res.licenceValidDate);
      this.driverForm.get("addressLine1")?.setValue(res.addressLine1);
      this.driverForm.get("addressLine2")?.setValue(res.addressLine2);
      this.driverForm.get("city")?.setValue(res.city);
      this.driverForm.get("state")?.setValue(res.state);
      this.driverForm.get("driverLicensePhoto")?.setValue(res?.driverLicensePhoto?.length > 0 ? res?.driverLicensePhoto[0]?.url : '');
      this.driverForm.get("zipCode")?.setValue(res.pincode);
      this.driverForm.get("country")?.setValue(res.country);
      //  this.driverForm.get("")?.setValue(res.);
      // this.driverForm.get("")?.setValue(res.phoneCountryCode);
      // this.selectedProfileFile = res.driverProfilePhoto[0];
      if (!res.country) {
        this.driverForm.get("country")?.setValue('United Kingdom');
      }
      this.prefixmobile?.setValue(res.phoneCountryCode)
      // this.selectedProfileFile= res.driverProfilePhoto[0];
      //console.log(this.selectedProfileFile);
      this.imageUrlProfile = res.driverProfilePhoto[0]?.url;
      this.selectedFile = res.driverLicensePhoto[0];
    })
  }

  // number hyphen restrict
  allowOnlyNumbersLettersAndHyphen(event: KeyboardEvent) {
    const allowedChars = /^[a-zA-Z0-9\-]$/;
    const inputChar = event.key;
  
    if (!allowedChars.test(inputChar)) {
      event.preventDefault();  // Block invalid key
    }
  }

  getCountry() {
    this.driverServ.getCountryList().then((res: any) => {
      //console.log(res);
      this.countries = res;
    })
  }
  getVendorList() {
    this.driverServ.getVendorList().then((res: any) => {
      //console.log(res);
      this.vendors = res;
    })
  }
  allowAlphaOnly(event: any) {
    //console.log(event.keyCode);
    // (event.keyCode >= 65 && event.keyCode <= 90) ||
    if ((event.keyCode > 97 && event.keyCode < 122)) {
      //console.log("dslfshk");

      return true
    }
    return false
  }
  getStateCountryCity(res: any) {
    this.driverForm.get("country")?.setValue(res.countryName);
    this.driverForm.get("state")?.setValue(res.county);
    this.driverForm.get("city")?.setValue(res.city);
  }
  getZipCode(event: any) {
    //console.log(event.target.value);

    this.driverServ.getStateCityCountyList(event.target.value).then((res: any) => {
      //console.log(res);
      this.zipCodes = res;
      if(res.length ==0){
        this.driverForm.get("country")?.setValue(null);
    this.driverForm.get("state")?.setValue(null);
    this.driverForm.get("city")?.setValue(null);
    
      }
    })
  }
  onFileSelected(event: any) {
    //console.log(event);
    this.licenseformData = new FormData()
    const fileInput: string | any = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.licenseFile = event.target.files[0];
      const reader: any = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        //console.log(event);
        this.driverForm.get('driverLicensePhoto')?.setValue(event?.target?.result);
        this.licenseformData.append('file', this.licenseFile)
      }
    }
  }

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
      //   this.driverForm.get('profileImage')?.setValue(imageDataUrlProfile);
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


  deleteProfile(name: any) {
    if (name.toLowerCase() == 'profile') {
      this.selectedFileProfile = null;
      this.selectedProfileFile = null;
      this.imageUrlProfile = null;
    }



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
        this.driverServ.editDriverRecord = null;
        this.location.back();
      }
    })
  }

  onSubmitandClose(): void {
    this.prefixmobile.markAsTouched();
    this.prefixmobile.updateValueAndValidity();

    if (this.driverForm.valid && this.prefixmobile.valid) {
      this.driverModel.AddressLine1 = this.driverForm.value.addressLine1;
      this.driverModel.AddressLine2 = this.driverForm.value.addressLine2;
      this.driverModel.City = this.driverForm.value.city;
      this.driverModel.ContactDetails = this.driverForm.value.mobileNumber;
      this.driverModel.Country = this.driverForm.value.country;
      this.driverModel.County = "";
      this.driverModel.DriverID = this.driverId ? Number(this.driverId) : 0;
      this.driverModel.DriverLicencePhotoPath = "";
      this.driverModel.Email = this.driverForm.value.email;
      this.driverModel.EmployeeId = Number(this.employeeId.employeeId);
      this.driverModel.EmployeeNo = this.driverForm.value.employeeId?.toString();
      this.driverModel.FirstName = this.driverForm.value.firstName;
      this.driverModel.LastName = this.driverForm.value.lastName;
      this.driverModel.LicenceIssuedDate = this.driverForm.value.licenseIssuedDate;
      this.driverModel.LicenceValidDate = this.driverForm.value.validityDate ? new Date(this.driverForm.value.validityDate) : new Date();
      this.driverModel.LicenseNumber = this.driverForm.value.licenseNumber.toString();
      this.driverModel.PhotoPath = "";
      this.driverModel.Pincode = this.driverForm.value.zipCode;
      this.driverModel.State = this.driverForm.value.state;
      this.driverModel.Status = this.driverStatus;
      this.driverModel.Vendor = this.driverForm.value.vendor;
      this.driverModel.PhoneCountryCode = this.prefixmobile.value;

      let toastMessage = this.driverId ? 'Driver edited successfully.' : 'Driver added successfully.';

      this.driverServ.addUpdateDriver(this.driverModel).then(res => {

        //console.log(res);
        if (res) {
          if (this.selectedProfileFile) {
            this.driverServ.driverPhoto(res.driverID, this.formData).then((val: any) => { });
          }
          if (this.licenseFile) {
            this.driverServ.licensePhoto(res.driverID, this.licenseformData).then((res: any) => { });
          }
          this.utilSer.toaster.next({ type: customToaster.successToast, message: toastMessage });
          this.location.back();
        }
      }).catch((err:any)=>{
        //console.log(err);
        if(err){
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'A problem occured! Server error!' });
        }
      });;

    } else {
      if (this.prefixmobile.invalid) {
        this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' });
      } else {
        this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' });
      }
      this.driverForm.markAllAsTouched();
      return;
    }

    //console.log(this.driverForm.value);
  }

  onSubmitandAddAnother(): void {
    //console.log(this.driverForm.value);
    if (this.driverForm.valid && this.prefixmobile.valid) {
      //console.log(this.driverForm.value);
      //console.log(this.driverForm.value);
      this.driverModel.AddressLine1 = this.driverForm.value.addressLine1;
      this.driverModel.AddressLine2 = this.driverForm.value.addressLine2;
      this.driverModel.City = this.driverForm.value.city;
      this.driverModel.ContactDetails = this.driverForm.value.mobileNumber;
      this.driverModel.Country = this.driverForm.value.country;
      this.driverModel.County = "";
      this.driverModel.DriverID = this.driverId ? Number(this.driverId) : 0;
      this.driverModel.DriverLicencePhotoPath = "";
      this.driverModel.Email = this.driverForm.value.email;
      this.driverModel.EmployeeId = Number(this.employeeId.employeeId ? this.employeeId.employeeId:0);
      this.driverModel.EmployeeNo = this.driverForm.value.employeeId?.toString();
      this.driverModel.FirstName = this.driverForm.value.firstName;
      this.driverModel.LastName = this.driverForm.value.lastName;
      this.driverModel.LicenceIssuedDate = this.driverForm.value.licenseIssuedDate;
      this.driverModel.LicenceValidDate = this.driverForm.value.validityDate ? new Date(this.driverForm.value.validityDate) : new Date();
      this.driverModel.LicenseNumber = this.driverForm.value.licenseNumber.toString();
      this.driverModel.PhotoPath = "";
      this.driverModel.Pincode = this.driverForm.value.zipCode;
      this.driverModel.State = this.driverForm.value.state;
      this.driverModel.Status = this.driverStatus;
      this.driverModel.Vendor = this.driverForm.value.vendor;
      //console.log(this.driverModel);
      this.driverServ.addUpdateDriver(this.driverModel).then((res: any) => {
        //console.log(res);
        if (res) {
          if (this.selectedProfileFile != null) {
            this.driverServ.driverPhoto(res.driverID, this.formData).then((val: any) => {
            })
          }
          if (this.licenseFile) {
            this.driverServ.licensePhoto(res.driverID, this.licenseformData).then((res: any) => {
            })
          }
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Driver added successfully.' });
          this.driverForm.get('profileImage')?.setValue(null);
          this.driverForm.get('driverLicensePhoto')?.setValue(null);
          this.imageUrl = null;
          this.imageUrlProfile = null;
          this.selectedFile = null;
          this.driverForm.reset();
        }
      })
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.driverForm.markAllAsTouched();
      return;
    }

  }

  deleteLicensePhoto() {
    this.selectedFile = null
    this.imageUrl = null
  }

  checkalreadyExitsForEmail() {
    if (this.driverForm.value.email != this.driverStatus.email) {
      this.driverServ.Checkexits(this.driverForm.value.email, '').then((res: any) => {
        //console.log(res);
        if (!res.isUnique) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: res.message })
          this.emailExits = true
        }
        else {
          this.emailExits = false
        }
      })
    }
  }
  checkalreadyExitsForPhone() {
    if (this.driverForm.value.email != this.driverStatus.contactDetails) {
      this.driverServ.Checkexits('', this.driverForm.value.mobileNumber).then((res: any) => {
        //console.log(res);
        this
        if (!res.isUnique) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: res.message })
          this.mobileNumberexits = true
        }
        else {
          this.mobileNumberexits = false
        }
      })
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
