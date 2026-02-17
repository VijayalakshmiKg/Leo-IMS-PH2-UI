import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';

@Component({
  selector: 'app-sent-verify-mail',
  templateUrl: './sent-verify-mail.component.html',
  styleUrls: ['./sent-verify-mail.component.css']
})
export class SentVerifyMailComponent implements OnInit {

  email: any;

  constructor(public loginSer: LoginService, public route: Router, public utliSer: UtilityService) { }

  ngOnInit(): void {

    this.email = this.loginSer.verifyMail
    //console.log(this.email);

    if (!this.email) {
      this.route.navigateByUrl('/login');
    }
    this.verifyuserMail();

  }



  // verify email and setInterval functionality
  verifyuserMail() {
    if (this.email) {
      const intervalId = setInterval(() => {
        this.loginSer.verifyuserMail(this.email).then(res => {
          //console.log(res);
          if (res[0] == "Verified") {
            clearInterval(intervalId);
            this.route.navigateByUrl('/login/createnewPassword');
          }
        });
      }, 5000);
    }
  }

  resendMail() {
    this.loginSer.getMail(this.email).then(res => {
      //console.log(res);
      if (res) {
        this.utliSer.toaster.next({ type: customToaster.successToast, message: 'Resend Email sent successfully.' });
      }
    });
  }

}
