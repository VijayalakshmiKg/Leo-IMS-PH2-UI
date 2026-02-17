import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({ providedIn: 'root' })

export class LoginAuthGuard implements CanActivate {

    constructor(private router: Router, private authenticationService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authenticationService.isLoggedIn()) {
            // User is logged in, so redirect to the dashboard or home page
            this.router.navigate(['/home/dashboard']); 
            return false;
          }
          return true; // Allow navigation to the requested route
      
    }
}