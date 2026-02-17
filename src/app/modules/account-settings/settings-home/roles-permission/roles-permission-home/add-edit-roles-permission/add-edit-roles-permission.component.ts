import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, AbstractControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/guards/auth.service';
import { AccountSettingsService } from 'src/app/modules/account-settings/account-settings.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { rolesModel, RootMenuModel, SettingsModel, SubMenuModel } from '../../rolesModel';

@Component({
  selector: 'app-add-edit-roles-permission',
  templateUrl: './add-edit-roles-permission.component.html',
  styleUrls: ['./add-edit-roles-permission.component.css']
})
export class AddEditRolesPermissionComponent implements OnInit {
  roleForm!: FormGroup;

  saveBtnText: any = 'Save'
  roleModels: rolesModel = new rolesModel();
  RootMenuModel: RootMenuModel = new RootMenuModel();
  SubMenuModel: SubMenuModel = new SubMenuModel();
  rollMenuId: any;
  loggedInUser: any;

  constructor(private fb: FormBuilder, public settingsServ: AccountSettingsService, public utilServ: UtilityService, public location: Location, public authServ: AuthService) { }

  ngOnInit(): void {
let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.loggedInUser = parsedData.roleName
    //console.log(parsedData);
    this.roleForm = this.fb.group({
      roleName: ['', [Validators.required]],
      description: [''],
      roleId: [''],
      roleType: [''],
      rootMenu: this.fb.array([]),
      settings: this.fb.array([])
    });

    if (this.settingsServ.editRoleRecord) {
      this.settingsServ.getRolesuser(this.settingsServ.editRoleRecord.roleID).then(res => {
        //console.log(res);
        this.rollMenuId = res;

        this.setRolesData(this.rollMenuId);
      })
      //console.log(this.settingsServ.editRoleRecord);

      this.saveBtnText = 'Update'
    }
    else {
      this.getEmptyroles();
      // this.loadFormData()
    }


    // Loop through the rootMenu controls to check the initial state
    this.rootMenu.controls.forEach((rootMenuControl, i) => {
      this.toggleRootMenuOnLoad(i, rootMenuControl);
    });


  }

  getEmptyroles() {
    this.settingsServ.getemptyRoles(13).then(res => {
      //console.log(res);
      if (res) {
        this.populateForm(res)
      }
    })
  }



  setRolesData(data: any) {
    this.populateForm(data);
  }

  loadFormData(): void {
    // const apiData = {
    //   "roleName": "",
    //   "description": "",
    //   "roleType": "System",
    //   "rootMenu": [
    //     {
    //       "name": "Dashboard",
    //       visible: false,
    //       "view": false,
    //       "create": false,
    //       "edit": false,
    //       "delete": false,
    //       pageurl: "/home/dashboard",
    //     },
    //     {
    //       "name": "Template",
    //       visible: false,
    //       "fullAccess": false,
    //       "view": false,
    //       "create": false,
    //       "edit": false,
    //       "delete": false,
    //       pageurl: "/home/template",
    //     },
    //     {
    //       "name": "Executive dashboard",
    //       visible: false,
    //       "view": false,
    //       "create": false,
    //       "edit": false,
    //       "delete": false,
    //       pageurl: "/home/executive-dashboard",
    //     },
    //     {
    //       "name": "Users",
    //       visible: true,
    //       "view": false,
    //       "create": false,
    //       "edit": false,
    //       "delete": false,
    //       pageurl: "/home/users",
    //     },
    //     {
    //       "name": "Shunter Drivers",
    //       visible: true,
    //       "view": false,
    //       "create": false,
    //       "edit": false,
    //       "delete": false,
    //       pageurl: "/home/shunterDrivers",
    //     },
    //     {
    //       "name": "Orders",
    //       visible: false,
    //       "view": false,
    //       "create": false,
    //       "edit": false,
    //       "delete": false,
    //       pageurl: "/home/orders",
    //     },
    //     {
    //       "name": "Tasks",
    //       visible: false,
    //       "view": false,
    //       "create": false,
    //       "edit": false,
    //       "delete": false,
    //       pageurl: "/home/tasks",
    //     },
    //     {
    //       "name": "Tracking",
    //       visible: false,
    //       "view": false,
    //       "create": false,
    //       "edit": false,
    //       "delete": false,
    //       pageurl: "/home/tracking",
    //     },
    //     {
    //       "name": "Supplier",
    //       visible: false,
    //       "view": false,
    //       "create": false,
    //       "edit": false,
    //       "delete": false,
    //       pageurl: "/home/supplier",
    //     },
    //     {
    //       "name": "Reports",
    //       visible: false,
    //       "view": false,
    //       "create": false,
    //       "edit": false,
    //       "delete": false,
    //       pageurl: "/home/reports",
    //     },
    //     {
    //       "name": "Directory",
    //       "visible": false,
    //       "subMenus": [
    //         {
    //           "name": "Driver",
    //           "visible": false,
    //           "view": false,
    //           "create": false,
    //           "edit": false,
    //           "delete": false,
    //           "pageurl": "/home/drivers"
    //         },
    //         {
    //           "name": "Vehicle",
    //           "visible": false,
    //           "fullAccess": false,
    //           "view": false,
    //           "create": false,
    //           "edit": false,
    //           "delete": false,
    //           "pageurl": "/home/vehicle"
    //         },
    //         {
    //           "name": "Trailer",
    //           "visible": false,
    //           "fullAccess": false,
    //           "view": false,
    //           "create": false,
    //           "edit": false,
    //           "delete": false,
    //           "pageurl": "/home/trailer"
    //         },
    //         //   {
    //         //       "name": "Customer",
    //         //       "visible": false,
    //         //       "fullAccess": false,
    //         //       "view": false,
    //         // "create": false,
    //         // "edit": false,
    //         // "delete": false,
    //         //       "pageurl": ""
    //         //   },
    //         {
    //           "name": "Material",
    //           "visible": false,
    //           "fullAccess": false,
    //           "view": false,
    //           "create": false,
    //           "edit": false,
    //           "delete": false,
    //           "pageurl": "/home/material"
    //         },
    //         {
    //           "name": "Consignees",
    //           "visible": false,
    //           "fullAccess": false,
    //           "view": false,
    //           "create": false,
    //           "edit": false,
    //           "delete": false,
    //           "pageurl": "/home/consignee"
    //         },
    //         {
    //           "name": "Consignors",
    //           "visible": false,
    //           "fullAccess": false,
    //           "view": false,
    //           "create": false,
    //           "edit": false,
    //           "delete": false,
    //           "pageurl": "/home/consignor"
    //         },
    //       ]
    //     },
    //     // {
    //     //   "name": "Some thing",
    //     //   "visible": false,
    //     //   "subMenus": [
    //     //     { "name": "Driver", "visible": false, "fullAccess": false, "view": false, "create": false, "edit": false, "delete": false, "pageurl": "" },
    //     //     { "name": "Vehicle", "visible": false, "fullAccess": false, "view": false, "create": false, "edit": false, "delete": false, "pageurl": "" }
    //     //   ]
    //     // }
    //   ],
    //   "settings": [
    //     { "name": "Master", "visible": false, "pageurl": "" },
    //     { "name": "Roles", "visible": false, "pageurl": "" }
    //   ]
    // };

    // this.populateForm(apiData);
  }

  populateForm(data: any): void {
    //console.log(data);
    this.roleForm.patchValue({
      roleName: data?.roleName,
      description: data?.description,
      roleType: data?.roleType,
      roleId: data?.roleId

    });

    const rootMenuArray = this.roleForm.get('rootMenu') as FormArray;
    data?.rootMenu?.forEach((menu: any) => {
      rootMenuArray.push(this.createRootMenuGroup(menu));
    });

    const settingsArray = this.roleForm.get('settings') as FormArray;
    data.settings.forEach((setting: any) => {
      settingsArray.push(this.createSettingsGroup(setting));
    });
  }

  createRootMenuGroup(menu: any): FormGroup {
    const subMenusArray = this.fb.array(
      (menu.subMenus || []).map((subMenu: any) => this.createSubMenuGroup(subMenu))
    );
    //console.log(menu);
    return this.fb.group({
      name: [menu.rootMenuName], // Dynamic Menu Name
      visible: [menu.isVisible],
      create: [menu.createAccess],
      view: [menu.viewAccess],
      fullAccess: [menu.fullAccess],
      edit: [menu.editAccess],
      delete: [menu.deleteAccess],
      pageurl: [menu.pageUrl],
      RootMenuId: [menu.rootMenuId],
      subMenus: subMenusArray
    });
  }

  createSubMenuGroup(subMenu: any): FormGroup {
    //console.log(subMenu);

    return this.fb.group({
      name: [subMenu.subMenuName],
      visible: [subMenu.isVisible],
      fullAccess: [subMenu.fullAccess],
      view: [subMenu.viewAccess],
      create: [subMenu.createAccess],
      edit: [subMenu.editAccess],
      delete: [subMenu.deleteAccess],
      pageurl: [subMenu.pageUrl],
      subMenuId: [subMenu.subMenuId],
    });
  }

  createSettingsGroup(setting: any): FormGroup {
    return this.fb.group({
      name: [setting.settingName],
      visible: [setting.isVisible],
      pageurl: [setting.pageUrl],
      settingId: [setting.settingId],
    });
  }

  // getSubMenus(menu: FormGroup | any): FormArray {
  //   return menu.get('subMenus') as FormArray || this.fb.array([]);
  // }

  getSubMenus(menu: AbstractControl | any): FormArray {
    return menu.get('subMenus') as FormArray;
  }



  save(): void {
    //console.log(this.roleForm.value);
    
    let formData = this.roleForm.value;
    //console.log(formData);

    const roleModelInstance: rolesModel = new rolesModel();
    roleModelInstance.RoleName = formData.roleName;
    roleModelInstance.Description = formData.description;
    roleModelInstance.RoleType = formData.roleType || 'system';
    roleModelInstance.RoleId = formData.roleId || 0;

    // Mapping RootMenu
    roleModelInstance.RootMenu = formData?.rootMenu?.map((menu: any) => {
      const rootMenuInstance = new RootMenuModel();
      if(menu.name == "Directory" || menu.name == "Mappings"){
        //console.log(menu);        
        if(menu.visible){
          rootMenuInstance.RootMenuId = menu.RootMenuId || 0;
      rootMenuInstance.RootMenuName = menu.name;
      rootMenuInstance.PageUrl = menu.pageurl || '';
      rootMenuInstance.CreateAccess = true;
      rootMenuInstance.EditAccess = true;
      rootMenuInstance.DeleteAccess = true;
      rootMenuInstance.ViewAccess = true;
      rootMenuInstance.FullAccess = true;

      // Ensure IsVisible is true if any access permission is granted
      rootMenuInstance.IsVisible =
        true;

      rootMenuInstance.SubMenus = menu?.subMenus?.map((subMenu: any) => {
        const subMenuInstance: SubMenuModel = new SubMenuModel();
        subMenuInstance.SubMenuId = subMenu?.subMenuId || 0;
        subMenuInstance.SubMenuName = subMenu.name;
        subMenuInstance.FullAccess = subMenu.fullAccess || false;
        subMenuInstance.ViewAccess = subMenu.view || false;
        subMenuInstance.CreateAccess = subMenu.create || false;
        subMenuInstance.EditAccess = subMenu.edit || false;
        subMenuInstance.DeleteAccess = subMenu.delete || false;
        subMenuInstance.PageUrl = subMenu.pageurl || '';

        // Ensure IsVisible is true if any access permission is granted
        subMenuInstance.IsVisible =
          subMenu.fullAccess || subMenu.view || subMenu.create || subMenu.edit || subMenu.delete;

        if (this.rollMenuId) {
          subMenuInstance.RootMenuId = this.rollMenuId?.rootMenuId || 0;
        }
        
        
        return subMenuInstance;
      });

        } else {
          rootMenuInstance.RootMenuId = menu.RootMenuId || 0;
      rootMenuInstance.RootMenuName = menu.name;
      rootMenuInstance.PageUrl = menu.pageurl || '';
      rootMenuInstance.CreateAccess = false;
      rootMenuInstance.EditAccess = false;
      rootMenuInstance.DeleteAccess = false;
      rootMenuInstance.ViewAccess = false;
      rootMenuInstance.FullAccess = false;

      // Ensure IsVisible is true if any access permission is granted
      rootMenuInstance.IsVisible =
        false;
        }


      } else {
        rootMenuInstance.RootMenuId = menu.RootMenuId || 0;
      rootMenuInstance.RootMenuName = menu.name;
      rootMenuInstance.PageUrl = menu.pageurl || '';
      rootMenuInstance.CreateAccess = menu.create || false;
      rootMenuInstance.EditAccess = menu.edit || false;
      rootMenuInstance.DeleteAccess = menu.delete || false;
      rootMenuInstance.ViewAccess = menu.view || false;
      rootMenuInstance.FullAccess = menu.fullAccess || false;

      // Ensure IsVisible is true if any access permission is granted
      rootMenuInstance.IsVisible =
        menu.fullAccess || menu.view || menu.create || menu.edit || menu.delete;

      rootMenuInstance.SubMenus = menu?.subMenus?.map((subMenu: any) => {
        const subMenuInstance: SubMenuModel = new SubMenuModel();
        subMenuInstance.SubMenuId = subMenu?.subMenuId || 0;
        subMenuInstance.SubMenuName = subMenu.name;
        subMenuInstance.FullAccess = subMenu.fullAccess || false;
        subMenuInstance.ViewAccess = subMenu.view || false;
        subMenuInstance.CreateAccess = subMenu.create || false;
        subMenuInstance.EditAccess = subMenu.edit || false;
        subMenuInstance.DeleteAccess = subMenu.delete || false;
        subMenuInstance.PageUrl = subMenu.pageurl || '';

        // Ensure IsVisible is true if any access permission is granted
        subMenuInstance.IsVisible =
          subMenu.fullAccess || subMenu.view || subMenu.create || subMenu.edit || subMenu.delete;

        if (this.rollMenuId) {
          subMenuInstance.RootMenuId = this.rollMenuId?.rootMenuId || 0;
        }
        return subMenuInstance;
      });
      }

      return rootMenuInstance;
    });

    // Mapping Settings
    roleModelInstance.Settings = formData?.settings?.map((setting: any) => {
      const settingInstance: SettingsModel = new SettingsModel();
      settingInstance.SettingId = setting.settingId || 0;
      settingInstance.SettingName = setting.name;
      settingInstance.IsVisible = setting.visible || false;
      settingInstance.PageUrl = setting.pageurl || '';
      settingInstance.RoleId = this.rollMenuId?.roleId || 0;
      return settingInstance;
    });

    //console.log(roleModelInstance);
    this.settingsServ.addRoles(roleModelInstance).then((res) => {
      //console.log(res);
      if (res) {
        // Handle success response
        this.utilServ.toaster.next({type:customToaster.successToast, message:'Permissions updated successfully.'})
      }
      this.location.back();
    });
  }



  back() {
    this.location.back()
  }

  get rootMenu(): FormArray {
    return this.roleForm.get('rootMenu') as FormArray;
  }

  get settings(): FormArray {
    return this.roleForm.get('settings') as FormArray;
  }

  toggleRootMenuOnLoad(i: number, rootMenuControl: any): void {
    const subMenusArray = rootMenuControl.get('subMenus') as FormArray;

    // Get the visibility value for the root menu checkbox
    const isVisible = rootMenuControl.get('visible')?.value;

    // Loop through each submenu and enable/disable it based on root menu's visibility
    subMenusArray.controls.forEach(subMenuControl => {
      if (isVisible) {
        // Enable submenu form controls if root menu is visible
        subMenuControl.enable();
      } else {
        // Disable submenu form controls if root menu is not visible
        subMenuControl.disable();
      }
    });
  }


  toggleRootMenu(i: number): void {
    const rootMenuControl = this.rootMenu.at(i);
    const subMenusArray = rootMenuControl.get('subMenus') as FormArray;

    // Get the visibility value for the root menu checkbox
    const isVisible = rootMenuControl.get('visible')?.value;

    // Loop through each submenu and enable or disable it based on the root menu's checkbox
    subMenusArray.controls.forEach(subMenuControl => {
      if (isVisible) {
        // If the root menu is visible, enable the submenu form controls
        subMenuControl.enable();
      } else {
        // If the root menu is not visible, disable the submenu form controls
        subMenuControl.disable();
        subMenuControl.get('fullAccess')?.setValue(false);
        subMenuControl.get('view')?.setValue(false);
        subMenuControl.get('create')?.setValue(false);
        subMenuControl.get('edit')?.setValue(false);
        subMenuControl.get('delete')?.setValue(false);
      }
    });
  }

  // This will be called when any individual submenu checkbox is toggled
  toggleSubMenu(i: number, j: number): void {
    const rootMenuControl = this.rootMenu.at(i);
    const subMenuControl = (rootMenuControl.get('subMenus') as FormArray).at(j);

    // If any submenu is toggled, update its visibility accordingly
    const isVisible = subMenuControl.get('visible')?.value;

    subMenuControl.get('fullAccess')?.setValue(isVisible);
    subMenuControl.get('view')?.setValue(isVisible);
    subMenuControl.get('create')?.setValue(isVisible);
    subMenuControl.get('edit')?.setValue(isVisible);
    subMenuControl.get('delete')?.setValue(isVisible);
  }


  // This will be called when any of "View", "Create", "Edit", or "Delete" change
  onPermissionChange(subMenuControl: AbstractControl): void {
    const viewChecked = subMenuControl.get('view')?.value;
    const createChecked = subMenuControl.get('create')?.value;
    const editChecked = subMenuControl.get('edit')?.value;
    const deleteChecked = subMenuControl.get('delete')?.value;

    // Ensure that if Create is true, Edit should also be true
    // if (createChecked) {
    //   subMenuControl.get('edit')?.setValue(true);
    // }

    // Ensure that if Edit is true, Create should also be true
    if (editChecked) {
      subMenuControl.get('edit')?.setValue(true);
      subMenuControl.get('create')?.setValue(true);
      subMenuControl.get('view')?.setValue(true);
    }

    if (createChecked) {
      subMenuControl.get('view')?.setValue(true);
    }
    if (deleteChecked) {
      subMenuControl.get('view')?.setValue(true);
    }




    // If any of "View", "Create", "Edit", or "Delete" is false, set "Full Access" to false
    const fullAccess = viewChecked && createChecked && editChecked && deleteChecked;
    subMenuControl.get('fullAccess')?.setValue(fullAccess);
  }



  // This will be called when "Full Access" changes
  onFullAccessChange(subMenuControl: AbstractControl): void {
    const fullAccess = subMenuControl.get('fullAccess')?.value;

    // If "Full Access" is true, set all other permissions to true
    if (fullAccess) {
      subMenuControl.get('view')?.setValue(true);
      subMenuControl.get('create')?.setValue(true);
      subMenuControl.get('edit')?.setValue(true);
      subMenuControl.get('delete')?.setValue(true);
    } else {
      // If "Full Access" is false, reset other permissions to false
      subMenuControl.get('view')?.setValue(false);
      subMenuControl.get('create')?.setValue(false);
      subMenuControl.get('edit')?.setValue(false);
      subMenuControl.get('delete')?.setValue(false);
    }
  }


}
