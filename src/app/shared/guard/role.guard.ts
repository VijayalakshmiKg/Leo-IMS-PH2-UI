import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRoleData = localStorage.getItem('loggedInUser');

    if (!userRoleData) {
      this.router.navigate(['/login']);
      return false;
    }

    const roleData = JSON.parse(userRoleData);

    // Extract allowed routes from both rootMenu and settings
    const allowedModules = [
      ...this.getAllRoutes(roleData.rootMenu),
      ...this.getSettingsRoutes(roleData.settings) // Process settings separately
    ];

    // Get the requested route path
    const routePath = route.routeConfig?.path || ''; // Ensure it's a string
    //console.log("Requested Route:", routePath);
    //console.log("Allowed Routes:", allowedModules);

    // Check if the user has access to the requested route
    if (allowedModules.includes(routePath)) {
      return true;
    } else {
      this.router.navigate(['/not-authorized']);
      return false;
    }
  }

  // Recursively fetch all accessible routes from menus & submenus
  private getAllRoutes(menus: any[]): string[] {
    let routes: string[] = [];

    menus?.forEach(menu => {
      if (menu.pageUrl) {
        routes.push(menu.pageUrl.replace('/home/', '')); // Store relative paths
      }
      if (menu.subMenus && menu.subMenus.length > 0) {
        routes = [...routes, ...this.getAllRoutes(menu.subMenus)];
      }
    });

    return routes.filter(route => route); // Remove undefined/null routes
  }

  // Extract routes from settings and ensure "settings" is included
  private getSettingsRoutes(settings: any[]): string[] {
    let routes = settings?.map(setting => setting.pageUrl.replace('/home/', '')) || [];

    // Ensure 'settings' parent route is included if any settings exist
    if (routes.length > 0 && !routes.includes('settings')) {
      routes.push('settings');
    }

    return routes;
  }
}
