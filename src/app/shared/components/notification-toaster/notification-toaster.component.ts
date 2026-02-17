import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-notification-toaster',
  templateUrl: './notification-toaster.component.html',
  styleUrls: ['./notification-toaster.component.css']
})
export class NotificationToasterComponent implements OnInit {

  toastMsg: string = '';
  toastColor: string = '';
  toastBackground: string = '';
  toastBorderColor: string = ''
  toasterDuration: number = 0;
  show: boolean = false;
  // toastCount: number = 0;
  constructor(public utility: UtilityService) {

  }
  ngOnInit(): void {
    // this.listenToast()
  }

  // it will listen the toast activity
  listenToast() {
    this.utility.notificationToaster.subscribe((res: any) => {
      //console.log(res)
      if (res) {
        this.toastMsg = res.message;
        this.toastColor = '#FFF';
        this.toastBackground = ' #64748B';
        this.toastBorderColor = '#64748B';
        this.toasterDuration = res?.duration ? res?.duration : 4000
        this.createToast()
      }
    })
   
  }

  //it will decide the user selected toaster type
  chooseType() {
    let selectedType: string = ''
    selectedType = 'success';
    return selectedType
  }


  //create a custom toast based on the BehaviorSubject 
  createToast() {
    let parentNode = document.querySelector('.notifies')
    let createNode: any;
    createNode = document.querySelector('.master-notification')?.cloneNode(true);
    createNode?.classList.add("notification");
    createNode.style.backgroundColor = this.toastBackground;
    createNode.style.border = '1px solid ' + this.toastBorderColor;
    createNode?.classList.remove('master-notification');
    let text: any = createNode?.querySelector('.notify-msg');
    text.textContent = this.toastMsg;
    text.style.color = this.toastColor
    createNode.querySelector('.close-icon i').classList.add('fa-solid', 'fa-xmark')
    createNode.classList.remove('hide-toast')
    createNode.classList.add('slide-in-slide-out')
    createNode.querySelector('.close-icon').addEventListener("click", function () {
      createNode.remove()
    })
    parentNode?.appendChild(createNode);
    setTimeout(() => {
      createNode.remove();
    }, this.toasterDuration);
  }
}





