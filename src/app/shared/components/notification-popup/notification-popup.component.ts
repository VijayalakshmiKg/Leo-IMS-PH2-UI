import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.css']
})
export class NotificationPopupComponent implements OnInit {

  unread:boolean = true;
  notificationList:any[] = [];
  unreadList:any[] = [];
  allNotifications:any[] = [];

  constructor(public dialog:MatDialogRef<NotificationPopupComponent>, public utilServ:UtilityService) { }

  ngOnInit(): void {
    this.unreadList = this.utilServ.unreadList;
    this.allNotifications = this.utilServ.allNotifications;
    this.notificationList = this.unreadList;
  }

  toggle(){
    this.unread = !this.unread;
    if(this.unread){
      this.notificationList = this.unreadList;
    } else {
      this.notificationList = this.allNotifications;
    }
  }
close(){
  this.dialog.close();
}
}
