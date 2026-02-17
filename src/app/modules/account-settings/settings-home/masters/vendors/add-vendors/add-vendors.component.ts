import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountSettingsService } from 'src/app/modules/account-settings/account-settings.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AddStatusComponent } from '../../status/add-status/add-status.component';
import { MasterService } from '../../master.service';
import { vendorModel } from '../../masterModel/vendorModel';
import { map, startWith } from 'rxjs/operators';
import { Country } from 'country-state-city';

@Component({
  selector: 'app-add-vendors',
  templateUrl: './add-vendors.component.html',
  styleUrls: ['./add-vendors.component.css']
})
export class AddVendorsComponent implements OnInit {
  vendorsForm!: FormGroup
  saveBtnText: any = 'Add'
  zipCodes: any;
  countries: any;
  vendorModel: vendorModel = new vendorModel();
  vendorName: string = 'New';
  vendorId: number = 0;
  filteredTel: any;
  telOptions: any[] = [];;
  prefixmobile = new FormControl('', Validators.required);
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public fb: FormBuilder, public masterSer: MasterService, public settingServ: AccountSettingsService, public dialog: MatDialogRef<AddStatusComponent>, public utilServ: UtilityService) {
    this.getCountryCode();
    this.filteredTel = this.prefixmobile.valueChanges.pipe(
      startWith(''), map((value: any) => this._filter(value))
    );
  }

  ngOnInit(): void {
    this.getCountry();
    this.vendorsForm = this.fb.group({
      vendorsName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern("^[0-9]{8,12}$")]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      county: [''],
      country: ['', Validators.required],
      address: ['', Validators.required],
      postalCode: ['', Validators.required],

    });

    //console.log(this.data);
     this.prefixmobile?.setValue("+44");
    //  this.vendorsForm.get('vendorsName')?.setValue('Haulage holdings')
    if (this.data) {
      this.setValues();
      this.vendorName = 'Edit';
      this.saveBtnText = 'Update';
      this.vendorId = this.data.data.vendorId;
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
  getStateCountryCity(res: any) {
    this.vendorsForm.get("country")?.setValue(res.countryName);
    this.vendorsForm.get("state")?.setValue(res.state);
    this.vendorsForm.get("city")?.setValue(res.city);
  }
  getZipCode(event: any) {
    //console.log(event.target.value);

    this.masterSer.getStateCityCountyList(event.target.value).then((res: any) => {
      //console.log(res);
      this.zipCodes = res;

    })
  }
  getCountry() {
    this.masterSer.getCountryList().then((res: any) => {
      //console.log(res);
      this.countries = res;
    })
  }
  setValues() {
    this.vendorsForm.get('vendorsName')?.setValue(this.data?.data?.name)
    this.vendorsForm.get('postalCode')?.setValue(this.data?.data?.postalCode)
    this.vendorsForm.get('address')?.setValue(this.data?.data?.address)
    this.vendorsForm.get('country')?.setValue(this.data?.data?.country)
    // this.vendorsForm.get('county')?.setValue(this.data?.data?.vendorsName)
    this.vendorsForm.get('state')?.setValue(this.data?.data?.state)
    this.vendorsForm.get('city')?.setValue(this.data?.data?.city)
    this.vendorsForm.get('mobile')?.setValue(this.data?.data?.phoneNumber)
    this.vendorsForm.get('email')?.setValue(this.data?.data?.email)
    this.prefixmobile.setValue(this.data?.data?.vendorPhoneNumerWithCountryCode)

  }

  savevendors() {
    //console.log(this.vendorsForm.value);

    if (this.vendorsForm.valid && this.prefixmobile.valid) {
      this.vendorModel.Address = this.vendorsForm.value.address;
      this.vendorModel.City = this.vendorsForm.value.city;
      this.vendorModel.Country = this.vendorsForm.value.country;
      this.vendorModel.Email = this.vendorsForm.value.email;
      this.vendorModel.Name = this.vendorsForm.value.vendorsName;
      this.vendorModel.PhoneNumber = this.vendorsForm.value.mobile;
      this.vendorModel.PostalCode = this.vendorsForm.value.postalCode;
      this.vendorModel.State = this.vendorsForm.value.state;
      this.vendorModel.VendorCompanyCode = '';
      this.vendorModel.VendorId = this.vendorId;
      this.vendorModel.PhoneCountryCode = this.prefixmobile.value;
      //console.log(this.vendorModel);
      this.masterSer.addUpdateVendor(this.vendorModel).then((res: any) => {
        //console.log(res);
        if (res) {
          if (this.vendorName.toLowerCase() == 'new') {
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Vendor added successfully' });
            this.close(true)
          } else {
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Vendor updated successfully' });
            this.close(true)
          }
        }
      })
    }
  }

  close(value?: boolean) {
    this.dialog.close(value)
  }
}
