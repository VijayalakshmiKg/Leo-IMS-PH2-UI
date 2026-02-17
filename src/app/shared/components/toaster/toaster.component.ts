import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css']
})
export class ToasterComponent implements OnInit  {
  iconCollection: any = {
    success:
    {
      icon: 'fa-check',
      color: '#689F38',
      backgroundColor: ' #d4edda',
      borderColor: '#c3e6cb',
      iconColor: '#27ae60'
    },
    error:
    {
      icon: 'fa-xmark',
      color: '#D32F2F',
      backgroundColor: '#f8d7da',
      borderColor: '#f5c6cb',
      iconColor: '#c0392b'
    },
    info:
    {
      icon: 'fa-info',
      color: '#0288D1',
      backgroundColor: '#cce5ff',
      borderColor: '#b8daff',
      iconColor: '#2980b9'
    },
    warning:
    {
      icon: 'fa-triangle-exclamation',
      color: '#FBC02D',
      backgroundColor: '#fff3cd',
      borderColor: '#f39c12',
      iconColor: '#f39c12'
    }
  };
  toastMsg: string = '';
  toastIcon: string = '';
  toastColor: string = '';
  toastBackground: string = '';
  toastBorderColor: string = ''
  toastIconColor: string = '';
  toasterDuration: number = 0;
  // toastCount: number = 0;
  constructor(public utility : UtilityService) {

  }
  ngOnInit(): void {
    this.listenToast()
  }

  // it will listen the toast activity
  listenToast() {
    this.utility.toaster.subscribe((res: any) => {
      //console.log(res)
      this.toastMsg = res.message;
      this.toasterDuration = res?.duration ? res?.duration : 4000
      let toasterType = this.chooseType(res.type)
      this.toastIcon = this.iconCollection[toasterType].icon;
      this.toastColor = this.iconCollection[toasterType].color;
      this.toastBackground = this.iconCollection[toasterType].backgroundColor;
      this.toastBorderColor = this.iconCollection[toasterType].borderColor;
      this.toastIconColor = this.iconCollection[toasterType].iconColor;
      this.createToast()
    })
  }

  //it will decide the user selected toaster type
  chooseType(type: any) {
    let selectedType: string = ''
    switch (type) {
      case 0:
        selectedType = 'success';
        break;

      case 1:
        selectedType = 'error';
        break;

      case 2:
        selectedType = 'info';
        break;

      case 3:
        selectedType = 'warning';
        break;
    }
    return selectedType
  }

  //create a custom toast based on the BehaviorSubject 
  createToast() {
    let parentNode = document.querySelector('.toasts')
    let createNode: any;
    createNode = document.querySelector('.master-toast-notification')?.cloneNode(true);
    createNode?.classList.add("toast-notification");
    createNode.style.backgroundColor = this.toastBackground;
    createNode.style.border = '1px solid ' + this.toastBorderColor;
    createNode?.classList.remove('master-toast-notification');
    let text: any = createNode?.querySelector('.toast-msg');
    text.textContent = this.toastMsg;
    text.style.color = this.toastColor
    createNode.querySelector('.toast-content .toast-icon i').classList.add('fa-solid', this.toastIcon);
    createNode.querySelector('.close-icon i').classList.add('fa-solid', 'fa-xmark')
    let wiggle = createNode.querySelector('.toast-icon');
    wiggle.classList.add('wiggle-me');
    wiggle.style.backgroundColor = this.toastIconColor;
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

//please don't change the order, it will cause the wrong toaster

export enum customToaster {
  successToast,
  errorToast,
  infoToast,
  warningToast,
}

