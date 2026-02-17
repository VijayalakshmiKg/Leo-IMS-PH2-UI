import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-qrverification',
  templateUrl: './qrverification.component.html',
  styleUrls: ['./qrverification.component.css']
})
export class QRVerificationComponent implements OnInit {
  QrCode:string = 'ZHAKLAHSAKJHHFAJSKFHAKJHFSAF';

  constructor(public dialogRef: MatDialogRef<QRVerificationComponent>, public utilServ:UtilityService) { }

  ngOnInit(): void {
  }

  close(){
    this.dialogRef.close()
  }

  verifyBtn(){
    this.utilServ.toaster.next({type: customToaster.successToast, message:'QR Code enabled successfully.'})
    this.close()
  }

}
