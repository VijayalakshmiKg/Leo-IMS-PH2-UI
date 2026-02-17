import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ConsigneeService } from '../../consignee.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { addConsigneeModel } from '../../consigneeModel/consigneeModel';
import { Country } from 'country-state-city';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-add-edit-consignee',
  templateUrl: './add-edit-consignee.component.html',
  styleUrls: ['./add-edit-consignee.component.css']
})
export class AddEditConsigneeComponent implements OnInit {
  consigneeForm!: FormGroup

  saveBtnText: any = 'Add'
  imageUrl: any
  selectedFile: any
  imageUrlProfile: any
  selectedFileProfile: any
  zipCodes: any | any[] = []
  countries: any | any[] = [];
  consigneeModel: addConsigneeModel = new addConsigneeModel();
  filteredTel: any;
  filteredFax: any;
  telOptions: any[] = [];
  faxOptions: any[] = [];
  prefixmobile = new FormControl('+44', Validators.required);
  prefixfax = new FormControl('+44', Validators.required);

  constructor(public dialog: MatDialog, public fb: FormBuilder, public sanitizer: DomSanitizer, public consigneeServ: ConsigneeService, public location: Location, public utilSer: UtilityService) {
    this.getCountryCode();
    this.filteredTel = this.prefixmobile?.valueChanges.pipe(
      startWith(''), map((value: any) => this._filter(value))
    );

    this.filteredFax = this.prefixfax.valueChanges.pipe(
      startWith(''), map((value: any) => this._filterFax(value))
    );
  }

  ngOnInit(): void {

    this.consigneeForm = this.fb.group({
      consigneeName: ['', Validators.required],
      consigneeRegNo: ['', Validators.required],
      email: ['', [Validators.required, this.isValidEmail.bind(this)]],
      contactDetails: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      faxNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      address1: ['', Validators.required],
      address2: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', Validators.required],
      country: ['', Validators.required]
    });
    this.getCountries()
    //console.log(this.consigneeServ.viewConsigneeIndex);
    if (this.consigneeServ.editConsigneeRecord) {
      //console.log(this.consigneeServ.editConsigneeRecord);
      this.setconsigneeDetails()
    }
    else {
      this.consigneeForm.get("country")?.setValue('United Kingdom');
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
    this.consigneeServ.getCountryList().then(res => {
      //console.log(res);
      this.countries = res;
    })
  }

  getStateCountryCity(res: any) {
    this.consigneeForm.get("country")?.setValue(res.countryName);
    if (!res.countryName) {
      this.consigneeForm.get("country")?.setValue('United Kingdom');
    }
    this.consigneeForm.get("state")?.setValue(res.county);
    this.consigneeForm.get("city")?.setValue(res.city);
  }
  getZipCode(event: any) {
    //console.log(event.target.value);
    this.consigneeServ.getZipCodes(event.target.value).then((res: any) => {
      //console.log(res);
      this.zipCodes = res;
      if(res.length == 0){
        this.consigneeForm.get("state")?.setValue(null);
        this.consigneeForm.get("city")?.setValue(null);
      }
    })
  }
  setconsigneeDetails() {
    this.imageUrl = this.consigneeServ?.editConsigneeRecord?.consigneeLicensePhoto
    this.imageUrlProfile = this.consigneeServ?.editConsigneeRecord?.profileImage
    this.selectedFile = this.consigneeServ?.editConsigneeRecord?.selectedFileconsigneeLicense
    this.consigneeForm.patchValue(this.consigneeServ.editConsigneeRecord)
    this.prefixmobile.setValue(this.consigneeServ.editConsigneeRecord.phoneCountryCode);
    // this.prefixfax.setValue(this.consigneeServ.editConsigneeRecord.faxCountryCode);
  }


  // onFileSelected(event: Event) {
  //   const fileInput = event.target as HTMLInputElement;
  //   if (fileInput.files && fileInput.files.length > 0) {
  //     this.selectedFile = fileInput.files[0].name;
  //     this.consigneeForm.get('selectedFileconsigneeLicense')?.setValue(this.selectedFile.name)
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const imageDataUrl = reader.result as string;
  //       // Set the raw data URL in the form control
  //       this.consigneeForm.get('consigneeLicensePhoto')?.setValue(imageDataUrl);
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
  //       this.consigneeForm.get('profileImage')?.setValue(imageDataUrlProfile);
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
        this.consigneeServ.editConsigneeRecord = null
        this.location.back()
      }
    })
  }

  onSubmitandClose(): void {
    //console.log(this.consigneeForm.value);
    this.consigneeModel.ConsigneeID = this.consigneeServ.editConsigneeRecord ? this.consigneeServ.editConsigneeRecord.consigneeID : 0;
    this.consigneeModel.ConsigneeName = this.consigneeForm.value.consigneeName;
    this.consigneeModel.ConsigneeRegNo = this.consigneeForm.value.consigneeRegNo;
    this.consigneeModel.Email = this.consigneeForm.value.email;
    this.consigneeModel.PhoneCountryCode = this.prefixmobile.value;
    this.consigneeModel.ContactDetails = this.consigneeForm.value.contactDetails;
    this.consigneeModel.FaxCountryCode = this.prefixfax.value;
    this.consigneeModel.FaxNumber = this.consigneeForm.value.faxNumber;
    this.consigneeModel.Address1 = this.consigneeForm.value.address1;
    this.consigneeModel.Address2 = this.consigneeForm.value.address2;
    this.consigneeModel.City = this.consigneeForm.value.city;
    this.consigneeModel.State = this.consigneeForm.value.state;
    this.consigneeModel.Pincode = this.consigneeForm.value.pincode;
    this.consigneeModel.Country = this.consigneeForm.value.country;
    if (this.consigneeForm.valid && this.prefixmobile.valid && this.prefixfax.valid) {
      //console.log(this.consigneeModel);
      let toastMessage = this.consigneeServ.editConsigneeRecord ? 'Consignee edited successfully.' : 'Consignee added successfully.';
      this.consigneeServ.addUpdateConsignee(this.consigneeModel).then(res => {
        //console.log(res);
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: toastMessage })
          this.location.back()
        }
      })
    }
    else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.consigneeForm.markAllAsTouched();
      return;
    }
  }
  onSubmitandAddAnother(): void {
    //console.log(this.consigneeForm.value);
    if (this.consigneeForm.valid) {
      this.consigneeModel.ConsigneeID = 0;
      this.consigneeModel.ConsigneeName = this.consigneeForm.value.consigneeName;
      this.consigneeModel.ConsigneeRegNo = this.consigneeForm.value.consigneeRegNo;
      this.consigneeModel.Email = this.consigneeForm.value.email;
      this.consigneeModel.PhoneCountryCode = this.prefixmobile.value;
      this.consigneeModel.ContactDetails = this.consigneeForm.value.contactDetails;
      this.consigneeModel.FaxCountryCode = this.prefixfax.value;
      this.consigneeModel.FaxNumber = this.consigneeForm.value.faxNumber;
      this.consigneeModel.Address1 = this.consigneeForm.value.address1;
      this.consigneeModel.Address2 = this.consigneeForm.value.address2;
      this.consigneeModel.City = this.consigneeForm.value.city;
      this.consigneeModel.State = this.consigneeForm.value.state;
      this.consigneeModel.Pincode = this.consigneeForm.value.pincode;
      this.consigneeModel.Country = this.consigneeForm.value.country;
      //console.log(this.consigneeModel);
      this.consigneeServ.addUpdateConsignee(this.consigneeModel).then(res => {
        //console.log(res);
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Consignee added successfully.' })
          this.consigneeForm.reset();
        }
      })
      // Process the form submission here
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.consigneeForm.markAllAsTouched();
      return;
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
