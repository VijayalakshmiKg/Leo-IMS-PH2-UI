import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

import { addUserModel } from './users-main/models/userModel';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  usersList:any | any[] = []

viewByEditUsers:any 
editUserIndex:any |any[] =[];
  permissions:any;


  constructor(public http:CustomHttpService) { }

  addUpdateUsers(model:addUserModel){
    return this.http.post('/User/AddUpdateEmployeeUser',model).then(res => res)
  }

  getUsersList(searchKey:any,sortBy:any,pageNumber:any,pageSize:any){
    return this.http.get('/User/GetUsersSearchAndSort?searchKey='+searchKey+'&sortKey='+sortBy+'&pageNumber='+pageNumber+'&pageSize='+pageSize).then(res => res)
  }

  getUserRecordByUserID(userId:any){
    return this.http.get("/User/GetUsersbyUserid?Userid="+userId).then(res => res)
  }

  getSortLits() {
    return this.http.get("/Master/GetSortings").then(res => res);
  }

  getRolesList(){
    return this.http.get('/Master/GetRoles').then(res => res)
  }

  getPlantSiteLocations(){
    return this.http.get('/TransportManager/GetConsigneeDetailsBySearch?searchKey=').then(res => res)
  }

  Checkexits(email: any, mobileNum: any) {
    return this.http.get('/TransportManager/ValidateDriverUniqueness?email=' + email + '&phoneNumber=' + mobileNum).then(res => res)
  }

  deleteUserByUserId(userID:any){
    return this.http.get('/User/DeleteUserById?userId='+userID).then(res => res)
  }
}
