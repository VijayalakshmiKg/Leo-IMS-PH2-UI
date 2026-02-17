import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../users.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { Location } from '@angular/common';
import { addUserModel } from '../../users-main/models/userModel';
import { Country } from 'country-state-city';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUsersComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  saveBtnText: any = 'Add'

  rolesList: any | any[] = [
    // 'Plant Site Manager',
    // 'Transport Manager',
    // 'Driver',
    // 'Shunter Driver',
    // 'Abattoir Site Manager',
    // 'Weighbridge Operator ',
    // 'Production Manager',
    // 'Quality Manager',
    // 'Accounts Manager',
    // 'General Manager',

  ]

   filteredTel: any;
    telOptions: any[] = [];

    emailValue:any
    mobileValue:any
    

  constructor(private fb: FormBuilder, public route: Router, public userServ: UsersService, public utilServ: UtilityService, public locaton: Location) {
   
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      prefixmobile:['+44',[Validators.required, Validators.pattern(/^\+\d+$/)]] ,
      email: this.fb.control("", { 
        validators: [
          Validators.required,
          Validators.email,
          Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
        ], 
        updateOn: "blur" // ✅ Only for this field
      }),
      mobileNumber: this.fb.control("", { 
        validators: [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10)
        ], 
        updateOn: "blur" // ✅ Only for this field
      }),
      roleType: ['', Validators.required],
      location: ['']
    });

    //console.log(this.userServ.viewByEditUsers);


    if (this.userServ.viewByEditUsers) {
      this.setUserData();
      this.saveBtnText = 'Update';
    } else {
      // this.cancel();
    }
    this.getCountryCode();
    this.getRoles();


    this.filteredTel = this.userForm?.get('prefixmobile')?.valueChanges.pipe(
      startWith(''), map((value: any) => this._filter(value))
    );

    this.userForm.get('roleType')?.valueChanges.subscribe((roleType) => {
      const locationControl = this.userForm.get('location');
    
     /* if (roleType === 2) {
        locationControl?.setValidators([Validators.required]);
      } else {
        locationControl?.clearValidators();
      }
      */  
      locationControl?.updateValueAndValidity();
    });


    this.userForm.get('email')?.valueChanges.subscribe((value:any) => {
      //console.log(value);
      this.emailValue = value
      this.checkExistingValues()

    })
    this.userForm.get('mobileNumber')?.valueChanges.subscribe((value:any) => {
      //console.log(value);
      this.mobileValue = value
      this.checkExistingValues()
    })

    this.getLocations()
  }


  checkExistingValues(){
    this.userServ.Checkexits(this.emailValue, this.mobileValue).then((res:any) => {
      //console.log(res);
      
    })
  }

  locationList :any | any[] = []
  getLocations(){
    this.userServ.getPlantSiteLocations().then(res => {
      //console.log(res);
      if(res){
        this.locationList = res
      }
    })
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

  ngOnDestroy(): void {
    this.userServ.editUserIndex = undefined
    this.userServ.viewByEditUsers = undefined
  }

  getRoles(){
    this.userServ.getRolesList().then(res => {
      //console.log(res);
      if(res){
        this.rolesList = res
      }
      
    })
  }

  restrictedName(event: any) {
    const keyCode = event.keyCode || event.which;
    //console.log(keyCode);

    // Block special characters based on the key code ranges
    if (
      (keyCode >= 32 && keyCode <= 64) || // Special characters (space, !, @, etc.)
      (keyCode >= 91 && keyCode <= 96) ||  // Special characters ([, \, ], etc.)
      (keyCode >= 123 && keyCode <= 126)  // Special characters ({, |, }, etc.)
    ) {
      event.preventDefault(); // Prevent the key from being entered
      return false;
    }

    return true; // Allow other key presses
  }


  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode <= 46 || (charCode > 31 && (charCode < 48 || charCode > 57))) {
      if (this.userForm.value.mobileNumber?.length < 8) {
        // this.proper = true;
      }
      return false;
    }
    return true;
  }


  setUserData() {
    this.employeeID = this.userServ?.viewByEditUsers?.employeeId
    this.userForm.get("firstName")?.setValue(this.userServ?.viewByEditUsers?.userFirstName)
    this.userForm.get("lastName")?.setValue(this.userServ?.viewByEditUsers?.userLastName)
    this.userForm.get("email")?.setValue(this.userServ?.viewByEditUsers?.email)
    this.userForm.get("prefixmobile")?.setValue(this.userServ?.viewByEditUsers?.phoneCountryCode)
    this.userForm.get("mobileNumber")?.setValue(this.userServ?.viewByEditUsers?.phoneNumber)
    this.userForm.get("roleType")?.setValue(this.userServ?.viewByEditUsers?.roleId)
    this.userForm.get("location")?.setValue(this.userServ?.viewByEditUsers?.consigneeId)
  }

  employeeID:any = 0

  onSubmit() {
    //console.log(this.userForm.value);
    
    // Mark all fields as touched to trigger validation messages
    this.userForm.markAllAsTouched();

    if (this.userForm.invalid) {
      this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Please fill all required fields correctly' });
      return;
    }

    if (this.userForm.valid) {
      //console.log(this.userForm.value);

      let userModels:addUserModel = new addUserModel()
  
      userModels.EmployeeId = this.employeeID
      userModels.RoleId = this.userForm.value.roleType
      userModels.Email = this.userForm.value.email
      userModels.DOJ = new Date()
      userModels.FirstName = this.userForm.value.firstName
      userModels.MiddleName = ''
      userModels.LastName =this.userForm.value.lastName
      userModels.Gender = 0
      userModels.DOB = new Date()
      userModels.Age = '0'
      userModels.PhoneNumber = this.userForm.value.mobileNumber
      userModels.PhoneCountryCode =this.userForm.value.prefixmobile
      userModels.ConsigneeId =  this.userForm.value.roleType == 2 ?  Number(this.userForm.value.location) : 0
      // userModels.EmailConfirmed = false
      // userModels.PhoneNumberConfirmed = false
      // userModels.TwoFactorEnabled = false
      userModels.MobileNumber =this.userForm.value.mobileNumber
      // userModels.MobileNumberCountryCode =this.userForm.value.prefixmobile
  //console.log(userModels);
  
      this.userServ.addUpdateUsers(userModels).then(res => {
        //console.log(res);
        if(res){
          if (res ) {
            // Submit the form
            //console.log('if');
            
            //console.log(this.userForm.value);
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'User created successfully' });
            // this.userServ.usersList.splice(this.userServ.editUserIndex, 1, res)
            this.locaton.back()
          }
          else if(res && this.userServ.editUserIndex) {
    
    
            // Submit the form
            //console.log('else');
            
            //console.log(this.userForm.value);
            this.utilServ.toaster.next({ type: customToaster.successToast, message: 'User updated successfully' });
            // this.userServ.usersList.push(res)
            this.locaton.back()
    
          }
        }
        
      })
     
    }
  }

  cancel() {
    this.locaton.back()
  }

}
