import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UtilityService } from '../../services/utility.service';
import { NotificationService } from '../../services/notification.service';

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

  constructor(
    public dialog:MatDialogRef<NotificationPopupComponent>,
    public utilServ:UtilityService,
    private notificationServ:NotificationService
  ) { }

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

  markAsRead(notification: any) {
    notification.read = true;
    // Remove from unread list
    const idx = this.utilServ.unreadList.indexOf(notification);
    if (idx > -1) {
      this.utilServ.unreadList.splice(idx, 1);
    }
    // Update in all notifications
    const allItem = this.utilServ.allNotifications.find(
      (n: any) => n.notificationId === notification.notificationId
    );
    if (allItem) {
      allItem.read = true;
    }
    // Persist to backend
    if (notification.notificationId) {
      this.notificationServ.markAsRead(notification.notificationId).catch(() => {});
    }
  }

  markAllAsRead() {
    this.utilServ.unreadList.forEach((n: any) => n.read = true);
    this.utilServ.allNotifications.forEach((n: any) => n.read = true);
    this.utilServ.unreadList = [];
    this.unreadList = this.utilServ.unreadList;
    if (this.unread) {
      this.notificationList = this.unreadList;
    }
    this.notificationServ.markAllAsRead().catch(() => {});
  }

  close(){
    this.dialog.close();
  }
}
