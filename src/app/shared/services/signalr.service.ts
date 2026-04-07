import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { AppConfigService } from 'src/app/app.config.service';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private isConnected: boolean = false;
  private currentRole: string = '';

  // Emits when a status-change notification arrives
  statusChanged: Subject<any> = new Subject();
  // Emits when any notification arrives
  notificationReceived: Subject<any> = new Subject();

  constructor(
    private appConfig: AppConfigService,
    private utilServ: UtilityService
  ) {}

  /**
   * Start the SignalR connection.
   * Call this after login when the token is available in sessionStorage.
   */
  startConnection(): void {
    if (this.isConnected) {
      return;
    }

    const baseUrl = this.appConfig.ApplicationConfig.ApiEndPoint;
    const token = sessionStorage.getItem('token') || '';

    // Get current user's role for group-based notifications
    try {
      const user = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}');
      this.currentRole = user.roleName || '';
    } catch (e) {
      this.currentRole = '';
    }

    // Build the hub connection
    // Backend should have: app.MapHub<NotificationHub>("/notificationHub");
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/notificationHub`, {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Register listeners BEFORE starting
    this.registerListeners();

    // Start connection
    this.hubConnection
      .start()
      .then(() => {
        this.isConnected = true;
        console.log('SignalR connected');
        // Join role-based group so backend can send targeted notifications
        this.joinRoleGroup();
      })
      .catch(err => {
        this.isConnected = false;
        console.error('SignalR connection error:', err);
        // Retry after 5 seconds if initial connection fails
        setTimeout(() => this.startConnection(), 5000);
      });

    // Handle reconnection events
    this.hubConnection.onreconnecting(() => {
      this.isConnected = false;
      console.log('SignalR reconnecting...');
    });

    this.hubConnection.onreconnected(() => {
      this.isConnected = true;
      console.log('SignalR reconnected');
      // Re-join role group after reconnection
      this.joinRoleGroup();
    });

    this.hubConnection.onclose(() => {
      this.isConnected = false;
      console.log('SignalR disconnected');
    });
  }

  /**
   * Join a role-based SignalR group.
   * Backend Hub must have: public async Task JoinRoleGroup(string roleName)
   * which calls: await Groups.AddToGroupAsync(Context.ConnectionId, roleName);
   */
  private joinRoleGroup(): void {
    if (this.isConnected && this.currentRole) {
      this.hubConnection.invoke('JoinRoleGroup', this.currentRole)
        .then(() => console.log(`Joined SignalR group: ${this.currentRole}`))
        .catch(err => console.error('Failed to join role group:', err));
    }
  }

  /**
   * Stop the SignalR connection.
   * Call this on logout.
   */
  stopConnection(): void {
    if (this.hubConnection) {
      // Leave role group before disconnecting
      if (this.isConnected && this.currentRole) {
        this.hubConnection.invoke('LeaveRoleGroup', this.currentRole).catch(() => {});
      }
      this.hubConnection.stop().then(() => {
        this.isConnected = false;
        this.currentRole = '';
        console.log('SignalR disconnected');
      });
    }
  }

  /**
   * Register all hub event listeners.
   * These event names must match the backend Hub method names.
   */
  private registerListeners(): void {
    // General notification from backend (sent to specific user or role group)
    this.hubConnection.on('ReceiveNotification', (data: any) => {
      console.log('SignalR notification:', data);

      const notification = {
        notificationId: data.notificationId || null,
        message: data.message || 'You have a new notification',
        time: data.timestamp ? new Date(data.timestamp) : new Date(),
        read: false,
        taskId: data.taskId,
        status: data.newStatus,
        updatedBy: data.updatedBy,
        senderRole: data.senderRole || '',
        type: data.type || 'general'
      };

      // Push to unread and all notifications
      this.utilServ.unreadList.unshift(notification);
      this.utilServ.allNotifications.unshift({ ...notification });

      // Show toast notification
      this.utilServ.notificationToaster.next({ message: notification.message });

      // Emit for any component that subscribes
      this.notificationReceived.next(data);
    });

    // Status change specific event
    this.hubConnection.on('StatusUpdated', (data: any) => {
      console.log('SignalR status update:', data);
      this.statusChanged.next(data);

      const notification = {
        notificationId: data.notificationId || null,
        message: data.message || `Task status changed to ${data.newStatus}`,
        time: data.timestamp ? new Date(data.timestamp) : new Date(),
        read: false,
        taskId: data.taskId,
        status: data.newStatus,
        updatedBy: data.updatedBy,
        senderRole: data.senderRole || '',
        type: 'status_change'
      };
      this.utilServ.unreadList.unshift(notification);
      this.utilServ.allNotifications.unshift({ ...notification });
      this.utilServ.notificationToaster.next({ message: notification.message });
    });

    // Task refresh event — tells the dashboard to reload data
    this.hubConnection.on('RefreshTasks', () => {
      console.log('SignalR: RefreshTasks received');
      this.statusChanged.next({ action: 'refresh' });
    });
  }

  /**
   * Send a status update to the backend hub.
   * Backend Hub must have: public async Task NotifyStatusChange(int taskId, string newStatus)
   */
  sendStatusUpdate(taskId: number, newStatus: string): void {
    if (this.isConnected) {
      this.hubConnection.invoke('NotifyStatusChange', taskId, newStatus)
        .catch(err => console.error('SignalR send error:', err));
    }
  }

  /**
   * Send a notification to a specific role group via the hub.
   * Backend Hub must have: public async Task SendToRole(string targetRole, string message, string type)
   */
  sendToRole(targetRole: string, message: string, type: string = 'general'): void {
    if (this.isConnected) {
      this.hubConnection.invoke('SendToRole', targetRole, message, type)
        .catch(err => console.error('SignalR sendToRole error:', err));
    }
  }

  getConnectionState(): boolean {
    return this.isConnected;
  }

  getCurrentRole(): string {
    return this.currentRole;
  }
}
