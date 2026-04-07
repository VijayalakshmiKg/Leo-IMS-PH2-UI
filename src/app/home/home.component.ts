import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../shared/services/signalr.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private signalRService: SignalRService) { }

  ngOnInit(): void {
    // Reconnect SignalR on page refresh if user is already logged in
    const token = sessionStorage.getItem('token');
    if (token && !this.signalRService.getConnectionState()) {
      this.signalRService.startConnection();
    }
  }

}
