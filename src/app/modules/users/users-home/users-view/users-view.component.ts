import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../users.service';
import { MatDialog } from '@angular/material/dialog';
import { UserDeleteComponent } from '../user-delete/user-delete.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { ResetPswdPopupComponent } from '../reset-pswd-popup/reset-pswd-popup.component';

@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.css']
})
export class UsersViewComponent implements OnInit,OnDestroy {

  viewRecordOfUser:any
logedInUser:any
  permissions: any;
  constructor(public locaton:Location,public route:Router,public userServ:UsersService,public dialog:MatDialog,public utilServ:UtilityService) { }

  ngOnInit(): void {

     let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
this.permissions = this.userServ.permissions;
    //console.log(this.userServ.viewByEditUsers);
  
    if(this.userServ.viewByEditUsers){
      // this.viewRecordOfUser = this.userServ.viewByEditUsers
      this.userServ.getUserRecordByUserID(this.userServ.viewByEditUsers.id).then(res => {
        //console.log(res);
        if(res){
          this.viewRecordOfUser = res[0]
        }
        
      })
    }
    else{
      this.locaton.back()
    }
    
    // this.userDelete()
  }

  ngOnDestroy(): void {
    // this.userServ.editUserIndex = undefined
    // this.userServ.viewByEditUsers = undefined
  }

  back(){
    this.locaton.back()
  }

  editUsers(){
    //console.log(this.userServ.viewByEditUsers);
    
    this.route.navigateByUrl('/home/users/addUsers')
  }

  userDelete(){
   
    // let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
    //   width: '480px',
    //   height: 'auto',
    //   data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this user ?', title: 'Are you sure?' },
    //   disableClose: true,
    //   autoFocus: false,
    //   panelClass: 'custom-msg-box'
    // })
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.userServ.usersList.splice(this.userServ.editUserIndex,1)
        
    //     // this.router.navigateByUrl('/home/users/list')
    //     this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Driver deleted successfully.' })
    //     this.back()
    //   }
    // })

    let dialogRef = this.dialog.open(DeletePopupComponent, {
        width: '505px',
        height: 'auto',
        data: {title: 'Remove Customer', 
          message: 'Do you wish to remove this customer? All the customer data will be deleted and cannot be restored again.', 
          value:this.viewRecordOfUser.email,
          placeholder:'Enter the email'},
        disableClose: true,
        autoFocus: false,
        panelClass: 'deletePopup'
      })
      dialogRef.afterClosed().subscribe(res => {
        //console.log(res);
        if (res) {
          this.userServ.usersList.splice(this.userServ.editUserIndex,1); // delete Your record
          this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Customer removed successfully.' })
        this.back()
        }
      })
}

resendInvitation() {
  this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Invitation sent successfully.' })
}

resetPassword(){
  let dialogRef = this.dialog.open(ResetPswdPopupComponent, {
    width: '505px',
    height: 'auto',
    data: this.viewRecordOfUser,
    disableClose: true,
    autoFocus: false,
    panelClass: 'resetPswdCls'
  })
  dialogRef.afterClosed().subscribe(res => {
    //console.log(res);
    if (res) {
      this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Reset password link sent successfully.'})
    this.back()
    }
  })

}

deleteUser(){


  
  let dialogRef = this.dialog.open(DeletePopupComponent, {
    width: '505px',
    height: 'auto',
    data: {title: 'Remove Customer', 
      message: 'Do you wish to remove this customer? All the customer data will be deleted and cannot be restored again.', 
      value:this.viewRecordOfUser.email,
      placeholder:'Enter the email'},
    disableClose: true,
    autoFocus: false,
    panelClass: 'deletePopup'
  })
  dialogRef.afterClosed().subscribe(res => {
    //console.log(res);
    if (res) {
      this.userServ.deleteUserByUserId(this.userServ.viewByEditUsers.id).then(res => {
        //console.log(res);
        if(res){
          this.utilServ.toaster.next({ type: customToaster.successToast, message: 'User deleted successfully'})
          this.back()
        }
        
      })
    }
  })
 
}

}
