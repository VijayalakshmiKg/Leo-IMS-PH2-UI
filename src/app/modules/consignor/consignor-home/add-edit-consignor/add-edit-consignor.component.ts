import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ConsignorService } from '../../consignor.service';
import { addConsignorModel } from '../../consignorModel/consignorModel';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { Country } from 'country-state-city';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-add-edit-consignor',
  templateUrl: './add-edit-consignor.component.html',
  styleUrls: ['./add-edit-consignor.component.css']
})
export class AddEditConsignorComponent implements OnInit {
  consignorForm!: FormGroup

  saveBtnText: any = 'Add'
  imageUrl: any
  selectedFile: any
  imageUrlProfile: any
  selectedFileProfile: any
  zipCodes: any | any[] = []
  countries: any | any[] = [];
  consignorModel: addConsignorModel = new addConsignorModel();
  filteredTel: any;
  filteredFax: any;
  telOptions: any[] = [];
  faxOptions: any[] = [];
  prefixmobile = new FormControl('+44', Validators.required);
  prefixfax = new FormControl('+44', Validators.required);

  constructor(public dialog: MatDialog, public fb: FormBuilder, public sanitizer: DomSanitizer, public consignorServ: ConsignorService, public location: Location, public utilSer: UtilityService) {
    this.getCountryCode();
    this.filteredTel = this.prefixmobile.valueChanges.pipe(
      startWith(''), map((value: any) => this._filter(value))
    );

    this.filteredFax = this.prefixfax.valueChanges.pipe(
      startWith(''), map((value: any) => this._filterFax(value))
    );
  }

  ngOnInit(): void {
    this.consignorForm = this.fb.group({
      consignorName: ['', Validators.required],
      consignorLicenseNo: ['', Validators.required],
      email: ['', [Validators.required, this.isValidEmail.bind(this)]],
      contactDetails: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      faxNumber: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', Validators.required],
      country: ['', Validators.required]
    });
    this.getCountries()
    //console.log(this.consignorServ.viewConsignorIndex);
    if (this.consignorServ.editConsignorRecord) {
      //console.log(this.consignorServ.editConsignorRecord);
      this.setconsignorDetails()
    } else {
      this.consignorForm.get("country")?.setValue('United Kingdom');
    }
  }
  private _filter(value: string): string[] {
    const filterValue = value;
    //console.log(value);

    return this.telOptions.filter((option: any) => option.includes(filterValue));
  }
  private _filterFax(value: string): string[] {
    const filterValue = value;
    //console.log(value);

    return this.faxOptions.filter((option: any) => option.includes(filterValue));
  }
  getCountryCode() {
    Country.getAllCountries().map((res: any) => {
      this.telOptions.push(res.phonecode.includes("+") ? res.phonecode : '+' + res.phonecode);
      this.faxOptions.push(res.phonecode.includes("+") ? res.phonecode : '+' + res.phonecode);
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
    this.consignorServ.getCountryList().then(res => {
      //console.log(res);
      this.countries = res;
    })
  }

  getStateCountryCity(res: any) {
    this.consignorForm.get("country")?.setValue(res.countryName);
    if (!res.countryName) {
      this.consignorForm.get("country")?.setValue('United Kingdom');
    }
    this.consignorForm.get("state")?.setValue(res.county);
    this.consignorForm.get("city")?.setValue(res.city);
  }
  getZipCode(event: any) {
    //console.log(event.target.value);
    this.consignorServ.getZipCodes(event.target.value).then((res: any) => {
      //console.log(res);
      this.zipCodes = res;
      if (res.length == 0) {
        this.consignorForm.get("state")?.setValue(null);
        this.consignorForm.get("city")?.setValue(null);
      }
    })
  }
  setconsignorDetails() {
    this.imageUrl = this.consignorServ?.editConsignorRecord?.consignorLicensePhoto
    this.imageUrlProfile = this.consignorServ?.editConsignorRecord?.profileImage
    this.selectedFile = this.consignorServ?.editConsignorRecord?.selectedFileconsignorLicense
    this.consignorForm.patchValue(this.consignorServ.editConsignorRecord);
    this.prefixmobile.setValue(this.consignorServ.editConsignorRecord.phoneCountryCode);
    // this.prefixfax.setValue(this.consignorServ.editConsignorRecord.faxCountryCode);
  }

  // onFileSelected(event: Event) {
  //   const fileInput = event.target as HTMLInputElement;
  //   if (fileInput.files && fileInput.files.length > 0) {
  //     this.selectedFile = fileInput.files[0].name;
  //     this.consignorForm.get('selectedFileconsignorLicense')?.setValue(this.selectedFile.name)
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const imageDataUrl = reader.result as string;
  //       // Set the raw data URL in the form control
  //       this.consignorForm.get('consignorLicensePhoto')?.setValue(imageDataUrl);
  //       // Set the sanitized URL for display only
  //       this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(imageDataUrl) as SafeUrl;
  //     };
  //     reader.readAsDataURL(this.selectedFile);
  //   }
  // }

  // onFileSelectedProfile(event: Event) {
  //   const fileInput = event.target as HTMLInputElement;
  //   if (fileInput.files && fileInput.files.length > 0) {
  //     this.selectedFileProfile = fileInput.files[0];
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const imageDataUrlProfile = reader.result as string;
  //       // Set the raw data URL in the form control
  //       this.consignorForm.get('profileImage')?.setValue(imageDataUrlProfile);
  //       // Set the sanitized URL for display only
  //       this.imageUrlProfile = this.sanitizer.bypassSecurityTrustUrl(imageDataUrlProfile) as SafeUrl;
  //     };
  //     reader.readAsDataURL(this.selectedFileProfile);
  //   }
  // }



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
        this.consignorServ.editConsignorRecord = null;
        this.location.back()
      }
    })
  }

  onSubmitandClose(): void {
    //console.log(this.consignorForm.value);
    this.consignorModel.ConsignorID = this.consignorServ.editConsignorRecord ? this.consignorServ.editConsignorRecord.consignorID : 0;
    this.consignorModel.ConsignorName = this.consignorForm.value.consignorName;
    this.consignorModel.ConsignorLicenseNo = this.consignorForm.value.consignorLicenseNo;
    this.consignorModel.Email = this.consignorForm.value.email;
    this.consignorModel.PhoneCountryCode = this.prefixmobile.value;
    this.consignorModel.ContactDetails = this.consignorForm.value.contactDetails;
    this.consignorModel.FaxCountryCode = this.prefixfax.value;
    this.consignorModel.FaxNumber = this.consignorForm.value.faxNumber;
    this.consignorModel.Address1 = this.consignorForm.value.address1;
    this.consignorModel.Address2 = this.consignorForm.value.address2;
    this.consignorModel.City = this.consignorForm.value.city;
    this.consignorModel.State = this.consignorForm.value.state;
    this.consignorModel.Pincode = this.consignorForm.value.pincode;
    this.consignorModel.Country = this.consignorForm.value.country;
    if (this.consignorForm.valid) {
      //console.log(this.consignorModel);
      let toastMessage = this.consignorServ.editConsignorRecord ? 'Supplier edited successfully.' : 'Supplier added successfully.';
      this.consignorServ.addUpdateConsignor(this.consignorModel).then(res => {
        //console.log(res);
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: toastMessage })
          this.location.back()
        }
      }).catch((err:any)=>{
        //console.log(err);
        if(err){
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
        }
      });
    }
    else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' });
      this.consignorForm.markAllAsTouched();
      return
    }
  }
  onSubmitandAddAnother(): void {
    //console.log(this.consignorForm.value);
    if (this.consignorForm.valid) {
      this.consignorModel.ConsignorID = 0;
      this.consignorModel.ConsignorName = this.consignorForm.value.consignorName;
      this.consignorModel.ConsignorLicenseNo = this.consignorForm.value.consignorLicenseNo;
      this.consignorModel.Email = this.consignorForm.value.email;
      this.consignorModel.PhoneCountryCode = this.prefixmobile.value;
      this.consignorModel.ContactDetails = this.prefixmobile.value + this.consignorForm.value.contactDetails;
      this.consignorModel.FaxCountryCode = this.prefixfax.value;
      this.consignorModel.FaxNumber = this.prefixfax.value + this.consignorForm.value.faxNumber;
      this.consignorModel.Address1 = this.consignorForm.value.address1;
      this.consignorModel.Address2 = this.consignorForm.value.address2;
      this.consignorModel.City = this.consignorForm.value.city;
      this.consignorModel.State = this.consignorForm.value.state;
      this.consignorModel.Pincode = this.consignorForm.value.pincode;
      this.consignorModel.Country = this.consignorForm.value.country;
      //console.log(this.consignorModel);
      this.consignorServ.addUpdateConsignor(this.consignorModel).then(res => {
        //console.log(res);
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Supplier added successfully.' })
          this.consignorForm.reset();
        }
      }).catch((err:any)=>{
        //console.log(err);
        if(err){
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'Server unavailable!' });
        }
      });
      // Process the form submission here
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.consignorForm.markAllAsTouched();
      return
    }

  }

  deleteLicensePhoto() {
    this.selectedFile = null
    this.imageUrl = null
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
