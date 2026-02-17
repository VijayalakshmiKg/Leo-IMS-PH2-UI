import { Injectable } from "@angular/core";
import { AuthService } from "src/app/core/guards/auth.service";
import { CustomHttpService } from "src/app/core/http/custom-http.service";


@Injectable({
    providedIn: 'root'
})

export class LoginService {


    verifyMail: any;
    userProfile: any = { companyName: 'Leo Groups PVT LTD', displayName: '', email: 'blutrax@bmsmartware.com', mobile: '8778358383', telephone: '', }

    constructor(public http: CustomHttpService, public authServ: AuthService) { }

    checkRole(username: any, password: any) {
        this.authServ
    }

    rolesList: any | any[] = [
        {
            "roleName": "Transportation Manager",
            "description": "Assigns the truck and orders to the driver",
            "roleType": "System",
            "email": "transport.manager@example.com",
            "password": "transportManager@1248",
            "rootMenu": [
                {
                    "name": "Directory",
                    "visible": true,
                    "subMenus": [
                        {
                            "name": "Driver",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Vehicle",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Trailer",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Customer",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Material",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        }
                    ]
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
            alreadyCreated: true
        },

        {
            "roleName": "Driver",
            "description": "Picks up the loads and delivers it to the plant site",
            "roleType": "System",
            "email": "driver@example.com",
            "password": "driver@1248",
            "rootMenu": [
                {
                    "name": "Directory",
                    "visible": true,
                    "subMenus": [
                        {
                            "name": "Driver",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Vehicle",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Trailer",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Customer",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Material",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        }
                    ]
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
            alreadyCreated: true
        },
        {
            "roleName": "Abattoir Manager",
            "description": "Sends pick up information to the Transport Manager",
            "roleType": "System",
            "email": "abattoir.manager@example.com",
            "password": "abattoirManager@1248",
            "rootMenu": [
                {
                    "name": "Directory",
                    "visible": true,
                    "subMenus": [
                        {
                            "name": "Driver",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Vehicle",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Trailer",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Customer",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Material",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        }
                    ]
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
            alreadyCreated: true
        },
        {
            "roleName": "Plant Site Manager",
            "description": "Assigns the shunter driver to tip and drop orders in the assigned bin",
            "roleType": "System",
            "email": "plantSite.manager@example.com",
            "password": "plantSiteManager@1248",
            "rootMenu": [
                {
                    "name": "Directory",
                    "visible": true,
                    "subMenus": [
                        {
                            "name": "Driver",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Vehicle",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Trailer",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Customer",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Material",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        }
                    ]
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
            alreadyCreated: true
        },
        {
            "roleName": "Shunter Driver",
            "description": "Tips the orders from the driver and drops it in the assigned bin",
            "roleType": "System",
            "email": "shunter.driver@example.com",
            "password": "shunterDriver@1248",
            "rootMenu": [
                {
                    "name": "Directory",
                    "visible": true,
                    "subMenus": [
                        {
                            "name": "Driver",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Vehicle",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Trailer",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Customer",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Material",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        }
                    ]
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
            alreadyCreated: true
        },
        {
            "roleName": "Weighbridge Operator",
            "description": "Weighs the material and provides a digital receipt to the driver",
            "roleType": "System",
            "email": "weighbridge.manager@example.com",
            "password": "weighbridgeManager@1248",
            "rootMenu": [
                {
                    "name": "Directory",
                    "visible": true,
                    "subMenus": [
                        {
                            "name": "Driver",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Vehicle",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Trailer",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Customer",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Material",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        }
                    ]
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
            alreadyCreated: true
        },
        {
            "roleName": "Production Manager",
            "description": "Checks the intake form filled by the shunter driver",
            "roleType": "System",
            "email": "production.manager@example.com",
            "password": "productionManager@1248",
            "rootMenu": [
                {
                    "name": "Directory",
                    "visible": true,
                    "subMenus": [
                        {
                            "name": "Driver",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Vehicle",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Trailer",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Customer",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Material",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        }
                    ]
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
            alreadyCreated: true
        },
        {
            "roleName": "Quality Manager",
            "description": "Verifies the intake form and completes the process with a digital sign-off",
            "roleType": "System",
            "email": "quality.manager@example.com",
            "password": "qualityManager@1248",
            "rootMenu": [
                {
                    "name": "Directory",
                    "visible": true,
                    "subMenus": [
                        {
                            "name": "Driver",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Vehicle",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Trailer",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Customer",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Material",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        }
                    ]
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
            alreadyCreated: true
        },
        {
            "roleName": "Accounts Manager",
            "description": "Processes the payment for the orders received by the Plant Site",
            "roleType": "System",
            "email": "accounts.manager@example.com",
            "password": "accountsManager@1248",
            "rootMenu": [
                {
                    "name": "Directory",
                    "visible": true,
                    "subMenus": [
                        {
                            "name": "Driver",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Vehicle",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Trailer",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Customer",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Material",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        }
                    ]
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
            alreadyCreated: true
        },
        {
            "roleName": "Executive Manager",
            "description": "Supervises the truck and its status and generates a report",
            "roleType": "System",
            "email": "executive.manager@example.com",
            "password": "executiveManager@1248",
            "rootMenu": [
                {
                    "name": "Directory",
                    "visible": true,
                    "subMenus": [
                        {
                            "name": "Driver",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Vehicle",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Trailer",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Customer",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        },
                        {
                            "name": "Material",
                            "visible": false,
                            "fullAccess": true,
                            "view": true,
                            "create": true,
                            "edit": true,
                            "delete": true,
                            "pageurl": ""
                        }
                    ]
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
            alreadyCreated: true
        },
    ]

    tenantLogin(userModel: any) {
        return this.http.post('/Tenant/TenantAuthenticate', userModel).then(res => res)
    }

    userAuth(userModel: any) {
        return this.http.post('/User/UserAuthenticate', userModel).then(res => res)
    }
    userLogin(email: any) {
        return this.http.get('/User/GetUserbyEmail?Email=' + email).then(res => res)
    }

    // changePassword

    createPassword(mail: any, password: any) {
        return this.http.get('/User/ChangeUserPasswordAndUpdateVerification?email=' + mail + '&newPassword=' + password).then(res => res)
    }

    getMail(mail: any) {
        return this.http.get('/User/SendMailforResetPassword?email=' + mail).then(res => res)
    }

    verifyuserMail(mail: any) {
        return this.http.get('/Admin/VerifyEmail?email=' + mail).then(res => res)
    }

    checkPassword(mail: any) {
        return this.http.get('/User/ForgotPasswordEmail?Email=' + mail).then(res => res)
    }

    empolyeePassword(id: any, password: any) {
        return this.http.get('/TransportManager/UpdateEmployeePassword?employeeId=' + id + '&employeePassword=' + password).then(res => res)
    }

    getRolemenu(roleId: any) {
        return this.http.get('/Tenant/GetRoleMenuByRoleId?roleId='+roleId).then(res => res)
    }

    getRoleaccess(roleId:any){
        debugger;
        return this.http.get('/Tenant/GetRoleAccessbyRoleId?roleId='+roleId).then(res => res)
    }




}