import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authenticationService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

      
           
                  // if (sessionStorage.getItem('token') != null) {      
                  //    return true;
                  //  }
                  //  else {      
                  //    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                  //    return false;
                  //  }
         
              

        // Check if user is logged in (check both in-memory state and sessionStorage)
        if (this.authenticationService.isLoggedIn()) {
            return true;
        }

        // Also check sessionStorage directly for token (handles page refresh)
        const token = sessionStorage.getItem('token');
        const loggedInUser = sessionStorage.getItem('loggedInUser');
        if (token && loggedInUser) {
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;


    }
}