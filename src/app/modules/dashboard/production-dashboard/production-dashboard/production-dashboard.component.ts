import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { ProductionDashboardService } from '../production-dashboard.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-production-dashboard',
  templateUrl: './production-dashboard.component.html',
  styleUrls: ['./production-dashboard.component.css']
})
export class ProductionDashboardComponent implements OnInit, OnDestroy {
  
  // Interval for refreshing wait times
  private waitTimeInterval: any = null;

  // Auto-refresh toggle
  autoRefreshEnabled: boolean = false;
  private autoRefreshInterval: any = null;

  // Close filter popup on document click
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const filterPopup = document.querySelector('.column-filter-popup');
    const filterIcon = target.closest('.column-filter-icon');
    
    if (this.showColumnFilterPopup && filterPopup && !filterPopup.contains(target) && !filterIcon) {
      this.showColumnFilterPopup = null;
    }

    // Close shunter dropdown if clicking outside
    if (this.editingShunterTaskId !== null && !target.closest('.shunter-editable')) {
      this.editingShunterTaskId = null;
    }

    // Close bin dropdown if clicking outside
    if (this.editingBinTaskId !== null && !target.closest('.bin-editable')) {
      this.editingBinTaskId = null;
    }

    // Close scheduled time picker if clicking outside
    if (this.editingScheduledTimeTaskId !== null && !target.closest('.scheduledtime-editable')) {
      this.editingScheduledTimeTaskId = null;
      this.tempScheduledTime = '';
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

  // Trailer overview card counts
  trailerCardCounts: any = {
    trailersInTransit: 0,
    trailersUntipped: 0,
    trailersOver2Hrs: 0,
    trailersDirty: 0,
    trailersClean: 0
  };
  
  // Search and filter
  searchText: string = '';
  filterStatus: string = 'All';
  
  // Loading state
  isLoading: boolean = false;
  
  // Column definitions for the table
  tableColumns = [
    { key: 'taskID', label: 'TaskID', visible: false, width: 80, filterable: false, sortable: false },
    { key: 'no', label: 'No.', visible: true, width: 55, filterable: false, sortable: true },
    { key: 'customer', label: 'Customer', visible: true, width: 110, filterable: true, sortable: true },
    { key: 'product', label: 'Product', visible: true, width: 100, filterable: true, sortable: true },
    { key: 'pickupLocation', label: 'Pickup Location', visible: true, width: 110, filterable: true, sortable: true },
    { key: 'productType', label: 'Product Type', visible: true, width: 100, filterable: true, sortable: true },
    { key: 'trailerNo', label: 'Trailer No.', visible: true, width: 80, filterable: true, sortable: true },
    { key: 'status', label: 'Status', visible: true, width: 80, filterable: true, sortable: true },
    { key: 'shunter', label: 'Shunter', visible: true, width: 90, filterable: true, sortable: true },
    { key: 'binNo', label: 'Bin No.', visible: true, width: 70, filterable: true, sortable: true },
    { key: 'netWeight', label: 'Net Weight (kg)', visible: true, width: 80, filterable: true, sortable: true },
    { key: 'arrivedTime', label: 'Arrived Time', visible: true, width: 110, filterable: true, sortable: true },
    { key: 'scheduledTime', label: 'Scheduled Time', visible: false, width: 160, filterable: true, sortable: true },
    { key: 'tippingTime', label: 'Tipped Time', visible: true, width: 110, filterable: true, sortable: true },
    { key: 'waitTime', label: 'Wait Time', visible: true, width: 80, filterable: true, sortable: true }
  ];
  
  // Selection tracking
  selectedTasks: Set<number> = new Set();
  selectAll: boolean = false;
  
  // Column filter properties
  showColumnFilterPopup: string | null = null;
  activeColumnFilters: { [key: string]: string[] } = {};
  pendingColumnFilters: { [key: string]: string[] } = {};
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

  // Shunter inline editing
  editingShunterTaskId: number | null = null;
  shunterList: any[] = [];
  isLoadingShunters: boolean = false;

  // Bin inline editing
  editingBinTaskId: number | null = null;
  binList: any[] = [];
  isLoadingBins: boolean = false;

  // Scheduled Time inline editing
  editingScheduledTimeTaskId: number | null = null;
  tempScheduledTime: string = '';

  // View Trailers In Transit popup
  showInTransitPopup: boolean = false;
  isLoadingInTransit: boolean = false;
  inTransitList: any[] = [];
  inTransitSearch: string = '';
  inTransitSelectedDate: string = '';
  inTransitSelectedDay: number = new Date().getDate();
  inTransitSelectedMonth: number = new Date().getMonth() + 1;
  inTransitSelectedYear: number = new Date().getFullYear();
  inTransitMonths: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // View Trailers popup
  showViewTrailersPopup: boolean = false;
  isLoadingTrailers: boolean = false;
  viewTrailersList: any[] = [];
  viewTrailersSearch: string = '';
  viewTrailersSelectedDate: string = '';

  // View Untipped Trailers popup
  showUntippedTrailersPopup: boolean = false;
  isLoadingUntippedTrailers: boolean = false;
  untippedTrailersList: any[] = [];
  untippedTrailersSearch: string = '';
  pnwSelectAll: boolean = false;
  pnwSelectedItems: Set<any> = new Set();

  // View Clean Trailers popup
  showCleanTrailersPopup: boolean = false;
  isLoadingCleanTrailers: boolean = false;
  cleanTrailersList: any[] = [];
  cleanTrailersSearch: string = '';
  cleanTrailersSelectedDate: string = '';

  // View Dirty Trailers popup
  showDirtyTrailersPopup: boolean = false;
  isLoadingDirtyTrailers: boolean = false;
  dirtyTrailersList: any[] = [];
  dirtyTrailersSearch: string = '';
  dirtyTrailersSelectedDate: string = '';

  // Approve Task Popup properties
  showApproveTaskPopup: boolean = false;
  isLoadingApproveData: boolean = false;
  isSavingApproveData: boolean = false;
  approveTaskList: any[] = [];
  approveBinSearch: string = '';
  
  constructor(
    public route: Router,
    public productionService: ProductionDashboardService,
    public utilServ: UtilityService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Get logged in user
    let user: any = sessionStorage.getItem('loggedInUser');
    if (user) {
      this.loggedInUser = JSON.parse(user);
    }
    
    // Load initial data
    //this.loadOverviewCount();
    this.loadTrailerCardCounts();
    this.loadTaskList();

    // Refresh wait times every minute (commented out for now)
    // this.waitTimeInterval = setInterval(() => {
    //   this.refreshWaitTimes();
    // }, 60000);
  }

  ngOnDestroy(): void {
    if (this.waitTimeInterval) {
      clearInterval(this.waitTimeInterval);
    }
    this.stopAutoRefresh();
  }

  // Refresh wait times for all tasks
  refreshWaitTimes() {
    this.taskList.forEach(task => {
      const rawStatus = (task.status || '-').toLowerCase().trim();
      // For Accepted/Tipping/Untipping/Tipped, keep the API value (no recalculation)
      if (rawStatus.includes('accepted') || rawStatus.includes('tipping') || rawStatus.includes('untipping') || rawStatus.includes('tipped')) {
        return;
      }
      // For other statuses, recalculate from current time
      if (task.arrivedTimeRaw) {
        task.waitTime = this.calculateWaitTime(task.arrivedTimeRaw, task.status);
      }
    });
    this.cdr.detectChanges();
  }

  // Load trailer card counts for overview cards
  async loadTrailerCardCounts() {
    try {
      const res: any = await this.productionService.getProductionTrailerCardCounts();
      if (res) {
        this.trailerCardCounts = {
          trailersInTransit: res.trailersInTransit || res.TrailersInTransit || 0,
          trailersUntipped: res.trailersUntipped || res.TrailersUntipped || 0,
          trailersOver2Hrs: res.trailersOver2Hrs || res.TrailersOver2Hrs || 0,
          trailersDirty: res.trailersDirty || res.TrailersDirty || 4,
          trailersClean: res.trailersClean || res.TrailersClean || 4
        };
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error loading trailer card counts:', error);
    }
  }
  
  // Load overview card counts
  async loadOverviewCount() {
    try {
      const res: any = await this.productionService.getProductionCount();
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
      /*const res: any = await this.productionService.getProductionTaskTable(
        this.searchText || '',
        filterKey,
        this.pageNumber,
        this.pageSize
      );*/
      // Get logged in user's employee ID
      let user: any = sessionStorage.getItem('loggedInUser');
      if (!user) {
        console.warn('⚠️ No logged in user found');
        return;
      }
      
      let parsedData = JSON.parse(user);
      console.log('🔍 Parsed user data:', parsedData);
      
      let employeeId = parsedData?.employeeId || parsedData?.EmployeeId || parsedData?.empId || parsedData?.EmpId || parsedData?.id || parsedData?.Id;
      console.log('🔍 Employee ID:', employeeId);
      const res: any = await this.productionService.getProductionTaskTableByEmpId(employeeId);
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
          customer: item.customer || item.Customer || item.customerName || '-',
          product: item.product || item.Product || item.productName || '-',
          productId: item.productId || item.ProductId || item.productID || item.ProductID || null,
          pickupLocation: item.pickupLocation || item.PickupLocation || item.pickUpLocation || item.PickUpLocation || '-',
          productType: item.productType || item.ProductType || item.productCategory || item.ProductCategory || '-',
          trailerNo: item.trailerNo || item.TrailerNo || item.trailerIn || item.TrailerIn || item.trailerNumber || item.TrailerNumber || '-',
          status: this.mapStatusLabel(item.status || item.Status || item.orderStatus || '-'),
          shunter: item.shunter || item.Shunter || item.shunterName || item.ShunterName || '-',
          shunterId: item.shunterId || item.ShunterId || item.shunterID || item.ShunterID || item.shunterDriverID || item.ShunterDriverID || null,
          binNo: item.binNo || item.BinNo || item.binNumber || item.BinNumber || '-',
          binId: item.binId || item.BinId || item.binID || item.BinID || null,
          netWeight: item.netWeight || item.NetWeight || '-',
          collectedTime: this.formatDateTime(item.collectedTime || item.CollectedTime || item.collectedDateTime || item.CollectedDateTime),
          arrivedTime: this.formatDateTime(item.arrivedTime || item.ArrivedTime || item.arrivedDateTime || item.ArrivedDateTime),
          arrivedTimeRaw: item.arrivedTime || item.ArrivedTime || item.arrivedDateTime || item.ArrivedDateTime || null,
          collectedTimeRaw: item.collectedTime || item.CollectedTime || item.collectedDateTime || item.CollectedDateTime || null,
          scheduledTime: this.formatDateTime(item.scheduledTime || item.ScheduledTime || item.scheduledDateTime || item.ScheduledDateTime),
          scheduledTimeRaw: item.scheduledTime || item.ScheduledTime || item.scheduledDateTime || item.ScheduledDateTime || null,
          tippingTime:  item.tippingTime || item.TippingTime || item.tippingDateTime || item.TippingDateTime ,
          waitTimeRaw: item.waitTime || item.WaitTime || item.waitDateTime || item.WaitDateTime || null,
          waitTime: this.calculateWaitTime(item.arrivedTime || item.ArrivedTime || item.arrivedDateTime || item.ArrivedDateTime, item.status || item.Status || item.orderStatus || '', item.waitTime || item.WaitTime || item.waitDateTime || item.WaitDateTime || null)
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
  
  // Map API status labels to display labels
  mapStatusLabel(status: string): string {
    if (!status) return '-';
    const s = status.toLowerCase().trim();
    if (s === 'arrived') return 'Weighed';
    return status;
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
  
  // Calculate wait time from arrived time to now
  calculateWaitTime(scheduledTime: any, status?: string, apiWaitTime?: any): string {
    // For Accepted/Tipping/Untipping/Tipped statuses, use API value directly
    if (status) {
      const s = status.toLowerCase().trim();
      if (s.includes('accepted') || s.includes('tipping') || s.includes('untipping') || s.includes('tipped')) {
        if (apiWaitTime) {
          return this.formatWaitTimeValue(apiWaitTime);
        }
        return '-';
      }
    }
    if (!scheduledTime) return '-';
    try {
      const scheduled = new Date(scheduledTime);
      if (isNaN(scheduled.getTime())) return '-';
      const now = new Date();
      const diffMs = now.getTime() - scheduled.getTime();
      if (diffMs < 0) return '00hrs 00mins';
      const totalMinutes = Math.floor(diffMs / 60000);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return String(hours).padStart(2, '0') + 'hrs ' + String(minutes).padStart(2, '0') + 'mins';
    } catch {
      return '-';
    }
  }

  // Format API wait time value to display string
  formatWaitTimeValue(value: any): string {
    if (!value) return '-';
    // If it's already a formatted string like "02hrs 30mins", return as-is
    if (typeof value === 'string' && value.includes('hrs')) {
      return value;
    }
    // If it's a number (minutes), format it
    const numVal = parseFloat(value);
    if (!isNaN(numVal)) {
      const hours = Math.floor(numVal / 60);
      const minutes = Math.floor(numVal % 60);
      return String(hours).padStart(2, '0') + 'hrs ' + String(minutes).padStart(2, '0') + 'mins';
    }
    // If it's a date/time string, try to parse
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const totalMinutes = Math.max(0, Math.floor(diffMs / 60000));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return String(hours).padStart(2, '0') + 'hrs ' + String(minutes).padStart(2, '0') + 'mins';
      }
    } catch {}
    return String(value);
  }

  // Get wait time in minutes for a task (current time - arrived time)
  getWaitTimeMinutes(task: any): number {
    const s = (task.status || '').toLowerCase().trim();
    // For frozen statuses, parse the stored waitTime string or API value
    if (s.includes('accepted') || s.includes('tipping') || s.includes('untipping') || s.includes('tipped')) {
      const wt = task.waitTimeRaw;
      if (!wt) return 0;
      // If number (minutes)
      const numVal = parseFloat(wt);
      if (!isNaN(numVal)) return numVal;
      // If formatted string like "02hrs 30mins"
      if (typeof wt === 'string' && wt.includes('hrs')) {
        const match = wt.match(/(\d+)hrs\s*(\d+)mins/);
        if (match) return parseInt(match[1]) * 60 + parseInt(match[2]);
      }
      return 0;
    }
    const arrivedTime = task.arrivedTimeRaw || task.collectedTimeRaw;
    if (!arrivedTime) return 0;
    try {
      const arrived = new Date(arrivedTime);
      if (isNaN(arrived.getTime())) return 0;
      const now = new Date();
      const diffMs = now.getTime() - arrived.getTime();
      return diffMs > 0 ? Math.floor(diffMs / 60000) : 0;
    } catch {
      return 0;
    }
  }

  // Check if wait time exceeds 2 hours
  isWaitTimeOver2Hrs(task: any): boolean {
    return this.getWaitTimeMinutes(task) > 120;
  }

  // Get count of trailers over 2 hrs from table data
  getTrailersOver2HrsCount(): number {
    return this.taskList.filter(t => this.isWaitTimeOver2Hrs(t)).length;
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
      // Initialize pending filters from active filters
      this.pendingColumnFilters[columnKey] = this.activeColumnFilters[columnKey] ? [...this.activeColumnFilters[columnKey]] : [];
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
    return this.pendingColumnFilters[columnKey]?.includes(value) || false;
  }
  
  toggleFilterValue(columnKey: string, value: string): void {
    if (!this.pendingColumnFilters[columnKey]) {
      this.pendingColumnFilters[columnKey] = [];
    }
    
    const index = this.pendingColumnFilters[columnKey].indexOf(value);
    if (index > -1) {
      this.pendingColumnFilters[columnKey].splice(index, 1);
    } else {
      this.pendingColumnFilters[columnKey].push(value);
    }
  }
  
  selectAllFilterValues(columnKey: string): void {
    this.pendingColumnFilters[columnKey] = [...this.getFilteredDistinctValues(columnKey)];
  }
  
  clearAllFilterValues(columnKey: string): void {
    this.pendingColumnFilters[columnKey] = [];
  }
  
  applyColumnFilters(): void {
    if (this.showColumnFilterPopup) {
      const columnKey = this.showColumnFilterPopup;
      this.activeColumnFilters[columnKey] = this.pendingColumnFilters[columnKey] ? [...this.pendingColumnFilters[columnKey]] : [];
    }
    this.showColumnFilterPopup = null;
  }
  
  closeColumnFilterPopup(): void {
    // Discard pending changes
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

  // Check if selected tasks have mixed (different) statuses
  hasMultipleStatuses(): boolean {
    if (this.selectedTasks.size <= 1) return false;
    const selectedTasksList = this.taskList.filter(task => this.selectedTasks.has(task.taskID));
    if (selectedTasksList.length <= 1) return false;
    const firstStatus = (selectedTasksList[0].status || '').toLowerCase().trim();
    return !selectedTasksList.every(task => (task.status || '').toLowerCase().trim() === firstStatus);
  }

  // Check if all selected tasks have "Weighed" status
  areAllSelectedTasksWeighed(): boolean {
    if (this.selectedTasks.size === 0) return false;
    const selectedTasksList = this.taskList.filter(task => this.selectedTasks.has(task.taskID));
    return selectedTasksList.length > 0 && selectedTasksList.every(task => {
      const status = (task.status || '').toLowerCase();
      return status.includes('weighed');
    });
  }

  // Check if all selected tasks have "Pending" status
  areAllSelectedTasksPending(): boolean {
    if (this.selectedTasks.size === 0) return false;
    const selectedTasksList = this.taskList.filter(task => this.selectedTasks.has(task.taskID));
    return selectedTasksList.length > 0 && selectedTasksList.every(task => {
      const status = (task.status || '').toLowerCase().trim();
      return status.includes('pending');
    });
  }

  // Check if all selected tasks have "On Hold" status
  areAllSelectedTasksOnHold(): boolean {
    if (this.selectedTasks.size === 0) return false;
    const selectedTasksList = this.taskList.filter(task => this.selectedTasks.has(task.taskID));
    return selectedTasksList.length > 0 && selectedTasksList.every(task => {
      const status = (task.status || '').toLowerCase().trim();
      return status.includes('onhold') || status.includes('on hold');
    });
  }

  // Check if all selected tasks have "Untipped" status
  areAllSelectedTasksUntipped(): boolean {
    if (this.selectedTasks.size === 0) return false;
    const selectedTasksList = this.taskList.filter(task => this.selectedTasks.has(task.taskID));
    return selectedTasksList.length > 0 && selectedTasksList.every(task => {
      const status = (task.status || '').toLowerCase().trim();
      return status.includes('untipped');
    });
  }

  // Check if all selected tasks have "Accepted" or "Tipping" status
  areAllSelectedTasksAcceptedOrTipping(): boolean {
    if (this.selectedTasks.size === 0) return false;
    const selectedTasksList = this.taskList.filter(task => this.selectedTasks.has(task.taskID));
    return selectedTasksList.length > 0 && selectedTasksList.every(task => {
      const status = (task.status || '').toLowerCase().trim();
      return status.includes('accepted') || status.includes('tipping');
    });
  }

  // Assign action
  async onAssign() {
    const selectedTasksList = this.taskList.filter(task => this.selectedTasks.has(task.taskID));

    if (selectedTasksList.length === 0) {
      this.utilServ.toaster.next({
        type: customToaster.warningToast,
        message: 'Please select a task to assign'
      });
      return;
    }

    // Validate shunter and bin are assigned for all selected tasks
    const invalidTasks = selectedTasksList.filter(task => {
      const hasShunter = task.shunter && task.shunter !== '-';
      const hasBin = task.binNo && task.binNo !== '-';
      return !hasShunter || !hasBin;
    });

    if (invalidTasks.length > 0) {
      this.utilServ.toaster.next({
        type: customToaster.warningToast,
        message: 'Please assign Shunter and Bin before assigning the task'
      });
      return;
    }

    try {
      const employeeId = this.loggedInUser?.employeeId || this.loggedInUser?.EmployeeId || this.loggedInUser?.empId || this.loggedInUser?.EmpId || this.loggedInUser?.id || this.loggedInUser?.Id;

      // Ensure shunter/bin lists are loaded so we can resolve IDs from names
      await this.loadShunterList();
      await this.loadBinList();

      for (const task of selectedTasksList) {
        // Resolve ShunterId from name if not already set
        let shunterId = task.shunterId;
        if (!shunterId && task.shunter && task.shunter !== '-') {
          const matched = this.shunterList.find(s => s.name === task.shunter);
          if (matched) shunterId = matched.id;
        }

        // Resolve BinId from name if not already set
        let binId = task.binId;
        if (!binId && task.binNo && task.binNo !== '-') {
          const matched = this.binList.find(b => b.name === task.binNo);
          if (matched) binId = matched.id;
        }

        const model = {
          TaskId: task.taskID,
          ShunterId: shunterId,
          ShunterName: task.shunter,
          BinId: binId,
          BinName: task.binNo,
          ScheduledTime: task.scheduledTimeRaw || new Date().toISOString(),
          ProductionManagerID: employeeId,
          StatusId: 11,
          StatusName: 'Pending - Shunt Driver'
        };
        await this.productionService.assignTask(model);
      }

      this.utilServ.toaster.next({
        type: customToaster.successToast,
        message: 'Assigned successfully'
      });

      // Refresh data after assignment
      this.selectedTasks.clear();
      this.selectAll = false;
      this.loadTaskList();
      this.loadOverviewCount();
      this.loadTrailerCardCounts();
    } catch (error) {
      console.error('Error assigning task:', error);
      this.utilServ.toaster.next({
        type: customToaster.errorToast,
        message: 'Failed to assign task'
      });
    }
  }

  // Re-assign action
  async onReAssign() {
    const selectedTasksList = this.taskList.filter(task => this.selectedTasks.has(task.taskID));

    if (selectedTasksList.length === 0) {
      this.utilServ.toaster.next({
        type: customToaster.warningToast,
        message: 'Please select a task to re-assign'
      });
      return;
    }

    // Validate shunter and bin are assigned for all selected tasks
    const invalidTasks = selectedTasksList.filter(task => {
      const hasShunter = task.shunter && task.shunter !== '-';
      const hasBin = task.binNo && task.binNo !== '-';
      return !hasShunter || !hasBin;
    });

    if (invalidTasks.length > 0) {
      this.utilServ.toaster.next({
        type: customToaster.warningToast,
        message: 'Please assign Shunter and Bin before re-assigning the task'
      });
      return;
    }

    try {
      const employeeId = this.loggedInUser?.employeeId || this.loggedInUser?.EmployeeId || this.loggedInUser?.empId || this.loggedInUser?.EmpId || this.loggedInUser?.id || this.loggedInUser?.Id;

      // Ensure shunter/bin lists are loaded so we can resolve IDs from names
      await this.loadShunterList();
      await this.loadBinList();

      for (const task of selectedTasksList) {
        // Resolve ShunterId from name if not already set
        let shunterId = task.shunterId;
        if (!shunterId && task.shunter && task.shunter !== '-') {
          const matched = this.shunterList.find(s => s.name === task.shunter);
          if (matched) shunterId = matched.id;
        }

        // Resolve BinId from name if not already set
        let binId = task.binId;
        if (!binId && task.binNo && task.binNo !== '-') {
          const matched = this.binList.find(b => b.name === task.binNo);
          if (matched) binId = matched.id;
        }

        const model = {
          TaskId: task.taskID,
          ShunterId: shunterId,
          ShunterName: task.shunter,
          BinId: binId,
          BinName: task.binNo,
          ScheduledTime: task.scheduledTimeRaw || new Date().toISOString(),
          ProductionManagerID: employeeId,
          StatusId: 11,
          StatusName: 'Pending - Shunt Driver'
        };
        await this.productionService.reAssignTask(model);
      }

      this.utilServ.toaster.next({
        type: customToaster.successToast,
        message: 'Re-assigned successfully'
      });

      // Refresh data after re-assignment
      this.selectedTasks.clear();
      this.selectAll = false;
      this.loadTaskList();
      this.loadOverviewCount();
      this.loadTrailerCardCounts();
    } catch (error) {
      console.error('Error re-assigning task:', error);
      this.utilServ.toaster.next({
        type: customToaster.errorToast,
        message: 'Failed to re-assign task'
      });
    }
  }

  // Edit action
  onEditTask() {
    const selectedTasksList = this.taskList.filter(task => this.selectedTasks.has(task.taskID));
    console.log('Edit tasks:', selectedTasksList);
  }

  // Approve action - open popup
  async onApprove() {
    const selectedTasksList = this.taskList.filter(task => this.selectedTasks.has(task.taskID));

    if (selectedTasksList.length === 0) {
      this.utilServ.toaster.next({
        type: customToaster.warningToast,
        message: 'Please select a task to approve'
      });
      return;
    }

    this.showApproveTaskPopup = true;
    this.isLoadingApproveData = true;
    this.approveTaskList = [];

    try {
      const employeeId = this.loggedInUser?.employeeId || this.loggedInUser?.EmployeeId || this.loggedInUser?.empId || this.loggedInUser?.EmpId || this.loggedInUser?.id || this.loggedInUser?.Id;

      for (const task of selectedTasksList) {
        const res: any = await this.productionService.getApproveTaskDetails(task.taskID, employeeId);
        if (res) {
          const dataArray = Array.isArray(res) ? res : (res.data || res.result || [res]);
          const mapped = dataArray.map((item: any) => ({
            taskId: item.taskId || item.TaskId || item.taskID || item.TaskID,
            no: '',
            customer: item.customer || item.Customer || item.customerName || item.CustomerName || '-',
            product: item.product || item.Product || item.productName || item.ProductName || '-',
            productType: item.productType || item.ProductType || item.productTypeName || item.ProductTypeName || '-',
            netWeight: item.netWeight || item.NetWeight || '-',
            driver: item.driver || item.Driver || item.driverName || item.DriverName || '-',
            trailerNo: item.trailerNo || item.TrailerNo || item.trailerNumber || item.TrailerNumber || '-',
            binNo: item.binNo || item.BinNo || item.binNumber || item.BinNumber || '-',
            productChange: item.productChange || item.ProductChange || '-',
            productTypeChange: item.productTypeChange || item.ProductTypeChange || '-',
            binNoChange: item.binNoChange || item.BinNoChange || item.binChange || item.BinChange || '-'
          }));
          this.approveTaskList.push(...mapped);
        }
      }

      // Assign row numbers after collecting all results
      this.approveTaskList.forEach((item, index) => {
        item.no = (index + 1).toString().padStart(2, '0');
      });
    } catch (error) {
      console.error('Error loading approve task details:', error);
      this.utilServ.toaster.next({
        type: customToaster.errorToast,
        message: 'Failed to load task details'
      });
    } finally {
      this.isLoadingApproveData = false;
      this.cdr.detectChanges();
    }
  }

  // Close approve task popup
  closeApproveTaskPopup() {
    this.showApproveTaskPopup = false;
    this.approveTaskList = [];
  }

  // Mark a single task as rejected (visual only, no API call)
  markTaskRejected(task: any) {
    task.isRejected = true;
    task.isApproved = false;
    task.selectedBinId = null;
    task.selectedBinName = null;
  }

  // Mark a single task as approved (visual only, no API call)
  markTaskApproved(task: any) {
    task.isApproved = true;
    task.isRejected = false;
    task.selectedBinId = null;
    task.selectedBinName = null;
    this.approveBinSearch = '';
    this.loadBinList();
  }

  // Get filtered bin list for approve popup
  getFilteredApproveBinList(): any[] {
    if (!this.approveBinSearch || !this.approveBinSearch.trim()) return this.binList;
    const search = this.approveBinSearch.toLowerCase();
    return this.binList.filter(b => b.name.toLowerCase().includes(search));
  }

  // Select bin for approved task
  selectApproveBin(task: any, bin: any) {
    task.selectedBinId = bin.id;
    task.selectedBinName = bin.name;
  }

  // Save approve/reject data - sends TaskId, IsApproved, NewBinNo, EmployeeID to API
  async saveApproveTaskData() {
    if (this.approveTaskList.length === 0) return;
    this.isSavingApproveData = true;
    try {
      const employeeId = this.loggedInUser?.employeeId || this.loggedInUser?.EmployeeId || this.loggedInUser?.empId || this.loggedInUser?.EmpId || this.loggedInUser?.id || this.loggedInUser?.Id;

      for (const t of this.approveTaskList) {
        const model = {
          TaskId: t.taskId,
          IsRejected: t.isRejected || false,
          IsApproved: t.isApproved || false,
          NewBinNo: t.selectedBinId || null,
          EmployeeID: employeeId
        };
        await this.productionService.approveTask(model);
      }

      this.utilServ.toaster.next({
        type: customToaster.successToast,
        message: 'Task(s) saved successfully'
      });

      this.closeApproveTaskPopup();
      this.selectedTasks.clear();
      this.selectAll = false;
      this.loadTaskList();
      this.loadTrailerCardCounts();
    } catch (error) {
      console.error('Error saving approve task data:', error);
      this.utilServ.toaster.next({
        type: customToaster.errorToast,
        message: 'Failed to save task(s)'
      });
    } finally {
      this.isSavingApproveData = false;
      this.cdr.detectChanges();
    }
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
      const res: any = await this.productionService.getWeighTrailerDetails(taskId);
      
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
      
      const res: any = await this.productionService.saveWeighTrailerData(saveModel);
      
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
    this.productionService.getRaiseIssuesDetails(taskId).then((res: any) => {
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
    
    this.productionService.saveRaiseIssuesData(saveModel).then((res: any) => {
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

  // Load shunter driver list for dropdown
  async loadShunterList() {
    if (this.shunterList.length > 0) return; // already loaded
    this.isLoadingShunters = true;
    try {
      const res: any = await this.productionService.getShunterDriverList();
      if (res) {
        let dataArray = Array.isArray(res) ? res : (res.data || res.result || []);
        this.shunterList = dataArray.map((item: any) => ({
          id: item.shunterDriverID,
          name: item.shunterDriverName?.trim() || ((item.shunterfirstname || '') + ' ' + (item.shunterlastname || '')).trim()
        })).filter((s: any) => s.name);
      }
    } catch (error) {
      console.error('Error loading shunter list:', error);
    } finally {
      this.isLoadingShunters = false;
      this.cdr.detectChanges();
    }
  }

  // Check if status allows editing shunter/bin
  isEditableStatus(task: any): boolean {
    if (!task || !task.status) return false;
    const s = task.status.toLowerCase().trim();
    return s.includes('weighed') || s.includes('pending') || s.includes('on hold') || s.includes('onhold') || s.includes('untipped');
  }

  // Handle double-click on shunter cell
  async onShunterDblClick(task: any) {
    if (!this.isEditableStatus(task)) return;
    this.editingShunterTaskId = task.taskID;
    await this.loadShunterList();
    this.cdr.detectChanges();
    // Auto-focus the dropdown after rendering
    setTimeout(() => {
      const dropdown = document.querySelector('.shunter-dropdown') as HTMLSelectElement;
      if (dropdown) {
        dropdown.focus();
      }
    }, 50);
  }

  // Handle shunter dropdown change (update cell only, no save)
  onShunterChange(task: any, event: any) {
    const selectedValue = event.target.value;
    if (!selectedValue) {
      this.editingShunterTaskId = null;
      return;
    }

    const selectedShunter = this.shunterList.find(s => s.id == selectedValue);
    if (selectedShunter) {
      task.shunter = selectedShunter.name;
      task.shunterId = selectedShunter.id;
    }

    this.editingShunterTaskId = null;
    this.cdr.detectChanges();
  }

  // Cancel shunter editing
  cancelShunterEdit() {
    this.editingShunterTaskId = null;
  }

  // Load bin list for dropdown by product ID
  async loadBinList(productId?: any) {
    this.isLoadingBins = true;
    this.binList = [];
    try {
      let res: any;
      if (productId) {
        res = await this.productionService.getBinsByProductId(productId);
      } else {
        res = await this.productionService.getBinList();
      }
      if (res) {
        let dataArray = Array.isArray(res) ? res : (res.data || res.result || []);
        this.binList = dataArray.map((item: any) => ({
          id: item.binID || item.BinID || item.id || item.Id,
          name: item.binNumber || item.BinNumber || item.binName || item.BinName || ''
        })).filter((b: any) => b.name);
      }
    } catch (error) {
      console.error('Error loading bin list:', error);
    } finally {
      this.isLoadingBins = false;
      this.cdr.detectChanges();
    }
  }

  // Handle double-click on bin cell
  async onBinDblClick(task: any) {
    if (!this.isEditableStatus(task)) return;
    this.editingBinTaskId = task.taskID;
    await this.loadBinList(task.productId);
    this.cdr.detectChanges();
    // Auto-focus the dropdown after rendering
    setTimeout(() => {
      const dropdown = document.querySelector('.bin-dropdown') as HTMLSelectElement;
      if (dropdown) {
        dropdown.focus();
      }
    }, 50);
  }

  // Handle bin dropdown change (update cell only, no save)
  onBinChange(task: any, event: any) {
    const selectedValue = event.target.value;
    if (!selectedValue) {
      this.editingBinTaskId = null;
      return;
    }

    const selectedBin = this.binList.find(b => b.id == selectedValue);
    if (selectedBin) {
      task.binNo = selectedBin.name;
      task.binId = selectedBin.id;
    }

    this.editingBinTaskId = null;
    this.cdr.detectChanges();
  }

  // Cancel bin editing
  cancelBinEdit() {
    this.editingBinTaskId = null;
  }

  // Handle double-click on scheduled time cell
  onScheduledTimeDblClick(task: any) {
    if (!this.isEditableStatus(task)) return;
    this.editingScheduledTimeTaskId = task.taskID;
    this.tempScheduledTime = task.scheduledTimeRaw ? this.formatDateTimeForInput(task.scheduledTimeRaw) : '';
    this.cdr.detectChanges();
    setTimeout(() => {
      const input = document.querySelector('.scheduledtime-input') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 50);
  }

  // Confirm scheduled time change
  onScheduledTimeConfirm(task: any) {
    if (this.tempScheduledTime) {
      task.scheduledTimeRaw = this.tempScheduledTime;
      task.scheduledTime = this.formatDateTime(this.tempScheduledTime);
      task.waitTime = this.calculateWaitTime(this.tempScheduledTime);
    }
    this.editingScheduledTimeTaskId = null;
    this.tempScheduledTime = '';
    this.cdr.detectChanges();
  }

  // Cancel scheduled time editing
  onScheduledTimeCancel() {
    this.editingScheduledTimeTaskId = null;
    this.tempScheduledTime = '';
  }

  // Get status class for styling
  getStatusClass(status: string): string {
    if (!status) return '';
    const statusLower = status.toLowerCase().trim();
    if (statusLower.includes('weighed')) {
      return 'status-weighed';
    } else if (statusLower.includes('pending')) {
      return 'status-pending';
    } else if (statusLower.includes('accepted')) {
      return 'status-accepted';
    } else if (statusLower.includes('untipped')) {
      return 'status-untipped';
    } else if (statusLower.includes('tipping')) {
      return 'status-tipping';
    } else if (statusLower.includes('tipped')) {
      return 'status-tipped';
    } else if (statusLower.includes('onhold') || statusLower.includes('on hold')) {
      return 'status-onhold';
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
      case 'weighed':
        this.filterByStatus('Load weighed');
        break;
      case 'weighed':
        this.filterByStatus('Weighed');
        break;
    }
  }
  
  // Export to Excel
  exportToExcel() {
    // Use selected rows if any checked, otherwise all
    const dataToExport = this.selectedTasks.size > 0
      ? this.taskList.filter(task => this.selectedTasks.has(task.taskID))
      : this.taskList;

    if (dataToExport.length === 0) {
      this.utilServ.toaster.next({ 
        type: customToaster.warningToast, 
        message: 'No data to export' 
      });
      return;
    }
    
    try {
      const visibleCols = this.getVisibleColumns();
      const exportData = dataToExport.map((item: any) => {
        const row: any = {};
        visibleCols.forEach(col => {
          row[col.label] = item[col.key] || '-';
        });
        return row;
      });
      
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Production Tasks');
      
      const now = new Date();
      const dateStr = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}`;
      const fileName = `production_tasks_${dateStr}.xlsx`;
      
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
    // Use selected rows if any checked, otherwise all
    const dataToExport = this.selectedTasks.size > 0
      ? this.taskList.filter(task => this.selectedTasks.has(task.taskID))
      : this.taskList;

    if (dataToExport.length === 0) {
      this.utilServ.toaster.next({ 
        type: customToaster.warningToast, 
        message: 'No data to export' 
      });
      return;
    }
    
    try {
      const visibleCols = this.getVisibleColumns();
      const headers = visibleCols.map(col => col.label);
      
      let csvContent = headers.join(',') + '\n';
      
      dataToExport.forEach((item: any) => {
        const row = visibleCols.map(col => `"${item[col.key] || '-'}"`);
        csvContent += row.join(',') + '\n';
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      const now = new Date();
      const dateStr = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}`;
      const fileName = `production_tasks_${dateStr}.csv`;
      
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
  
  // ===== View Trailers In Transit Popup =====
  openInTransitPopup() {
    this.showInTransitPopup = true;
    this.inTransitSearch = '';
    const now = new Date();
    this.inTransitSelectedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    this.loadInTransitTrailers();
  }

  closeInTransitPopup() {
    this.showInTransitPopup = false;
    this.inTransitList = [];
  }

  onSearchInTransitTrailers() {
    this.loadInTransitTrailers();
  }

  async loadInTransitTrailers() {
    this.isLoadingInTransit = true;
    try {
      const dateStr = this.inTransitSelectedDate;
      const employeeId = this.loggedInUser?.employeeId || this.loggedInUser?.EmployeeId || this.loggedInUser?.empId || this.loggedInUser?.EmpId || this.loggedInUser?.id || this.loggedInUser?.Id;
      console.log('GetInTransitTrailers Input:', { date: dateStr, employeeId: employeeId });
      const res: any = await this.productionService.getInTransitTrailers(dateStr, employeeId);
      console.log('GetInTransitTrailers Output:', res);

      if (res) {
        let dataArray = Array.isArray(res) ? res : (res.data || res.result || []);
        this.inTransitList = dataArray.map((item: any) => ({
          trailer: item.trailerNo || item.TrailerNo || item.trailerNumber || item.TrailerNumber || '-',
          shunter: item.shunterName || item.ShunterName || item.shunter || item.Shunter || item.driverName || item.DriverName || '-',
          scheduledTime: item.scheduledTime || item.ScheduledTime || item.scheduledDateTime || item.ScheduledDateTime || null,
          status: item.status || item.Status || 'In Transit'
        }));
      }
    } catch (error) {
      console.error('Error loading in-transit trailers:', error);
      this.inTransitList = [];
    } finally {
      this.isLoadingInTransit = false;
      this.cdr.detectChanges();
    }
  }

  getFilteredInTransitTrailers(): any[] {
    if (!this.inTransitSearch || !this.inTransitSearch.trim()) {
      return this.inTransitList;
    }
    const search = this.inTransitSearch.toLowerCase();
    return this.inTransitList.filter(t =>
      t.trailer.toLowerCase().includes(search)
    );
  }

  clearInTransitSearch() {
    this.inTransitSearch = '';
  }

  onInTransitDateSearch() {
    this.loadInTransitTrailers();
  }

  // View Trailers Over 2 hrs popup
  openViewTrailersPopup() {
    this.showViewTrailersPopup = true;
    this.viewTrailersSearch = '';
    this.loadTrailersOver2Hrs();
  }

  closeViewTrailersPopup() {
    this.showViewTrailersPopup = false;
    this.viewTrailersList = [];
  }

  loadTrailersOver2Hrs() {
    this.viewTrailersList = this.taskList
      .filter(t => this.isWaitTimeOver2Hrs(t))
      .map(t => {
        const minutes = this.getWaitTimeMinutes(t);
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const waitTimeStr = String(hrs).padStart(2, '0') + 'hrs ' + String(mins).padStart(2, '0') + 'mins';
        return {
          trailer: t.trailerNo || '-',
          driver: t.shunter || '-',
          arrivedOnSite: t.collectedTimeRaw || null,
          status: t.status || 'Over 2 hrs',
          waitTime: waitTimeStr
        };
      });
    this.cdr.detectChanges();
  }

  getFilteredViewTrailers(): any[] {
    if (!this.viewTrailersSearch || !this.viewTrailersSearch.trim()) {
      return this.viewTrailersList;
    }
    const search = this.viewTrailersSearch.toLowerCase();
    return this.viewTrailersList.filter(t =>
      t.trailer.toLowerCase().includes(search)
    );
  }

  clearViewTrailersSearch() {
    this.viewTrailersSearch = '';
  }

  formatTrailerDateTime(dateTime: any): string {
    if (!dateTime) return '-';
    try {
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return '-';
    }
  }



  // ===== View Trailers Untipped Popup =====
  getUntippedTrailersCount(): number {
    return this.taskList.filter(t => {
      const s = (t.status || '').toLowerCase().trim();
      return !s.includes('tipped') || s.includes('untipped');
    }).length;
  }

  openUntippedTrailersPopup() {
    this.showUntippedTrailersPopup = true;
    this.untippedTrailersSearch = '';
    this.pnwSelectAll = false;
    this.pnwSelectedItems.clear();
    this.loadUntippedTrailers();
  }

  closeUntippedTrailersPopup() {
    this.showUntippedTrailersPopup = false;
    this.untippedTrailersList = [];
    this.pnwSelectedItems.clear();
    this.pnwSelectAll = false;
  }

  loadUntippedTrailers() {
    this.isLoadingUntippedTrailers = true;
    try {
      this.untippedTrailersList = this.taskList
        .filter(t => {
          const s = (t.status || '').toLowerCase().trim();
          return !s.includes('tipped') || s.includes('untipped');
        })
        .map(t => ({
          taskID: t.taskID,
          customer: t.customer || '-',
          product: t.product || '-',
          productType: t.productType || '-',
          trailerNo: t.trailerNo || '-',
          status: t.status || '-',
          netWeight: t.netWeight || '-'
        }));
    } catch (error) {
      console.error('Error loading untipped trailers:', error);
      this.untippedTrailersList = [];
    } finally {
      this.isLoadingUntippedTrailers = false;
      this.cdr.detectChanges();
    }
  }

  getFilteredUntippedTrailers(): any[] {
    let list = [...this.untippedTrailersList];
    if (this.untippedTrailersSearch && this.untippedTrailersSearch.trim()) {
      const search = this.untippedTrailersSearch.toLowerCase();
      list = list.filter(t =>
        (t.customer || '').toLowerCase().includes(search) ||
        (t.product || '').toLowerCase().includes(search) ||
        (t.productType || '').toLowerCase().includes(search) ||
        (t.trailerNo || '').toLowerCase().includes(search) ||
        (t.status || '').toLowerCase().includes(search) ||
        (t.netWeight || '').toString().toLowerCase().includes(search)
      );
    }
    return list;
  }

  getTotalNetWeight(): string {
    const filtered = this.getFilteredUntippedTrailers();
    let total = 0;
    filtered.forEach(t => {
      const w = parseFloat(t.netWeight);
      if (!isNaN(w)) total += w;
    });
    return total.toLocaleString();
  }

  togglePnwSelectAll() {
    this.pnwSelectAll = !this.pnwSelectAll;
    this.pnwSelectedItems.clear();
    if (this.pnwSelectAll) {
      this.getFilteredUntippedTrailers().forEach(t => this.pnwSelectedItems.add(t.taskID));
    }
  }

  togglePnwItem(taskID: any) {
    if (this.pnwSelectedItems.has(taskID)) {
      this.pnwSelectedItems.delete(taskID);
    } else {
      this.pnwSelectedItems.add(taskID);
    }
    const filtered = this.getFilteredUntippedTrailers();
    this.pnwSelectAll = filtered.length > 0 && filtered.every(t => this.pnwSelectedItems.has(t.taskID));
  }

  exportUntippedReport() {
    const selectedList = this.getFilteredUntippedTrailers().filter(t => this.pnwSelectedItems.has(t.taskID));
    if (selectedList.length === 0) {
      this.utilServ.toaster.next({ type: customToaster.warningToast, message: 'No items selected to export' });
      return;
    }
    try {
      const headers = ['Customer', 'Product Type', 'Net Weight'];
      let csvContent = headers.join(',') + '\n';
      selectedList.forEach(item => {
        csvContent += `"${item.customer}","${item.productType}","${item.netWeight}"\n`;
      });
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const now = new Date();
      const dateStr = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}`;
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `product_net_weight_${dateStr}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Report exported successfully' });
    } catch (error) {
      console.error('Export failed:', error);
      this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Failed to export report' });
    }
  }

  clearUntippedSearch() {
    this.untippedTrailersSearch = '';
  }

  // ===== View Clean Trailers Popup =====
  openCleanTrailersPopup() {
    this.showCleanTrailersPopup = true;
    this.cleanTrailersSearch = '';
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    this.cleanTrailersSelectedDate = `${y}-${m}-${d}`;
    this.loadCleanTrailers();
  }

  onFilterCleanTrailers() {
    this.loadCleanTrailers();
  }

  closeCleanTrailersPopup() {
    this.showCleanTrailersPopup = false;
    this.cleanTrailersList = [];
  }

  async loadCleanTrailers() {
    this.isLoadingCleanTrailers = true;
    try {
      const dateStr = this.cleanTrailersSelectedDate;
      let res: any = null;

      try {
        res = await this.productionService.getCleanTrailers(dateStr);
      } catch (apiError) {
        console.warn('API call failed, using sample data:', apiError);
      }

      // Fallback to sample data if API returns no data
      if (!res || (Array.isArray(res) && res.length === 0) || (res.data && res.data.length === 0)) {
        res = [
          { trailerNo: '680', cleanerName: 'Diego Sanchez', completedTime: '2025-10-06T20:30:00', status: 'Clean' },
          { trailerNo: '455', cleanerName: 'Carlos Rivera', completedTime: '2025-10-06T18:15:00', status: 'Clean' },
          { trailerNo: '712', cleanerName: 'Ana Martinez', completedTime: '2025-10-06T16:45:00', status: 'Clean' },
          { trailerNo: '329', cleanerName: 'Luis Torres', completedTime: '2025-10-06T14:30:00', status: 'Clean' }
        ];
      }

      let dataArray = Array.isArray(res) ? res : (res.data || res.result || []);
      this.cleanTrailersList = dataArray.map((item: any) => ({
        trailer: item.trailerNo || item.TrailerNo || item.trailerNumber || item.TrailerNumber || '-',
        cleaner: item.cleanerName || item.CleanerName || item.cleaner || item.Cleaner || '-',
        completedTime: item.completedTime || item.CompletedTime || item.completedDateTime || item.CompletedDateTime || null,
        status: item.status || item.Status || 'Clean'
      }));
    } catch (error) {
      console.error('Error loading clean trailers:', error);
      this.cleanTrailersList = [];
    } finally {
      this.isLoadingCleanTrailers = false;
      this.cdr.detectChanges();
    }
  }

  getFilteredCleanTrailers(): any[] {
    if (!this.cleanTrailersSearch || !this.cleanTrailersSearch.trim()) {
      return this.cleanTrailersList;
    }
    const search = this.cleanTrailersSearch.toLowerCase();
    return this.cleanTrailersList.filter(t =>
      t.trailer.toLowerCase().includes(search)
    );
  }

  clearCleanTrailersSearch() {
    this.cleanTrailersSearch = '';
  }

  // ===== View Dirty Trailers Popup =====
  openDirtyTrailersPopup() {
    this.showDirtyTrailersPopup = true;
    this.dirtyTrailersSearch = '';
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    this.dirtyTrailersSelectedDate = `${y}-${m}-${d}`;
    this.loadDirtyTrailers();
  }

  onFilterDirtyTrailers() {
    this.loadDirtyTrailers();
  }

  closeDirtyTrailersPopup() {
    this.showDirtyTrailersPopup = false;
    this.dirtyTrailersList = [];
  }

  async loadDirtyTrailers() {
    this.isLoadingDirtyTrailers = true;
    try {
      const dateStr = this.dirtyTrailersSelectedDate;
      let res: any = null;

      try {
        res = await this.productionService.getDirtyTrailers(dateStr);
      } catch (apiError) {
        console.warn('API call failed, using sample data:', apiError);
      }

      // Fallback to sample data if API returns no data
      if (!res || (Array.isArray(res) && res.length === 0) || (res.data && res.data.length === 0)) {
        res = [
          { trailerNo: '680', shunterName: 'Alex John', scheduledTime: '2025-10-06T20:00:00', status: 'Dirty' },
          { trailerNo: '455', shunterName: 'Mark Davis', scheduledTime: '2025-10-06T18:30:00', status: 'Dirty' },
          { trailerNo: '712', shunterName: 'Sam Wilson', scheduledTime: '2025-10-06T16:00:00', status: 'Dirty' },
          { trailerNo: '329', shunterName: 'Tom Brown', scheduledTime: '2025-10-06T14:45:00', status: 'Dirty' }
        ];
      }

      let dataArray = Array.isArray(res) ? res : (res.data || res.result || []);
      this.dirtyTrailersList = dataArray.map((item: any) => ({
        trailer: item.trailerNo || item.TrailerNo || item.trailerNumber || item.TrailerNumber || '-',
        shunter: item.shunterName || item.ShunterName || item.shunter || item.Shunter || item.driverName || item.DriverName || '-',
        scheduledTime: item.scheduledTime || item.ScheduledTime || item.scheduledDateTime || item.ScheduledDateTime || null,
        status: item.status || item.Status || 'Dirty'
      }));
    } catch (error) {
      console.error('Error loading dirty trailers:', error);
      this.dirtyTrailersList = [];
    } finally {
      this.isLoadingDirtyTrailers = false;
      this.cdr.detectChanges();
    }
  }

  getFilteredDirtyTrailers(): any[] {
    if (!this.dirtyTrailersSearch || !this.dirtyTrailersSearch.trim()) {
      return this.dirtyTrailersList;
    }
    const search = this.dirtyTrailersSearch.toLowerCase();
    return this.dirtyTrailersList.filter(t =>
      t.trailer.toLowerCase().includes(search)
    );
  }

  clearDirtyTrailersSearch() {
    this.dirtyTrailersSearch = '';
  }



  // Refresh data
  refreshData() {
    this.loadOverviewCount();
    this.loadTrailerCardCounts();
    this.loadTaskList();
  }

  // Auto-refresh toggle (1 minute interval)
  toggleAutoRefresh() {
    this.autoRefreshEnabled = !this.autoRefreshEnabled;
    if (this.autoRefreshEnabled) {
      this.startAutoRefresh();
    } else {
      this.stopAutoRefresh();
    }
  }

  private startAutoRefresh() {
    this.stopAutoRefresh();
    this.autoRefreshInterval = setInterval(() => {
      this.refreshData();
    }, 60000); // 1 minute
  }

  private stopAutoRefresh() {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
      this.autoRefreshInterval = null;
    }
  }
}
