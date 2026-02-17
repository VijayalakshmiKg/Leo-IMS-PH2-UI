import { Component, OnInit } from '@angular/core';
import { ShunterDriverService } from '../../shunter-driver.service';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Country } from 'country-state-city';
import { map, startWith } from 'rxjs/operators';
import { shunterModel } from '../shunterDriverModel/shunterDriverModel';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-shunter-drivers',
  templateUrl: './add-edit-shunter-drivers.component.html',
  styleUrls: ['./add-edit-shunter-drivers.component.css']
})
export class AddEditShunterDriversComponent implements OnInit {

  shunterDriverForm!: FormGroup
  formData: FormData = new FormData();
  saveBtnText: any = 'Add'
  imageUrl: any
  selectedFile: any
  imageUrlProfile: any;
  selectedFileProfile: any
  zipCodes: any | any[] = []
  countries: any | any[] = [];
  driverId: number = 0;
  shunterDriverModel: shunterModel = new shunterModel();
  filteredTel: any;
  telOptions: any[] = [];
  prefixmobile = new FormControl('+44', Validators.required);
  userDetails: any
  userDetailsdata: any
  photoImg: any;
  selectedProfileFile: any;
  licensePhoto: any;
  emailExits: boolean = false;
  mobileNumberexits: boolean = false;
  driverData: any;


  constructor(public fb: FormBuilder, public dialog: MatDialog, public sanitizer: DomSanitizer, public shuntDriverServ: ShunterDriverService, public location: Location, public utilSer: UtilityService) {
    this.getCountryCode();
    this.filteredTel = this.prefixmobile?.valueChanges.pipe(
      startWith(''), map((value: any) => this._filter(value))
    );
  }

  ngOnInit(): void {
    this.selectedFileProfile = null;
    this.selectedProfileFile = null;
    this.licensePhoto = null;
    this.imageUrlProfile = null;
    let userCred: any = localStorage.getItem('userDetails')
    this.userDetails = JSON.parse(userCred);
    this.getUserDetails();
    this.shunterDriverForm = this.fb.group({
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

      // driverLicensePhoto: [''],
      // selectedFileDriverLicense:['']
    });
    this.getCountries()
    //console.log(this.shuntDriverServ.viewShuntDriverIndex);
    if (this.shuntDriverServ.editShunDriverRecord) {
      //console.log(this.shuntDriverServ.editShunDriverRecord);
      this.saveBtnText = 'Update';
      this.driverId = this.shuntDriverServ.editShunDriverRecord.shunterDriverID;
      this.setDriverDetails()
    } else {
      this.prefixmobile?.setValue("+44");
      this.saveBtnText = 'Add';
    }
  }
  // Get user details
  getUserDetails() {
    this.shuntDriverServ.getProfile(this.userDetails.email).then(data => {
      //console.log(data);
      this.userDetailsdata = data[0];
    })
  }
  private _filter(value: string): string[] {
    const filterValue = value;
    //console.log(value);

    return this.telOptions.filter((option: any) => option.includes(filterValue));
  }
  setDriverDetails() {
    this.shuntDriverServ.viewDriverDetail(this.driverId).then((res: any) => {
      //console.log(res);
      this.driverData = res;
      this.shunterDriverForm.get("firstName")?.setValue(res.shunterfirstname);
      this.shunterDriverForm.get("lastName")?.setValue(res.shunterlastname);
      this.shunterDriverForm.get("email")?.setValue(res.email);
      this.shunterDriverForm.get("contactDetails")?.setValue(res.contactDetails);
      this.shunterDriverForm.get("employeeId")?.setValue(res.employeeNo);
      this.shunterDriverForm.get("addressLine1")?.setValue(res.addressLine1);
      this.shunterDriverForm.get("addressLine2")?.setValue(res.addressLine2);
      this.shunterDriverForm.get("city")?.setValue(res.city);
      this.shunterDriverForm.get("state")?.setValue(res.state);
      this.shunterDriverForm.get("zipCode")?.setValue(res.pincode);
      this.shunterDriverForm.get("country")?.setValue(res.country);
      this.prefixmobile?.setValue(res.phoneCountryCode);
      this.imageUrlProfile = res.shunterDriverProfilePhoto[0]?.url;
      this.selectedFile = res.shunterDriverProfilePhoto[0]?.fileName;
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
    this.shuntDriverServ.getCountryList().then(res => {
      //console.log(res);
      this.countries = res;
    })
  }

  getStateCountryCity(res: any) {
    this.shunterDriverForm.get("country")?.setValue(res.countryName);
    this.shunterDriverForm.get("state")?.setValue(res.state);
    this.shunterDriverForm.get("city")?.setValue(res.city);
  }
  getZipCode(event: any) {
    //console.log(event.target.value);
    this.shuntDriverServ.getZipCodes(event.target.value).then((res: any) => {
      //console.log(res);
      this.zipCodes = res;
    })
  }

  onFileSelected(event: any) {
    this.formData = new FormData();
    // const fileInput = event.target as HTMLInputElement;
    //console.log('profile', event.target.files);
    //console.log(event.target.files[0].size);
    if (event.target.files[0].size > 1024000) {
      this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'File is too large, maximum file size is 1MB' })
    } else if (event.target.files[0].size < 1024000 && event.target.files.length > 0) {

      this.licensePhoto = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        //console.log(event);
        this.photoImg = event.target.result;
        //console.log('dsds', event.target.files[0].name);


      }
      this.selectedFile = event.target.files[0].name;
      this.formData.append('file', this.licensePhoto);
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
        this.shuntDriverServ.editShunDriverRecord = null;
        this.location.back();
      }
    })
  }

  onSubmitandClose(): void {
    //console.log(this.shunterDriverForm.value);
    this.shunterDriverModel.ShunterDriverID = this.shuntDriverServ.editShunDriverRecord ? this.shuntDriverServ.editShunDriverRecord.shunterDriverID : 0;
    this.shunterDriverModel.PlantSiteManagerId = this.userDetailsdata.employeeId;
    this.shunterDriverModel.Shunterfirstname = this.shunterDriverForm.value.firstName;
    this.shunterDriverModel.Shunterlastname = this.shunterDriverForm.value.lastName;
    this.shunterDriverModel.Email = this.shunterDriverForm.value.email.trim("");
    this.shunterDriverModel.EmployeeNo = this.shunterDriverForm.value.employeeId;
    this.shunterDriverModel.PhoneCountryCode = this.prefixmobile.value;
    this.shunterDriverModel.ContactDetails = this.shunterDriverForm.value.contactDetails.trim("");
    this.shunterDriverModel.AddressLine1 = this.shunterDriverForm.value.addressLine1;
    this.shunterDriverModel.AddressLine2 = this.shunterDriverForm.value.addressLine2;
    this.shunterDriverModel.City = this.shunterDriverForm.value.city;
    this.shunterDriverModel.State = this.shunterDriverForm.value.state;
    this.shunterDriverModel.Pincode = this.shunterDriverForm.value.zipCode;
    this.shunterDriverModel.Country = this.shunterDriverForm.value.country;
    this.shunterDriverModel.Status = this.shuntDriverServ.editShunDriverRecord ? this.shuntDriverServ.editShunDriverRecord.status : 'Available';
    if (this.shunterDriverForm.valid && this.prefixmobile.valid) {
      //console.log(this.shunterDriverModel);
      let toastMessage = this.shuntDriverServ.editShunDriverRecord ? 'Shunter driver edited successfully.' : 'Shunter driver added successfully.';
      this.shuntDriverServ.addUpdateShunter(this.shunterDriverModel).then(res => {
        //console.log(res);
        if (res) {
          if (this.selectedProfileFile) {
            //console.log(res.shunterDriverID, this.formData);

            this.shuntDriverServ.shunterDriverPhoto(res.shunterDriverID, this.formData).then((val: any) => {
              //console.log(val);

            })

          }
          if (this.licensePhoto) {
            this.shuntDriverServ.shunterDriverLicense(res.shunterDriverID, this.formData).then((val: any) => {

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
    //console.log(this.shunterDriverForm.value);
    this.shunterDriverModel.ShunterDriverID = 0;
    this.shunterDriverModel.PlantSiteManagerId = this.userDetailsdata.employeeId;
    this.shunterDriverModel.Shunterfirstname = this.shunterDriverForm.value.firstName;
    this.shunterDriverModel.Shunterlastname = this.shunterDriverForm.value.lastName;
    this.shunterDriverModel.Email = this.shunterDriverForm.value.email;
    this.shunterDriverModel.EmployeeNo = this.shunterDriverForm.value.employeeId;
    this.shunterDriverModel.PhoneCountryCode = this.prefixmobile.value;
    this.shunterDriverModel.ContactDetails = this.shunterDriverForm.value.contactDetails;
    this.shunterDriverModel.AddressLine1 = this.shunterDriverForm.value.addressLine1;
    this.shunterDriverModel.AddressLine2 = this.shunterDriverForm.value.addressLine2;
    this.shunterDriverModel.City = this.shunterDriverForm.value.city;
    this.shunterDriverModel.State = this.shunterDriverForm.value.state;
    this.shunterDriverModel.Pincode = this.shunterDriverForm.value.zipCode;
    this.shunterDriverModel.Country = this.shunterDriverForm.value.country;
    if (this.shunterDriverForm.valid && this.prefixmobile.valid) {
      //console.log(this.shunterDriverModel);
      this.shuntDriverServ.addUpdateShunter(this.shunterDriverModel).then(res => {
        //console.log(res);
        if (res) {
          if (this.selectedProfileFile) {
            this.shuntDriverServ.shunterDriverPhoto(res.shunterDriverID, this.formData).then((val: any) => {
            })
          }
          let toastMessage = this.shuntDriverServ.editShunDriverRecord ? 'Shunter driver edited successfully.' : 'Shunter driver added successfully.';
          this.utilSer.toaster.next({ type: customToaster.successToast, message: toastMessage })
          this.shunterDriverForm.get('profileImage')?.setValue(null);
          this.imageUrl = null;
          this.imageUrlProfile = null;
          this.selectedFile = null;
          this.shunterDriverForm.reset();
        }
        if (this.licensePhoto) {
          this.shuntDriverServ.shunterDriverLicense(res.shunterDriverID, this.formData).then((val: any) => {

          })
        }
        this.shuntDriverServ.subject.next(true)
      })
    }
    else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
    }

  }

  deleteLicensePhoto() {
    this.selectedFile = null
    this.imageUrl = null
  }

  shunterDuplicateemail() {
    if (this.shunterDriverForm.value.email?.trim("") != this.driverData?.email) {
      this.shuntDriverServ.shunterDuplicate(this.shunterDriverForm.value.email, '').then(res => {
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
  shunterDuplicateMobile() {
    if (this.shunterDriverForm.value.contactDetails?.trim("") != this.driverData?.contactDetails) {
      this.shuntDriverServ.shunterDuplicate('', this.shunterDriverForm.value.contactDetails).then(res => {
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
