import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountSettingsService } from '../../../account-settings.service';
import { Location } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { addaddressModel, addprofileModel } from '../../../accountModel/addProfilemodel';
import { Router } from '@angular/router';
import { Country } from 'country-state-city';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  profileForm!: FormGroup;
  addressModel: addaddressModel = new addaddressModel();
  profileModel: addprofileModel = new addprofileModel();
  userData: any;
  profileData: any;
  upload: any | string;
  formData = new FormData();

  citys: any | any[] = [
    "Mumbai",
    "Delhi",
    "Bengaluru",
    "Kolkata",
    "Chennai",
    "Hyderabad",
    "Ahmedabad",
    "Pune",
    "Jaipur",
    "Surat",
    "Lucknow",
    "Kanpur",
    "Nagpur",
    "Visakhapatnam",
    "Bhopal",
    "Patna"
  ]

  states: any | any = [
    "Maharashtra",
    "Delhi",
    "Karnataka",
    "West Bengal",
    "Tamil Nadu",
    "Telangana",
    "Gujarat",
    "Maharashtra",
    "Rajasthan",
    "Gujarat",
    "Uttar Pradesh",
    "Uttar Pradesh",
    "Maharashtra",
    "Andhra Pradesh",
    "Madhya Pradesh",
    "Bihar"
  ]

  zipCodes: any | any[] = []

  countries: any | any[] = [];

  billingzipCodes: any | any[] = []

  billingcountries: any | any[] = []

  timeZones: any | any[] = [
    "GMT-5:00 Eastern Standard Time (America/New_York)",
    "GMT-8:00 Pacific Standard Time (America/Los_Angeles)",
    "GMT+0:00 Greenwich Mean Time (Europe/London)",
    "GMT+1:00 Central European Time (Europe/Berlin)",
    "GMT+5:30 India Standard Time (Asia/Kolkata)",
    "GMT+9:00 Japan Standard Time (Asia/Tokyo)",
    "GMT+10:00 Australian Eastern Standard Time (Australia/Sydney)",
    "GMT+2:00 South Africa Standard Time (Africa/Johannesburg)",
    "GMT+3:00 Arabian Standard Time (Asia/Riyadh)",
    "GMT-3:00 Brasília Time (America/Sao_Paulo)"
  ]

  dateFormats: any | any[] = [
    "dd/MM/yyyy (28/10/2024)",
    "MM/dd/yyyy (10/28/2024)",
    "yyyy-MM-dd (2024-10-28)",
    "dd-MM-yyyy (28-10-2024)",
    "yyyy/MM/dd (2024/10/28)",
    "MMMM dd, yyyy (October 28, 2024)",
    "dd MMMM yyyy (28 October 2024)",
    "EEEE, MMMM dd, yyyy (Monday, October 28, 2024)",
    "MM-dd-yyyy (10-28-2024)",
    "yyyyMMdd (20241028)"
  ]
  profile: any;
  mobileCode: any;
  phonecode: any
  orgmobileCode: any;
  orgPhonecode: any;
  // faxcountry:any
  premobileNumber = new FormControl('+44', Validators.required);
  preworkPhone = new FormControl('+44');
  preorgMobile = new FormControl('+44', Validators.required);
  preorgWorkPhone = new FormControl('+44');
  // faxcode = new FormControl('');
  telOptions: any[] = [];
  phoneOptions: any[] = [];
  orgmobileOptions: any[] = [];
  orgphoneOptions: any[] = [];
  // faxcodeOptions:any[]=[];
  constructor(public fb: FormBuilder, public accServ: AccountSettingsService, public location: Location, private sanitizer: DomSanitizer, public utilServ: UtilityService, public route: Router) {
    this.getCountryCode();
    this.mobileCode = this.premobileNumber?.valueChanges.pipe(
      startWith(''), map((value: any) => this._filter(value))
    );
    this.phonecode = this.preworkPhone?.valueChanges.pipe(
      startWith(''), map((value: any) => this.phoneFilter(value))
    );
    this.orgmobileCode = this.preorgMobile?.valueChanges.pipe(
      startWith(''), map((value: any) => this.orgmobileFilter(value))
    );
    this.orgPhonecode = this.preorgWorkPhone?.valueChanges.pipe(
      startWith(''), map((value: any) => this.orgphoneFilter(value))
    );
    // this.faxcountry = this.faxcode?.valueChanges.pipe(
    //   startWith(''), map((value: any) => this.faxFilter(value))
    // );
  }

  ngOnInit(): void {

    let Data: any = localStorage.getItem("userData");
    this.userData = JSON.parse(Data);
    //console.log(this.userData);
    this.profileData = this.accServ.editProfile;
    if (this.profileData == 0) {
      this.route.navigateByUrl('/home/settings/profile')
    }

    this.profileForm = this.fb.group({
      file: [],

      // Personal Information
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      workPhone: ['',],

      // Organization Information
      displayName: [''],
      organizationName: [''],
      orgMobile: [''],
      orgWorkPhone: [''],
      sameAsOrganization: [false],

      // Organization Address
      orgAddressLine1: [''],
      orgAddressLine2: [''],
      orgCity: [''],
      orgState: [''],
      orgZipCode: [''],
      orgCountry: [''],

      // Billing Address
      billingAddressLine1: [''],
      billingAddressLine2: [''],
      billingCity: [''],
      billingState: [''],
      billingZipCode: [''],
      billingCountry: [''],

      // Time Zone
      timezone: [''],
      dateFormat: ['']
    })
    this.getCountry();
    this.billingCountry();

    if (this.accServ.editProfile) {
      this.setValuesProfile()
    }
  }


  // countryCode functionality
  private _filter(value: string): string[] {
    const filterValue = value;
    //console.log(value);

    return this.telOptions?.filter((option: any) => option.includes(filterValue));
  }
  private phoneFilter(value: string): string[] {
    const filterValue = value;
    //console.log(value);
    return this.phoneOptions?.filter((option: any) => option.includes(filterValue));
  }
  private orgmobileFilter(value: string): string[] {
    const filterValue = value;
    //console.log(value);
    return this.orgmobileOptions?.filter((option: any) => option.includes(filterValue));
  }
  private orgphoneFilter(value: string): string[] {
    const filterValue = value;
    //console.log(value);
    return this.orgphoneOptions?.filter((option: any) => option.includes(filterValue));
  }
  // private faxFilter(value: string): string[] {
  //   const filterValue = value;
  //   //console.log(value);
  //   return this.faxcodeOptions?.filter((option: any) => option.includes(filterValue));
  // }
  getCountryCode() {
    Country.getAllCountries().map((res: any) => {
      this.telOptions?.push(res.phonecode.includes("+") ? res.phonecode : '+' + res.phonecode);
      this.phoneOptions?.push(res.phonecode.includes("+") ? res.phonecode : '+' + res.phonecode);
      this.orgmobileOptions?.push(res.phonecode.includes("+") ? res.phonecode : '+' + res.phonecode);
      this.orgphoneOptions?.push(res.phonecode.includes("+") ? res.phonecode : '+' + res.phonecode);
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

  selectedFile: File | null = null; // To store the selected file
  imageUrl: string | ArrayBuffer | null | any = null;

  setValuesProfile() {
    //console.log(this.profileData);
    if (this.profileData) {
      this.profileForm.get('firstName')?.setValue(this.profileData.firstName);
      this.profileForm.get('lastName')?.setValue(this.profileData.lastName);
      this.profileForm.get('email')?.setValue(this.profileData.email);
      this.profileForm.get('mobileNumber')?.setValue(this.profileData?.mobileNumber); //profile mobile number
      this.premobileNumber?.setValue(this.profileData?.mobileNumberCountryCode); // profile mobile countrycode
      this.preworkPhone?.setValue(this.profileData?.phoneCountryCode);

      this.profileForm.get('workPhone')?.setValue(this.profileData?.phoneNumber);
      this.profileForm.get('displayName')?.setValue(this.profileData.employeeAddressmodel?.displayName);
      this.profileForm.get('organizationName')?.setValue(this.profileData.employeeAddressmodel?.organizationName);
      this.profileForm.get('orgMobile')?.setValue(this.profileData.employeeAddressmodel?.organizationMobileNumber);
      this.profileForm.get('orgWorkPhone')?.setValue(this.profileData.employeeAddressmodel?.organzitionPhoneNumber);

      this.preorgMobile?.setValue(this.profileData?.employeeAddressmodel.organizationMobileNumberCountryCode);
      this.preorgWorkPhone?.setValue(this.profileData?.employeeAddressmodel.organizationPhoneCountryCode);

      this.profileForm.get('sameAsOrganization')?.setValue(this.profileData?.employeeAddressmodel?.isSameAsBillingAddress);
      this.profileForm.get('orgAddressLine1')?.setValue(this.profileData.employeeAddressmodel?.address1);
      this.profileForm.get('orgAddressLine2')?.setValue(this.profileData.employeeAddressmodel?.address2);
      this.profileForm.get('orgCity')?.setValue(this.profileData.employeeAddressmodel?.city);
      this.profileForm.get('orgState')?.setValue(this.profileData.employeeAddressmodel?.state);
      this.profileForm.get('orgZipCode')?.setValue(this.profileData.employeeAddressmodel?.pincode);
      this.profileForm.get('orgCountry')?.setValue(this.profileData.employeeAddressmodel?.country);
      this.profileForm.get('billingAddressLine1')?.setValue(this.profileData.employeeAddressmodel?.billingAddressLine1);
      this.profileForm.get('billingAddressLine2')?.setValue(this.profileData.employeeAddressmodel?.billingAddressLine2 ? this.profileData.employeeAddressmodel?.billingAddressLine2 : '-')
      this.profileForm.get('billingCity')?.setValue(this.profileData.employeeAddressmodel?.billingCity);
      this.profileForm.get('billingState')?.setValue(this.profileData.employeeAddressmodel?.billingState);
      this.profileForm.get('billingZipCode')?.setValue(this.profileData.employeeAddressmodel?.billingPincode);
      this.profileForm.get('billingCountry')?.setValue(this.profileData.employeeAddressmodel?.billingCountry);
      this.profileForm.get('timezone')?.setValue(this.profileData.timeZone)
      this.profileForm.get('dateFormat')?.setValue(this.profileData.dateFormat)
      this.profile = this.profileData?.employeeProfilePhoto && this.profileData.employeeProfilePhoto.length > 0 ? this.profileData.employeeProfilePhoto[0].url : null;
    }
  }
  // fileUpload
  addprofileImg(img: any) {
    //console.log(img.target.files[0]);
    this.upload = img.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(img.target?.files[0]);
    reader.onload = (event: any) => {
      //console.log(event);
      this.profile = event.target.result;
      this.profileForm.get('file')?.setValue(this.upload);
      this.upload = this.sanitizer.bypassSecurityTrustUrl(reader.result as string) as SafeUrl;
      this.formData.append('file', img.target.files[0])
    }
  }


  updateUserProfile() {
    //console.log(this.profileData);
    if (this.profileForm.valid) {
      this.profileModel.IsActive = true;
      this.profileModel.EmployeeId = this.profileData.employeeId ? this.profileData.employeeId : 0;
      this.profileModel.DOB = this.userData.dob;
      this.profileModel.UserId = this.profileData.userId;
      this.profileModel.RoleId = this.userData.roleId;
      this.profileModel.Email = this.profileForm.value.email;
      this.profileModel.DOJ = this.userData.doj;
      this.profileModel.FirstName = this.profileForm.value.firstName;
      this.profileModel.MiddleName = ''
      this.profileModel.LastName = this.profileForm.value.lastName;
      this.profileModel.Gender = this.userData.gender;
      this.profileModel.Age = this.userData.age;
      this.profileModel.MobileNumber = this.profileForm.value.mobileNumber;
      this.profileModel.PhoneNumber = this.profileForm.value.workPhone;
      this.profileModel.Password = this.userData.password;
      this.profileModel.EmailConfirmed = false
      this.profileModel.PhoneNumberConfirmed = false
      this.profileModel.TwoFactorEnabled = false;
      this.profileModel.MobileNumberCountryCode = this.premobileNumber.value;
      this.profileModel.PhoneCountryCode = this.preworkPhone.value;
      // this.profileModel.ori
      //console.log(this.profileModel);

      this.accServ.addProfile(this.profileModel).then(res => {
        if (res) {
          this.addressModel.EmployeeAddressId = this.profileData.employeeAddressmodel?.employeeAddressId ? this.profileData.employeeAddressmodel?.employeeAddressId : 0;
          this.addressModel.IsSameAsBillingAddress = this.profileForm.value.sameAsOrganization;
          //console.log(this.profileForm.value.sameAsOrganization);

          this.addressModel.EmployeeId = this.profileData.employeeId ? this.profileData.employeeId : 0;
          this.addressModel.DisplayName = this.profileForm.value.displayName;
          this.addressModel.OrganizationName = this.profileForm.value.organizationName;
          this.addressModel.OrganizationMobileNumber = this.profileForm.value.orgMobile;
          this.addressModel.OrganzitionPhoneNumber = this.profileForm.value.orgWorkPhone;

          this.addressModel.OrganizationPhoneCountryCode = this.preorgWorkPhone.value
          this.addressModel.OrganizationMobileNumberCountryCode = this.preorgMobile.value
          // Organization Address
          this.addressModel.Address1 = this.profileForm.value.orgAddressLine1;
          this.addressModel.Address2 = this.profileForm.value.orgAddressLine2;
          this.addressModel.City = this.profileForm.value.orgCity;
          this.addressModel.State = this.profileForm.value.orgState;
          this.addressModel.Country = this.profileForm.value.orgCountry;
          this.addressModel.County = this.profileForm.value.orgState;
          this.addressModel.Pincode = this.profileForm.value.orgZipCode;

          // Billing Address
          this.addressModel.BillingAddressLine1 = this.profileForm.value.billingAddressLine1;
          this.addressModel.BillingAddressLine2 = this.profileForm.value.billingAddressLine2;
          this.addressModel.BillingCity = this.profileForm.value.billingCity;
          this.addressModel.BillingCountry = this.profileForm.value.billingCountry;
          this.addressModel.BillingState = this.profileForm.value.billingState;
          this.addressModel.BillingPincode = this.profileForm.value.billingZipCode;
          this.addressModel.TimeZone = this.profileForm.value.timezone;
          this.addressModel.DateFormat = this.profileForm.value.dateFormat;
          //console.log(this.addressModel);

          this.accServ.addAddress(this.addressModel).then(res => {
            //console.log(res);
            if (res) {
              if (this.upload) {
                this.accServ.fileupload(this.formData, this.profileData.employeeId).then(res => {
                  //console.log(res);
                  if (res) {

                    this.accServ.userProfileChanges.next(true)
                  }
                })
              }

              this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Profile updated successfully' });
            }

          })
        }
        this.route.navigateByUrl('home/settings/profile')
      })

    }
    else {
      this.utilServ.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
    }
  }

  deleteProfile(name: any) {
    if (name.toLowerCase() == 'profile') {
      this.profile = null;
      this.upload = null;
      // this.u = null;
    }



  }
  cancle() {
    this.location.back()

  }

  sameAsOrganizationAddress() {
    if (this.profileForm.value.sameAsOrganization) {  // When checked
      this.profileForm.get('billingAddressLine1')?.setValue(this.profileForm.get('orgAddressLine1')?.value);
      this.profileForm.get('billingAddressLine2')?.setValue(this.profileForm.get('orgAddressLine2')?.value);
      this.profileForm.get('billingCity')?.setValue(this.profileForm.get('orgCity')?.value);
      this.profileForm.get('billingState')?.setValue(this.profileForm.get('orgState')?.value);
      this.profileForm.get('billingZipCode')?.setValue(this.profileForm.get('orgZipCode')?.value);
      this.profileForm.get('billingCountry')?.setValue(this.profileForm.get('orgCountry')?.value);
    } else {  // When unchecked
      this.profileForm.get('billingAddressLine1')?.setValue(null);
      this.profileForm.get('billingAddressLine2')?.setValue(null);
      this.profileForm.get('billingCity')?.setValue(null);
      this.profileForm.get('billingState')?.setValue(null);
      this.profileForm.get('billingZipCode')?.setValue(null);
      this.profileForm.get('billingCountry')?.setValue(null);
    }
  }


  getStateCountryCity(res: any) {
    this.profileForm.get("orgCountry")?.setValue(res.countryName);
    this.profileForm.get("orgState")?.setValue(res.state);
    this.profileForm.get("orgCity")?.setValue(res.city);
    if(this.profileForm.value.sameAsOrganization){
      this.profileForm.get('billingCity')?.setValue(res.city);
      this.profileForm.get('billingState')?.setValue(res.state);
      this.profileForm.get('billingZipCode')?.setValue(res.postalCode);
      this.profileForm.get('billingCountry')?.setValue(res.countryName);
    }
  }

  // get zip code data 
  getZipCode(event: any) {
    //console.log(event.target.value);
    this.accServ.getStateCityCountyList(event.target.value).then((res: any) => {
      //console.log(res);
      this.zipCodes = res;

    })
  }

  // get country data list
  getCountry() {
    this.accServ.getCountryList().then((res: any) => {
      //console.log(res);
      this.countries = res;
    })
  }

  // ---------------------------------------
  billingStateCountryCity(res: any) {
    this.profileForm.get("billingCountry")?.setValue(res.countryName);
    this.profileForm.get('billingCity')?.setValue(res.city)
    this.profileForm.get('billingState')?.setValue(res.state)
  }

  // get zip code data 
  billingZipCode(event: any) {
    //console.log(event.target.value);
    this.accServ.getStateCityCountyList(event.target.value).then((res: any) => {
      //console.log(res);
      this.billingzipCodes = res;
    })
  }

  // get country data list
  billingCountry() {
    this.accServ.getCountryList().then((res: any) => {
      //console.log(res);
      this.billingcountries = res;
    })
  }



}
