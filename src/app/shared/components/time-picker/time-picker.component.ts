import { DatePipe } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent {
  currentTime: any;

  @ViewChild('timePicker') timePicker: any

  constructor(public dialogRef: MatDialogRef<TimePickerComponent>, public datepipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data) {
      this.currentTime = this.data
    }
    else {
      this.currentTime = this.datepipe.transform(new Date(), "hh:mm a");
    }
  }

  selectedTime: any;

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close()
  }

  sendSelectedTime() {
    this.dialogRef.close(this.timePicker.timepickerTime)
  }
}
