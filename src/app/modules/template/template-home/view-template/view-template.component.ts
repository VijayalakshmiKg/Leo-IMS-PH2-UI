import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { DeletePopupComponent } from 'src/app/shared/components/delete-popup/delete-popup.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TemplateService } from '../../template.service';
import { Location } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-template',
  templateUrl: './view-template.component.html',
  styleUrls: ['./view-template.component.css']
})
export class ViewTemplateComponent implements OnInit {
  templatesList:any | any[] = []
  activeTemplates :any
  viewTemplatesRecord:any | any[] = []
  viewMode:any = 'Overview'
  sortByText:any = 'All'
  intakeList:any | any[] = []
  summaryList:any | any[] = []
  sortList:any | any[] = []
  pageNumber: any = 1;
  currentPage:any =1
  pageSize: any = 10;
  totalPages: any;
  filter:any;
  permissions:any;
  constructor(public templatesServ:TemplateService, public routes:Router , public dialog:MatDialog,public utilSer:UtilityService, public location:Location) { }
  ngOnDestroy(): void {
    // this.templatesServ.edittemplatesRecord = null
  }

  ngOnInit(): void {
    this.permissions = this.templatesServ.permissions;
    this.getSortList()

    this.sortCode = this.templatesServ.sort
    this.filter = this.templatesServ.filter
    this.pageNumber = this.templatesServ.pageNumber
    this.currentPage = this.templatesServ.pageNumber
    this.pageSize = this.templatesServ.pageSize
    this.totalPages = this.templatesServ.totalpages
    //console.log(this.templatesServ.pageNumber,this.currentPage);
    

    // this.templatesList = this.templatesServ.templateList
    //console.log(this.templatesList);
    
    this.activeTemplates =  this.templatesServ.viewTemplateIndex ? this.templatesServ.viewTemplateIndex : 0
    //console.log(this.activeTemplates);
    this.viewTemplatesRecord = this.templatesList[this.templatesServ.viewTemplateIndex]
    //console.log(this.viewTemplatesRecord);
    this.getAllTemplates()
    // this.intakeList = this.templatesServ.intakeSheetList
    // this.summaryList = this.templatesServ.summaryTabelList
  }

  allChecked:any | any[] = []
  allTemplateId:any | any[] = []

   // Function to update master checkbox state
 updateMasterCheckbox(event: MouseEvent | any) {
  event.stopPropagation(); // Stop the click from propagating to the <tr>

  this.allChecked = this.templatesList.every((item:any) => item.checked);
  this.getCheckedIds();
}

getSortList() {
  this.utilSer.getSortLits().then((res: any) => {
    //console.log(res);
    this.sortList = res;
  })
}
sortCode:any = 'Newest to Oldest date'

sortByValue(code:any){
  this.sortCode = code
  this.getAllTemplates()
}



   // Function to get IDs of checked items
   getCheckedIds() {
    this.allTemplateId = this.templatesList
      .filter((item:any) => item.checked)
      .map((item:any) => item.orderTemplateID);
    //console.log(this.allTemplateId); // Output the array of checked IDs
  }

  deleteTemplatesMultiple(){
    this.templatesServ.deleteTemplatesByTemID(this.allTemplateId).then(res => {
      //console.log(res);
      if(res){
        this.getAllTemplates()
        this.allTemplateId = []
        this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Template deleted successfully.' })
      }
    })
  }

    onPageChange(event: PageEvent | any) {
      //console.log(event);
      this.pageNumber = Number(event.pageIndex) + 1
      this.pageSize = event.pageSize
      this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
      this.totalPages = Math.ceil(event.length / event.pageSize);
     this.getAllTemplates()
    }

  getAllTemplates(){
    this.templatesServ.getAllTemplates(3,'',this.sortCode,this.pageNumber,this.pageSize).then(res => {
      //console.log(res);
      if(res){
        this.totalPages = res.totalRecords
        this.templatesList = res.orderTemplateModels
        
    this.templatesList = this.templatesList.map((item:any) => ({ ...item, checked: false }));
    this.activeTemplates =  this.templatesServ.viewTemplateIndex ? this.templatesServ.viewTemplateIndex : 0
    
      this.viewTemplatesRecord = this.activeTemplates ? this.templatesList[this.activeTemplates] : this.templatesList[0]
      //console.log(this.viewTemplatesRecord);
      }

    })
   }

  changetemplatesView(index:any){
    this.activeTemplates = index
    this.templatesServ.viewTemplateIndex = index
    this.viewTemplatesRecord = this.templatesList[index]
    //console.log(this.viewTemplatesRecord);
    
  }

  editTemplates(){
    //console.log('alfklajf');
    
    this.templatesServ.editTemplateRecord = this.viewTemplatesRecord
    this.routes.navigateByUrl('/home/template/addEditTemplate')
  }

  back(){
    this.location.back()
  }

  changeView(value:any){
    this.viewMode= value

  }


  filteredUsersList(event:any){

  }

  deleteTemplates(){

    // let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
    //   width: '480px',
    //   height: 'auto',
    //   data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this Templates ?', title: 'Are you sure?' },
    //   disableClose: true,
    //   autoFocus: false,
    //   panelClass: 'custom-msg-box'
    // })
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.templatesServ.templatesList.splice(this.viewTemplatesRecord.viewUserId, 1);
        
    //     // this.router.navigateByUrl('/home/users/list')
    //     this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Templates deleted successfully.' })
    //     this.back()
    //   }
    // })
    //console.log('s;ljfaksjfasj');
    
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '505px',
      height: 'auto',
      data: {title: 'Remove templates', 
             message: 'Do you wish to remove the templates? All the templates data will be deleted and cannot be restored again.', 
             value:this.viewTemplatesRecord.orderTemplateName,
             placeholder:'Enter the templates name'},
      disableClose: true,
      autoFocus: false,
      panelClass: 'deletePopup'
    })
    dialogRef.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        // this.templatesServ.templateList.splice(this.activeTemplates, 1); // delete Your record
        this.templatesServ.deleteTemplatesByTemID([this.viewTemplatesRecord.orderTemplateID]).then(res => {
          //console.log(res);
          if(res){
            this.getAllTemplates()
            this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Templates removed successfully.'})
          }
          
        })
      this.back()
      }
    })
   
  }


  deleteTemplatesList(index?:any){
    
    let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
      width: '480px',
      height: 'auto',
      data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this order ?', title: 'Remove order ?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.templatesServ.templateList.splice(this.viewTemplatesRecord.viewUserId, 1); // delete Your record
        this.templatesList =  this.templatesServ.templateList

    
    this.utilSer.toaster.next({ type: customToaster.successToast, message: 'Order deleted successfully' });
      }
    })
  }

  changeSortBY(value:any){
    this.sortByText = value
  }

}
