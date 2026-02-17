import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authenticationService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

      
           
                  // if (localStorage.getItem('token') != null) {      
                  //    return true;
                  //  }
                  //  else {      
                  //    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                  //    return false;
                  //  }
         
              

        //Getting the CurrentUser Value From subject get method... in authservice

        const currentUser = this.authenticationService.currentUserValue;

        // //console.log(currentUser);

        if (currentUser) {
            // authorised so return true
            // //console.log("AuthGuard Passed", "currentUser-" + currentUser.UserName);
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;


    }
}