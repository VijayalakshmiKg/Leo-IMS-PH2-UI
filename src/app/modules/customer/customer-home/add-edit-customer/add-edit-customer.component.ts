import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CustomerService } from '../../customer.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { CustomerModel } from '../../customerModel/customerModel';
import { MatDialog } from '@angular/material/dialog';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';

@Component({
  selector: 'app-add-edit-customer',
  templateUrl: './add-edit-customer.component.html',
  styleUrls: ['./add-edit-customer.component.css']
})
export class AddEditCustomerComponent implements OnInit {

  customerForm!: FormGroup
  customerStatus: any = 'Active'
  saveBtnText: any;
  customerId: number = 0;
  customerModel: CustomerModel = new CustomerModel();
  countries: any[] = []
  states: any[] = []
  zipCodes: any[] = []
  employeeId: any;
  emailExits: boolean = false;
  phoneNumberExits: boolean = false;
  customerCodeExits: boolean = false;

  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    public customerServ: CustomerService,
    public location: Location,
    public utilSer: UtilityService
  ) { }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.pattern('^[a-zA-Z \\-\']+')]],
      customerCode: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\\-]+')]],
      email: ['', [Validators.required, this.isValidEmail.bind(this)]],
      phoneNumber: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: [''],
      zipCode: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });

    var user: any = localStorage.getItem("userData");
    this.employeeId = JSON.parse(user);

    this.getCountry();
    this.customerForm.get('country')?.setValue('United Kingdom');

    if (this.customerServ.editCustomerRecord) {
      this.saveBtnText = 'Update';
      this.customerId = this.customerServ.editCustomerRecord.customerID;
      this.setCustomerDetails();
    } else {
      this.saveBtnText = 'Add';
    }
  }

  setCustomerDetails() {
    const editData = this.customerServ.editCustomerRecord;
    this.customerStatus = editData.status
    this.customerForm.patchValue({
      customerName: editData.customerName,
      customerCode: editData.customerCode,
      email: editData.email,
      phoneNumber: editData.phoneNumber,
      address: editData.address,
      city: editData.city,
      state: editData.state,
      zipCode: editData.pincode,
      country: editData.country || 'United Kingdom'
    });
  }

  getCountry() {
    this.customerServ.getCountryList().then((res: any) => {
      this.countries = res;
    })
  }

  getStateCountryCity(res: any) {
    this.customerForm.get("country")?.setValue(res.countryName);
    this.customerForm.get("state")?.setValue(res.county);
    this.customerForm.get("city")?.setValue(res.city);
  }

  getZipCode(event: any) {
    this.customerServ.getCityStateCountyByZipCode(event.target.value).then((res: any) => {
      this.zipCodes = res;
      if (res.length == 0) {
        this.customerForm.get("country")?.setValue(null);
        this.customerForm.get("state")?.setValue(null);
        this.customerForm.get("city")?.setValue(null);
      }
    })
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
        this.customerServ.editCustomerRecord = null;
        this.location.back();
      }
    })
  }

  onSubmitandClose(): void {
    if (this.customerForm.valid && !this.emailExits && !this.phoneNumberExits && !this.customerCodeExits) {
      this.customerModel.CustomerID = this.customerId ? Number(this.customerId) : 0;
      this.customerModel.CustomerName = this.customerForm.value.customerName;
      this.customerModel.CustomerCode = this.customerForm.value.customerCode;
      this.customerModel.Email = this.customerForm.value.email;
      this.customerModel.PhoneNumber = this.customerForm.value.phoneNumber;
      this.customerModel.Address = this.customerForm.value.address;
      this.customerModel.City = this.customerForm.value.city;
      this.customerModel.State = this.customerForm.value.state;
      this.customerModel.Pincode = this.customerForm.value.zipCode;
      this.customerModel.Country = this.customerForm.value.country;
      this.customerModel.Status = this.customerStatus;

      let toastMessage = this.customerId ? 'Customer edited successfully.' : 'Customer added successfully.';

      this.customerServ.addUpdateCustomer(this.customerModel).then(res => {
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: toastMessage });
          this.location.back();
        }
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'A problem occured! Server error!' });
        }
      });
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' });
      this.customerForm.markAllAsTouched();
      return;
    }
  }

  onSubmitandAddAnother(): void {
    if (this.customerForm.valid && !this.emailExits && !this.phoneNumberExits && !this.customerCodeExits) {
      this.customerModel.CustomerID = 0;
      this.customerModel.CustomerName = this.customerForm.value.customerName;
      this.customerModel.CustomerCode = this.customerForm.value.customerCode;
      this.customerModel.Email = this.customerForm.value.email;
      this.customerModel.PhoneNumber = this.customerForm.value.phoneNumber;
      this.customerModel.Address = this.customerForm.value.address;
      this.customerModel.City = this.customerForm.value.city;
      this.customerModel.State = this.customerForm.value.state;
      this.customerModel.Pincode = this.customerForm.value.zipCode;
      this.customerModel.Country = this.customerForm.value.country;
      this.customerModel.Status = this.customerStatus;

      this.customerServ.addUpdateCustomer(this.customerModel).then((res: any) => {
        if (res) {
          this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Customer added successfully.' });
          this.customerForm.reset();
          this.customerForm.get('country')?.setValue('United Kingdom');
          this.customerStatus = 'Active';
        }
      }).catch((err: any) => {
        if (err) {
          this.utilSer.toaster.next({ type: customToaster.errorToast, message: 'A problem occured! Server error!' });
        }
      });
    } else {
      this.utilSer.toaster.next({ type: customToaster.warningToast, message: 'Please enter the details!' })
      this.customerForm.markAllAsTouched();
      return;
    }
  }

  checkalreadyExitsForEmail() {
    if (this.customerServ.editCustomerRecord && this.customerForm.value.email == this.customerServ.editCustomerRecord.email) {
      return;
    }
    this.customerServ.validateCustomerUniqueness(this.customerForm.value.email, '', '').then((res: any) => {
      if (!res.isUnique) {
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: res.message })
        this.emailExits = true
      } else {
        this.emailExits = false
      }
    })
  }

  checkalreadyExitsForPhone() {
    if (this.customerServ.editCustomerRecord && this.customerForm.value.phoneNumber == this.customerServ.editCustomerRecord.phoneNumber) {
      return;
    }
    this.customerServ.validateCustomerUniqueness('', this.customerForm.value.phoneNumber, '').then((res: any) => {
      if (!res.isUnique) {
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: res.message })
        this.phoneNumberExits = true
      } else {
        this.phoneNumberExits = false
      }
    })
  }

  checkalreadyExitsForCustomerCode() {
    if (this.customerServ.editCustomerRecord && this.customerForm.value.customerCode == this.customerServ.editCustomerRecord.customerCode) {
      return;
    }
    this.customerServ.validateCustomerUniqueness('', '', this.customerForm.value.customerCode).then((res: any) => {
      if (!res.isUnique) {
        this.utilSer.toaster.next({ type: customToaster.errorToast, message: res.message })
        this.customerCodeExits = true
      } else {
        this.customerCodeExits = false
      }
    })
  }

  isValidEmail(controls: AbstractControl): ValidationErrors | null | any {
    const value = controls.value;
    const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
    if (value?.length > 0) {
      return emailReg.test(value) ? null : { isEmail: true }
    }
    return null
  }

  allowOnlyNumbersLettersAndHyphen(event: KeyboardEvent) {
    const allowedChars = /^[a-zA-Z0-9\-]$/;
    const inputChar = event.key;
    if (!allowedChars.test(inputChar)) {
      event.preventDefault();
    }
  }
}
