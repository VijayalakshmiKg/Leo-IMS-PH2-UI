import { Component, OnInit, ChangeDetectorRef, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { WeighbridgeDashboardService } from '../weighbridge-dashboard.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-weighbridge-dashboard',
  templateUrl: './weighbridge-dashboard.component.html',
  styleUrls: ['./weighbridge-dashboard.component.css']
})
export class WeighbridgeDashboardComponent implements OnInit {
  
  // Close filter popup on document click
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const filterPopup = document.querySelector('.column-filter-popup');
    const filterIcon = target.closest('.column-filter-icon');
    
    if (this.showColumnFilterPopup && filterPopup && !filterPopup.contains(target) && !filterIcon) {
      this.showColumnFilterPopup = null;
    }
  }
  
  // Weigh Trailer Popup properties
  showWeighTrailerPopup: boolean = false;
  weighTrailerData: any = null;
  isLoadingWeighData: boolean = false;
  isSavingWeighData: boolean = false;
  weighFormData: any = {
    grossWeight: null,
    grossWeighedDateTime: '',
    moistureDeduction: null,
    moistureDateTime: '',
    tareWeight: null,
    tareWeighedDateTime: ''
  };
  
  // Raise Issues Popup properties
  showRaiseIssuesPopup: boolean = false;
  raiseIssuesData: any = null;
  isLoadingRaiseIssues: boolean = false;
  isSavingRaiseIssues: boolean = false;
  raiseIssuesFormData: any = {
    taskId: null,
    trailerLeaking: null,
    trailerContainsStrongOdours: null
  };
  
  // Task list data
  taskList: any[] = [];
  
  // Overview counts
  overViewCardCount: any = {
    totalTasks: 0,
    loadsInTransit: 0,
    loadsArrived: 0,
    loadsWeighed: 0
  };
  
  // Search and filter
  searchText: string = '';
  filterStatus: string = 'All';
  
  // Loading state
  isLoading: boolean = false;
  
  // Column definitions for the table
  tableColumns = [
    { key: 'no', label: 'No', visible: true, width: 60, filterable: false, sortable: true },
    { key: 'taskID', label: 'TaskID', visible: false, width: 100, filterable: false, sortable: false },
    { key: 'planner', label: 'Planner', visible: true, width: 150, filterable: true, sortable: true },
    { key: 'customer', label: 'Customer', visible: true, width: 180, filterable: true, sortable: true },
    { key: 'product', label: 'Product', visible: true, width: 150, filterable: true, sortable: true },
    { key: 'pickupLocation', label: 'Pickup Location', visible: true, width: 180, filterable: true, sortable: true },
    { key: 'vehicle', label: 'Vehicle', visible: true, width: 120, filterable: true, sortable: true },
    { key: 'driverName', label: 'Driver', visible: true, width: 150, filterable: true, sortable: true },
    { key: 'status', label: 'Status', visible: true, width: 120, filterable: true, sortable: true },
    { key: 'trailerIn', label: 'Trailer In', visible: true, width: 120, filterable: true, sortable: true },
    { key: 'productEstWeight', label: 'Product Est Weight', visible: true, width: 140, filterable: true, sortable: true },
    { key: 'productCategory', label: 'Product Category', visible: true, width: 150, filterable: true, sortable: true },
    { key: 'trailerInType', label: 'Trailer In Type', visible: true, width: 130, filterable: true, sortable: true },
    { key: 'changeoverLocation', label: 'Changeover Location', visible: true, width: 180, filterable: true, sortable: true }
  ];
  
  // Selection tracking
  selectedTasks: Set<number> = new Set();
  selectAll: boolean = false;
  
  // Column filter properties
  showColumnFilterPopup: string | null = null;
  activeColumnFilters: { [key: string]: string[] } = {};
  columnFilterSearch: { [key: string]: string } = {};
  columnDistinctValues: { [key: string]: string[] } = {};
  
  // Column drag-drop
  draggedColumn: string | null = null;
  
  // Column manager
  showColumnManager: boolean = false;
  
  // Sort state
  columnSorts: { [key: string]: 'asc' | 'desc' | null } = {};
  
  // Logged in user
  loggedInUser: any;
  
  constructor(
    public route: Router,
    public weighbridgeService: WeighbridgeDashboardService,
    public utilServ: UtilityService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Get logged in user
    let user: any = localStorage.getItem('loggedInUser');
    if (user) {
      this.loggedInUser = JSON.parse(user);
    }
    
    // Load initial data
    this.loadOverviewCount();
    this.loadTaskList();
  }
  
  // Load overview card counts
  async loadOverviewCount() {
    try {
      const res: any = await this.weighbridgeService.getWeighBridgeCount();
      if (res) {
        this.overViewCardCount = {
          totalTasks: res.totalTasks || res.TotalTasks || 0,
          loadsInTransit: res.loadsInTransit || res.LoadsInTransit || 0,
          loadsArrived: res.loadsArrived || res.LoadsArrived || 0,
          loadsWeighed: res.loadsWeighed || res.LoadsWeighed || 0
        };
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error loading overview count:', error);
    }
  }
  
  // Load task list from API
  async loadTaskList() {
    this.isLoading = true;
    try {
      const filterKey = this.filterStatus === 'All' ? '' : this.filterStatus;
      /*const res: any = await this.weighbridgeService.getWeighBridgeTaskTable(
        this.searchText || '',
        filterKey,
        this.pageNumber,
        this.pageSize
      );*/
      // Get logged in user's employee ID
      let user: any = localStorage.getItem('loggedInUser');
      if (!user) {
        console.warn('⚠️ No logged in user found');
        return;
      }
      
      let parsedData = JSON.parse(user);
      console.log('🔍 Parsed user data:', parsedData);
      
      let employeeId = parsedData?.employeeId || parsedData?.EmployeeId || parsedData?.empId || parsedData?.EmpId || parsedData?.id || parsedData?.Id;
      console.log('🔍 Employee ID:', employeeId);
      const res: any = await this.weighbridgeService.getWeighBridgeTaskTableByEmpId(employeeId);
      if (res) {
        // Handle different response formats
        let dataArray = res.data || res.result || res.tasks || res || [];
        if (!Array.isArray(dataArray)) {
          dataArray = [];
        }
        
        // Map data to consistent format
        this.taskList = dataArray.map((item: any, index: number) => ({
          no: index + 1,
          taskID: item.taskID || item.TaskID || item.taskId || item.orderID || item.OrderID || null,
          planner: item.planner || item.Planner || item.plannerName || item.PlannerName || '-',
          customer: item.customer || item.Customer || item.customerName || '-',
          product: item.product || item.Product || item.productName || '-',
          pickupLocation: item.pickupLocation || item.PickupLocation || '-',
          vehicle: item.registrationNo || item.RegistrationNo || item.vehicle || item.Vehicle || '-',
          driverName: item.driverName || item.DriverName || item.driver || '-',
          status: item.status || item.Status || item.orderStatus || '-',
          trailerIn: item.trailerIn || item.TrailerIn || item.trailerNumber || item.TrailerNumber || '-',
          productEstWeight: item.productEstWeight || item.ProductEstWeight || item.estWeight || item.EstWeight || '-',
          productCategory: item.productCategory || item.ProductCategory || item.category || '-',
          trailerInType: item.trailerInType || item.TrailerInType || item.trailerType || '-',
          changeoverLocation: item.changeoverLocation || item.ChangeoverLocation || item.changeover || '-'
        }));
        
        // Clear selection on data reload
        this.selectedTasks.clear();
        this.selectAll = false;
        
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error loading task list:', error);
      this.taskList = [];
      this.utilServ.toaster.next({ 
        type: customToaster.errorToast, 
        message: 'Failed to load tasks' 
      });
    } finally {
      this.isLoading = false;
    }
  }
  
  // Format date time
  formatDateTime(dateTime: any): string {
    if (!dateTime) return '-';
    try {
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '-';
    }
  }
  
  // Search handler
  onSearch() {
    this.loadTaskList();
  }
  
  // Clear search
  clearSearch() {
    this.searchText = '';
    this.onSearch();
  }
  
  // Filter by status
  filterByStatus(status: string) {
    this.filterStatus = status;
    this.loadTaskList();
  }
  
  // Get visible columns
  getVisibleColumns() {
    return this.tableColumns.filter(col => col.visible);
  }
  
  // Toggle column visibility
  toggleColumnVisibility(key: string) {
    const column = this.tableColumns.find(col => col.key === key);
    if (column) {
      column.visible = !column.visible;
    }
  }
  
  // Toggle column manager
  toggleColumnManager() {
    this.showColumnManager = !this.showColumnManager;
  }
  
  // Sort column
  toggleColumnSort(columnKey: string) {
    const currentSort = this.columnSorts[columnKey];
    
    // Clear other sorts
    this.columnSorts = {};
    
    if (!currentSort) {
      this.columnSorts[columnKey] = 'asc';
    } else if (currentSort === 'asc') {
      this.columnSorts[columnKey] = 'desc';
    } else {
      this.columnSorts[columnKey] = null;
    }
  }
  
  // Get filtered and sorted tasks
  getFilteredAndSortedTasks() {
    let filteredTasks = [...this.taskList];
    
    // Apply search filter
    if (this.searchText && this.searchText.trim()) {
      const searchLower = this.searchText.toLowerCase();
      filteredTasks = filteredTasks.filter(task => {
        return Object.values(task).some((value: any) => 
          value && value.toString().toLowerCase().includes(searchLower)
        );
      });
    }
    
    // Apply column filters (checkbox-based)
    Object.keys(this.activeColumnFilters).forEach(columnKey => {
      const selectedValues = this.activeColumnFilters[columnKey];
      if (selectedValues && selectedValues.length > 0) {
        filteredTasks = filteredTasks.filter(task => {
          const cellValue = task[columnKey];
          if (cellValue === null || cellValue === undefined) return false;
          return selectedValues.includes(String(cellValue));
        });
      }
    });
    
    // Apply sorting
    const sortColumn = Object.keys(this.columnSorts).find(key => this.columnSorts[key]);
    if (sortColumn && this.columnSorts[sortColumn]) {
      const sortDirection = this.columnSorts[sortColumn];
      filteredTasks.sort((a, b) => {
        const aValue = a[sortColumn]?.toString().toLowerCase() || '';
        const bValue = b[sortColumn]?.toString().toLowerCase() || '';
        
        if (sortDirection === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
    }
    
    return filteredTasks;
  }
  
  // Column filter methods
  toggleColumnFilterPopup(columnKey: string, event: Event): void {
    event.stopPropagation();
    if (this.showColumnFilterPopup === columnKey) {
      this.showColumnFilterPopup = null;
    } else {
      this.showColumnFilterPopup = columnKey;
      this.loadColumnDistinctValues(columnKey);
      if (!this.columnFilterSearch[columnKey]) {
        this.columnFilterSearch[columnKey] = '';
      }
      this.positionFilterPopup(event.target as HTMLElement);
    }
  }
  
  positionFilterPopup(target: HTMLElement): void {
    setTimeout(() => {
      const popup = document.querySelector('.column-filter-popup') as HTMLElement;
      if (popup && target) {
        const rect = target.getBoundingClientRect();
        const popupWidth = 280;
        const popupHeight = 350;
        
        let left = rect.left;
        let top = rect.bottom + 8;
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        if (left + popupWidth > viewportWidth) {
          left = Math.max(8, rect.right - popupWidth);
        }
        
        if (top + popupHeight > viewportHeight) {
          top = Math.max(80, rect.top - popupHeight - 8);
        }
        
        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
      }
    }, 0);
  }
  
  loadColumnDistinctValues(columnKey: string): void {
    const allValues = this.taskList
      .map(task => task[columnKey])
      .filter(value => value !== null && value !== undefined && value !== '' && value !== '-')
      .map(value => String(value));
    
    this.columnDistinctValues[columnKey] = [...new Set(allValues)].sort();
  }
  
  getFilteredDistinctValues(columnKey: string): string[] {
    if (!this.columnDistinctValues[columnKey]) return [];
    
    const searchTerm = this.columnFilterSearch[columnKey]?.toLowerCase() || '';
    if (!searchTerm) return this.columnDistinctValues[columnKey];
    
    return this.columnDistinctValues[columnKey].filter(value => 
      value.toLowerCase().includes(searchTerm)
    );
  }
  
  isValueSelected(columnKey: string, value: string): boolean {
    return this.activeColumnFilters[columnKey]?.includes(value) || false;
  }
  
  toggleFilterValue(columnKey: string, value: string): void {
    if (!this.activeColumnFilters[columnKey]) {
      this.activeColumnFilters[columnKey] = [];
    }
    
    const index = this.activeColumnFilters[columnKey].indexOf(value);
    if (index > -1) {
      this.activeColumnFilters[columnKey].splice(index, 1);
    } else {
      this.activeColumnFilters[columnKey].push(value);
    }
  }
  
  selectAllFilterValues(columnKey: string): void {
    this.activeColumnFilters[columnKey] = [...this.getFilteredDistinctValues(columnKey)];
  }
  
  clearAllFilterValues(columnKey: string): void {
    this.activeColumnFilters[columnKey] = [];
  }
  
  applyColumnFilters(): void {
    this.showColumnFilterPopup = null;
  }
  
  closeColumnFilterPopup(): void {
    this.showColumnFilterPopup = null;
  }
  
  getColumnLabel(columnKey: string): string {
    const column = this.tableColumns.find(col => col.key === columnKey);
    return column ? column.label : columnKey;
  }
  
  // Column resize
  startResize(columnKey: string, event: MouseEvent) {
    event.preventDefault();
    const startX = event.clientX;
    const column = this.tableColumns.find(col => col.key === columnKey);
    const startWidth = column?.width || 100;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - startX);
      if (column) {
        column.width = Math.max(60, newWidth);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
  
  // Column reordering
  onColumnDragStart(columnKey: string, event: DragEvent) {
    this.draggedColumn = columnKey;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onColumnDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onColumnDrop(targetIndex: number, event: DragEvent) {
    event.preventDefault();
    if (this.draggedColumn) {
      const draggedIndex = this.tableColumns.findIndex(col => col.key === this.draggedColumn);
      if (draggedIndex !== -1 && draggedIndex !== targetIndex) {
        const draggedColumn = this.tableColumns.splice(draggedIndex, 1)[0];
        this.tableColumns.splice(targetIndex, 0, draggedColumn);
      }
      this.draggedColumn = null;
    }
  }
  
  // Toggle select all checkboxes
  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.taskList.forEach(task => this.selectedTasks.add(task.taskID));
    } else {
      this.selectedTasks.clear();
    }
  }
  
  // Toggle individual row selection
  toggleRowSelection(taskID: number) {
    if (this.selectedTasks.has(taskID)) {
      this.selectedTasks.delete(taskID);
    } else {
      this.selectedTasks.add(taskID);
    }
    // Update selectAll state
    this.selectAll = this.taskList.length > 0 && this.selectedTasks.size === this.taskList.length;
  }
  
  // Check if a row is selected
  isRowSelected(taskID: number): boolean {
    return this.selectedTasks.has(taskID);
  }
  
  // Get selected tasks count
  getSelectedCount(): number {
    return this.selectedTasks.size;
  }
  
  // Check if action buttons should be shown (when any row is selected)
  showActionButtons(): boolean {
    return this.selectedTasks.size > 0;
  }
  
  // Weigh trailer action
  onWeighTrailer() {
    const selectedTasksList = this.taskList.filter(task => this.selectedTasks.has(task.taskID));
    console.log('Weigh trailer for tasks:', selectedTasksList);
    
    if (selectedTasksList.length === 0) {
      this.utilServ.toaster.next({ 
        type: customToaster.warningToast, 
        message: 'Please select a task to weigh' 
      });
      return;
    }
    
    // Open popup for first selected task
    const firstTask = selectedTasksList[0];
    this.openWeighTrailerPopup(firstTask.taskID);
  }
  
  // Open Weigh Trailer Popup
  async openWeighTrailerPopup(taskId: number) {
    this.showWeighTrailerPopup = true;
    this.isLoadingWeighData = true;
    this.resetWeighFormData();
    
    try {
      // Get task details from API
      const res: any = await this.weighbridgeService.getWeighTrailerDetails(taskId);
      
      if (res) {
        // Map API response to weighTrailerData
        this.weighTrailerData = {
          taskID: res.taskID || res.TaskID || taskId,
          customer: res.customer || res.Customer || res.customerName || '-',
          product: res.product || res.Product || res.productName || '-',
          productCategory: res.productCategory || res.ProductCategory || '-',
          productEstWeight: res.productEstWeight || res.ProductEstWeight || res.estWeight || '0',
          driverName: res.driverName || res.DriverName || '-',
          status: res.status || res.Status || '-',
          movementDocNo: res.movementDocNo || res.MovementDocNo || res.taskID || taskId,
          ticketNo: res.ticketNo || res.TicketNo || '-',
          transactionType: res.transactionType || res.TransactionType || 'General',
          // Pre-fill existing weigh data if available
          grossWeight: res.grossWeight || res.GrossWeight || null,
          grossWeighedDateTime: res.grossWeighedDateTime || res.GrossWeighedDateTime || '',
          moistureDeduction: res.moistureDeduction || res.MoistureDeduction || null,
          moistureDateTime: res.moistureDateTime || res.MoistureDateTime || '',
          tareWeight: res.tareWeight || res.TareWeight || null,
          tareWeighedDateTime: res.tareWeighedDateTime || res.TareWeighedDateTime || ''
        };
        
        // Pre-fill form data with existing values
        this.weighFormData = {
          grossWeight: this.weighTrailerData.grossWeight,
          grossWeighedDateTime: this.formatDateTimeForInput(this.weighTrailerData.grossWeighedDateTime),
          moistureDeduction: this.weighTrailerData.moistureDeduction,
          moistureDateTime: this.formatDateTimeForInput(this.weighTrailerData.moistureDateTime),
          tareWeight: this.weighTrailerData.tareWeight,
          tareWeighedDateTime: this.getCurrentDateTime()
        };
      } else {
        // If no API data, use selected task data
        const taskData = this.taskList.find(t => t.taskID === taskId);
        this.weighTrailerData = {
          taskID: taskId,
          customer: taskData?.customer || '-',
          product: taskData?.product || '-',
          productCategory: taskData?.productCategory || '-',
          productEstWeight: taskData?.productEstWeight || '0',
          driverName: taskData?.driverName || '-',
          status: taskData?.status || '-',
          movementDocNo: taskId,
          ticketNo: '-',
          transactionType: 'General'
        };
        
        // Set current date/time for tare weight
        this.weighFormData.tareWeighedDateTime = this.getCurrentDateTime();
      }
    } catch (error) {
      console.error('Error loading weigh trailer details:', error);
      // Fallback to task list data
      const taskData = this.taskList.find(t => t.taskID === taskId);
      this.weighTrailerData = {
        taskID: taskId,
        customer: taskData?.customer || '-',
        product: taskData?.product || '-',
        productCategory: taskData?.productCategory || '-',
        productEstWeight: taskData?.productEstWeight || '0',
        driverName: taskData?.driverName || '-',
        status: taskData?.status || '-',
        movementDocNo: taskId,
        ticketNo: '-',
        transactionType: 'General'
      };
      this.weighFormData.tareWeighedDateTime = this.getCurrentDateTime();
    } finally {
      this.isLoadingWeighData = false;
      this.cdr.detectChanges();
    }
  }
  
  // Close Weigh Trailer Popup
  closeWeighTrailerPopup() {
    this.showWeighTrailerPopup = false;
    this.weighTrailerData = null;
    this.resetWeighFormData();
  }
  
  // Reset form data
  resetWeighFormData() {
    this.weighFormData = {
      grossWeight: null,
      grossWeighedDateTime: '',
      moistureDeduction: null,
      moistureDateTime: '',
      tareWeight: null,
      tareWeighedDateTime: ''
    };
  }
  
  // Get current date time in format for datetime-local input
  getCurrentDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  
  // Format date time for input field
  formatDateTimeForInput(dateTime: any): string {
    if (!dateTime) return '';
    try {
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return '';
    }
  }
  
  // Calculate moisture deduction weight
  calculateMoistureDeductionWeight(): string {
    const gross = this.weighFormData.grossWeight || 0;
    const moisturePercent = this.weighFormData.moistureDeduction || 0;
    const deduction = (gross * moisturePercent) / 100;
    return deduction.toFixed(2);
  }
  
  // Calculate net weight
  calculateNetWeight(): string {
    const gross = this.weighFormData.grossWeight || 0;
    const tare = this.weighFormData.tareWeight || 0;
    const moisturePercent = this.weighFormData.moistureDeduction || 0;
    const moistureDeduction = (gross * moisturePercent) / 100;
    const netWeight = gross - tare - moistureDeduction;
    return netWeight.toFixed(2);
  }
  
  // Save Weigh Trailer Data
  async saveWeighTrailerData() {
    // Validate required fields
    if (!this.weighFormData.grossWeight) {
      this.utilServ.toaster.next({ 
        type: customToaster.warningToast, 
        message: 'Please enter gross weight' 
      });
      return;
    }
    
    if (!this.weighFormData.grossWeighedDateTime) {
      this.utilServ.toaster.next({ 
        type: customToaster.warningToast, 
        message: 'Please select gross weighed date & time' 
      });
      return;
    }
    
    this.isSavingWeighData = true;
    
    try {
      const saveModel = {
        TaskId: this.weighTrailerData.taskID,
        GrossWeight: this.weighFormData.grossWeight,
        GrossWeightDateTime: this.weighFormData.grossWeighedDateTime,
        MoistureDetuction: this.weighFormData.moistureDeduction || 0,
        MoistureDetuctionDateTime: this.weighFormData.moistureDateTime || null,
        TareWeight: this.weighFormData.tareWeight || 0,
        TareWeightDateTime: this.weighFormData.tareWeighedDateTime,
        NetWeight: parseFloat(this.calculateNetWeight()),
         CreatedBy: "User"
      };
      
      const res: any = await this.weighbridgeService.saveWeighTrailerData(saveModel);
      
      if (res && res.success) {
        this.utilServ.toaster.next({ 
          type: customToaster.successToast, 
          message: res.message || 'Weigh data saved successfully' 
        });
        
        // Log receipt details if available
        if (res.receiptNumber) {
          console.log('Receipt Number:', res.receiptNumber);
          console.log('Weighbridge Record ID:', res.weighbridgeRecordId);
          console.log('Created Date:', res.createdDate);
        }
        
        this.closeWeighTrailerPopup();
        this.loadTaskList(); // Refresh the task list
        this.loadOverviewCount(); // Refresh overview counts
      } else {
        this.utilServ.toaster.next({ 
          type: customToaster.errorToast, 
          message: res?.message || 'Failed to save weigh data' 
        });
      }
    } catch (error) {
      console.error('Error saving weigh data:', error);
      this.utilServ.toaster.next({ 
        type: customToaster.errorToast, 
        message: 'Failed to save weigh data' 
      });
    } finally {
      this.isSavingWeighData = false;
    }
  }
  
  // Raise issues action
  onRaiseIssues() {
    const selectedTasksList = this.taskList.filter(task => this.selectedTasks.has(task.taskID));
    if (selectedTasksList.length === 0) {
      this.utilServ.toaster.next({ 
        type: customToaster.warningToast, 
        message: 'Please select a task first' 
      });
      return;
    }
    
    // Open popup for the first selected task
    const firstTask = selectedTasksList[0];
    this.openRaiseIssuesPopup(firstTask.taskID);
  }
  
  // Open Raise Issues popup
  openRaiseIssuesPopup(taskId: number) {
    this.showRaiseIssuesPopup = true;
    this.isLoadingRaiseIssues = true;
    this.raiseIssuesData = null;
    
    // Reset form data
    this.raiseIssuesFormData = {
      taskId: taskId,
      trailerLeaking: null,
      trailerContainsStrongOdours: null
    };
    
    // Get task details from taskList for fallback
    const taskData = this.taskList.find(t => t.taskID === taskId);
    
    // Load data from API - show popup even if API fails or returns no data
    this.weighbridgeService.getRaiseIssuesDetails(taskId).then((res: any) => {
      this.isLoadingRaiseIssues = false;
      
      // Handle different response formats (wrapped or direct)
      const responseData = res?.responseData || res;
      const isValidResponse = (res && res.responseCode === 200 && res.responseData) || (res && !res.responseCode);
      
      if (isValidResponse && responseData) {
        
        this.raiseIssuesData = responseData;
        // Populate form with existing data - handle both camelCase and PascalCase
        if (this.raiseIssuesData) {
          const trailerLeakingValue = this.raiseIssuesData.trailerLeaking ?? this.raiseIssuesData.TrailerLeaking ?? null;
          const trailerOdoursValue = this.raiseIssuesData.trailerHavingOdours ?? this.raiseIssuesData.TrailerHavingOdours ?? 
                                     this.raiseIssuesData.trailerContainsStrongOdours ?? this.raiseIssuesData.TrailerContainsStrongOdours ?? null;
          
          // Convert to boolean - handle true/false, 'true'/'false', 'True'/'False', 1/0
          const leakingStr = typeof trailerLeakingValue === 'string' ? trailerLeakingValue.toLowerCase() : null;
          const odoursStr = typeof trailerOdoursValue === 'string' ? trailerOdoursValue.toLowerCase() : null;
          
          this.raiseIssuesFormData.trailerLeaking = trailerLeakingValue === true || leakingStr === 'true' || trailerLeakingValue === 1 ? true : 
                                                     trailerLeakingValue === false || leakingStr === 'false' || trailerLeakingValue === 0 ? false : null;
          this.raiseIssuesFormData.trailerContainsStrongOdours = trailerOdoursValue === true || odoursStr === 'true' || trailerOdoursValue === 1 ? true :
                                                                  trailerOdoursValue === false || odoursStr === 'false' || trailerOdoursValue === 0 ? false : null;
           this.raiseIssuesData = {
          taskID: taskId,
          customer: taskData?.customer || '-',
          product: taskData?.product || '-',
          productCategory: taskData?.productCategory || '-',
          productEstWeight: taskData?.productEstWeight || '0',
          driverName: taskData?.driverName || '-',
          status: taskData?.status || '-',
          vehicle: taskData?.vehicle || '-',
          trailerIn: taskData?.trailerIn || '-',
          pickupLocation: taskData?.pickupLocation || '-',
          planner: taskData?.planner || '-' 
        };
          console.log('Raise Issues Form Data:', this.raiseIssuesFormData);
        }
      } else {
        // If no API data, use selected task data from taskList (similar to openWeighTrailerPopup)
        this.raiseIssuesData = {
          taskID: taskId,
          customer: taskData?.customer || '-',
          product: taskData?.product || '-',
          productCategory: taskData?.productCategory || '-',
          productEstWeight: taskData?.productEstWeight || '0',
          driverName: taskData?.driverName || '-',
          status: taskData?.status || '-',
          vehicle: taskData?.vehicle || '-',
          trailerIn: taskData?.trailerIn || '-',
          pickupLocation: taskData?.pickupLocation || '-',
          planner: taskData?.planner || '-',
          trailerLeaking: null,
          trailerContainsStrongOdours: null
        };
      }
    }).catch((error: any) => {
      this.isLoadingRaiseIssues = false;
      console.error('Error loading raise issues data:', error);
      // Fallback to task list data (similar to openWeighTrailerPopup)
      this.raiseIssuesData = {
        taskID: taskId,
        customer: taskData?.customer || '-',
        product: taskData?.product || '-',
        productCategory: taskData?.productCategory || '-',
        productEstWeight: taskData?.productEstWeight || '0',
        driverName: taskData?.driverName || '-',
        status: taskData?.status || '-',
        vehicle: taskData?.vehicle || '-',
        trailerIn: taskData?.trailerIn || '-',
        pickupLocation: taskData?.pickupLocation || '-',
        planner: taskData?.planner || '-',
        trailerLeaking: null,
        trailerContainsStrongOdours: null
      };
    });
  }
  
  // Close Raise Issues popup
  closeRaiseIssuesPopup() {
    this.showRaiseIssuesPopup = false;
    this.raiseIssuesData = null;
    this.raiseIssuesFormData = {
      taskId: null,
      trailerLeaking: null,
      trailerContainsStrongOdours: null
    };
  }
  
  // Set trailer leaking value
  setTrailerLeaking(value: boolean) {
    this.raiseIssuesFormData.trailerLeaking = value;
  }
  
  // Set trailer contains strong odours value
  setTrailerOdours(value: boolean) {
    this.raiseIssuesFormData.trailerContainsStrongOdours = value;
  }
  
  // Save Raise Issues data
  saveRaiseIssuesData() {
    // Validate form
    if (this.raiseIssuesFormData.trailerLeaking === null && this.raiseIssuesFormData.trailerContainsStrongOdours === null) {
      this.utilServ.toaster.next({ 
        type: customToaster.warningToast, 
        message: 'Please select at least one issue option' 
      });
      return;
    }
    
    this.isSavingRaiseIssues = true;
    
    const saveModel = {
      TaskId: this.raiseIssuesFormData.taskId,
      TrailerLeaking: this.raiseIssuesFormData.trailerLeaking,
      TrailerHavingOdours: this.raiseIssuesFormData.trailerContainsStrongOdours,
      CreatedBy:  "User"//this.loggedInUser?.employeeId || this.loggedInUser?.EmployeeId || this.loggedInUser?.id || null
    };
    
    this.weighbridgeService.saveRaiseIssuesData(saveModel).then((res: any) => {
      this.isSavingRaiseIssues = false;
      if (res && res.success === true) {
        this.utilServ.toaster.next({ 
          type: customToaster.successToast, 
          message: 'Issue report sent successfully' 
        });
        this.closeRaiseIssuesPopup();
        this.selectedTasks.clear();
        this.loadTaskList();
      } else {
        this.utilServ.toaster.next({ 
          type: customToaster.errorToast, 
          message: res?.message || 'Failed to send issue report' 
        });
      }
    }).catch((error: any) => {
      this.isSavingRaiseIssues = false;
      console.error('Error saving raise issues data:', error);
      this.utilServ.toaster.next({ 
        type: customToaster.errorToast, 
        message: 'Failed to send issue report' 
      });
    });
  }

  // Get status class for styling
  getStatusClass(status: string): string {
    if (!status) return '';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('completed') || statusLower.includes('weighed')) {
      return 'status-completed';
    } else if (statusLower.includes('transit') || statusLower.includes('progress')) {
      return 'status-in-transit';
    } else if (statusLower.includes('arrived')) {
      return 'status-arrived';
    } else if (statusLower.includes('pending')) {
      return 'status-pending';
    }
    return 'status-default';
  }
  
  // Navigate to card section
  navigateToMenu(section: string) {
    // Filter tasks based on card clicked
    switch(section) {
      case 'total':
        this.filterByStatus('All');
        break;
      case 'transit':
        this.filterByStatus('Load in transit');
        break;
      case 'arrived':
        this.filterByStatus('Load arrived');
        break;
      case 'weighed':
        this.filterByStatus('Weighed');
        break;
    }
  }
  
  // Export to Excel
  exportToExcel() {
    if (this.taskList.length === 0) {
      this.utilServ.toaster.next({ 
        type: customToaster.warningToast, 
        message: 'No data to export' 
      });
      return;
    }
    
    try {
      const exportData = this.taskList.map((item: any) => ({
        'No': item.no,
        'TaskID': item.taskID,
        'Planner': item.planner,
        'Customer': item.customer,
        'Product': item.product,
        'Pickup Location': item.pickupLocation,
        'Vehicle': item.vehicle,
        'Driver': item.driverName,
        'Status': item.status,
        'Trailer In': item.trailerIn,
        'Product Est Weight': item.productEstWeight,
        'Product Category': item.productCategory,
        'Trailer In Type': item.trailerInType,
        'Changeover Location': item.changeoverLocation
      }));
      
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Weighbridge Tasks');
      
      const now = new Date();
      const dateStr = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}`;
      const fileName = `weighbridge_tasks_${dateStr}.xlsx`;
      
      XLSX.writeFile(wb, fileName);
      
      this.utilServ.toaster.next({ 
        type: customToaster.successToast, 
        message: 'Excel file exported successfully' 
      });
    } catch (error) {
      console.error('Export to Excel failed:', error);
      this.utilServ.toaster.next({ 
        type: customToaster.errorToast, 
        message: 'Failed to export Excel file' 
      });
    }
  }
  
  // Export to CSV
  exportToCSV() {
    if (this.taskList.length === 0) {
      this.utilServ.toaster.next({ 
        type: customToaster.warningToast, 
        message: 'No data to export' 
      });
      return;
    }
    
    try {
      const headers = ['No', 'TaskID', 'Planner', 'Customer', 'Product', 'Pickup Location', 
                       'Vehicle', 'Driver', 'Status', 'Trailer In', 'Product Est Weight',
                       'Product Category', 'Trailer In Type', 'Changeover Location'];
      
      let csvContent = headers.join(',') + '\n';
      
      this.taskList.forEach((item: any) => {
        const row = [
          item.no,
          `"${item.taskID}"`,
          `"${item.planner}"`,
          `"${item.customer}"`,
          `"${item.product}"`,
          `"${item.pickupLocation}"`,
          `"${item.vehicle}"`,
          `"${item.driverName}"`,
          `"${item.status}"`,
          `"${item.trailerIn}"`,
          `"${item.productEstWeight}"`,
          `"${item.productCategory}"`,
          `"${item.trailerInType}"`,
          `"${item.changeoverLocation}"`
        ];
        csvContent += row.join(',') + '\n';
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      const now = new Date();
      const dateStr = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}`;
      const fileName = `weighbridge_tasks_${dateStr}.csv`;
      
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.utilServ.toaster.next({ 
        type: customToaster.successToast, 
        message: 'CSV file exported successfully' 
      });
    } catch (error) {
      console.error('Export to CSV failed:', error);
      this.utilServ.toaster.next({ 
        type: customToaster.errorToast, 
        message: 'Failed to export CSV file' 
      });
    }
  }
  
  // Refresh data
  refreshData() {
    this.loadOverviewCount();
    this.loadTaskList();
  }
}
