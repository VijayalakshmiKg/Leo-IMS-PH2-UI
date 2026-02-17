import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-users-home',
  templateUrl: './users-home.component.html',
  styleUrls: ['./users-home.component.css']
})
export class UsersHomeComponent implements OnInit {


  userRecords:any | any[]

  sortList: any[] = [];

  sortBy:any = 'Newest to Oldest date'
  searchKey:any = ''
  pageNumber:any = 1
  pageSize:any = 10
  sortByName:any
  totalPages:any =100
  currentPage:any =1
  logedInUser:any;
  permissions:any;
  constructor(public route:Router,public userServ:UsersService) { }

  ngOnInit(): void {
    
     let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
    for(var i=0;i<parsedData.rootMenu.length;i++){
if(parsedData.rootMenu[i].rootMenuName.toLowerCase() == 'users'){
  this.permissions = parsedData.rootMenu[i];
  this.userServ.permissions = this.permissions
}
}
//console.log(this.permissions);

    this.userRecords = this.userServ.usersList
    this.getSortByValues()
    this.getUsers()
  }

  getSortByValues(){
    this.userServ.getSortLits().then(res => {
      //console.log(res);
      if(res){
        this.sortList = res
      }
      
    })
  }

     onPageChange(event: PageEvent | any) {
      //console.log(event);
      this.pageNumber = Number(event.pageIndex) + 1
      this.pageSize = event.pageSize
      this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
      this.totalPages = Math.ceil(event.length / event.pageSize);
      this.getUsers()
    }
  

  sortByValue(filter:any){
    this.sortBy = filter
    this.getUsers()
  }

  getUsers(){
    this.userServ.getUsersList(this.searchKey,this.sortBy,this.pageNumber,this.pageSize).then(res => {
      //console.log(res);
      if(res){
        this.totalPages = res.totalRecords
        this.userRecords =res.data
      }
      
    })
  }

  

  addUsers(){
    this.userServ.editUserIndex = null
    this.route.navigateByUrl('/home/users/addUsers')
  }

  filteredUsersList(event:any) {
    //console.log(event);
    //console.log(event.value);
    this.searchKey = event?.value
   this.getUsers()
    
  }

  viewUser(userData:any,index:any){
    if(this.permissions?.viewAccess){
    this.userServ.editUserIndex = index
    this.userServ.viewByEditUsers = userData
    //console.log(this.userServ.viewByEditUsers);
    
    this.route.navigateByUrl('/home/users/viewUsers')
  }
  }
}
