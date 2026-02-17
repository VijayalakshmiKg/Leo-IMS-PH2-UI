import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
// import { Login } from '../login/loginModel/login.model';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
loginStatus:boolean =false
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject({});
  userDetails:any = {
    UserName:"blutrax@bmsmartware.com",
    Password:"Welcome@123",
    Mobile:'+918778358383',
    Email:'blutrax@bmsmartware.com'
  }

  rolesList:any | any[] = [
    {
        "roleName": "Transportation Manager",
        "description": "Assigns the truck and orders to the Driver",
        "roleType": "System",
        "rootMenu": [
            {
                "name": "Dashboard",
                "visible": true,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/dashboard",
                "subMenus": []
            },
            {
                "name": "Templates",
                visible: true,
                "fullAccess": true,
                "view": true,
                "create": true,
                "edit": true,
                "delete": true,
                pageurl: "/home/template",
              },
            {
                "name": "Movement document",
                "visible": true,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/orders",
                "subMenus": []
            },
            // {
            //     "name": "Tracking",
            //     "visible": true,
            //     "create": true,
            //     "view": true,
            //     "fullAccess": true,
            //     "edit": true,
            //     "delete": true,
            //     "pageurl": "/home/tracking",
            //     "subMenus": []
            // },
            {
                "name": "Directory",
                "visible": true,
                "create": null,
                "view": null,
                "fullAccess": null,
                "edit": null,
                "delete": null,
                "pageurl": "",
                "subMenus": [
                    {
                        "name": "Driver",
                        "visible": true,
                        "fullAccess": true,
                        "view": true,
                        "create": true,
                        "edit": true,
                        "delete": true,
                        "pageurl": "/home/drivers"
                    },
                    {
                        "name": "Vehicle",
                        "visible": true,
                        "fullAccess": true,
                        "view": true,
                        "create": true,
                        "edit": true,
                        "delete": true,
                        "pageurl": "/home/vehicle"
                    },
                    {
                        "name": "Trailer",
                        "visible": true,
                        "fullAccess": true,
                        "view": true,
                        "create": true,
                        "edit": true,
                        "delete": true,
                        "pageurl": "/home/trailer"
                    },
                    {
                        "name": "Product",
                        "visible": true,
                        "fullAccess": true,
                        "view": true,
                        "create": true,
                        "edit": true,
                        "delete": true,
                        "pageurl": "/home/material"
                    },
                    {
                        "name": "Consignee",
                        "visible": true,
                        "fullAccess": true,
                        "view": true,
                        "create": true,
                        "edit": true,
                        "delete": true,
                        "pageurl": "/home/consignee"
                    },
                    {
                        "name": "Supplier",
                        "visible": true,
                        "fullAccess": true,
                        "view": true,
                        "create": true,
                        "edit": true,
                        "delete": true,
                        "pageurl": "/home/consignor"
                    },
                    // {
                    //     "name": "Shunter Drivers",
                    //     "visible": true,
                    //     "create": true,
                    //     "view": true,
                    //     "fullAccess": true,
                    //     "edit": true,
                    //     "delete": true,
                    //     "pageurl": "/home/shunterDrivers",
                    //     "subMenus": []
                    // },
                    // {
                    //     "name": "Trailer washer",
                    //     "visible": true,
                    //     "create": true,
                    //     "view": true,
                    //     "fullAccess": true,
                    //     "edit": true,
                    //     "delete": true,
                    //     "pageurl": "/home/shunterDrivers",
                    //     "subMenus": []
                    // },
                ]
            }
        ],
        "settings": [
            {
                "name": "Master",
                "visible": true,
                "pageurl": "/home/settings"
            },
            {
                "name": "Roles",
                "visible": true,
                "pageurl": "/home/settings/roles"
            }
        ],
        "email": "transportionmanager@example.com",
        "password": "transportionmanager@1248"
    },
    {
        "roleName": "Weighbridge operator",
        "description": "Assigns the shunter driver to tip and drop orders in the assigned bin",
        "roleType": "System",
        "rootMenu": [
            {
                "name": "Dashboard",
                "visible": true,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/dashboard",
                "subMenus": []
            },
            {
                "name": "Tasks",
                "visible": true,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/tasks",
                "subMenus": []
            },
            {
                "name": "Movement document",
                "visible": true,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/orders",
                "subMenus": []
            },
            
        ],
        "settings": [
            {
                "name": "Master",
                "visible": false,
                "pageurl": ""
            },
            {
                "name": "Roles",
                "visible": false,
                "pageurl": ""
            }
        ],
        "email": "weighbridgemanager@example.com",
        "password": "weighbridgemanager@1248"
    },
    {
        "roleName": "Plant Site Manager",
        "description": "Assigns the shunter driver to tip and drop orders in the assigned bin",
        "roleType": "System",
        "rootMenu": [
            {
                "name": "Dashboard",
                "visible": true,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/dashboard",
                "subMenus": []
            },
           
            {
                "name": "Tasks",
                "visible": true,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/tasks",
                "subMenus": []
            },
            {
                "name": "Movement document",
                "visible": true,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/orders",
                "subMenus": []
            },
            {
                "name": "Directory",
                "visible": true,
                "create": null,
                "view": null,
                "fullAccess": null,
                "edit": null,
                "delete": null,
                "pageurl": "",
                "subMenus": [
                    // {
                    //     "name": "Driver",
                    //     "visible": true,
                    //     "fullAccess": true,
                    //     "view": true,
                    //     "create": true,
                    //     "edit": true,
                    //     "delete": true,
                    //     "pageurl": "/home/drivers"
                    // },
                    // {
                    //     "name": "Vehicle",
                    //     "visible": true,
                    //     "fullAccess": true,
                    //     "view": true,
                    //     "create": true,
                    //     "edit": true,
                    //     "delete": true,
                    //     "pageurl": "/home/vehicle"
                    // },
                    // {
                    //     "name": "Trailer",
                    //     "visible": true,
                    //     "fullAccess": true,
                    //     "view": true,
                    //     "create": true,
                    //     "edit": true,
                    //     "delete": true,
                    //     "pageurl": "/home/trailer"
                    // },
                    // {
                    //     "name": "Product",
                    //     "visible": true,
                    //     "fullAccess": true,
                    //     "view": true,
                    //     "create": true,
                    //     "edit": true,
                    //     "delete": true,
                    //     "pageurl": "/home/material"
                    // },
                    // {
                    //     "name": "Consignee",
                    //     "visible": true,
                    //     "fullAccess": true,
                    //     "view": true,
                    //     "create": true,
                    //     "edit": true,
                    //     "delete": true,
                    //     "pageurl": "/home/consignee"
                    // },
                    // {
                    //     "name": "Supplier",
                    //     "visible": true,
                    //     "fullAccess": true,
                    //     "view": true,
                    //     "create": true,
                    //     "edit": true,
                    //     "delete": true,
                    //     "pageurl": "/home/consignor"
                    // },
                    {
                        "name": "Shunter Drivers",
                        "visible": true,
                        "create": true,
                        "view": true,
                        "fullAccess": true,
                        "edit": true,
                        "delete": true,
                        "pageurl": "/home/shunterDrivers",
                        "subMenus": []
                    },
                    {
                        "name": "Trailer washer",
                        "visible": true,
                        "create": true,
                        "view": true,
                        "fullAccess": true,
                        "edit": true,
                        "delete": true,
                        "pageurl": "/home/trailerWashers",
                        "subMenus": []
                    },
                ]
            }
            
        ],
        "settings": [
            {
                "name": "Master",
                "visible": true,
                "pageurl": "/home/settings"
            },
            {
                "name": "Roles",
                "visible": true,
                "pageurl": "/home/settings/roles"
            }
        ],
        "email": "plantsitemanager@example.com",
        "password": "plantsitemanager@1248"
    },
    {
        "roleName": "Admin",
        "description": "Assigns the shunter driver to tip and drop orders in the assigned bin",
        "roleType": "System",
        "rootMenu": [
            {
                "name": "Dashboard",
                "visible": true,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/dashboard",
                "subMenus": []
            },
            {
                "name": "Users",
                "visible": true,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/users",
                "subMenus": []
            },
            {
                "name": "Movement document",
                "visible": true,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/orders",
                "subMenus": []
            },
            {
                "name": "Directory",
                "visible": true,
                "create": null,
                "view": null,
                "fullAccess": null,
                "edit": null,
                "delete": null,
                "pageurl": "",
                "subMenus": [
                    {
                        "name": "Driver",
                        "visible": true,
                        "fullAccess": true,
                        "view": true,
                        "create": true,
                        "edit": true,
                        "delete": true,
                        "pageurl": "/home/drivers"
                    },
                    {
                        "name": "Vehicle",
                        "visible": true,
                        "fullAccess": true,
                        "view": true,
                        "create": true,
                        "edit": true,
                        "delete": true,
                        "pageurl": "/home/vehicle"
                    },
                    {
                        "name": "Trailer",
                        "visible": true,
                        "fullAccess": true,
                        "view": true,
                        "create": true,
                        "edit": true,
                        "delete": true,
                        "pageurl": "/home/trailer"
                    },
                    {
                        "name": "Product",
                        "visible": true,
                        "fullAccess": true,
                        "view": true,
                        "create": true,
                        "edit": true,
                        "delete": true,
                        "pageurl": "/home/material"
                    },
                    {
                        "name": "Consignee",
                        "visible": true,
                        "fullAccess": true,
                        "view": true,
                        "create": true,
                        "edit": true,
                        "delete": true,
                        "pageurl": "/home/consignee"
                    },
                    {
                        "name": "Supplier",
                        "visible": true,
                        "fullAccess": true,
                        "view": true,
                        "create": true,
                        "edit": true,
                        "delete": true,
                        "pageurl": "/home/consignor"
                    },
                    {
                        "name": "Shunter Drivers",
                        "visible": true,
                        "create": true,
                        "view": true,
                        "fullAccess": true,
                        "edit": true,
                        "delete": true,
                        "pageurl": "/home/shunterDrivers",
                        "subMenus": []
                    },
                    {
                        "name": "Trailer washer",
                        "visible": true,
                        "create": true,
                        "view": true,
                        "fullAccess": true,
                        "edit": true,
                        "delete": true,
                        "pageurl": "/home/trailerWashers",
                        "subMenus": []
                    },
                ]
            }
            
        ],
       "settings": [
            {
                "name": "Master",
                "visible": true,
                "pageurl": "/home/settings"
            },
            {
                "name": "Roles",
                "visible": true,
                "pageurl": "/home/settings/roles"
            }
        ],
        "email": "plantsitemanager@example.com",
        "password": "plantsitemanager@1248"
    },
    {
        "roleName": "Weighbridge operator",
        "description": "Weighs the product and provides a digital receipt to the driver",
        "roleType": "System",
        "rootMenu": [
            {
                "name": "Dashboard",
                "visible": true,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/dashboard",
                "subMenus": []
            },
            {
                "name": "Tasks",
                "visible": true,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/tasks",
                "subMenus": []
            },
            {
                "name": "Movement document",
                "visible": true,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/orders",
                "subMenus": []
            },
           
        ],
        "settings": [
            {
                "name": "Master",
                "visible": false,
                "pageurl": ""
            },
            {
                "name": "Roles",
                "visible": false,
                "pageurl": ""
            }
        ],
        "email": "weighbridgemanager@example.com",
        "password": "weighbridgemanager@1248"
    },
    {
        "roleName": "Production Manager",
        "description": "Checks the intake form filled by the shunter driver",
        "roleType": "System",
        "rootMenu": [
            {
                "name": "Dashboard",
                "visible": true,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/dashboard",
                "subMenus": []
            },
            {
                "name": "Tasks",
                "visible": true,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/tasks",
                "subMenus": []
            },
            {
                "name": "Movement document",
                "visible": true,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/orders",
                "subMenus": []
            },
           
        ],
        "settings": [
            {
                "name": "Master",
                "visible": false,
                "pageurl": ""
            },
            {
                "name": "Roles",
                "visible": false,
                "pageurl": ""
            }
        ],
        "email": "productionmanager@example.com",
        "password": "productionmanager@1248"
    },
    {
        "roleName": "Quality Manager",
        "description": "Verifies the intake form and completes the process with a digital sign-off",
        "roleType": "System",
        "rootMenu": [
            {
                "name": "Dashboard",
                "visible": false,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/dashboard",
                "subMenus": []
            },
            {
                "name": "Tasks",
                "visible": false,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/tasks",
                "subMenus": []
            },
            {
                "name": "Movement document",
                "visible": false,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/orders",
                "subMenus": []
            },
            
        ],
        "settings": [
            {
                "name": "Master",
                "visible": false,
                "pageurl": ""
            },
            {
                "name": "Roles",
                "visible": false,
                "pageurl": ""
            }
        ],
        "email": "qualitymanager@example.com",
        "password": "qualitymanager@1248"
    },
    {
        "roleName": "Accounts Manager",
        "description": "Processes the payment for the orders received by the Plant Site",
        "roleType": "System",
        "rootMenu": [
            {
                "name": "Dashboard",
                "visible": true,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/dashboard",
                "subMenus": []
            },
            {
                "name": "Supplier",
                "visible": true,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                // "pageurl": "/home/supplier",
                "pageurl": "/home/consignor",
                "subMenus": []
            },
            {
                "name": "Reports",
                "visible": true,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/reports",
                "subMenus": []
            }
        ],
        "settings": [
            {
                "name": "Master",
                "visible": false,
                "pageurl": ""
            },
            {
                "name": "Roles",
                "visible": false,
                "pageurl": ""
            }
        ],
        "email": "accountsmanager@example.com",
        "password": "accountsmanager@1248"
    },
    {
        "roleName": "Executive Manager",
        "description": "Supervises the truck and its status and generates a report",
        "roleType": "System",
        "rootMenu": [
            {
                "name": "Executive dashboard",
                "visible": true,
                "create": true,
                "view": true,
                "fullAccess": true,
                "edit": true,
                "delete": true,
                "pageurl": "/home/executive-dashboard",
                "subMenus": []
            }
        ],
        "settings": [
            {
                "name": "Master",
                "visible": false,
                "pageurl": ""
            },
            {
                "name": "Roles",
                "visible": false,
                "pageurl": ""
            }
        ],
        "email": "executivemanager@example.com",
        "password": "executivemanager@1248"
    }
]
  
  userModel$: any = {
    UserName: "Dr David Adams",
    UserRole:"Endocrinologist",
    UserPhone: "9003727472",
    UserEmail: "endoc@gmail.com",
    UseProfileImg:"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"
  };
 userList:any[]= [
  {userName:'', password:'', role:'', roleID:'', firstName:'', lastName:'', mobile:''}
 ]

  constructor(private http: HttpClient) { }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  // loginAuthenticate(userModel: Login) {

  //   let dt: any = userModel;

  //   return this.http.post('https://jsonplaceholder.typicode.com/posts', userModel).pipe(map(user => {

  //     if (user &&  dt.username == "endoc@gmail.com" && dt.password == "Welcome@123" ) {

  //       this.currentUserSubject.next(this.userModel$);  
        
  //       localStorage.setItem('currentUser', JSON.stringify(this.userModel$));
  //     }
  //     else {
  //       this.currentUserSubject.next(null);
  //       return null;
  //     }
  //     return user;
  //   })
    
  //   );
     /*
     authendicate(login: Login): any {
        return this.http.post('/Auth/UserAuthendicate', login);
               }

      return this.http.post<any>(`/users/authenticate`, { username, password })
        .pipe(map(user => {
            // login successful if there's a jwt token in the response
            if (user && user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
            }
            return user;
        }));

      */
  // }



  logout() {
    //remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.loginStatus = false
  }

  isLoggedIn() {
return this.loginStatus
  }
}
