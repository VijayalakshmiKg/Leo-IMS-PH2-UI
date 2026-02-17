import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SupplierService } from '../../supplier.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-edit-supplier',
  templateUrl: './add-edit-supplier.component.html',
  styleUrls: ['./add-edit-supplier.component.css']
})
export class AddEditSupplierComponent implements OnInit {
  supplierForm!:FormGroup

  saveBtnText:any = 'Add'
  imageUrl:any
  selectedFile:any
  imageUrlProfile:any
  selectedFileProfile:any


  productCategories = ['Category A', 'Category B', 'Category C'];
  organizations = ['Organization 1', 'Organization 2', 'Organization 3'];
  organizationCodes = ['Code 1', 'Code 2', 'Code 3'];


  citys :any |any[] = [
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


    zipCodes: any | any[] = [
        "400001",
        "110001",
        "560001",
        "700001",
        "600001",
        "500001",
        "380001",
        "411001",
        "302001",
        "395001",
        "226001",
        "208001",
        "440001",
        "530001",
        "462001",
        "800001"
    ]

    countries:any | any[] = [
      "United States",
      "Canada",
      "United Kingdom",
      "Japan",
      "Australia",
      "India",
      "Germany",
      "France",
      "South Africa",
      "Brazil"
  ]



  constructor(public fb:FormBuilder,public sanitizer:DomSanitizer,public supplierServ:SupplierService,public location:Location,public utilSer:UtilityService) { }

  ngOnInit(): void {

    this.supplierForm = this.fb.group({
      supplierName: ['',Validators.required],
      // supplierRgno: ['',Validators.required],
      email: ['',Validators.required],
      mobileNumber: ['',Validators.required],
      vatNo: ['',Validators.required],
      utrNO: ['',Validators.required],
      balancePay: ['',Validators.required],
      balanceDate: ['',Validators.required],
      
      billingAddress: ['',Validators.required],
      supplierAddress: [''],
      sameAsBillingAddress:[false],
      checked:[false]

    });

    //console.log(this.supplierServ.viewSupplierIndex);
    

    if(this.supplierServ.editSupplierRecord){
      //console.log(this.supplierServ.editSupplierRecord);
      
      this.setsupplierDetails()
    }
  }

  setsupplierDetails(){
    this.imageUrl = this.supplierServ?.editSupplierRecord?.supplierLicensePhoto
    this.imageUrlProfile = this.supplierServ?.editSupplierRecord?.profileImage
    this.selectedFile = this.supplierServ?.editSupplierRecord?.selectedFilesupplierLicense
    this.supplierForm.patchValue(this.supplierServ.editSupplierRecord)
  }

  
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0].name;
      this.supplierForm.get('selectedFilesupplierLicense')?.setValue(this.selectedFile.name)
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrl = reader.result as string;
        // Set the raw data URL in the form control
        this.supplierForm.get('supplierLicensePhoto')?.setValue(imageDataUrl);
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
        this.supplierForm.get('profileImage')?.setValue(imageDataUrlProfile);
        // Set the sanitized URL for display only
        this.imageUrlProfile = this.sanitizer.bypassSecurityTrustUrl(imageDataUrlProfile) as SafeUrl;
      };
      reader.readAsDataURL(this.selectedFileProfile);
    }
  }
  


deleteProfile(){
  this.selectedFileProfile = null
  this.imageUrlProfile = null
}

  

  back(){
    this.location.back()
  }

  onSubmitandClose(): void {
    //console.log(this.supplierForm.value);

    if(  this.supplierForm.valid){
      //console.log('if');
      
      if (this.supplierServ.editSupplierRecord != null) {
        //console.log(this.supplierForm.value);
        this.supplierServ.supplierList.splice(this.supplierServ.viewSupplierIndex,1,this.supplierForm.value) 
this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Supplier edited successfully.' })
        this.back()
        // Process the form submission here
      } else {
        //console.log('else');
        //console.log(this.supplierForm.value);
        this.supplierServ.supplierList.push(this.supplierForm.value)
this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Supplier added successfully.' })
        this.back()
      }
    }
    else{
   
        //console.log('Form is not valid');
      
    }
    
    
   

    //console.log(this.supplierServ);
    
  }
  onSubmitandAddAnother(): void {
    //console.log(this.supplierForm.value);

   
    if (this.supplierForm.valid) {
      //console.log(this.supplierForm.value);
      this.supplierServ.supplierList.push(this.supplierForm.value)
this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Supplier added successfully.' })

      // Process the form submission here
      this.supplierForm.reset()
    } else {
      //console.log('Form is not valid');
    }

    //console.log(this.supplierServ);
    
  }

  deleteLicensePhoto(){
    this.selectedFile = null
    this.imageUrl = null
  }



}
