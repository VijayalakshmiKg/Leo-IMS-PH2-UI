import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-primary-contact-information',
  templateUrl: './primary-contact-information.component.html',
  styleUrls: ['./primary-contact-information.component.css']
})
export class PrimaryContactInformationComponent implements OnInit {

  primaryInformation !: FormGroup;

  constructor(public fb: FormBuilder, public utliSer: UtilityService, public route: Router,public title:Title) { 
    this.title.setTitle("Leo Group Ltd | Primary Contact");
  }

  ngOnInit(): void {

    this.primaryInformation = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', Validators.required],
      workPhone: ['', Validators.required],

    })
  }

  Proceed() {
    this.utliSer.toaster.next({ type: customToaster.successToast, message: 'Primary contact Information is created successfully' })
    setTimeout(() => {
      this.route.navigateByUrl('/login/welcomeScreen')
    }, 2000);
  }

  allowNumber(event: any) {
    if (event.keyCode > 47 && event.keyCode < 58) {
      if (this.primaryInformation.value.mobile.length < 10) {
        return true
      }
    }
    return false
  }
  allowWorkNumber(event: any) {
    if (event.keyCode > 47 && event.keyCode < 58) {
      if (this.primaryInformation.value.workPhone.length < 10) {
        return true
      }
    }
    return false
  }
}
