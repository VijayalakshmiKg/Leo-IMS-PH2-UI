import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { TemplateService } from '../template.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CustomMessageBoxComponent, messageBox } from 'src/app/shared/components/custom-message-box/custom-message-box.component';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { CanComponentDeactivate } from 'src/app/core/guards/can-deactivate.guard';

@Component({
  selector: 'app-template-home',
  templateUrl: './template-home.component.html',
  styleUrls: ['./template-home.component.css']
})
export class TemplateHomeComponent implements OnInit, AfterViewInit, CanComponentDeactivate {
    templateList:any | any[] = []
    sortList: any[] = [];
    status = 'Status'
    orderKeys:any
    allChecked:Boolean = false
 
    allTemplateId:any | any[] = []
    sortCode:any = 'Newest to Oldest date'
    filter = '';
    length = 200; // Total items
    pageSize = 10; // Items per page
    pageNumber = 1
    currentPage = 1; // Default first page
    totalPages = Math.ceil(this.length / this.pageSize); // Total pages
    logedInUser:any;
    permissions:any;

    // Template dropdown properties
    selectedTemplate: string = '';
    selectedTemplateName: string = '';
    currentTemplateID: number | null = null; // Store template ID when importing
    showTemplateDropdown: boolean = false; // Controls dropdown visibility

    // ViewChild reference for template paginator
    @ViewChild('templatePaginator', { static: false }) customPaginator: any;

    // Editable cell properties
    editingCell: { rowIndex: number | null, field: string | null, originalValue: any } = { 
      rowIndex: null, 
      field: null, 
      originalValue: null 
    };

    // Dropdown options for editable cells
    plannerOptions: any[] = [];
    customerOptions: any[] = [];
    productOptions: any[] = []; // Added for product dropdown
    pickupLocationOptions: any[] = [];
    vehicleOptions: any[] = [];
    driverOptions: any[] = [];
    statusOptions: any[] = [];
    trailerOptions: any[] = [];
    productTypeOptions: any[] = [];
    trailerTypeOptions: any[] = [];
    changeoverLocationOptions: any[] = [];
    weightUnitOptions: any[] = [];
    deliveryLocationOptions: any[] = [];
    trailerOutOptions: any[] = [];
    trailerOutTypeOptions: any[] = [];
    
    // Validation tracking
    validationErrors: Map<string, string[]> = new Map();
    
    // Validation error modal
    showValidationErrorModal: boolean = false;
    validationErrorList: any[] = [];
    groupedValidationErrors: Map<string, any[]> = new Map();
    
    // Flag to track if dropdown change is in progress
    private dropdownChangeInProgress: boolean = false;
    
    // Performance: Lookup maps for O(1) searches
    private plannerLookup: Map<string, any> = new Map();
    private customerLookup: Map<string, any> = new Map();
    private productLookup: Map<string, any> = new Map();
    private vehicleLookup: Map<string, any> = new Map();
    private driverLookup: Map<string, any> = new Map();
    private statusLookup: Map<string, any> = new Map();
    private trailerLookup: Map<string, any> = new Map();
    private productTypeLookup: Map<string, any> = new Map();
    private locationLookup: Map<string, any> = new Map();
    private trailerTypeLookup: Map<string, any> = new Map(); // For trailerInType
    private trailerOutLookup: Map<string, any> = new Map();
    private trailerOutTypeLookup: Map<string, any> = new Map();
      private deliveryLocationLookup: Map<string, any> = new Map();
       private changeoverLocationLookup: Map<string, any> = new Map();
    
    // Customer-specific lookup maps (for multi-customer imports)
    private customerProductsMap: Map<number, any[]> = new Map(); // customerId -> products[]
    private customerLocationsMap: Map<number, any[]> = new Map(); // customerId -> locations[]
    
    // Fast lookup maps for customer-specific data (O(1) lookup)
    private customerProductLookupMap: Map<number, Map<string, any>> = new Map(); // customerId -> (productName -> product)
    private customerLocationLookupMap: Map<number, Map<string, any>> = new Map(); // customerId -> (locationName -> location)
    
    // Field mapping for ID/Name pairs
    fieldMappings: any = {
      planner: { idField: 'plannerId', nameField: 'planner', options: 'plannerOptions' },
      customer: { idField: 'customerId', nameField: 'customer', options: 'customerOptions' },
      pickupLocation: { idField: 'pickupLocationId', nameField: 'pickupLocation', options: 'pickupLocationOptions' },
      product: { idField: 'productId', nameField: 'product', options: 'productOptions' },
      vehicle: { idField: 'vehicleId', nameField: 'vehicle', options: 'vehicleOptions' },
      driverName: { idField: 'driverId', nameField: 'driverName', options: 'driverOptions' },
      status: { idField: 'statusId', nameField: 'status', options: 'statusOptions' },
      trailerIn: { idField: 'trailerInId', nameField: 'trailerIn', options: 'trailerOptions' },
      trailerInType: { idField: 'trailerInTypeId', nameField: 'trailerInType', options: 'trailerTypeOptions' },
      changeoverLocation: { idField: 'changeoverLocationId', nameField: 'changeoverLocation', options: 'changeoverLocationOptions' },
      deliveryLocation: { idField: 'deliveryLocationId', nameField: 'deliveryLocation', options: 'deliveryLocationOptions' },
      trailerOut: { idField: 'trailerOutId', nameField: 'trailerOut', options: 'trailerOutOptions' }
    };
    hasLoadedData: boolean = false;
    templateSearchText: string = '';
    availableTemplates: any[] = [];

    // Import modal properties
    showImportModal: boolean = false;
    selectedTemplateType: string = '';

    // Excel sheet properties
    sheets: any[] = [];
    activeSheetIndex: number = 0;
    
    get filteredTemplates() {
      if (!this.templateSearchText) {
        return this.availableTemplates;
      }
      return this.availableTemplates.filter(template => 
        template.name.toLowerCase().includes(this.templateSearchText.toLowerCase())
      );
    }

  // Check if there's unsaved data
  hasUnsavedData(): boolean {
    return this.templateList && this.templateList.length > 0;
  }

  // Navigation guard for route changes within the app
  canDeactivate(): boolean {
    if (this.hasUnsavedData()) {
      return confirm('You have unsaved changes. Are you sure you want to leave this page? Any unsaved work will be lost.');
    }
    return true;
  }

  // Close template dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    // Check if click is outside template dropdown
    if (this.showTemplateDropdown && !target.closest('.template-selector')) {
      this.showTemplateDropdown = false;
    }
  }

  // Toggle template dropdown visibility
  async toggleTemplateDropdown(event: Event) {
    event.stopPropagation();
    this.showTemplateDropdown = !this.showTemplateDropdown;
    
    // Load templates when opening dropdown
    if (this.showTemplateDropdown) {
      await this.loadTemplatesByPlannerID();
    }
  }

  // Close template dropdown
  closeTemplateDropdown() {
    this.showTemplateDropdown = false;
  }

  ngOnInit(): void {

     let user:any = localStorage.getItem('loggedInUser')

    let parsedData = JSON.parse(user)
    this.logedInUser = parsedData.roleName
    //console.log(parsedData);
for(var i=0;i<parsedData.rootMenu.length;i++){
if(parsedData.rootMenu[i].rootMenuName.toLowerCase() == 'templates'){
  this.permissions = parsedData.rootMenu[i];
  this.temServ.permissions = this.permissions

}
}
//console.log(this.permissions);

    sessionStorage.setItem('refreshed', 'false');

    // Ensure templateList starts empty - no data loading on page load
    this.templateList = [];
    
    //console.log(this.temServ.templateList);
    // this.templateList = this.temServ.templateList
    //console.log(this.templateList);
   //  this.templateList = this.temServ.templateList 
   // this.getAllTemplates()
    //this.getSortList();
    // this.orderKeys = Object.keys(this.templateList[0]);
    
    // Load templates from API
    this.loadTemplatesByPlannerID();
    
    // Initialize dropdown options for editable cells (CRITICAL: Must load before any import)
    this.initializeDropdownOptions();
  }

  ngAfterViewInit(): void {
    // Ensure custom paginator is fully initialized after navigation
    setTimeout(() => {
      if (this.customPaginator) {
        // Force change detection first
        if (this.customPaginator.cdr) {
          this.customPaginator.cdr.detectChanges();
        }
        
        // Initialize the sheets if needed
        if (this.customPaginator.initializeSheets) {
          this.customPaginator.initializeSheets();
        }
        
        // Additional delay to ensure DOM is fully rendered
        setTimeout(() => {
          if (this.customPaginator.cdr) {
            this.customPaginator.cdr.detectChanges();
          }
        }, 100);
      }
    }, 150);
  }

  constructor(
    public route:Router,
    public temServ:TemplateService,
    public dialog:MatDialog, 
    public utilServ:UtilityService,
    private cdr: ChangeDetectorRef
  ) { }


  onPageChange(event: PageEvent) {
    //console.log(event);
    this.pageNumber = Number(event.pageIndex) + 1
    this.pageSize = event.pageSize
    this.currentPage = event.pageIndex + 1; // Convert zero-based index to human-readable
    this.totalPages = Math.ceil(event.length / event.pageSize);
    //this.getAllTemplates()
  }

  onSheetChanged(sheetIndexOrEvent: number | any) {
    // Handle both number (from sheetSelected) and object (from sheetAdded)
    const sheetIndex = typeof sheetIndexOrEvent === 'number' ? sheetIndexOrEvent : this.customPaginator?.activeSheetIndex || 0;
    
    // Update templateList to show data from the selected sheet
    if (this.customPaginator) {
      const sheetData = this.customPaginator.getActiveSheetData();
      
      if (sheetData && sheetData.length > 0) {
        this.templateList = [...sheetData]; // Create new array reference
        this.length = this.templateList.length;
        this.totalPages = this.templateList.length;
        this.currentPage = 1;
        
        // Update the template service
        this.temServ.templateList = this.templateList;
      } else {
        this.templateList = [];
      }
    }
  }

  getSortList() {
    this.utilServ.getSortLits().then((res: any) => {
      //console.log(res);
      this.sortList = res;
    })
  }

  sortByValue(code:any){
    this.sortCode = code
    // Only load data if templateList is not empty (user has already loaded data)
    if (this.templateList && this.templateList.length > 0) {
      this.getAllTemplates()
    }
  }

 getAllTemplates(){
  this.temServ.getAllTemplates(3,this.filter,this.sortCode,this.pageNumber,this.pageSize).then(res => {
    //console.log(res);
    if(res){
      this.totalPages = res.totalRecords
      this.totalPages = res.totalRecords
      this.templateList = res.orderTemplateModels
      this.totalPages = res.totalRecords
      this.templateList = this.templateList.map((item:any) => ({ ...item, checked: false }));
      //console.log(this.templateList);
      this.temServ.templateList = this.templateList
    }
  })
 }




  // Function to toggle all checkboxes
  toggleAll() {
    this.templateList = this.templateList.map((item:any) => ({
      ...item,
      checked: this.allChecked
    }));
    this.getCheckedIds()
  }

  toggleParticular(event: MouseEvent) {
    event.stopPropagation(); // Stop the click from propagating to the <tr>

    // Debugging output for the whole list
    //console.log('Template List:', this.templateList);

    // Step 1: Filter checked templates
    const checkedTemplates = this.templateList.filter((template: any) => template.checked == true);

    // Debugging output for filtered templates
    //console.log('Checked Templates:', checkedTemplates);

    // Step 2: Map to get only the IDs
    const checkedIds = checkedTemplates.map((template: any) => template.orderTemplateID);

    // Debugging output for checked IDs
    //console.log('Checked IDs:', checkedIds);
}

deleteTemplates(){
  this.temServ.deleteTemplatesByTemID(this.allTemplateId).then(res => {
    //console.log(res);
    if(res){
      this.getAllTemplates()
      this.allTemplateId = []
      this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Template deleted successfully.' })
    }
  })
}
deleteParticulerTemplate(deleteId:any){
  this.temServ.deleteTemplatesByTemID([deleteId]).then(res => {
    //console.log(res);
    if(res){
      this.getAllTemplates()
      this.allTemplateId = []
      this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Template deleted successfully.' })
    }
  })
}

// New method for handling selected rows deletion
deleteSelectedRows() {
  if (this.allTemplateId.length === 0) return;
  
  const confirmMessage = this.allTemplateId.length === 1 
    ? 'Are you sure you want to delete this row?' 
    : `Are you sure you want to delete ${this.allTemplateId.length} rows?`;
    
  if (confirm(confirmMessage)) {
    // Find selected rows and remove them from templateList
    this.templateList = this.templateList.filter((item: any) => !this.allTemplateId.includes(item.orderTemplateID));
    
    // Renumber all rows
    this.renumberRows();
    
    // Update active sheet data if using sheet system
    if (this.customPaginator) {
      this.customPaginator.updateActiveSheetData(this.templateList);
    }
    
    // Reset selection
    this.allTemplateId = [];
    this.allChecked = false;
    
    // Update pagination
    this.length = this.templateList.length;
    this.totalPages = this.templateList.length;
    
    this.utilServ.toaster.next({ 
      type: customToaster.successToast, 
      message: 'Row(s) deleted successfully.' 
    });
  }
}

// Method to duplicate selected row
duplicateRow() {
  if (this.allTemplateId.length !== 1) return;
  
  const selectedId = this.allTemplateId[0];
  const selectedIndex = this.templateList.findIndex((item: any) => item.orderTemplateID === selectedId);
  
  if (selectedIndex !== -1) {
    const originalRow = this.templateList[selectedIndex];
    
    // Create a duplicate with new ID and modified name
    const duplicatedRow = {
      ...originalRow,
      orderTemplateID: `duplicated_${Date.now()}_${Math.random()}`,
      orderTemplateName: `${originalRow.orderTemplateName} - Copy`,
      checked: false
    };
    
    // Insert the duplicate after the selected row
    this.templateList.splice(selectedIndex + 1, 0, duplicatedRow);
    
    // Renumber all rows
    this.renumberRows();
    
    // Update active sheet data if using sheet system
    if (this.customPaginator) {
      this.customPaginator.updateActiveSheetData(this.templateList);
    }
    
    // Reset selection
    this.allTemplateId = [];
    this.allChecked = false;
    
    // Update pagination
    this.length = this.templateList.length;
    this.totalPages = this.templateList.length;
    
    this.utilServ.toaster.next({ 
      type: customToaster.successToast, 
      message: 'Row duplicated successfully.' 
    });
  }
}

 // Function to update master checkbox state
 updateMasterCheckbox(event: MouseEvent | any) {
  event.stopPropagation(); // Stop the click from propagating to the <tr>

  this.allChecked = this.templateList.every((item:any) => item.checked);
  this.getCheckedIds();
}


   // Function to get IDs of checked items
   getCheckedIds() {
    this.allTemplateId = this.templateList
      .filter((item:any) => item.checked)
      .map((item:any) => item.orderTemplateID);
    //console.log(this.allTemplateId); // Output the array of checked IDs
  }

  filteredUsersList(event:any){

  }

 

  addTemplate(){
    this.temServ.editTemplateRecord = null
    this.route.navigateByUrl('/home/template/addEditTemplate')
  }
  
  viewTemplate(index:any){

    if(this.permissions?.viewAccess){
      this.temServ.sort = this.sortCode
    this.temServ.filter = this.filter
    this.temServ.pageNumber = this.pageNumber
    this.temServ.pageSize = this.pageSize
    this.temServ.totalpages = this.totalPages
    //console.log(index);
    this.temServ.viewTemplateIndex = index
    this.route.navigateByUrl('/home/template/viewTemplate')
    }

  }

  editTemplate(index:any,data:any){
    //console.log(index,data);
    //console.log('alfklajf');
    
    this.temServ.editTemplateRecord = data
    this.route.navigateByUrl('/home/template/addEditTemplate')
  }

  deleteTemplateList(index:any){

    this.templateList = this.temServ.templateList

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
        this.templateList.splice(index,1)
    
    this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Order deleted successfully' });
      }
    })
  }

  downloadTemplate(type: string) {
    if (type === 'normal') {
      this.downloadExcelTemplate('Normal_Task_Template.xlsx');
      this.utilServ.toaster.next({ 
        type: customToaster.successToast, 
        message: 'Normal Task template downloaded successfully' 
      });
    } else if (type === 'changeover') {
      this.downloadExcelTemplate('ChangeOver_Task_Template.xlsx');
      this.utilServ.toaster.next({ 
        type: customToaster.successToast, 
        message: 'Change over task template downloaded successfully' 
      });
    }
  }

  async onTemplateSelect(template: any) {
    this.selectedTemplate = template.value;
    this.selectedTemplateName = template.name;
    this.currentTemplateID = template.value; // Store template ID for update
    
    // Load template data from API
    try {
      const res: any = await this.temServ.getTemplateByTemID(template.value);
      
      if (res && res.result) {
        // Process template data structure
        const templateData = res.result;
        
        // Check if we have TemplateSheetDetails for multi-sheet support
        if (templateData.templateSheetDetails && Array.isArray(templateData.templateSheetDetails)) {
          // Clear existing sheets first
          if (this.customPaginator) {
            this.customPaginator.clearAllSheets();
          }
          
          // Group template details by sheet name
          const sheetDataMap = new Map<string, any[]>();
          
          if (templateData.templateDetails && Array.isArray(templateData.templateDetails)) {
            templateData.templateDetails.forEach((detail: any, index: number) => {
              const sheetName = detail.sheetName || detail.SheetName || 'Sheet 1';
              
              if (!sheetDataMap.has(sheetName)) {
                sheetDataMap.set(sheetName, []);
              }
              
              // Map template detail to row format
              // Lookup customerId from customerOptions by matching customer name
              const customerName = detail.customer || detail.Customer || '';
              let customerId = '';
              if (customerName && Array.isArray(this.customerOptions) && this.customerOptions.length > 0) {
                const found = this.customerOptions.find((opt: any) => (opt.name || '').toLowerCase().trim() === customerName.toLowerCase().trim());
                if (found) customerId = found.value;
              }
              const row = {
                orderTemplateID: `template_${template.value}_${index}`,
                orderTemplateName: template.name,
                orderTemplateDate: new Date().toISOString(),
                checked: false,
                no: (index + 1).toString().padStart(2, '0'),
                planner: detail.planner || detail.Planner || '',
                customer: customerName,
                customerId: customerId,
                pickupLocation: detail.pickupLocation || detail.PickupLocation || '',
                product: detail.product || detail.Product || '',
                productType: detail.productType || detail.ProductType || '',
                collectionTime: detail.collectionTime || detail.CollectionTime || '',
                deliveryLocation: detail.deliveryLocation || detail.DeliveryLocation || '',
                scheduledTime: detail.scheduledTime || detail.ScheduledTime || '',
                driverName: detail.driver || detail.Driver || '',
                vehicle: detail.vehicle || detail.Vehicle || '',
                trailerInType: detail.trailerInType || detail.TrailerInType || '',
                trailerOut: detail.trailerOut || detail.TrailerOut || '',
                trailerIn: detail.trailerIn || detail.TrailerIn || '',
                status: detail.status || detail.Status || '',
                productEstWeight: detail.productEstWeight || detail.ProductEstWeight || null,
                weightUnit: detail.weightUnit || detail.WeightUnit || '',
                changeoverLocation: detail.changeoverLocation || detail.ChangeoverLocation || '',
                changeoverMessage: detail.changeoverMessage || detail.ChangeoverMessage || '',
                notes: detail.notes || detail.Notes || ''
              };
              
              sheetDataMap.get(sheetName)!.push(row);
            });
          }
          
          // Sort sheets by display order if available
          const sortedSheets = templateData.templateSheetDetails
            .sort((a: any, b: any) => {
              const orderA = a.displayOrder || a.DisplayOrder || 0;
              const orderB = b.displayOrder || b.DisplayOrder || 0;
              return orderA - orderB;
            });
          
          // Add each sheet with its data
          sortedSheets.forEach((sheetDetail: any) => {
            const sheetName = sheetDetail.sheetName || sheetDetail.SheetName || 'Sheet 1';
            const sheetData = sheetDataMap.get(sheetName) || [];
            
            if (this.customPaginator) {
              this.customPaginator.addSheetWithData(sheetName, sheetData);
            }
          });
          
          // Set first sheet as active
          if (this.customPaginator && this.customPaginator.sheets.length > 0) {
            this.customPaginator.activeSheetIndex = 0;
            this.templateList = this.customPaginator.getActiveSheetData() || [];
          }
        } else {
          // Single sheet template (legacy format)
          const templateRows = templateData.templateDetails?.map((detail: any, index: number) => {
            // Lookup customerId from customerOptions by matching customer name
            const customerName = detail.customer || detail.Customer || '';
            let customerId = '';
            if (customerName && Array.isArray(this.customerOptions) && this.customerOptions.length > 0) {
              const found = this.customerOptions.find((opt: any) => (opt.name || '').toLowerCase().trim() === customerName.toLowerCase().trim());
              if (found) customerId = found.value;
            }
            return {
              orderTemplateID: `template_${template.value}_${index}`,
              orderTemplateName: template.name,
              orderTemplateDate: new Date().toISOString(),
              checked: false,
              no: (index + 1).toString().padStart(2, '0'),
              planner: detail.planner || detail.Planner || '',
              customer: customerName,
              customerId: customerId,
              pickupLocation: detail.pickupLocation || detail.PickupLocation || '',
              product: detail.product || detail.Product || '',
              productType: detail.productType || detail.ProductType || '',
              collectionTime: detail.collectionTime || detail.CollectionTime || '',
              deliveryLocation: detail.deliveryLocation || detail.DeliveryLocation || '',
              scheduledTime: detail.scheduledTime || detail.ScheduledTime || '',
              driverName: detail.driver || detail.Driver || '',
              vehicle: detail.vehicle || detail.Vehicle || '',
              trailerInType: detail.trailerInType || detail.TrailerInType || '',
              trailerOut: detail.trailerOut || detail.TrailerOut || '',
              trailerIn: detail.trailerIn || detail.TrailerIn || '',
              status: detail.status || detail.Status || '',
              productEstWeight: detail.productEstWeight || detail.ProductEstWeight || null,
              weightUnit: detail.weightUnit || detail.WeightUnit || '',
              changeoverLocation: detail.changeoverLocation || detail.ChangeoverLocation || '',
              changeoverMessage: detail.changeoverMessage || detail.ChangeoverMessage || '',
              notes: detail.notes || detail.Notes || ''
            };
          }) || [];
          
          this.templateList = templateRows;
          
          // Add to paginator if available
          if (this.customPaginator) {
            this.customPaginator.clearAllSheets();
            this.customPaginator.addSheetWithData(template.name, templateRows);
            this.customPaginator.activeSheetIndex = 0;
          }
        }
        
        // Update UI state
        this.hasLoadedData = true;
        this.length = this.templateList.length;
        this.totalPages = this.templateList.length;
        this.currentPage = 1;
        this.temServ.templateList = this.templateList;
        this.cdr.detectChanges();
        
        this.utilServ.toaster.next({ 
          type: customToaster.successToast, 
          message: `Template "${template.name}" loaded successfully!` 
        });
      } else {
        this.utilServ.toaster.next({ 
          type: customToaster.warningToast, 
          message: 'Template data not found!' 
        });
      }
    } catch (error) {
      console.error('Error loading template:', error);
      this.utilServ.toaster.next({ 
        type: customToaster.errorToast, 
        message: 'Failed to load template. Please try again.' 
      });
    }
  }

  filterTemplates() {
    // This method is called when user types in the search input
    // The filteredTemplates getter will automatically update the displayed options
  }

  async onImportTemplateClick() {
    // Load templates from API when import template dropdown is clicked
    await this.loadTemplatesByPlannerID();
  }

  importExcel(templateType?: string) {
    this.selectedTemplateType = templateType || '';
    this.showImportModal = true;
    
    // Force change detection to ensure modal receives updated data
    this.cdr.detectChanges();
  }

  closeImportModal() {
    this.showImportModal = false;
    this.selectedTemplateType = '';
  }

  saveTemplate() {
    // First validate that we have sheets
    if (!this.customPaginator || !this.customPaginator.sheets || this.customPaginator.sheets.length === 0) {
      this.utilServ.toaster.next({ 
        type: customToaster.errorToast, 
        message: 'No template data to save!' 
      });
      return;
    }

    // Validate sheet names are unique
    const sheetNames = this.customPaginator.sheets.map((sheet: any) => sheet.name);
    const uniqueSheetNames = new Set(sheetNames);
    
    if (sheetNames.length !== uniqueSheetNames.size) {
      this.utilServ.toaster.next({ 
        type: customToaster.errorToast, 
        message: 'Sheet names must be unique! Please rename duplicate sheets.' 
      });
      return;
    }
    
    // If editing existing template (has currentTemplateID), skip name prompt
    if (this.currentTemplateID) {
      this.saveTemplateToBackend(this.selectedTemplateName);
      return;
    }
    
    // New template - prompt user for template name
    const templateName = prompt('Enter template name:');
    
    if (templateName === null) {
      // User cancelled
      return;
    }
    
    const trimmedName = templateName.trim();
    
    if (!trimmedName) {
      this.utilServ.toaster.next({ 
        type: customToaster.errorToast, 
        message: 'Template name is required!' 
      });
      return;
    }

    // Validate template name doesn't already exist
    this.temServ.validateTemplateName(trimmedName).then((res: any) => {
      if (res && res.isUnique === false) {
        this.utilServ.toaster.next({ 
          type: customToaster.errorToast, 
          message: 'Template name already exists! Please use a different name.' 
        });
      } else {
        // Proceed with save
        this.saveTemplateToBackend(trimmedName);
      }
    }).catch(error => {
      console.error('Error validating template name:', error);
      this.utilServ.toaster.next({ 
        type: customToaster.errorToast, 
        message: 'Error validating template name. Please try again.' 
      });
    });
  }

  saveTemplateToBackend(templateName: string) {
    // Get logged in user details
    let user: any = localStorage.getItem('loggedInUser');
    let parsedData = JSON.parse(user);
    
    // Try multiple possible property names for employee ID
    let employeeId = parsedData.employeeId || parsedData.EmployeeId || parsedData.empId || parsedData.EmpId || parsedData.id || parsedData.Id;
    let loggedInUserName = parsedData.userName || parsedData.UserName || parsedData.name || parsedData.Name || parsedData.fullName || parsedData.FullName;
    
    // Validate employee ID
    if (!employeeId || employeeId === 0) {
      this.utilServ.toaster.next({ 
        type: customToaster.errorToast, 
        message: 'Unable to retrieve employee ID. Please login again.' 
      });
      return;
    }

    // Prepare template sheets
    const templateSheetDetails = this.customPaginator.sheets.map((sheet: any, index: number) => ({
      SheetName: sheet.name,
      DisplayOrder: index + 1
    }));

    // Prepare template details (all rows from all sheets with their sheet names)
    const templateDetails: any[] = [];
    
    this.customPaginator.sheets.forEach((sheet: any) => {
      if (sheet.data && sheet.data.length > 0) {
        sheet.data.forEach((row: any, index: number) => {
           let productEstWeight: number | null = null;
        let productEstWeightUnit: string = 'kg';
        
        if (row.productEstWeight) {
          const weightStr = String(row.productEstWeight);
          const weightMatch = weightStr.match(/^([\d.]+)\s*([a-zA-Z]*)/);
          if (weightMatch) {
            productEstWeight = parseFloat(weightMatch[1]);
            productEstWeightUnit = weightMatch[2] || 'kg';
          }
        }
          templateDetails.push({
            Sno: index + 1,
            SheetName: String(sheet.name || ''),
            // Save column names (not IDs) to database - ensure all are strings
            Planner: String(row.planner || ''),
            Customer: String(row.customer || ''),
            PickupLocation: String(row.pickupLocation || ''),
            Product: String(row.product || ''),
            ProductType: String(row.productType || ''),
            CollectionTime: String(row.collectionTime || ''),
            DeliveryLocation: String(row.deliveryLocation || ''),
            ScheduledTime: String(row.scheduledTime || ''),
            Driver: String(row.driverName || ''),
            Vehicle: String(row.vehicle || ''),
            TrailerInType: String(row.trailerInType || ''),
            TrailerOut: String(row.trailerOut || ''),
            TrailerIn: String(row.trailerIn || ''),
            Status: String(row.status || ''),
            ProductEstWeight: productEstWeight || null,
            ProductEstWeightUnits: String(productEstWeightUnit || 'kg'),
            WeightUnit: String(row.weightUnit || ''),
            ChangeoverLocation: String(row.changeoverLocation || ''),
            ChangeoverMessage: String(row.changeoverMessage || ''),
            Notes: String(row.notes || '')
          });
        });
      }
    });

    // Prepare final model
    const model: any = {
      TemplateMaster: {
        TemplateID: this.currentTemplateID || 0,  // 0 for new template
        TemplateName: templateName,
        EmployeeId: employeeId,
        CreatedBy: String(employeeId)  // Send employee ID as string
      },
      TemplateSheetDetails: templateSheetDetails,
      TemplateDetails: templateDetails
    };

    // Call API to save
    this.temServ.saveTemplateWithDetails(model).then((res: any) => {
      
      // Check for success - API may return success, result, or be truthy with no error
     /* const isSuccess = res && (res.success || res.Success || res.result || res.Result || 
                               (res.templateID || res.TemplateID) || 
                               (typeof res === 'object' && !res.error && !res.Error && !res.message?.toLowerCase().includes('error')));
       */
      const isSuccess = res && res.success;
      if (isSuccess) {
        this.utilServ.toaster.next({ 
          type: customToaster.successToast, 
          message: `Template "${templateName}" saved successfully!` 
        });
        
        // Update currentTemplateID if returned
        const returnedTemplateId = res.templateID || res.TemplateID || res.result?.templateID || res.result?.TemplateID;
        if (returnedTemplateId) {
          this.currentTemplateID = returnedTemplateId;
        }
        
        // Clear template grid completely
        this.hasLoadedData = false;
        this.cancelImport();
        
        // Reload templates dropdown list
        this.loadTemplatesByPlannerID();
      } else {
        // Check if there are validation errors
        if (res?.errors && Array.isArray(res.errors) && res.errors.length > 0) {
          // Show validation errors in custom modal
          this.showValidationErrors(res.errors);
        } else {
          // Show generic error in popup dialog
          const errorMessage = res?.message || res?.Message || res?.error || res?.Error || 'Failed to save template. Please try again.';
          
          let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
            width: '500px',
            maxHeight: '80vh',
            data: { 
              type: messageBox.cancelMessageBox, 
              message: errorMessage,
              title: 'Error Saving Template' 
            },
            disableClose: false,
            autoFocus: false,
            panelClass: 'custom-msg-box'
          });
        }
      }
    }).catch(error => {
      console.error('❌ Error saving template:', error);
      
      // Check if error has validation errors array
      if (error?.error?.errors && Array.isArray(error.error.errors) && error.error.errors.length > 0) {
        this.showValidationErrors(error.error.errors);
      } else {
        // Show generic error in popup dialog  
        const errorMessage = error?.message || error?.error?.message || error?.error?.Message || 'An unexpected error occurred while saving the template.';
        
        let dialogRef = this.dialog.open(CustomMessageBoxComponent, {
          width: '500px',
          maxHeight: '80vh',
          data: { 
            type: messageBox.cancelMessageBox, 
            message: errorMessage,
            title: 'Error Saving Template' 
          },
          disableClose: false,
          autoFocus: false,
          panelClass: 'custom-msg-box'
        });
      }
    });
  }

  // Show validation errors in a formatted modal
  showValidationErrors(errors: any[]) {
    this.validationErrorList = errors;
    
    // Group errors by sheet name
    this.groupedValidationErrors = new Map();
    errors.forEach(error => {
      const sheetName = error.sheetName || 'Unknown Sheet';
      if (!this.groupedValidationErrors.has(sheetName)) {
        this.groupedValidationErrors.set(sheetName, []);
      }
      this.groupedValidationErrors.get(sheetName)!.push(error);
    });
    
    this.showValidationErrorModal = true;
  }

  // Close validation error modal
  closeValidationErrorModal() {
    this.showValidationErrorModal = false;
    this.validationErrorList = [];
    this.groupedValidationErrors = new Map();
  }

  // Get unique missing values summary
  getUniqueMissingValues(): Map<string, Set<string>> {
    const uniqueValues = new Map<string, Set<string>>();
    
    this.validationErrorList.forEach(error => {
      const column = error.columnName || 'Unknown';
      if (!uniqueValues.has(column)) {
        uniqueValues.set(column, new Set());
      }
      if (error.providedValue) {
        uniqueValues.get(column)!.add(error.providedValue);
      }
    });
    
    return uniqueValues;
  }

  cancelImport() {
    // Clear template ID
    this.currentTemplateID = null;
    this.selectedTemplate = '';
    this.selectedTemplateName = '';
    
    // Clear all data and reset to initial state
    if (this.customPaginator) {
      this.customPaginator.clearAllSheets();
    }
    this.templateList = [];
    this.temServ.templateList = [];
    this.hasLoadedData = false;
    this.selectedTemplateType = '';
    
    // Clear customer data cache
    this.loadedCustomerIds.clear();
    
    this.cdr.detectChanges();
  }

  // Import Excel data - FAST import without blocking enrichment
  // Process sheet data synchronously - just map data, defer ID resolution
  processSheetDataSync(sheetData: any[], sheetIndex: number, sheetName: string): any[] {
    const mappedData: any[] = [];
    const totalRows = sheetData.length;
    const timestamp = new Date().toISOString();
    
    // Process all rows at once - NO enrichment during import for speed
    for (let i = 0; i < totalRows; i++) {
      const row = sheetData[i];
      mappedData.push({
        ...row,
        orderTemplateID: row.orderTemplateID || `imported_${sheetIndex}_${i}`,
        orderTemplateName: row.orderTemplateName || sheetName,
        orderTemplateDate: row.orderTemplateDate || timestamp,
        checked: false,
        no: (i + 1).toString().padStart(2, '0'),
        validationErrors: [],
        rowKey: `${sheetName}_${i}`
      });
    }
    
    return mappedData;
  }
  
  // Enrich rows with IDs in background after import completes
  private async enrichRowsInBackground(rows: any[]): Promise<void> {
    // Use requestIdleCallback or setTimeout to not block UI
    const batchSize = 50;
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      batch.forEach(row => this.enrichRowWithIds(row));
      // Yield to browser between batches
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  
  // Enrich a row by matching names to IDs from dropdown options
  private enrichRowWithIds(row: any): void {
    const unmatchedFields: string[] = [];
    
    // CRITICAL: Process customer FIRST so we have customerId for dependent fields
    const customerMapping = this.fieldMappings['customer'];
    const customerName = row[customerMapping.nameField];
    const customerId = row[customerMapping.idField];
    
    if (customerName && !customerId) {
      const foundCustomer = this.findOptionByNameFast('customer', customerName, null);
      if (foundCustomer) {
        row[customerMapping.idField] = foundCustomer.value;
        row[customerMapping.nameField] = foundCustomer.name;
      }
    }
    
    // Now get the resolved customerId for dependent field lookups
    const resolvedCustomerId = row.customerId ? Number(row.customerId) : null;
    
    // Process all other fields (skip customer since already processed)
    const fieldKeys = Object.keys(this.fieldMappings);
    
    for (const field of fieldKeys) {
      if (field === 'customer') continue; // Already processed
      
      const mapping = this.fieldMappings[field];
      const nameValue = row[mapping.nameField];
      const idValue = row[mapping.idField];
      
      // Skip if both name and ID already exist
      if (idValue && nameValue) {
        continue;
      }
      
      // If we have an ID but no name, try to get the name from options
      if (idValue && !nameValue) {
        const options = (this as any)[mapping.options];
        const foundOption = this.findOptionById(options, idValue);
        if (foundOption) {
          row[mapping.nameField] = foundOption.name;
        }
        continue;
      }
      
      // If name exists but ID is missing, try to resolve it
      if (nameValue && !idValue) {
        const foundOption = this.findOptionByNameFast(field, nameValue, resolvedCustomerId);
        
        if (foundOption) {
          // Found match: Set the ID
          row[mapping.idField] = foundOption.value;
          row[mapping.nameField] = foundOption.name; // Normalize name
        } else {
          // Track unmatched field for validation error
          unmatchedFields.push(`${field}="${nameValue}"`);
          
          // Add to row's validation errors
          if (!row.validationErrors) {
            row.validationErrors = [];
          }
          row.validationErrors.push(`Invalid ${field}: "${nameValue}" not found in system`);
        }
      }
    }
  }
  
  validateAndEnrichRow(row: any, rowIndex: number, sheetName: string): any {
    const enrichedRow = { 
      ...row, 
      validationErrors: [],
      rowKey: `${sheetName}_${rowIndex}`
    };
    
    // Validate and enrich each field using fast lookup maps
    const fieldKeys = Object.keys(this.fieldMappings);
    for (let i = 0; i < fieldKeys.length; i++) {
      const field = fieldKeys[i];
      const mapping = this.fieldMappings[field];
      const nameValue = row[mapping.nameField];

      if (nameValue && nameValue !== '' && nameValue !== '-') {
        const foundOption = this.findOptionByNameFast(field, nameValue);
        if (foundOption) {
          // Valid: Set both ID and name
          enrichedRow[mapping.idField] = foundOption.value;
          enrichedRow[mapping.nameField] = foundOption.name;
        } else {
          // Invalid: Keep name but flag as error
          enrichedRow[mapping.nameField] = nameValue;
          enrichedRow[mapping.idField] = null;
          enrichedRow.validationErrors.push(`Invalid ${field}: "${nameValue}"`);
        }
      }
    }
    
    // Track validation errors globally (only if errors exist)
    if (enrichedRow.validationErrors.length > 0) {
      this.validationErrors.set(enrichedRow.rowKey, enrichedRow.validationErrors);
    }
    
    return enrichedRow;
  }
  
  // Show validation summary dialog
  showValidationSummary() {
    if (this.validationErrors.size > 0) {
      let errorMessage = `Found ${this.validationErrors.size} row(s) with validation errors:\n\n`;
      let count = 0;
      this.validationErrors.forEach((errors, rowKey) => {
        if (count < 10) { // Show first 10 errors
          errorMessage += `${rowKey}: ${errors.join(', ')}\n`;
          count++;
        }
      });
      if (this.validationErrors.size > 10) {
        errorMessage += `\n... and ${this.validationErrors.size - 10} more errors.`;
      }
      errorMessage += `\n\nThese rows will be highlighted. Please correct them before saving.`;
      
      this.utilServ.toaster.next({ 
        type: customToaster.warningToast, 
        message: 'Data validation completed with errors. Check console for details.' 
      });
      console.warn(errorMessage);
    }
  }

  async onImportCompleted(event: {file: File, sheets: {name: string, data: any[]}[]}) {
    const importStart = performance.now();
    
    // Check if we have sheets data
    if (!event.sheets || event.sheets.length === 0) {
      this.utilServ.toaster.next({ 
        type: customToaster.errorToast, 
        message: 'No data found in Excel file!' 
      });
      return;
    }
    
    // Show processing indicator immediately
    this.utilServ.toaster.next({ 
      type: customToaster.infoToast, 
      message: 'Importing Excel file...' 
    });
    
    // Clear previous validation errors
    this.validationErrors.clear();
    
    const processStart = performance.now();
    
    // Process each sheet and add it to the custom paginator - NO API CALLS during import
    if (this.customPaginator) {
      // Clear existing sheets first
      this.customPaginator.clearAllSheets();
      
      // Process ALL sheets synchronously - fast import without delays
      const totalSheets = event.sheets.length;
      
      for (let sheetIndex = 0; sheetIndex < totalSheets; sheetIndex++) {
        const sheet = event.sheets[sheetIndex];
        
        // Import rows synchronously (no validation = instant)
        const mappedData = this.processSheetDataSync(sheet.data, sheetIndex, sheet.name);
        
        // Add sheet with imported data
        this.customPaginator.addSheetWithData(sheet.name, mappedData);
      }
      
      // Set the first sheet as active
      this.customPaginator.activeSheetIndex = 0;
      
      // Get the updated templateList from the active sheet
      const activeSheetData = this.customPaginator.getActiveSheetData();
      
      if (activeSheetData && activeSheetData.length > 0) {
        this.templateList = activeSheetData; // Use reference directly - no copy needed
        this.length = this.templateList.length;
        this.totalPages = this.templateList.length;
        this.currentPage = 1;
        this.temServ.templateList = this.templateList;
        this.hasLoadedData = true;
        this.cdr.detectChanges();
      }
      
      console.log(`[PERF] TOTAL IMPORT TIME: ${(performance.now() - processStart).toFixed(0)}ms`);
      
      // Show success message
      const totalRows = event.sheets.reduce((sum, sheet) => sum + sheet.data.length, 0);
      this.utilServ.toaster.next({ 
        type: customToaster.successToast, 
        message: `✅ ${event.sheets.length} sheet(s) imported with ${totalRows} rows!` 
      });
      
      // Load dropdown data in background (non-blocking)
      this.loadDropdownDataInBackground();
      
    } else {
      // Fallback: Load only the first sheet's data directly
      const firstSheet = event.sheets[0];
      const mappedData = firstSheet.data.map((row, index) => {
        return {
          ...row,
          orderTemplateID: row.orderTemplateID || `imported_${index}_${Date.now()}`,
          orderTemplateName: row.orderTemplateName || firstSheet.name,
          orderTemplateDate: row.orderTemplateDate || new Date().toISOString(),
          checked: false
        };
      });
      
      this.templateList = mappedData;
      this.length = this.templateList.length;
      this.totalPages = this.templateList.length;
      this.currentPage = 1;
      this.temServ.templateList = this.templateList;
      this.hasLoadedData = true;
      
      this.utilServ.toaster.next({ 
        type: customToaster.successToast, 
        message: `${mappedData.length} rows imported!` 
      });
      
      // Load dropdown data in background
      this.loadDropdownDataInBackground();
    }
    
    // Close the modal
    setTimeout(() => {
      this.showImportModal = false;
    }, 100);
  }

  // Helper method to find option by name (case-insensitive)
  // Fast lookup using Maps (O(1) instead of O(n))
  findOptionByNameFast(field: string, name: string, customerId?: any): any {
    if (!name) return null;
    const nameLower = name.toString().toLowerCase().trim();
    
    // For customer-dependent fields, use customer-specific fast lookup maps
    if (customerId) {
      const numericCustomerId = Number(customerId);
      
      if (field === 'product') {
        const productLookup = this.customerProductLookupMap.get(numericCustomerId);
        if (productLookup) {
          const found = productLookup.get(nameLower);
          if (found) return found;
        }
      }
       
      //|| field === 'deliveryLocation' 
      if (field === 'pickupLocation' || field === 'changeoverLocation') {
        const locationLookup = this.customerLocationLookupMap.get(numericCustomerId);
        if (locationLookup) {
          const found = locationLookup.get(nameLower);
          if (found) return found;
        }
      }
    }
    
    // Use appropriate lookup map based on field
    let lookup: Map<string, any>;
    switch(field) {
      case 'planner': lookup = this.plannerLookup; break;
      case 'customer': lookup = this.customerLookup; break;
      case 'product': lookup = this.productLookup; break;
      case 'vehicle': lookup = this.vehicleLookup; break;
      case 'driverName': lookup = this.driverLookup; break;
      case 'status': lookup = this.statusLookup; break;
      case 'trailerIn': lookup = this.trailerLookup; break;
      case 'trailerOut': lookup = this.trailerOutLookup; break;
      case 'productType': lookup = this.productTypeLookup; break;
      case 'trailerInType': lookup = this.trailerTypeLookup; break;
      case 'trailerOutType': lookup = this.trailerOutTypeLookup; break;
      case 'deliveryLocation': lookup = this.deliveryLocationLookup; break;
      case 'pickupLocation': case 'changeoverLocation':  //case 'deliveryLocation': 
        lookup = this.locationLookup; break;
      default: 
        // For fields without lookup maps, get the actual options array
        const mapping = this.fieldMappings[field];
        if (mapping && mapping.options) {
          const optionsArray = (this as any)[mapping.options];
          return this.findOptionByName(optionsArray, name);
        }
        return null;
    }
    
    // Check if lookup exists and has data
    if (lookup && lookup.size > 0) {
      const result = lookup.get(nameLower);
      // If result is an array (duplicate names), try to match by customer
      if (Array.isArray(result) && customerId) {
        const customerMatch = result.find((r: any) => r.customerId == customerId);
        if (customerMatch) {
          return customerMatch;
        }
        // Return first match if no customer match
        return result[0];
      }
      return result || null;
    }
    
    // Fallback to array search if lookup is empty
    const mapping = this.fieldMappings[field];
    if (mapping && mapping.options) {
      const optionsArray = (this as any)[mapping.options];
      return this.findOptionByName(optionsArray, name);
    }
    
    return null;
  }
  
  // Fallback to old method (for compatibility)
  findOptionByName(options: any[], name: string): any {
    if (!name || !options || !Array.isArray(options) || options.length === 0) return null;
    const nameLower = name.toString().toLowerCase().trim();
    return options.find((opt: any) => 
      opt.name && opt.name.toLowerCase().trim() === nameLower
    );
  }
  
  // Helper method to find option by ID
  findOptionById(options: any[], id: any): any {
    if (id === null || id === undefined || id === '' || !options || options.length === 0) return null;
    // Convert both to string for comparison to handle type mismatches
    const idStr = String(id);
    return options.find((opt: any) => String(opt.value) === idStr);
  }

  // Helper method to extract numeric values from strings
  private extractNumber(value: any): number {
    if (!value) return 0;
    const numStr = value.toString().replace(/[^\d.]/g, '');
    return parseFloat(numStr) || 0;
  }

  // Helper method to get product name from value
  getProductName(value: string): string {
    if (!value) return '';
    const product = this.productOptions.find(option => option.value === value);
    return product ? product.name : value;
  }

  // Helper method to get formatted row number
  getRowNumber(index: number): string {
    const rowNum = index + 1;
    return rowNum.toString().padStart(2, '0');
  }

  // Helper method to format datetime-local value for display
  formatDateTime(dateTimeValue: string): string {
    if (!dateTimeValue) return '-';
    
    try {
      // If it's already in datetime-local format (YYYY-MM-DDTHH:mm), parse and format
      const date = new Date(dateTimeValue);
      if (isNaN(date.getTime())) {
        return dateTimeValue; // Return as-is if invalid date
      }
      
      // Format as DD/MM/YYYY, HH:mm AM/PM
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12
      
      return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
    } catch (e) {
      return dateTimeValue;
    }
  }

  // Method to renumber all rows after add/delete operations
  private renumberRows(): void {
    this.templateList.forEach((item: any, index: number) => {
      item.no = this.getRowNumber(index);
    });
  }

  // Helper method to get template value with fallbacks
  getTemplateValue(template: any, field: string): string {
    // First, try the exact field name
    if (template[field] !== undefined && template[field] !== null && template[field] !== '') {
      return template[field];
    }
    
    // Try common variations
    const variations: { [key: string]: string[] } = {
      'no': ['no', 'number', 'id', 'sno', 's.no', 'serial'],
      'planner': ['planner', 'plannedby', 'plan'],
      'customer': ['customer', 'client', 'customername'],
      'product': ['product', 'material', 'productname'],
      'pickupLocation': ['pickuplocation', 'location', 'pickup', 'from'],
      'vehicle': ['vehicle', 'truck', 'vehicleno'],
      'driverName': ['drivername', 'driver', 'driverdetails'],
      'status': ['status', 'orderstatus'],
      'trailerIn': ['trailerin', 'trailer', 'trailerno'],
      'productEstWeight': ['productestweight', 'weight', 'estweight'],
      'productType': ['producttype', 'type', 'materialtype'],
      'trailerInType': ['trailerintype', 'trailertype'],
      'changeoverLocation': ['changeoverlocation', 'changeover', 'changelocation']
    };
    
    const fieldVariations = variations[field] || [field];
    for (const variation of fieldVariations) {
      const lowerVariation = variation.toLowerCase().replace(/\s+/g, '');
      for (const key in template) {
        const lowerKey = key.toLowerCase().replace(/\s+/g, '');
        if (lowerKey === lowerVariation && template[key] !== null && template[key] !== undefined && template[key] !== '') {
          return template[key];
        }
      }
    }
    
    return '-';
  }



  // Excel sheet methods
  addSheet() {
    const newSheetName = `Sheet ${this.sheets.length + 1}`;
    this.sheets.push({
      name: newSheetName,
      data: [...this.templateList] // Copy current template list
    });
    this.activeSheetIndex = this.sheets.length - 1;
  }

  selectSheet(index: number) {
    this.activeSheetIndex = index;
    // Load sheet-specific data if needed
  }

  navigateSheets(direction: 'prev' | 'next' | 'first' | 'last') {
    switch (direction) {
      case 'first':
        this.activeSheetIndex = 0;
        break;
      case 'prev':
        if (this.activeSheetIndex > 0) this.activeSheetIndex--;
        break;
      case 'next':
        if (this.activeSheetIndex < this.sheets.length - 1) this.activeSheetIndex++;
        break;
      case 'last':
        this.activeSheetIndex = this.sheets.length - 1;
        break;
    }
  }

  onItemsPerPageChange(event: any) {
    this.pageSize = parseInt(event.target.value);
    this.pageNumber = 1; // Reset to first page
    this.currentPage = 1;
    this.getAllTemplates();
  }

  // Excel download functionality
  downloadExcelTemplate(filename: string) {
    // Construct the path to the Excel file in assets/template folder
    const filePath = `assets/template/${filename}`;
    
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = filePath;
    link.download = filename;
    link.style.display = 'none';
    
    // Add to DOM, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Export table data to Excel
  exportToExcel() {
    // Define column order to match table display order
    const columnOrder = [
      { key: 'no', label: 'No' },
      { key: 'planner', label: 'Planner' },
      { key: 'customer', label: 'Customer' },
      { key: 'pickupLocation', label: 'Pickup Location' },
      { key: 'product', label: 'Product' },
      { key: 'productType', label: 'Product Type' },
      { key: 'collectionTime', label: 'Collection Time' },
      { key: 'deliveryLocation', label: 'Delivery Location' },
      { key: 'scheduledTime', label: 'Scheduled Time' },
      { key: 'driverName', label: 'Driver' },
      { key: 'vehicle', label: 'Vehicle' },
      { key: 'trailerInType', label: 'Trailer Type' },
      { key: 'trailerOut', label: 'Trailer Out' },
      { key: 'trailerIn', label: 'Trailer In' },
      { key: 'status', label: 'Status' },
      { key: 'productEstWeight', label: 'Product Est Weight' },
      { key: 'changeoverLocation', label: 'Changeover Location' },
      { key: 'changeoverMessage', label: 'Changeover Message' },
      { key: 'notes', label: 'Notes' }
    ];

    // Check if we have sheets in paginator
    if (this.customPaginator && this.customPaginator.sheets && this.customPaginator.sheets.length > 0) {
      try {
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        
        // Export each sheet
        this.customPaginator.sheets.forEach((sheet: any) => {
          const sheetData = sheet.data || [];
          
          if (sheetData.length === 0) {
            return;
          }
          
          // Map data following column order
          const exportData = sheetData.map((item: any) => {
            const row: any = {};
            columnOrder.forEach(col => {
              if (col.key === 'productEstWeight') {
                row[col.label] = (item.productEstWeight || '') + (item.weightUnit ? ' ' + item.weightUnit : '');
              } else {
                row[col.label] = item[col.key] || '';
              }
            });
            return row;
          });
          
          // Create worksheet for this sheet
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          
          // Sanitize sheet name (Excel has restrictions)
          const sanitizedSheetName = sheet.name.replace(/[\\/:*?"<>|]/g, '_').substring(0, 31);
          
          // Add worksheet to workbook
          XLSX.utils.book_append_sheet(wb, ws, sanitizedSheetName);
        });
        
        // Generate filename with current date
        const now = new Date();
        const dateStr = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}`;
        const fileName = `template_export_${dateStr}.xlsx`;
        
        // Save file
        XLSX.writeFile(wb, fileName);
        
        this.utilServ.toaster.next({ 
          type: customToaster.successToast, 
          message: `Excel file with ${this.customPaginator.sheets.length} sheet(s) exported successfully` 
        });
      } catch (error) {
        console.error('Export to Excel failed:', error);
        this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Failed to export Excel file' });
      }
    } else if (this.templateList && this.templateList.length > 0) {
      // Fallback: Export single sheet if no paginator
      try {
        const exportData = this.templateList.map((item: any) => {
          const row: any = {};
          columnOrder.forEach(col => {
            if (col.key === 'productEstWeight') {
              row[col.label] = (item.productEstWeight || '') + (item.weightUnit ? ' ' + item.weightUnit : '');
            } else {
              row[col.label] = item[col.key] || '';
            }
          });
          return row;
        });
        
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Template Data');
        
        const now = new Date();
        const dateStr = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}`;
        const fileName = `template_export_${dateStr}.xlsx`;
        XLSX.writeFile(wb, fileName);
        
        this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Excel file exported successfully' });
      } catch (error) {
        console.error('Export to Excel failed:', error);
        this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Failed to export Excel file' });
      }
    } else {
      this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'No data to export' });
    }
  }

  // Export table data to CSV
  exportToCSV() {
    // Define column order to match table display order
    const columnOrder = [
      { key: 'no', label: 'No' },
      { key: 'planner', label: 'Planner' },
      { key: 'customer', label: 'Customer' },
      { key: 'pickupLocation', label: 'Pickup Location' },
      { key: 'product', label: 'Product' },
      { key: 'productType', label: 'Product Type' },
      { key: 'collectionTime', label: 'Collection Time' },
      { key: 'deliveryLocation', label: 'Delivery Location' },
      { key: 'scheduledTime', label: 'Scheduled Time' },
      { key: 'driverName', label: 'Driver' },
      { key: 'vehicle', label: 'Vehicle' },
      { key: 'trailerInType', label: 'Trailer Type' },
      { key: 'trailerOut', label: 'Trailer Out' },
      { key: 'trailerIn', label: 'Trailer In' },
      { key: 'status', label: 'Status' },
      { key: 'productEstWeight', label: 'Product Est Weight' },
      { key: 'changeoverLocation', label: 'Changeover Location' },
      { key: 'changeoverMessage', label: 'Changeover Message' },
      { key: 'notes', label: 'Notes' }
    ];

    // Check if we have sheets in paginator
    if (this.customPaginator && this.customPaginator.sheets && this.customPaginator.sheets.length > 0) {
      try {
        let allCsvContent = '';
        
        // Export each sheet
        this.customPaginator.sheets.forEach((sheet: any, sheetIndex: number) => {
          const sheetData = sheet.data || [];
          
          if (sheetData.length === 0) {
            return;
          }
          
          // Add sheet header
          if (sheetIndex > 0) {
            allCsvContent += '\n\n'; // Separator between sheets
          }
          allCsvContent += `Sheet: ${sheet.name}\n`;
          
          // Map data following column order
          const exportData = sheetData.map((item: any) => {
            const row: any = {};
            columnOrder.forEach(col => {
              if (col.key === 'productEstWeight') {
                row[col.label] = (item.productEstWeight || '') + (item.weightUnit ? ' ' + item.weightUnit : '');
              } else {
                row[col.label] = item[col.key] || '';
              }
            });
            return row;
          });
          
          // Create CSV content for this sheet using column order
          const headers = columnOrder.map(col => col.label);
          const sheetCsvContent = [
            headers.join(','), // Header row
            ...exportData.map((row: any) => 
              headers.map(header => {
                const value = row[header] || '';
                // Escape commas and quotes in CSV
                return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
                  ? `"${value.replace(/"/g, '""')}"` 
                  : value;
              }).join(',')
            )
          ].join('\n');
          
          allCsvContent += sheetCsvContent;
        });
        
        // Create blob and download
        const blob = new Blob([allCsvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          const now = new Date();
          const dateStr = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}`;
          link.setAttribute('href', url);
          link.setAttribute('download', `template_export_${dateStr}.csv`);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        
        this.utilServ.toaster.next({ 
          type: customToaster.successToast, 
          message: `CSV file with ${this.customPaginator.sheets.length} sheet(s) exported successfully` 
        });
      } catch (error) {
        console.error('Export to CSV failed:', error);
        this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Failed to export CSV file' });
      }
    } else if (this.templateList && this.templateList.length > 0) {
      // Fallback: Export single sheet if no paginator
      try {
        const exportData = this.templateList.map((item: any) => {
          const row: any = {};
          columnOrder.forEach(col => {
            if (col.key === 'productEstWeight') {
              row[col.label] = (item.productEstWeight || '') + (item.weightUnit ? ' ' + item.weightUnit : '');
            } else {
              row[col.label] = item[col.key] || '';
            }
          });
          return row;
        });
        
        // Use column order for headers
        const headers = columnOrder.map(col => col.label);
        const csvContent = [
          headers.join(','),
          ...exportData.map((row: any) => 
            headers.map(header => {
              const value = row[header] || '';
              return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
                ? `"${value.replace(/"/g, '""')}"` 
                : value;
            }).join(',')
          )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          const now = new Date();
          const dateStr = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}`;
          link.setAttribute('href', url);
          link.setAttribute('download', `template_export_${dateStr}.csv`);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        
        this.utilServ.toaster.next({ type: customToaster.successToast, message: 'CSV file exported successfully' });
      } catch (error) {
        console.error('Export to CSV failed:', error);
        this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Failed to export CSV file' });
      }
    } else {
      this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'No data to export' });
    }
  }

  // Handle dropdown change - updates both ID and name
  onDropdownChange(rowIndex: number, field: string, selectedId: any, templateObj?: any) {
    // Mark that dropdown change is in progress (prevents stopEdit from clearing)
    this.dropdownChangeInProgress = true;
    
    // Use the passed template object if available, otherwise get from templateList
    const row = templateObj || this.templateList[rowIndex];
    
    // Handle empty selection (user selected "Select...")
    if (selectedId === '' || selectedId === null || selectedId === undefined) {
      const mapping = this.fieldMappings[field];
      if (mapping && row) {
        row[mapping.idField] = null;
        row[mapping.nameField] = '';
        this.templateList = [...this.templateList];
        this.cdr.detectChanges();
      }
      this.dropdownChangeInProgress = false;
      return;
    }
    
    const mapping = this.fieldMappings[field];
    if (!mapping) {
      console.warn(`⚠️ No mapping found for field: ${field}`);
      this.dropdownChangeInProgress = false;
      return;
    }
    
    // Check if row exists
    if (!row) {
      console.warn(`⚠️ Row not found at index: ${rowIndex}`);
      this.dropdownChangeInProgress = false;
      return;
    }
    
    // For product field, search in customer-specific products
    let selected = null;
    if (field === 'product' && row.customerId) {
      const customerId = Number(row.customerId);
      const numericSelectedId = Number(selectedId);
      
      // First try to find in the current productOptions (which are loaded for this customer)
      selected = this.productOptions.find((p: any) => Number(p.value) === numericSelectedId);
      
      // If not found, try customerProductsMap
      if (!selected) {
        const customerProducts = this.getCustomerProducts(customerId);
        selected = customerProducts.find((p: any) => Number(p.value) === numericSelectedId);
      }
      
      if (!selected) {
        // Product not found with ID
      }
    } else {
      const options = (this as any)[mapping.options];
      selected = this.findOptionById(options, selectedId);
    }
    
    if (selected) {
      // Update both ID and name in the row directly
      row[mapping.idField] = selected.value;
      row[mapping.nameField] = selected.name;
      
      // Auto-populate productType when product is selected
      if (field === 'product' && selected) {
        let productTypeName = selected.productType || '';
        let productTypeId = selected.productTypeId || null;
        
        // If we have productTypeId but no name, look it up from productTypeOptions
        if (productTypeId && !productTypeName && this.productTypeOptions.length > 0) {
          const productTypeOption = this.productTypeOptions.find((pt: any) => 
            Number(pt.value) === Number(productTypeId)
          );
          if (productTypeOption) {
            productTypeName = productTypeOption.name;
          }
        }
        
        if (productTypeName) {
          row.productType = productTypeName;
          row.productTypeId = productTypeId;
        } else {
          // Clear productType if product doesn't have one
          row.productType = '';
          row.productTypeId = null;
        }
      }
      
      // Clear validation error for this field
      const rowKey = `${row.sheetName || 'sheet'}_${rowIndex}`;
      if (this.validationErrors.has(rowKey)) {
        const errors = this.validationErrors.get(rowKey)!.filter(
          err => !err.includes(field)
        );
        if (errors.length === 0) {
          this.validationErrors.delete(rowKey);
        } else {
          this.validationErrors.set(rowKey, errors);
        }
      }
      
      // If customer changed, reload dependent dropdowns and clear dependent fields
      if (field === 'customer') {
        // Clear dependent fields when customer changes
        row.productId = null;
        row.product = '';
        row.pickupLocationId = null;
        row.pickupLocation = '';
        row.deliveryLocationId = null;
        row.deliveryLocation = '';
        row.changeoverLocationId = null;
        row.changeoverLocation = '';
        
        this.loadCustomerDependentData(selectedId, rowIndex);
      }
      
      // Update sheet data in paginator
      if (this.customPaginator) {
        this.customPaginator.updateActiveSheetData(this.templateList);
      }
      
      // Force Angular to detect changes by creating a new array reference
      this.templateList = [...this.templateList];
      
      // Force change detection
      this.cdr.detectChanges();
    } else {
      console.warn(`⚠️ No option found for selectedId: ${selectedId} in field: ${field}`);
    }
    
    // Reset the flag after change is complete
    this.dropdownChangeInProgress = false;
  }
  
  // Load all dropdowns that depend on customer selection
  // Cache to track which customers have already been loaded
  private loadedCustomerIds: Set<number> = new Set();
  
  async loadCustomerDependentData(customerId: any, rowIndex?: number, skipChangeDetection: boolean = false): Promise<void> {
    if (!customerId) return;
    
    const numericCustomerId = Number(customerId);
    
    // Skip if already loaded (cache hit)
    if (this.loadedCustomerIds.has(numericCustomerId)) {
      return;
    }
    
    try {
      // Load all customer-dependent dropdowns in parallel
      await Promise.all([
        this.loadCustomerProducts(numericCustomerId),
        this.loadCustomerLocations(numericCustomerId) 
      ]);
      
      // Mark as loaded
      this.loadedCustomerIds.add(numericCustomerId);
      
      // Only trigger change detection if not in bulk mode
      if (!skipChangeDetection) {
        this.cdr.detectChanges();
      }
      
      // If editing a specific row, clear dependent fields that are now invalid
      if (rowIndex !== undefined) {
        this.clearInvalidCustomerDependentFields(rowIndex);
      }
    } catch (error) {
      console.error('Error loading customer-dependent data:', error);
    }
  }
  
  // Clear fields that are no longer valid after customer change
  clearInvalidCustomerDependentFields(rowIndex: number) {
    const row = this.templateList[rowIndex];
    const fieldsToCheck = [
      'product', 'productType', 'pickupLocation', 'driverName', 'trailerIn', 
      'trailerInType', 'changeoverLocation', 'deliveryLocation',
      'trailerOut', 'trailerOutType'
    ];
    
    fieldsToCheck.forEach(field => {
      const mapping = this.fieldMappings[field];
      if (mapping && row[mapping.idField]) {
        const options = (this as any)[mapping.options];
        const isValid = this.findOptionById(options, row[mapping.idField]);
        if (!isValid) {
          // Clear invalid field
          row[mapping.idField] = null;
          row[mapping.nameField] = '';
        }
      }
    });
  }

  // Editable cell methods
  async startEdit(rowIndex: number, field: string, event: Event) {
    event.stopPropagation();
    
    const customerId = this.templateList[rowIndex].customerId ? Number(this.templateList[rowIndex].customerId) : null;
    
    // Load dropdown data based on field type
    switch(field) {
      case 'planner':
        if (this.plannerOptions.length === 0) {
          await this.loadPlannerOptions();
        }
        break;
        
      case 'customer':
        if (this.customerOptions.length === 0) {
          await this.loadCustomerOptions();
        }
        break;
        
      case 'product':
        if (customerId) {
          await this.loadCustomerProducts(customerId);
          this.productOptions = this.getCustomerProducts(customerId);
          
          // Also ensure productTypeOptions are loaded for looking up productType names
          if (this.productTypeOptions.length === 0) {
            await this.loadProductTypeOptions();
          }
        } else {
          this.productOptions = [];
        }
        break;
        
      case 'pickupLocation':
      //case 'changeoverLocation':
      //case 'deliveryLocation':
        if (customerId) {
          await this.loadCustomerLocations(customerId);
          const locations = this.getCustomerLocations(customerId);
          this.pickupLocationOptions = [...locations];
         // this.changeoverLocationOptions = [...locations];
          //this.deliveryLocationOptions = [...locations];
          this.cdr.detectChanges();
        } else {
          this.pickupLocationOptions = [];
          //this.changeoverLocationOptions = [];
          //this.deliveryLocationOptions = [];
        }
        break;
        
      case 'changeoverLocation':
        if (this.changeoverLocationOptions.length === 0) {
          await this.loadChangeoverLocationOptions();
        }
        break;

       case 'deliveryLocation':
        if (this.deliveryLocationOptions.length === 0) {
          await this.loadDeliveryLocationOptions();
        }
        break;

      case 'vehicle':
        if (this.vehicleOptions.length === 0) {
          await this.loadVehicleOptions();
        }
        break;
        
      case 'driverName':
        if (this.driverOptions.length === 0) {
          await this.loadDriverOptions();
        }
        break;
        
      case 'status':
        if (this.statusOptions.length === 0) {
          await this.loadStatusOptions();
          this.cdr.detectChanges();
        }
        break;
        
      case 'trailerIn':
        if (this.trailerOptions.length === 0) {
          await this.loadTrailerOptions();
        }
        break;
        
      case 'productType':
        if (this.productTypeOptions.length === 0) {
          await this.loadProductTypeOptions();
        }
        break;
        
      case 'trailerInType':
         if (this.trailerTypeOptions.length === 0) {
          await this.loadTrailerTypeOptions();
        }
        break;
        
      case 'trailerOut':
         if (this.trailerOptions.length === 0) {
          await this.loadTrailerOptions();
        }
        break;
        
      case 'trailerOutType':
         if (this.trailerTypeOptions.length === 0) {
          await this.loadTrailerTypeOptions();
        }
        break;
    }
    
    // Store original value for cancellation
    this.editingCell.originalValue = this.templateList[rowIndex][field];
    
    // Set editing state
    this.editingCell.rowIndex = rowIndex;
    this.editingCell.field = field;
    
    // Focus the input after change detection
    setTimeout(() => {
      const input = document.querySelector('input:focus, select:focus') as HTMLElement;
      if (input) {
        input.focus();
      }
    }, 0);
  }

  stopEdit() {
    // Use setTimeout to ensure any pending change events complete first
    setTimeout(() => {
      // Don't clear editing state if a dropdown change is in progress
      if (this.dropdownChangeInProgress) {
        // Try again shortly
        setTimeout(() => this.stopEdit(), 100);
        return;
      }
      
      // Clear editing state
      this.editingCell.rowIndex = null;
      this.editingCell.field = null;
      this.editingCell.originalValue = null;
      this.cdr.detectChanges();
    }, 100);
  }

  cancelEdit() {
    if (this.editingCell.rowIndex !== null && this.editingCell.field !== null) {
      // Restore original value
      this.templateList[this.editingCell.rowIndex][this.editingCell.field] = this.editingCell.originalValue;
    }
    this.stopEdit();
  }

  // Initialize dropdown options
  async loadTemplatesByPlannerID() {
    // Get planner ID from logged in user
    let user: any = localStorage.getItem('loggedInUser');
    
    if (user) {
      let parsedData = JSON.parse(user);
      let employeeId = parsedData.employeeId || parsedData.EmployeeId;
      
      if (employeeId) {
        try {
          const res: any = await this.temServ.getAllTemplatesByEmployeeId(employeeId);
          
          if (res && res.result && Array.isArray(res.result)) {
            // Map API response to template dropdown format
            this.availableTemplates = res.result.map((template: any) => ({
              name: template.templateName || template.TemplateName,
              value: template.templateID || template.TemplateID || template.templateId || template.TemplateId
            }));
            
            // Force change detection to update the UI
            this.cdr.detectChanges();
          } else if (res && Array.isArray(res)) {
            // Handle if result is directly an array
            this.availableTemplates = res.map((template: any) => ({
              name: template.templateName || template.TemplateName,
              value: template.templateID || template.TemplateID || template.templateId || template.TemplateId
            }));
            this.cdr.detectChanges();
          } else {
            this.availableTemplates = [];
            this.cdr.detectChanges();
          }
        } catch (error) {
          console.error('Error loading templates:', error);
          this.availableTemplates = [];
          this.cdr.detectChanges();
        }
      } else {
        this.availableTemplates = [];
      }
    } else {
      this.availableTemplates = [];
    }
  }

  // Flag to track if dropdown options are already loaded
  private dropdownOptionsLoaded: boolean = false;
  private dropdownOptionsLoading: Promise<void> | null = null;

  async initializeDropdownOptions() {
    // Skip if already loaded
    if (this.dropdownOptionsLoaded) {
      return;
    }
    
    // If already loading, wait for it to complete
    if (this.dropdownOptionsLoading) {
      return this.dropdownOptionsLoading;
    }
    
    // Load only master/global dropdown data (not customer-dependent)
    // Customer-dependent data will be loaded when customer is selected
    
    this.dropdownOptionsLoading = (async () => {
      try {
        // Load all master data in parallel
        await Promise.all([
          this.loadPlannerOptions(),
          this.loadCustomerOptions(),
          this.loadVehicleOptions(),
          this.loadStatusOptions(),
          this.loadProductTypeOptions(),
          this.loadDriverOptions(),
          this.loadTrailerOptions(),
          this.loadTrailerTypeOptions(),
          this.loadDeliveryLocationOptions(),
           this.loadChangeoverLocationOptions()
        ]);
        
        this.dropdownOptionsLoaded = true;
      } catch (error) {
        console.error('Error loading dropdown options:', error);
        this.utilServ.toaster.next({ 
          type: customToaster.errorToast, 
          message: 'Error loading dropdown data. Please refresh the page.' 
        });
      } finally {
        this.dropdownOptionsLoading = null;
      }
    })();
    
    await this.dropdownOptionsLoading;
    
    // Weight units - static data
    this.weightUnitOptions = [
      { value: 'kg', name: 'kg' },
      { value: 'g', name: 'g' },
      { value: 'ton', name: 'Tonnes' },
      { value: 'lb', name: 'lbs' },
      { value: 'oz', name: 'oz' }
    ];
  }
  
  // Load dropdown data in background after import (non-blocking)
  private loadDropdownDataInBackground(): void {
    // Don't await - fire and forget
    setTimeout(async () => {
      try {
        // Load master data if not already loaded
        if (!this.dropdownOptionsLoaded) {
          await this.initializeDropdownOptions();
        }
        
        // Extract unique customers from current data and load their dependent data
        const uniqueCustomerNames = new Set<string>();
        if (this.customPaginator && this.customPaginator.sheets) {
          this.customPaginator.sheets.forEach((sheet: any) => {
            if (sheet.data) {
              sheet.data.forEach((row: any) => {
                if (row.customer) {
                  uniqueCustomerNames.add(row.customer);
                }
              });
            }
          });
        }
        
        // Load customer data in parallel
        const customerLoadPromises: Promise<void>[] = [];
        for (const customerName of uniqueCustomerNames) {
          const foundCustomer = this.findOptionByNameFast('customer', customerName);
          if (foundCustomer) {
            customerLoadPromises.push(this.loadCustomerDependentData(foundCustomer.value, undefined, true));
          }
        }
        
        if (customerLoadPromises.length > 0) {
          await Promise.all(customerLoadPromises);
        }
        
        // Enrich all rows with IDs in background
        if (this.customPaginator && this.customPaginator.sheets) {
          for (const sheet of this.customPaginator.sheets) {
            if (sheet.data) {
              await this.enrichRowsInBackground(sheet.data);
            }
          }
        }
        
        console.log('[PERF] Background data loading complete');
      } catch (error) {
        console.error('Background data loading error:', error);
      }
    }, 100); // Small delay to let UI render first
  }
   
  // Load master data APIs
  async loadPlannerOptions() {
    // Skip if already loaded
    if (this.plannerOptions.length > 0) return;
    
    try {
      const res: any = await this.temServ.getAllPlanners();
      
      // Try multiple response formats
      let dataArray = null;
      if (res && res.result && Array.isArray(res.result)) {
        dataArray = res.result;
      } else if (res && Array.isArray(res)) {
        dataArray = res;
      } else if (res && res.data && Array.isArray(res.data)) {
        dataArray = res.data;
      }
      
      if (dataArray && dataArray.length > 0) {
        this.plannerOptions = dataArray.map((item: any) => ({
          value: item.plannerId || item.PlannerID || item.employeeId || item.EmployeeId || item.id || item.ID,
          name: item.plannerName || item.PlannerName || item.employeeName || item.EmployeeName || item.name || item.Name
        }));
        
        // Build lookup map for fast O(1) searches
        this.plannerLookup.clear();
        this.plannerOptions.forEach(opt => {
          this.plannerLookup.set(opt.name.toLowerCase().trim(), opt);
        });
      } else {
        this.plannerOptions = [];
      }
    } catch (error) {
      console.error('Error loading planners:', error);
      this.plannerOptions = [];
    }
  }

  async loadCustomerOptions() {
    // Skip if already loaded
    if (this.customerOptions.length > 0) return;
    
    try {
      const res: any = await this.temServ.getAllCustomers();
      
      // Try multiple response formats
      let dataArray = null;
      if (res && res.result && Array.isArray(res.result)) {
        dataArray = res.result;
      } else if (res && Array.isArray(res)) {
        dataArray = res;
      } else if (res && res.data && Array.isArray(res.data)) {
        dataArray = res.data;
      }
      
      if (dataArray && dataArray.length > 0) {
        this.customerOptions = dataArray.map((item: any) => ({
          value: item.customerID || item.customerId || item.CustomerID || item.id || item.ID,
          name: item.customerName || item.CustomerName || item.name || item.Name
        }));
        
        // Build lookup map for fast O(1) searches
        this.customerLookup.clear();
        this.customerOptions.forEach(opt => {
          this.customerLookup.set(opt.name.toLowerCase().trim(), opt);
        });
      } else {
        this.customerOptions = [];
      }
    } catch (error) {
      console.error('Error loading customers:', error);
      this.customerOptions = [];
    }
  }

  async loadVehicleOptions() {
    // Skip if already loaded
    if (this.vehicleOptions.length > 0) return;
    
    try {
      const res: any = await this.temServ.getAllVehicles();
      
      // Try multiple response formats
      let dataArray = null;
      if (res && res.result && Array.isArray(res.result)) {
        dataArray = res.result;
      } else if (res && Array.isArray(res)) {
        dataArray = res;
      } else if (res && res.data && Array.isArray(res.data)) {
        dataArray = res.data;
      }
      
      if (dataArray && dataArray.length > 0) {
        this.vehicleOptions = dataArray.map((item: any) => {
          // Try all possible field names for ID
          const idValue = item.vehicleId || item.VehicleId || item.VehicleID || 
                         item.vehicle_id || item.id || item.Id || item.ID ||
                         item.vehicleID;
          // Try all possible field names for name
          const nameValue = item.vehicleNumber || item.VehicleNumber || item.vehicle_number ||
                           item.vehicleName || item.VehicleName || item.vehicle_name ||
                           item.name || item.Name || item.number || item.Number ||
                           item.registrationNumber || item.RegistrationNumber;
          
          return {
            value: idValue,
            name: nameValue || 'Unknown'
          };
        });
        
        // Build lookup map
        this.vehicleLookup.clear();
        this.vehicleOptions.forEach(opt => {
          if (opt.name) {
            this.vehicleLookup.set(opt.name.toLowerCase().trim(), opt);
          }
        });
      } else {
        this.vehicleOptions = [];
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
      this.vehicleOptions = [];
    }
  }

  async loadStatusOptions() {
    // Skip if already loaded
    if (this.statusOptions.length > 0) return;
    
    try {
      const res: any = await this.temServ.getAllStatuses();
      
      // Try multiple response formats
      let dataArray = null;
      if (res && res.result && Array.isArray(res.result)) {
        dataArray = res.result;
      } else if (res && Array.isArray(res)) {
        dataArray = res;
      } else if (res && res.data && Array.isArray(res.data)) {
        dataArray = res.data;
      }
      
      if (dataArray && dataArray.length > 0) {
        this.statusOptions = dataArray.map((item: any) => ({
          value: item.statusId || item.StatusID || item.statusID || item.id || item.ID,
          name: item.statusName || item.StatusName || item.name || item.Name
        })).filter((opt: any) => opt.value !== undefined && opt.value !== null);
        
        // Build lookup map
        this.statusLookup.clear();
        this.statusOptions.forEach(opt => {
          this.statusLookup.set(opt.name.toLowerCase().trim(), opt);
        });
      } else {
        this.statusOptions = [];
      }
    } catch (error) {
      console.error('Error loading statuses:', error);
      this.statusOptions = [];
    }
  }

  async loadProductTypeOptions() {
    // Skip if already loaded
    if (this.productTypeOptions.length > 0) return;
    
    try {
      const res: any = await this.temServ.getAllProductTypes();
      
      // Try multiple response formats
      let dataArray = null;
      if (res && res.result && Array.isArray(res.result)) {
        dataArray = res.result;
      } else if (res && Array.isArray(res)) {
        dataArray = res;
      } else if (res && res.data && Array.isArray(res.data)) {
        dataArray = res.data;
      }
      
      if (dataArray && dataArray.length > 0) {
        this.productTypeOptions = dataArray.map((item: any) => ({
          value: item.productTypeId || item.productTypeID || item.ProductTypeID || item.id || item.ID,
          name: item.productTypeName || item.ProductTypeName || item.name || item.Name
        }));
        
        // Build lookup map for fast searching
        this.productTypeLookup.clear();
        this.productTypeOptions.forEach((opt: any) => {
          if (opt.name) {
            this.productTypeLookup.set(opt.name.toLowerCase().trim(), opt);
          }
        });
      } else {
        this.productTypeOptions = [];
      }
    } catch (error) {
      console.error('❌ Error loading product types:', error);
      this.productTypeOptions = [];
    }
  }

     
      
  // API Methods (commented - implement as needed)
  /*
  loadPlannerOptions() {
    this.utilServ.getPlanners().then((res: any) => {
      this.plannerOptions = res.map((item: any) => ({
        value: item.plannerId,
        name: item.plannerName
      }));
    }).catch(error => {
      console.error('Error loading planners:', error);
    });
  }

  loadCustomerOptions() {
    this.utilServ.getCustomers().then((res: any) => {
      this.customerOptions = res.map((item: any) => ({
        value: item.customerId,
        name: item.customerName
      }));
    }).catch(error => {
      console.error('Error loading customers:', error);
    });
  }

  loadLocationOptions() {
    this.utilServ.getLocations().then((res: any) => {
      this.pickupLocationOptions = res.pickupLocations.map((item: any) => ({
        value: item.locationId,
        name: item.locationName
      }));
      
      this.changeoverLocationOptions = res.changeoverLocations.map((item: any) => ({
        value: item.locationId,
        name: item.locationName
      }));
    }).catch(error => {
      console.error('Error loading locations:', error);
    });
  }

  loadVehicleOptions() {
    this.utilServ.getVehicles().then((res: any) => {
      this.vehicleOptions = res.map((item: any) => ({
        value: item.vehicleId,
        name: item.vehicleNumber
      }));
    }).catch(error => {
      console.error('Error loading vehicles:', error);
    });
  }

  loadDriverOptions() {
    this.utilServ.getDrivers().then((res: any) => {
      this.driverOptions = res.map((item: any) => ({
        value: item.driverId,
        name: item.driverName
      }));
    }).catch(error => {
      console.error('Error loading drivers:', error);
    });
  }
  */

  // Customer-dependent data loading methods
  async loadCustomerProducts(customerId: any): Promise<any> {
    // Normalize customerId to number for consistent storage
    const normalizedCustomerId = Number(customerId);
    
    // Skip if already loaded (cache hit)
    if (this.customerProductsMap.has(normalizedCustomerId) && this.customerProductsMap.get(normalizedCustomerId)!.length > 0) {
      return;
    }
    
    try {
      const res: any = await this.temServ.getCustomerProducts(normalizedCustomerId);
      
      // Try multiple response formats
      let dataArray = null;
      if (res && res.result && Array.isArray(res.result)) {
        dataArray = res.result;
      } else if (res && Array.isArray(res)) {
        dataArray = res;
      } else if (res && res.data && Array.isArray(res.data)) {
        dataArray = res.data;
      }
      
      if (dataArray && dataArray.length > 0) {
        const customerProducts = dataArray.map((item: any) => {
          // Extract productType from various possible field names
          const productTypeValue = item.productType || item.ProductType || item.productTypeName || 
                                   item.ProductTypeName || item.product_type || item.producttype ||
                                   item.type || item.Type || '';
          const productTypeIdValue = item.productTypeID || item.productTypeId || item.ProductTypeID || 
                                     item.ProductTypeId || item.productTypeid || item.product_type_id || null;
          
          return {
            value: item.productID || item.productId || item.ProductID || item.id || item.ID,
            name: item.productName || item.ProductName || item.name || item.Name,
            customerId: normalizedCustomerId,
            productType: productTypeValue,
            productTypeId: productTypeIdValue
          };
        });
        
        // Store products for this specific customer (using normalized ID)
        this.customerProductsMap.set(normalizedCustomerId, customerProducts);
        
        // Build FAST lookup map for this customer (O(1) lookups)
        const productLookup = new Map<string, any>();
        customerProducts.forEach((opt: any) => {
          if (opt.name) {
            productLookup.set(opt.name.toLowerCase().trim(), opt);
          }
        });
        this.customerProductLookupMap.set(normalizedCustomerId, productLookup);
        
        // Merge into global productOptions (for backward compatibility)
        const existingProducts = this.productOptions.filter(p => p.customerId !== normalizedCustomerId);
        this.productOptions = [...existingProducts, ...customerProducts];
        
        // Build/update lookup map (merge all customer products)
        customerProducts.forEach((opt: any) => {
          const key = opt.name.toLowerCase().trim();
          // Store with customer context for better matching
          if (!this.productLookup.has(key)) {
            this.productLookup.set(key, opt);
          } else {
            // If duplicate name exists, store as array
            const existing = this.productLookup.get(key);
            if (Array.isArray(existing)) {
              existing.push(opt);
            } else {
              this.productLookup.set(key, [existing, opt]);
            }
          }
        });
      } else {
        this.customerProductsMap.set(customerId, []);
      }
    } catch (error) {
      console.error('Error loading customer products:', error);
      this.productOptions = [];
    }
  }

  async loadCustomerLocations(customerId: any): Promise<any> {
    const normalizedCustomerId = Number(customerId);
    
    // Skip if already loaded (cache hit)
    if (this.customerLocationsMap.has(normalizedCustomerId) && this.customerLocationsMap.get(normalizedCustomerId)!.length > 0) {
      return;
    }
    
    try {
      const res: any = await this.temServ.getCustomerLocations(customerId);
      
      // Try multiple response formats
      let dataArray = null;
      if (res && res.result && Array.isArray(res.result)) {
        dataArray = res.result;
      } else if (res && Array.isArray(res)) {
        dataArray = res;
      } else if (res && res.data && Array.isArray(res.data)) {
        dataArray = res.data;
      }
      
      if (dataArray && dataArray.length > 0) {
        const locations = dataArray.map((item: any) => ({
          value: item.locationId || item.LocationID || item.locationID || item.id || item.ID,
          name: item.locationName || item.LocationName || item.name || item.Name
        })).filter((loc: any) => loc.value !== undefined && loc.value !== null);
        
        // Store in customer-specific map
        this.customerLocationsMap.set(normalizedCustomerId, locations);
        
        // Build FAST lookup map for this customer (O(1) lookups)
        const locationLookup = new Map<string, any>();
        locations.forEach((opt: any) => {
          if (opt.name) {
            locationLookup.set(opt.name.toLowerCase().trim(), opt);
          }
        });
        this.customerLocationLookupMap.set(normalizedCustomerId, locationLookup);
        
        // For dropdown editing, just use the current customer's locations
        // Note: deliveryLocationOptions is loaded separately from getAllDeliveryLocations
        this.pickupLocationOptions = [...locations];
        //this.changeoverLocationOptions = [...locations];
        
        // Build lookup map
        locations.forEach((opt: any) => {
          const key = opt.name.toLowerCase().trim();
          if (!this.locationLookup.has(key)) {
            this.locationLookup.set(key, opt);
          } else {
            const existing = this.locationLookup.get(key);
            if (Array.isArray(existing)) {
              existing.push(opt);
            } else {
              this.locationLookup.set(key, [existing, opt]);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error loading customer locations:', error);
    }
  }

  // Flag to track if delivery locations were loaded from the correct API
  private deliveryLocationsLoadedFromAPI: boolean = false;
   
  async loadDeliveryLocationOptions() {
    // Skip if already loaded from getAllDeliveryLocations API
     if ( this.deliveryLocationOptions.length > 0) return;
    
    try {
      const res: any = await this.temServ.getAllDeliveryLocations();
      
      // Try multiple response formats
      let dataArray = null;
      if (res && res.result && Array.isArray(res.result)) {
        dataArray = res.result;
      } else if (res && Array.isArray(res)) {
        dataArray = res;
      } else if (res && res.data && Array.isArray(res.data)) {
        dataArray = res.data;
      }
      
      if (dataArray && dataArray.length > 0) {
        // Debug: Log first item to see actual property names
        console.log('🔍 Delivery Location API - First item keys:', Object.keys(dataArray[0]));
        console.log('🔍 Delivery Location API - First item:', dataArray[0]);
        
        this.deliveryLocationOptions = dataArray.map((item: any) => ({
          value: item.deliverylocationId || item.deliveryLocationId || item.deliveryLocationID || 
                 item.DeliveryLocationId || item.DeliveryLocationID || item.locationId || 
                 item.LocationId || item.LocationID || item.id || item.Id || item.ID,
          name: item.deliverylocationName || item.deliveryLocationName || item.DeliveryLocationName || 
                item.locationName || item.LocationName || item.name || item.Name
        })).filter((loc: any) => loc.value !== undefined && loc.value !== null && loc.name);
        console.log(`🔄 Mapped ${this.deliveryLocationOptions.length} delivery locations from API`);
        this.deliveryLocationLookup.clear();
        this.deliveryLocationOptions.forEach(opt => {
          if (opt.name) {
            this.deliveryLocationLookup.set(opt.name.toLowerCase().trim(), opt);
          }
        });
        
        
        console.log(`✅ Loaded ${this.deliveryLocationOptions.length} delivery locations`);
      } else {
        console.warn('⚠️ No delivery locations returned from API');
        this.deliveryLocationOptions = [];
        
      }
    } catch (error) {
      console.error('Error loading delivery locations:', error);
      this.deliveryLocationOptions = [];
    }
  }

  
  async loadChangeoverLocationOptions() {
    // Skip if already loaded from getAllChangeoverLocations API
     if ( this.changeoverLocationOptions.length > 0) return;
    
    try {
      const res: any = await this.temServ.getAllChangeoverLocations();
      
      // Try multiple response formats
      let dataArray = null;
      if (res && res.result && Array.isArray(res.result)) {
        dataArray = res.result;
      } else if (res && Array.isArray(res)) {
        dataArray = res;
      } else if (res && res.data && Array.isArray(res.data)) {
        dataArray = res.data;
      }
      
      if (dataArray && dataArray.length > 0) {
        // Debug: Log first item to see actual property names
        console.log('🔍 Changeover Location API - First item keys:', Object.keys(dataArray[0]));
        console.log('🔍 Changeover Location API - First item:', dataArray[0]);
        
        this.changeoverLocationOptions = dataArray.map((item: any) => ({
          value: item.changeoverLocationID ,
          name: item.changeoverLocationName  
        })).filter((loc: any) => loc.value !== undefined && loc.value !== null && loc.name);
        console.log(`🔄 Mapped ${this.changeoverLocationOptions.length} changeover locations from API`);
        this.changeoverLocationLookup.clear();
        this.changeoverLocationOptions.forEach(opt => {
          if (opt.name) {
            this.changeoverLocationLookup.set(opt.name.toLowerCase().trim(), opt);
          }
        });
        
      
        console.log(`✅ Loaded ${this.changeoverLocationOptions.length} changeover locations`);
      } else {
        console.warn('⚠️ No changeover locations returned from API');
        this.changeoverLocationOptions = [];
       
      }
    } catch (error) {
      console.error('Error loading changeover locations:', error);
      this.changeoverLocationOptions = [];
    }
  }
  // Load all drivers from master
  async loadDriverOptions() {
    // Skip if already loaded
    if (this.driverOptions.length > 0) return;
    
    try {
      const res: any = await this.temServ.getAllDrivers();
      let dataArray = null;
      if (res && res.result && Array.isArray(res.result)) {
        dataArray = res.result;
      } else if (res && Array.isArray(res)) {
        dataArray = res;
      } else if (res && res.data && Array.isArray(res.data)) {
        dataArray = res.data;
      }
      if (dataArray && dataArray.length > 0) {
        this.driverOptions = dataArray.map((item: any) => ({
          value: item.driverId || item.DriverID || item.driverID || item.id || item.ID,
          name: item.firstName && item.lastName ? `${item.firstName} ${item.lastName}` : 
                item.driverName || item.DriverName || item.name || item.Name || 
                item.firstName || item.FirstName || ''
        })).filter((opt: any) => opt.name && opt.name.trim() !== '');
        
        // Build lookup map for fast O(1) searches
        this.driverLookup.clear();
        this.driverOptions.forEach(opt => {
          if (opt.name) {
            this.driverLookup.set(opt.name.toLowerCase().trim(), opt);
          }
        });
      } else {
        this.driverOptions = [];
      }
    } catch (error) {
      console.error('Error loading drivers:', error);
      this.driverOptions = [];
    }
  }

  // Load all trailers from master
  async loadTrailerOptions() {
    // Skip if already loaded
    if (this.trailerOptions.length > 0) return;
    
    try {
      const res: any = await this.temServ.getAllTrailers();
      let dataArray = null;
      if (res && res.result && Array.isArray(res.result)) {
        dataArray = res.result;
      } else if (res && Array.isArray(res)) {
        dataArray = res;
      } else if (res && res.data && Array.isArray(res.data)) {
        dataArray = res.data;
      }
      if (dataArray && dataArray.length > 0) {
        this.trailerOptions = dataArray.map((item: any) => ({
          value: item.trailerId || item.TrailerID || item.trailerID || item.id || item.ID,
          name: item.trailerNumber || item.TrailerNumber || item.trailerName || item.TrailerName || item.name || item.Name || ''
        })).filter((opt: any) => opt.name && opt.name.trim() !== '');
        this.trailerOutOptions = this.trailerOptions;
        
        // Build lookup maps for fast O(1) searches
        this.trailerLookup.clear();
        this.trailerOutLookup.clear();
        this.trailerOptions.forEach(opt => {
          if (opt.name) {
            this.trailerLookup.set(opt.name.toLowerCase().trim(), opt);
            this.trailerOutLookup.set(opt.name.toLowerCase().trim(), opt);
          }
        });
      } else {
        this.trailerOptions = [];
        this.trailerOutOptions = [];
      }
    } catch (error) {
      console.error('Error loading trailers:', error);
      this.trailerOptions = [];
      this.trailerOutOptions = [];
    }
  }

  // Load all trailer types from master
  async loadTrailerTypeOptions() {
    // Skip if already loaded
    if (this.trailerTypeOptions.length > 0) return;
    
    try {
      const res: any = await this.temServ.getAllTrailerTypes();
      let dataArray = null;
      if (res && res.result && Array.isArray(res.result)) {
        dataArray = res.result;
      } else if (res && Array.isArray(res)) {
        dataArray = res;
      } else if (res && res.data && Array.isArray(res.data)) {
        dataArray = res.data;
      }
      if (dataArray && dataArray.length > 0) {
        this.trailerTypeOptions = dataArray.map((item: any) => ({
          value: item.trailerTypeId || item.TrailerTypeID || item.trailerTypeID || item.id || item.ID,
          name: item.trailerTypeName || item.TrailerTypeName || item.typeName || item.TypeName || item.name || item.Name || ''
        })).filter((opt: any) => opt.name && opt.name.trim() !== '');
        this.trailerOutTypeOptions = this.trailerTypeOptions;
        
        // Build lookup maps for fast O(1) searches
        this.trailerTypeLookup.clear();
        this.trailerOutTypeLookup.clear();
        this.trailerTypeOptions.forEach(opt => {
          if (opt.name) {
            this.trailerTypeLookup.set(opt.name.toLowerCase().trim(), opt);
            this.trailerOutTypeLookup.set(opt.name.toLowerCase().trim(), opt);
          }
        });
      } else {
        this.trailerTypeOptions = [];
        this.trailerOutTypeOptions = [];
      }
    } catch (error) {
      console.error('Error loading trailer types:', error);
      this.trailerTypeOptions = [];
      this.trailerOutTypeOptions = [];
    }
  }


  // Get customer-specific products for dropdown
  getCustomerProducts(customerId: any): any[] {
    if (!customerId) return [];
    
    // Normalize to number for Map lookup (Map is typed as Map<number, any[]>)
    const numericId = Number(customerId);
    
    // Return products for this specific customer
    let customerProducts = this.customerProductsMap.get(numericId);
    
    if (customerProducts && customerProducts.length > 0) {
      return customerProducts;
    }
    
    // Fallback: filter from global productOptions
    return this.productOptions.filter((p: any) => Number(p.customerId) === numericId);
  }
  
  // Get customer-specific locations for dropdown
  getCustomerLocations(customerId: any): any[] {
    if (!customerId) return [];
    
    const customerLocations = this.customerLocationsMap.get(customerId);
    if (customerLocations && customerLocations.length > 0) {
      return customerLocations;
    }
    
    return this.pickupLocationOptions.filter((l: any) => l.customerId == customerId);
  }
  
  
  // Get display value for ID (for rendering in grid)
  getDisplayValue(row: any, field: string): string {
    const mapping = this.fieldMappings[field];
    if (!mapping) return row[field] || '-';
    
    // Return the name field value
    return row[mapping.nameField] || '-';
  }
  
  // Check if row has validation errors
  hasValidationError(rowIndex: number, field?: string): boolean {
    const row = this.templateList[rowIndex];
    const rowKey = row.rowKey || `sheet_${rowIndex}`;
    
    if (!this.validationErrors.has(rowKey)) return false;
    
    if (field) {
      const errors = this.validationErrors.get(rowKey)!;
      return errors.some(err => err.includes(field));
    }
    
    return true;
  }
  
  // Get validation error message for tooltip
  getValidationError(rowIndex: number): string {
    const row = this.templateList[rowIndex];
    const rowKey = row.rowKey || `sheet_${rowIndex}`;
    
    if (this.validationErrors.has(rowKey)) {
      return this.validationErrors.get(rowKey)!.join(', ');
    }
    
    return '';
  }

}
