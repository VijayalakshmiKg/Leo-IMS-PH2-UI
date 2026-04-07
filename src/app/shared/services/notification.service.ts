import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private http: CustomHttpService,
    private utilServ: UtilityService
  ) {}

  /**
   * Send a notification to a specific user or role.
   * Backend: POST /Notification/Send
   */
  sendNotification(payload: {
    targetUserId?: number;
    targetRole?: string;
    title: string;
    message: string;
    type?: string;
    taskId?: number;
  }): Promise<any> {
    return this.http.post('/Notification/Send', payload);
  }

  /**
   * Get all notifications for the logged-in user (persisted from DB).
   * Backend: GET /Notification/GetAll
   */
  getNotifications(): Promise<any> {
    return this.http.get('/Notification/GetAll');
  }

  /**
   * Get unread notifications for the logged-in user.
   * Backend: GET /Notification/GetUnread
   */
  getUnreadNotifications(): Promise<any> {
    return this.http.get('/Notification/GetUnread');
  }

  /**
   * Mark a single notification as read.
   * Backend: POST /Notification/MarkAsRead
   */
  markAsRead(notificationId: number): Promise<any> {
    return this.http.post('/Notification/MarkAsRead', { notificationId });
  }

  /**
   * Mark all notifications as read for logged-in user.
   * Backend: POST /Notification/MarkAllAsRead
   */
  markAllAsRead(): Promise<any> {
    return this.http.post('/Notification/MarkAllAsRead', {});
  }

  /**
   * Load persisted notifications from DB into utilServ arrays.
   * Call this on login / app init.
   */
  loadNotifications(): void {
    this.getUnreadNotifications().then((res: any) => {
      if (res && Array.isArray(res)) {
        this.utilServ.unreadList = res.map((n: any) => ({
          notificationId: n.notificationId,
          message: n.message,
          time: new Date(n.createdAt),
          read: false,
          taskId: n.taskId,
          status: n.status,
          updatedBy: n.senderName,
          senderRole: n.senderRole,
          type: n.type
        }));
      }
    }).catch(err => console.error('Failed to load unread notifications:', err));

    this.getNotifications().then((res: any) => {
      if (res && Array.isArray(res)) {
        this.utilServ.allNotifications = res.map((n: any) => ({
          notificationId: n.notificationId,
          message: n.message,
          time: new Date(n.createdAt),
          read: n.isRead,
          taskId: n.taskId,
          status: n.status,
          updatedBy: n.senderName,
          senderRole: n.senderRole,
          type: n.type
        }));
      }
    }).catch(err => console.error('Failed to load notifications:', err));
  }
}
