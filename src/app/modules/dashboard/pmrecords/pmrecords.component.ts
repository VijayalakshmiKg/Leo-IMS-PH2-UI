import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { PmrecordsService } from 'src/app/modules/dashboard/pmrecords/pmrecords.service';
import { PageEvent } from '@angular/material/paginator';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-pmrecords',
  templateUrl: './pmrecords.component.html',
  styleUrls: ['./pmrecords.component.css']
})
export class PmrecordsComponent implements OnInit {

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
  isViewMode: boolean = false; // Track if popup is in view-only mode
  weighFormData: any = {
    grossWeight: null,
    grossWeighedDateTime: '',
    moistureDeduction: null,
    moistureDateTime: '',
    tareWeight: null,
    tareWeighedDateTime: ''
  };

  // View Mov Doc Popup properties
  showMovDocPopup: boolean = false;
  movDocData: any = null;
  isLoadingMovDoc: boolean = false;

  // Records list data
  recordsList: any[] = [];

  // Selection tracking
  selectedRecords: Set<any> = new Set();
  selectAll: boolean = false;

  // Pagination
  length = 0;
  pageSize = 10;
  pageNumber = 1;
  currentPage = 1;
  totalPages = 0;
  pageSizeOptions = [10, 25, 50, 100];

  // Search and filter
  searchText: string = '';

  // Loading state
  isLoading: boolean = false;

  // Column definitions for the table
  tableColumns = [
    { key: 'checkbox', label: '', visible: true, width: 50, filterable: false, sortable: false },
    { key: 'no', label: 'No.', visible: true, width: 40, filterable: false, sortable: true },
    { key: 'customer', label: 'Customer', visible: true, width: 110, filterable: true, sortable: true },
    { key: 'product', label: 'Product', visible: true, width: 100, filterable: true, sortable: true },
    { key: 'productType', label: 'Product Type', visible: true, width: 100, filterable: true, sortable: true },
    { key: 'trailerNo', label: 'Trailer No.', visible: true, width: 80, filterable: true, sortable: true },
    { key: 'status', label: 'Status', visible: true, width: 80, filterable: true, sortable: true },
    { key: 'shunter', label: 'Shunter', visible: true, width: 90, filterable: true, sortable: true },
    { key: 'binNo', label: 'Bin No.', visible: true, width: 70, filterable: true, sortable: true },
    { key: 'netWeight', label: 'Net Weight (kgs)', visible: true, width: 80, filterable: true, sortable: true },
    { key: 'collectedTime', label: 'Arrived Time', visible: true, width: 110, filterable: true, sortable: true },
    { key: 'scheduledTime', label: 'Scheduled Time', visible: false, width: 160, filterable: true, sortable: true },
    { key: 'tippingTime', label: 'Tipping Time', visible: true, width: 110, filterable: true, sortable: true },
    { key: 'waitTime', label: 'Wait Time', visible: true, width: 80, filterable: true, sortable: true }
  ];

  // Column Manager
  showColumnManager: boolean = false;
  draggedColumn: string | null = null;

  // Column sorting
  columnSorts: { [key: string]: 'asc' | 'desc' | null } = {};

  // Column filtering
  showColumnFilterPopup: string | null = null;
  columnFilterSearch: { [key: string]: string } = {};
  activeColumnFilters: { [key: string]: string[] } = {};
  tempColumnFilters: { [key: string]: string[] } = {};
  distinctColumnValues: { [key: string]: string[] } = {};

  constructor(
    private router: Router,
    private utilityService: UtilityService,
    private pmrecordsService: PmrecordsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadRecordsList();
  }

  // Load records list from API
  async loadRecordsList() {
    this.isLoading = true;
    try {
      const params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        searchText: this.searchText
      };
      let user: any = sessionStorage.getItem('loggedInUser');
      if (!user) {
        console.warn('⚠️ No logged in user found');
        return;
      }

      let parsedData = JSON.parse(user);
      console.log('🔍 Parsed user data:', parsedData);
      //const response: any = await this.pmrecordsService.getRecordsList(params);
      let employeeId = parsedData?.employeeId || parsedData?.EmployeeId || parsedData?.empId || parsedData?.EmpId || parsedData?.id || parsedData?.Id;
      console.log('🔍 Employee ID:', employeeId);
      const response: any = await this.pmrecordsService.getPMRecordsByEmpId(employeeId);

      // Handle different response formats - API returns array directly
      let dataArray = response?.data || response?.result || response || [];
      if (!Array.isArray(dataArray)) {
        dataArray = [];
      }

      if (dataArray.length > 0) {
        this.recordsList = dataArray.map((item: any, index: number) => ({
          no: item.no || item.sNo || index + 1,
          taskID: item.taskID || item.TaskID || null,
          customer: item.customer || item.Customer || item.customerName || '-',
          product: item.product || item.Product || item.productName || '-',
          productType: item.productType || item.ProductType || item.productCategory || item.ProductCategory || '-',
          trailerNo: item.trailerNo || item.TrailerNo || item.trailerIn || item.TrailerIn || item.trailerNumber || item.TrailerNumber || '-',
          status: item.status || item.Status || item.orderStatus || '-',
          shunter: item.shunter || item.Shunter || item.shunterName || item.ShunterName || '-',
          binNo: item.binNo || item.BinNo || item.binNumber || item.BinNumber || '-',
          netWeight: item.netWeight || item.NetWeight || '-',
          collectedTime: this.formatDateTime(item.collectedTime || item.CollectedTime || item.collectedDateTime || item.CollectedDateTime),
          collectedTimeRaw: item.collectedTime || item.CollectedTime || item.collectedDateTime || item.CollectedDateTime || null,
          scheduledTime: this.formatDateTime(item.scheduledTime || item.ScheduledTime || item.scheduledDateTime || item.ScheduledDateTime),
          scheduledTimeRaw: item.scheduledTime || item.ScheduledTime || item.scheduledDateTime || item.ScheduledDateTime || null,
          tippingTime: this.formatDateTime(item.tippingTime || item.TippingTime || item.tippingDateTime || item.TippingDateTime),
          waitTime: this.calculateWaitTime(item.collectedTime || item.CollectedTime || item.collectedDateTime || item.CollectedDateTime, item.status || item.Status || item.orderStatus || ''),
          // Keep for popup usage
          weighbridgeRecordID: item.weighbridgeRecordID || item.WeighbridgeRecordID || '-',
          driver: item.driver || item.Driver || item.driverName || item.DriverName || '-',
          grossWeight: item.grossWeight || item.GrossWeight || '-',
          moistureDeduction: item.moistureDetuction || item.MoistureDetuction || item.moistureDeduction || item.MoistureDeduction || '-',
          tareWeight: item.tareWeight || item.TareWeight || '-'
        }));
        this.length = response.totalCount || dataArray.length;
        this.totalPages = Math.ceil(this.length / this.pageSize);

        // Build distinct values for filtering
        this.buildDistinctColumnValues();
      } else {
        this.recordsList = [];
        this.length = 0;
      }
    } catch (error) {
      console.error('Error loading records list:', error);
      this.utilityService.toaster.next({ type: customToaster.errorToast, message: 'Error loading records' });
      this.recordsList = [];
    } finally {
      this.isLoading = false;
    }
  }

  // Build distinct values for column filters
  buildDistinctColumnValues() {
    this.tableColumns.forEach(col => {
      if (col.filterable) {
        const values = new Set<string>();
        this.recordsList.forEach(record => {
          if (record[col.key] !== null && record[col.key] !== undefined && record[col.key] !== '') {
            values.add(String(record[col.key]));
          }
        });
        this.distinctColumnValues[col.key] = Array.from(values).sort();
      }
    });
  }

  // Get visible columns
  getVisibleColumns() {
    return this.tableColumns.filter(col => col.visible);
  }

  // Toggle column manager visibility
  toggleColumnManager() {
    this.showColumnManager = !this.showColumnManager;
  }

  // Toggle column visibility
  toggleColumnVisibility(key: string) {
    const column = this.tableColumns.find(col => col.key === key);
    if (column) {
      column.visible = !column.visible;
    }
  }

  // Column drag and drop
  onColumnDragStart(key: string, event: DragEvent) {
    this.draggedColumn = key;
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
      const sourceIndex = this.tableColumns.findIndex(col => col.key === this.draggedColumn);
      if (sourceIndex !== -1 && sourceIndex !== targetIndex) {
        const [movedColumn] = this.tableColumns.splice(sourceIndex, 1);
        this.tableColumns.splice(targetIndex, 0, movedColumn);
      }
    }
    this.draggedColumn = null;
  }

  // Column sorting
  toggleColumnSort(key: string) {
    const currentSort = this.columnSorts[key];
    // Clear other sorts
    this.columnSorts = {};

    if (currentSort === null || currentSort === undefined) {
      this.columnSorts[key] = 'asc';
    } else if (currentSort === 'asc') {
      this.columnSorts[key] = 'desc';
    } else {
      this.columnSorts[key] = null;
    }
  }

  // Column filtering
  toggleColumnFilterPopup(key: string, event: Event) {
    event.stopPropagation();
    if (this.showColumnFilterPopup === key) {
      this.showColumnFilterPopup = null;
    } else {
      this.showColumnFilterPopup = key;
      this.columnFilterSearch[key] = '';
      // Initialize temp filters with current active filters
      this.tempColumnFilters[key] = [...(this.activeColumnFilters[key] || [])];
    }
  }

  closeColumnFilterPopup() {
    this.showColumnFilterPopup = null;
  }

  getColumnLabel(key: string): string {
    const column = this.tableColumns.find(col => col.key === key);
    return column ? column.label : key;
  }

  getFilteredDistinctValues(key: string): string[] {
    const values = this.distinctColumnValues[key] || [];
    const search = (this.columnFilterSearch[key] || '').toLowerCase();
    if (!search) {
      return values;
    }
    return values.filter(v => v.toLowerCase().includes(search));
  }

  isValueSelected(columnKey: string, value: string): boolean {
    return (this.tempColumnFilters[columnKey] || []).includes(value);
  }

  toggleFilterValue(columnKey: string, value: string) {
    if (!this.tempColumnFilters[columnKey]) {
      this.tempColumnFilters[columnKey] = [];
    }
    const index = this.tempColumnFilters[columnKey].indexOf(value);
    if (index > -1) {
      this.tempColumnFilters[columnKey].splice(index, 1);
    } else {
      this.tempColumnFilters[columnKey].push(value);
    }
  }

  selectAllFilterValues(columnKey: string) {
    this.tempColumnFilters[columnKey] = [...this.getFilteredDistinctValues(columnKey)];
  }

  clearAllFilterValues(columnKey: string) {
    this.tempColumnFilters[columnKey] = [];
  }

  applyColumnFilters() {
    if (this.showColumnFilterPopup) {
      this.activeColumnFilters[this.showColumnFilterPopup] = [...(this.tempColumnFilters[this.showColumnFilterPopup] || [])];
    }
    this.closeColumnFilterPopup();
  }

  // Get filtered and sorted records
  getFilteredAndSortedRecords(): any[] {
    let records = [...this.recordsList];

    // Apply column filters
    Object.keys(this.activeColumnFilters).forEach(columnKey => {
      const filterValues = this.activeColumnFilters[columnKey];
      if (filterValues && filterValues.length > 0) {
        records = records.filter(record => {
          const value = String(record[columnKey] || '');
          return filterValues.includes(value);
        });
      }
    });

    // Apply sorting
    const sortKey = Object.keys(this.columnSorts).find(key => this.columnSorts[key] !== null);
    if (sortKey) {
      const direction = this.columnSorts[sortKey];
      records.sort((a, b) => {
        const aValue = a[sortKey] || '';
        const bValue = b[sortKey] || '';

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return direction === 'asc' ? aValue - bValue : bValue - aValue;
        }

        const comparison = String(aValue).localeCompare(String(bValue));
        return direction === 'asc' ? comparison : -comparison;
      });
    }

    return records;
  }

  // Search
  onSearch() {
    this.pageNumber = 1;
    this.currentPage = 1;
    this.loadRecordsList();
  }

  clearSearch() {
    this.searchText = '';
    this.onSearch();
  }

  // Refresh data
  refreshData() {
    this.loadRecordsList();
  }

  // Pagination
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.currentPage = this.pageNumber;
    this.loadRecordsList();
  }

  // Export functions
  exportToExcel() {
    const data = this.getExportData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'PM Records');
    XLSX.writeFile(workbook, 'pmrecords_export.xlsx');
    this.utilityService.toaster.next({ type: customToaster.successToast, message: 'Excel file exported successfully' });
  }

  exportToCSV() {
    const data = this.getExportData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'pmrecords_export.csv';
    link.click();
    this.utilityService.toaster.next({ type: customToaster.successToast, message: 'CSV file exported successfully' });
  }

  getExportData(): any[] {
    const visibleColumns = this.getVisibleColumns();
    return this.getFilteredAndSortedRecords().map(record => {
      const exportRow: any = {};
      visibleColumns.forEach(col => {
        exportRow[col.label] = record[col.key] || '';
      });
      return exportRow;
    });
  }

  // Status class
  getStatusClass(status: string): string {
    if (!status) return 'status-badge status-default';

    const statusLower = status.toLowerCase();
    if (statusLower.includes('complete') || statusLower.includes('weighed')) {
      return 'status-badge status-completed';
    } else if (statusLower.includes('pending')) {
      return 'status-badge status-pending';
    } else if (statusLower.includes('in progress') || statusLower.includes('arrived')) {
      return 'status-badge status-in-progress';
    } else if (statusLower.includes('cancelled') || statusLower.includes('rejected')) {
      return 'status-badge status-cancelled';
    } else if (statusLower.includes('tipped')) {
      return 'status-badge status-tipped';
    }
    return 'status-badge status-default';
  }

  // Column resize
  startResize(columnKey: string, event: MouseEvent) {
    event.preventDefault();
    const column = this.tableColumns.find(col => col.key === columnKey);
    if (!column) return;

    const startX = event.clientX;
    const startWidth = column.width;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const diff = moveEvent.clientX - startX;
      column.width = Math.max(60, startWidth + diff);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  // Format date time for display
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
  calculateWaitTime(scheduledTime: any, status?: string): string {
    if (!scheduledTime) return '-';
    // Skip wait time for certain statuses
    if (status) {
      const s = status.toLowerCase().trim();
      if (s.includes('accepted') || s.includes('tipping') || s.includes('untipping') || s.includes('untipped')) {
        return '-';
      }
    }
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

  // Selection methods
  isSelected(record: any): boolean {
    return this.selectedRecords.has(record);
  }

  toggleSelection(record: any): void {
    if (this.selectedRecords.has(record)) {
      this.selectedRecords.delete(record);
    } else {
      this.selectedRecords.add(record);
    }
    this.updateSelectAllState();
  }

  toggleSelectAll(): void {
    const filteredRecords = this.getFilteredAndSortedRecords();
    if (this.selectAll) {
      // Deselect all
      filteredRecords.forEach(record => this.selectedRecords.delete(record));
      this.selectAll = false;
    } else {
      // Select all
      filteredRecords.forEach(record => this.selectedRecords.add(record));
      this.selectAll = true;
    }
  }

  updateSelectAllState(): void {
    const filteredRecords = this.getFilteredAndSortedRecords();
    if (filteredRecords.length === 0) {
      this.selectAll = false;
      return;
    }
    this.selectAll = filteredRecords.every(record => this.selectedRecords.has(record));
  }

  getSelectedRecords(): any[] {
    return Array.from(this.selectedRecords);
  }

  clearSelection(): void {
    this.selectedRecords.clear();
    this.selectAll = false;
  }

  // Selection action methods
  editWeighTrailer(): void {
    const selectedRecords = this.getSelectedRecords();
    if (selectedRecords.length === 0) {
      this.utilityService.toaster.next({ type: customToaster.errorToast, message: 'Please select at least one record' });
      return;
    }
    
    if (selectedRecords.length > 1) {
      this.utilityService.toaster.next({ type: customToaster.errorToast, message: 'Please select only one record to edit' });
      return;
    }
    
    const selectedRecord = selectedRecords[0];
    const taskId = selectedRecord.taskID;
    
    if (!taskId) {
      this.utilityService.toaster.next({ type: customToaster.errorToast, message: 'Invalid task ID' });
      return;
    }
    
    // Open the weigh trailer popup in edit mode
    this.isViewMode = false;
    this.openWeighTrailerPopup(taskId, selectedRecord);
  }

  // Open Weigh Trailer Popup
  async openWeighTrailerPopup(taskId: number, recordData: any) {
    this.showWeighTrailerPopup = true;
    this.isLoadingWeighData = true;
    this.resetWeighFormData();
    
    try {
      // Get task details from API
      const res: any = await this.pmrecordsService.getWeighTrailerDetails(taskId);
      
      if (res) {
        // Map API response to weighTrailerData
        this.weighTrailerData = {
          taskID: res.taskID || res.TaskID || taskId,
          customer: res.customer || res.Customer || res.customerName || recordData?.customer || '-',
          product: res.product || res.Product || res.productName || recordData?.product || '-',
          productCategory: res.productCategory || res.ProductCategory || '-',
          productEstWeight: res.productEstWeight || res.ProductEstWeight || res.estWeight || '0',
          driverName: res.driverName || res.DriverName || recordData?.driver || '-',
          status: res.status || res.Status || recordData?.status || '-',
          movementDocNo: res.movementDocNo || res.MovementDocNo || res.taskID || taskId,
          ticketNo: res.ticketNo || res.TicketNo || '-',
          transactionType: res.transactionType || res.TransactionType || 'General',
          weighbridgeRecordID: res.weighbridgeRecordID || res.WeighbridgeRecordID || recordData?.weighbridgeRecordID || '-',
          // Pre-fill existing weigh data if available
          grossWeight: res.grossWeight || res.GrossWeight || recordData?.grossWeight || null,
          grossWeighedDateTime: res.grossWeighedDateTime || res.GrossWeighedDateTime || '',
          moistureDeduction: res.moistureDeduction || res.MoistureDeduction || res.moistureDetuction || res.MoistureDetuction || recordData?.moistureDeduction || null,
          moistureDateTime: res.moistureDateTime || res.MoistureDateTime || res.moistureDetuctionDateTime || res.MoistureDetuctionDateTime || '',
          tareWeight: res.tareWeight || res.TareWeight || recordData?.tareWeight || null,
          tareWeighedDateTime: res.tareWeighedDateTime || res.TareWeighedDateTime || ''
        };
        
        // Pre-fill form data with existing values
        this.weighFormData = {
          grossWeight: this.weighTrailerData.grossWeight,
          grossWeighedDateTime: this.formatDateTimeForInput(this.weighTrailerData.grossWeighedDateTime),
          moistureDeduction: this.weighTrailerData.moistureDeduction,
          moistureDateTime: this.formatDateTimeForInput(this.weighTrailerData.moistureDateTime),
          tareWeight: this.weighTrailerData.tareWeight,
          tareWeighedDateTime: this.formatDateTimeForInput(this.weighTrailerData.tareWeighedDateTime) || this.getCurrentDateTime()
        };
      } else {
        // If no API data, use selected record data
        this.weighTrailerData = {
          taskID: taskId,
          customer: recordData?.customer || '-',
          product: recordData?.product || '-',
          productCategory: '-',
          productEstWeight: '0',
          driverName: recordData?.driver || '-',
          status: recordData?.status || '-',
          movementDocNo: taskId,
          ticketNo: '-',
          transactionType: 'General',
          weighbridgeRecordID: recordData?.weighbridgeRecordID || '-',
          grossWeight: recordData?.grossWeight || null,
          moistureDeduction: recordData?.moistureDeduction || null,
          tareWeight: recordData?.tareWeight || null
        };
        
        // Set current date/time for tare weight
        this.weighFormData = {
          grossWeight: recordData?.grossWeight || null,
          grossWeighedDateTime: '',
          moistureDeduction: recordData?.moistureDeduction || null,
          moistureDateTime: '',
          tareWeight: recordData?.tareWeight || null,
          tareWeighedDateTime: this.getCurrentDateTime()
        };
      }
    } catch (error) {
      console.error('Error loading weigh trailer details:', error);
      // Fallback to record data
      this.weighTrailerData = {
        taskID: taskId,
        customer: recordData?.customer || '-',
        product: recordData?.product || '-',
        productCategory: '-',
        productEstWeight: '0',
        driverName: recordData?.driver || '-',
        status: recordData?.status || '-',
        movementDocNo: taskId,
        ticketNo: '-',
        transactionType: 'General',
        weighbridgeRecordID: recordData?.weighbridgeRecordID || '-'
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
    this.isViewMode = false;
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
      this.utilityService.toaster.next({ 
        type: customToaster.warningToast, 
        message: 'Please enter gross weight' 
      });
      return;
    }
    
    if (!this.weighFormData.grossWeighedDateTime) {
      this.utilityService.toaster.next({ 
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
      
      const res: any = await this.pmrecordsService.saveWeighTrailerData(saveModel);
      
      if (res && res.success) {
        this.utilityService.toaster.next({ 
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
        this.clearSelection();
        this.loadRecordsList(); // Refresh the records list
      } else {
        this.utilityService.toaster.next({ 
          type: customToaster.errorToast, 
          message: res?.message || 'Failed to save weigh data' 
        });
      }
    } catch (error) {
      console.error('Error saving weigh data:', error);
      this.utilityService.toaster.next({ 
        type: customToaster.errorToast, 
        message: 'Failed to save weigh data' 
      });
    } finally {
      this.isSavingWeighData = false;
    }
  }

  viewWeighTrailer(): void {
    const selectedRecords = this.getSelectedRecords();
    if (selectedRecords.length === 0) {
      this.utilityService.toaster.next({ type: customToaster.errorToast, message: 'Please select at least one record' });
      return;
    }
    
    if (selectedRecords.length > 1) {
      this.utilityService.toaster.next({ type: customToaster.errorToast, message: 'Please select only one record to view' });
      return;
    }
    
    const selectedRecord = selectedRecords[0];
    const taskId = selectedRecord.taskID;
    
    if (!taskId) {
      this.utilityService.toaster.next({ type: customToaster.errorToast, message: 'Invalid task ID' });
      return;
    }
    
    // Open the weigh trailer popup in view mode
    this.isViewMode = true;
    this.openWeighTrailerPopup(taskId, selectedRecord);
  }

  viewMovDoc(): void {
    const selectedRecords = this.getSelectedRecords();
    if (selectedRecords.length === 0) {
      this.utilityService.toaster.next({ type: customToaster.errorToast, message: 'Please select at least one record' });
      return;
    }
    
    if (selectedRecords.length > 1) {
      this.utilityService.toaster.next({ type: customToaster.errorToast, message: 'Please select only one record to view' });
      return;
    }
    
    const selectedRecord = selectedRecords[0];
    this.openMovDocPopup(selectedRecord);
  }

  // Open Mov Doc Popup
  async openMovDocPopup(recordData: any) {
    this.showMovDocPopup = true;
    this.isLoadingMovDoc = true;
    
    try {
      // Get movement document details from API if needed
      const taskId = recordData.taskID;
      
      // For now, use the record data to populate the form
      this.movDocData = {
        documentNo: `A ${recordData.weighbridgeRecordID || recordData.taskID || '100710'}`,
        date: new Date().toLocaleDateString('en-GB'),
        category: '3',
        categoryText: 'NOT FOR HUMAN CONSUMPTION',
        
        // Section 1 - Consignor details
        consignorName: '',
        consignorLicNo: '',
        consignorAddress: '',
        materialDescription: recordData.product || '',
        quantity: '',
        haulierName: '',
        consignorSignedBy: '',
        
        // Section 2 - Haulier details
        haulierAddress: 'KINTORE HAULAGE TRANSPORT LTD, QUARRY GARAGE, STAINTON, PENRITH, CUMBRIA CA11 0EB',
        haulierStatement: 'The above material was collected from the Consignor and delivered to the Consignee in compliance with the EU Animal By-Products Regulation.',
        driverSignedBy: recordData.driver || '',
        
        // Section 3 - Consignee/Receiver details
        consignees: [
          {
            name: 'Alba Protein Penrith Ltd',
            approvalNo: '08/170/0200/ABP/REN',
            address: 'GREYSTOKE RD,PENRITH\nCUMBRIA CA11 0BX',
            confirmed: false
          },
          {
            name: 'Alba Proteins Ltd',
            approvalNo: '75/304/8002/ABP/MED',
            address: 'RACKS, COLLIN\nDUMFRIES DG1 4PU',
            confirmed: false
          },
          {
            name: 'Alba Proteins Ltd',
            approvalNo: '49/349/8010/ABP/MED',
            address: 'SWALESMOOR ROAD,\nHALIFAX HX3 6UF',
            confirmed: false
          },
          {
            name: '',
            approvalNo: '',
            address: '',
            confirmed: false,
            isOther: true
          }
        ]
      };
      
    } catch (error) {
      console.error('Error loading movement document details:', error);
      this.utilityService.toaster.next({ 
        type: customToaster.errorToast, 
        message: 'Error loading movement document' 
      });
    } finally {
      this.isLoadingMovDoc = false;
      this.cdr.detectChanges();
    }
  }

  // Close Mov Doc Popup
  closeMovDocPopup() {
    this.showMovDocPopup = false;
    this.movDocData = null;
  }
}
