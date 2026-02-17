import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AccountSettingsService } from '../../../account-settings.service';
import { AddCategoryTypeComponent } from './add-category-type/add-category-type.component';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { MasterService } from '../master.service';

@Component({
  selector: 'app-category-type',
  templateUrl: './category-type.component.html',
  styleUrls: ['./category-type.component.css']
})
export class CategoryTypeComponent implements OnInit {
  categoryTypeList: any | any[] = [];
  constructor(public dialog: MatDialog, public masterSer: MasterService, public settingServ: AccountSettingsService, public utilServ: UtilityService) { }

  ngOnInit(): void {
    // this.categoryTypeList = this.settingServ.categoryTypeRecords
    this.getAllCategory();
  }

  addEditCategoryType(data?: any, index?: any) {
    var dia = this.dialog.open(AddCategoryTypeComponent, {
      panelClass: 'add-categoryType',
      position: { right: "0" },
      height: "100vh",
      data: data ? { data, index, type: 'Edit' } : null,
      width: "700px",
      disableClose: true
    })


    dia.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        // this.categoryTypeList = this.settingServ.categoryTypeRecords
        this.getAllCategory();
      }

    })
  }

  getAllCategory() {
    this.masterSer.getAllCategory().then((res: any) => {
      //console.log(res);
      this.categoryTypeList = res;
    })
  }
  copyCategoryType(data: any) {
    var dia = this.dialog.open(AddCategoryTypeComponent, {
      panelClass: 'add-categoryType',
      position: { right: "0" },
      height: "100vh",
      data: data ? { data, type: 'Copy' } : null,
      width: "700px",
      disableClose: true
    })


    dia.afterClosed().subscribe(res => {
      //console.log(res);
      if (res) {
        // this.categoryTypeList = this.settingServ.categoryTypeRecords
       this.getAllCategory();
      }

    })
  }

  deleteCategoryType(item: any) {
    let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
      width: '480px',
      height: 'auto',
      data: { type: messageBox.deleteMessageBox, message: 'Do you really want to delete this category type ?', title: 'Remove category type ?' },
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-msg-box'
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        //console.log(item.id);
        
      this.masterSer.deleteCategory(item.id).then((res:any) => {
        //console.log(res);
        if(res){
          this.getAllCategory();
          this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Category type deleted successfully' });
        }
      })
      }
    })

  }
}
