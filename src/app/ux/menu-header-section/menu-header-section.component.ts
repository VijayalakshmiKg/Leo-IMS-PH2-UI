import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/guards/auth.service';
import { AccountSettingsService } from 'src/app/modules/account-settings/account-settings.service';
import { OrdersService } from 'src/app/modules/orders/orders.service';
import { NotificationPopupComponent } from 'src/app/shared/components/notification-popup/notification-popup.component';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-menu-header-section',
  templateUrl: './menu-header-section.component.html',
  styleUrls: ['./menu-header-section.component.css']
})
export class MenuHeaderSectionComponent implements OnInit {

  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  menuOpen = false;
  notificationMsg: any = {};
  visibleMenuItems: any[] = [];
  hiddenMenuItems: any[] = [];
  currentUser: any;
  profileData: any

  menuItems: any[] = [
    { name: 'Dashboard', url: '/home/dashboard' },
    { name: 'Executive Dashboard', url: '/home/executive-dashboard' }, // Its for temporary we will change //
    { name: 'Users', url: '/home/users' },
    { name: 'Driver', url: '/home/drivers' },
    { name: 'Vehicle', url: '/home/vehicle' },
    { name: 'Trailer', url: '/home/trailer' },
    { name: 'Material', url: '/home/material' },
    { name: 'Tasks', url: '/home/tasks' },
    { name: 'Orders', url: '/home/orders' },
    { name: 'Consignor', url: '/home/consignor' },
    { name: 'Consignee', url: '/home/consignee' },
    { name: 'Tracking', url: '/home/tracking' },
    { name: 'Supplier', url: '/home/supplier' },
    { name: 'Reports', url: '/home/reports' },
    { name: 'Template', url: '/home/template' },
    { name: 'Shunter Driver', url: '/home/shunterDriver' },
    // { name: 'Invoices', url: '/home/invoices' },
    // { name: 'Plans', url: '/home/plans' },
    // { name: 'Subscriptions', url: '/home/subscriptions' },
  ];
  menu: boolean = false;
  logedInUser: any;
  userDetails: any
  userDetailsdata: any
  constructor(public orderServ:OrdersService ,private cdr: ChangeDetectorRef, public route: Router, public AuthSvc: AuthService, public accServ: AccountSettingsService, public dialog: MatDialog, public utilServ: UtilityService) { }
  elem: any




  ngOnInit() {
    // this.updateMenuItems();

    let user: any = localStorage.getItem('loggedInUser')
    let userCred: any = localStorage.getItem('userDetails')
    this.userDetails = JSON.parse(userCred);
    this.getUserDetails();
    let parsedData = JSON.parse(user)
    //console.log(parsedData);

    this.logedInUser = parsedData.roleName

    // this.elem = this.document.documentElement;
    // Retrieve the menu items from localStorage
    const storedMenuItems: any = localStorage.getItem('loggedInUser');
    //console.log(storedMenuItems);
    this.currentUser = JSON.parse(storedMenuItems).roleName;
    //console.log(this.currentUser);

    // Check if the data exists in localStorage
    if (storedMenuItems) {
      // Parse the JSON data into an object (not array) and assign it to menuItems
      const parsedStoredMenuItems = JSON.parse(storedMenuItems);
      //console.log(parsedStoredMenuItems);
      //console.log(parsedStoredMenuItems.rootMenu);

      // Ensure that the rootMenu property exists and is assigned correctly
      this.menuItems = parsedStoredMenuItems.rootMenu || []; // If rootMenu doesn't exist, default to empty array
      //console.log(this.menuItems);

    } else {
      // If no data found, initialize with a default or empty array
      this.menuItems = [];
    }





    this.profileData = this.accServ.userProfile

    this.accServ.userProfileChanges.subscribe((res: any) => {
      //console.log(res);
      this.profileData = this.accServ.userProfile
      this.getUserDetails();
    })
    //console.log(this.profileData);
    setInterval(() => {
      this.getNotify();
    }, 10000)
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateMenuItems();
  }

  updateMenuItems() {
    const menu = document.querySelector('.menu') as HTMLElement;
    const moreButton = document.querySelector('.more-option') as HTMLElement;
    const menuWidth = menu?.offsetWidth;
    let totalWidth = 0;
    const gapWidth = 16; // Example gap width between items
    this.visibleMenuItems = [];
    this.hiddenMenuItems = [];

    // Check if the "More" button exists and get its width
    const moreButtonWidth = moreButton ? moreButton.offsetWidth : 0;

    for (const item of this.menuItems) {
      const tempItem = document.createElement('div');
      tempItem.style.visibility = 'hidden';
      tempItem.style.position = 'absolute';
      tempItem.innerHTML = item.name;
      document.body.appendChild(tempItem);
      const itemWidth = tempItem.offsetWidth + gapWidth; // Include gap width
      document.body.removeChild(tempItem);

      if (totalWidth + itemWidth + moreButtonWidth <= menuWidth) {
        // //console.log('visible');

        this.visibleMenuItems.push(item);
        totalWidth += itemWidth;
      } else {
        // //console.log('hidden');

        this.hiddenMenuItems.push(item);
      }
    }
    this.cdr.detectChanges();
  }

  openMenu() {
    //console.log('open');

    this.menuTrigger.openMenu();
    this.menuOpen = true; // Set the flag to indicate the menu is open
  }

  closeMenu() {
    //console.log('leave');

    this.menuTrigger.closeMenu();
    this.menuOpen = false; // Reset the flag when the menu is closed
  }

  toggleMenu() {
    this.menuOpen ? this.closeMenu() : this.openMenu();
  }

  onButtonLeave() {
    // Only close the menu if it's not hovered over
    setTimeout(() => {
      if (!this.menuOpen) {
        this.closeMenu();
      }
    }, 100); // Adjust the delay if necessary
  }

  // Notification Popup
  openNotifications() {
    var dialogRef = this.dialog.open(NotificationPopupComponent, {
      width: '505px',
      height: '100%',
      panelClass: 'notificationPopupCls',
      disableClose: true,
      position: { right: '0px' },
    })
  }

  goToSettings() {
    this.route.navigateByUrl('/home/settings')
  }
  logout() {
    //console.log('logout');
    this.orderServ.ordersList = []
    this.AuthSvc.logout();
    localStorage.clear();
    this.route.navigate(['/login']);
  }

  getNotify() {
    // //console.log(this.currentUser);

    if (this.currentUser === "Transportation Manager") {
      this.notificationMsg.message = "Driver Alex Venus has started collecting the order. You will get notifications regarding the order status.!";
    }
    if (this.currentUser === "Weighbridge operator") {
      this.notificationMsg.message = "Driver Alex Venus has collected the order. Please ready for weighing.";
    }
    if (this.currentUser === "Plant Site Manager") {
      this.notificationMsg.message = "Driver Alex Venus has reached the site. Please avail the shunter driver.!";
    }
    if (this.currentUser === "Production Manager") {
      this.notificationMsg.message = "Driver John Paul has finished the tipping. The bin is ready for quality checking.!";
    }
    // //console.log(this.notificationMsg.message);

    this.notificationMsg.time = new Date();
    this.notificationMsg.read = false;
    // this.utilServ.unreadList.push(this.notificationMsg);
    // this.utilServ.notificationToaster.next({ message: this.notificationMsg.message });
  }

  // Full screen
  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  // Get user details
  getUserDetails() {
    this.utilServ.getProfile(this.userDetails.email).then(data => {
      //console.log(data);
      this.userDetailsdata = data[0];

    })
  }

}
