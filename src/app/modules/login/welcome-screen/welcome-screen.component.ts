import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-screen',
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.css']
})
export class WelcomeScreenComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.router.navigateByUrl('/home/dashboard')
    }, 3000);
  }

}
