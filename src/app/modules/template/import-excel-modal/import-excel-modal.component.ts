import { Component, Output, EventEmitter, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-import-excel-modal',
  templateUrl: './import-excel-modal.component.html',
  styleUrls: ['./import-excel-modal.component.css']
})
export class ImportExcelModalComponent implements OnInit {
  @Input() templateType: string = '';
  @Input() availableTemplates: any[] = [];
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() importCompleted = new EventEmitter<{file: File, sheets: {name: string, data: any[]}[]}>(); 
  @Output() templateSelected = new EventEmitter<any>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  uploadedFile: File | null = null;
  templateName: string = '';
  isDragOver: boolean = false;
  excelData: any[] = [];
  allSheets: {name: string, data: any[]}[] = []; // Store all sheets from Excel
  totalSheets: number = 0;
  isProcessing: boolean = false;
  processingMessage: string = '';
  selectedTemplateId: string = '';
  
  // Expected column headers for weekly template
  private readonly WEEKLY_TEMPLATE_HEADERS = [
    'NO', 'Planner', 'Customer', 'Product', 'Pickup Location', 'Vehicle', 'Driver', 'Status',
    'Trailer in', 'Product est Weight', 'Product Type', 'Trailer inType', 'Changeover Location',
    'Changeover Message', 'Delivery Location', 'Trailer Out', 'Trailer out type',
    'Scheduled time', 'Collection time', 'Collected time', 'Notes'
  ];

  constructor() { }

  ngOnInit() {
  }

  closeModal() {
    this.closeModalEvent.emit();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
      // Clear the input so the same file can be selected again if needed
      event.target.value = '';
    }
  }

  private handleFile(file: File) {
    // Check if it's an Excel file
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    const isValidType = validTypes.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    
    if (isValidType) {
      // Show loading state
      this.isProcessing = true;
      this.processingMessage = 'Reading file...';
      
      // Set the file immediately
      this.uploadedFile = file;
      
      // Auto-generate template name from file name
      const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
      this.templateName = fileName;
      
      // Parse Excel file immediately
      this.parseExcelFile(file);
    } else {
      alert('Please upload a valid Excel file (.xlsx or .xls)');
      this.uploadedFile = null;
      this.templateName = '';
    }
  }

  private parseExcelFile(file: File) {
    const parseStart = performance.now();
    const reader = new FileReader();
    
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      alert('Failed to read file. Please try again.');
      this.uploadedFile = null;
      this.templateName = '';
      this.isProcessing = false;
    };
    
    reader.onload = (e: any) => {
      try {
        console.log(`[PERF] FileReader onload: ${(performance.now() - parseStart).toFixed(0)}ms`);
        this.processingMessage = 'Parsing Excel file...';
        const fileSize = file.size;
        const maxSize = 10 * 1024 * 1024;
        
        if (fileSize > maxSize) {
          alert('File size too large. Maximum allowed size is 10MB.');
          this.uploadedFile = null;
          this.templateName = '';
          this.isProcessing = false;
          return;
        }

        this.processingMessage = 'Loading workbook...';
        const data = new Uint8Array(e.target.result);
        const xlsxStart = performance.now();
        
        try {
          // Optimize workbook reading - skip formula/style parsing for speed
          const workbook = XLSX.read(data, { 
            type: 'array', 
            cellDates: false, 
            cellFormula: false, 
            cellHTML: false, 
            cellStyles: false,
            sheetRows: 0 // Read all rows
          });
          console.log(`[PERF] XLSX.read: ${(performance.now() - xlsxStart).toFixed(0)}ms`);
              this.allSheets = [];
              this.totalSheets = workbook.SheetNames.length;
              
              // Validate weekly template format if templateType is 'weekly'
              if (this.templateType === 'weekly') {
                const validation = this.validateWeeklyTemplate(workbook);
                if (!validation.valid) {
                  alert(validation.error);
                  this.uploadedFile = null;
                  this.templateName = '';
                  this.isProcessing = false;
                  return;
                }
              }
              
              if (this.totalSheets > 10) {
                alert('Too many sheets. Maximum 10 sheets allowed.');
                this.uploadedFile = null;
                this.templateName = '';
                this.isProcessing = false;
                return;
              }
              
              // Process sheets with setTimeout to prevent unresponsive dialog
              let currentSheet = 0;
              const sheetProcessStart = performance.now();
              const processNext = () => {
                if (currentSheet >= workbook.SheetNames.length) {
                  console.log(`[PERF] All sheets processed: ${(performance.now() - sheetProcessStart).toFixed(0)}ms`);
                  this.finalizeImport(file);
                  return;
                }
                
                const sheetName = workbook.SheetNames[currentSheet];
                this.processingMessage = `Processing sheet ${currentSheet + 1} of ${this.totalSheets}`;
                
                try {
                  this.processSheetSync(workbook, sheetName, currentSheet);
                } catch (err) {
                  console.error(`Error processing sheet ${sheetName}:`, err);
                }
                
                currentSheet++;
                
                // Yield to browser every sheet to prevent "unresponsive" warning
                setTimeout(processNext, 0);
              };
              
              processNext();
              
        } catch (error) {
          console.error('Error parsing Excel:', error);
          alert('Invalid Excel file format.');
          this.uploadedFile = null;
          this.templateName = '';
          this.allSheets = [];
          this.totalSheets = 0;
          this.isProcessing = false;
        }
      } catch (error) {
        console.error('Error in processing:', error);
        this.uploadedFile = null;
        this.templateName = '';
        this.allSheets = [];
        this.totalSheets = 0;
        this.isProcessing = false;
      }
    };
    
    reader.readAsArrayBuffer(file);
  }

  removeFile() {
    this.uploadedFile = null;
    this.templateName = '';
    this.excelData = [];
    this.allSheets = [];
    this.totalSheets = 0;
    this.isProcessing = false;
    this.processingMessage = '';
  }

  triggerFileInput() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }

  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getSheetNames(): string {
    return this.allSheets.map(s => s.name).join(', ');
  }

  // Parse date-time value from Excel (handles Excel serial numbers, date strings, time strings)
  private parseDateTime(value: any): string {
    if (!value) return '';
    
    // Handle Excel serial number (date-time)
    if (typeof value === 'number') {
      // Excel serial number: days since 1899-12-30
      // If >= 1, it's a date (or date-time); if < 1, it's time-only
      if (value >= 1) {
        // Separate integer (days) and fractional (time) parts to avoid floating-point precision issues
        const days = Math.floor(value);
        const timeFraction = value - days;
        
        // Convert days to date
        // Excel's epoch is December 30, 1899 (day 0)
        // Note: Excel incorrectly treats 1900 as leap year, so dates after Feb 28, 1900 are off by 1
        const excelEpoch = new Date(Date.UTC(1899, 11, 30));
        const jsDate = new Date(excelEpoch.getTime() + days * 86400000);
        
        // Convert time fraction to hours, minutes, seconds
        // Total seconds in a day = 86400
        // Use Math.round to avoid floating point errors
        const totalSecondsInDay = Math.round(timeFraction * 86400);
        const hours = Math.floor(totalSecondsInDay / 3600);
        const minutes = Math.floor((totalSecondsInDay % 3600) / 60);
        const seconds = totalSecondsInDay % 60;
        
        // Format as DD/MM/YYYY HH:mm:ss
        const day = jsDate.getUTCDate().toString().padStart(2, '0');
        const month = (jsDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = jsDate.getUTCFullYear();
        
        return `${day}/${month}/${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        // Time-only (fraction of day)
        const totalSeconds = Math.round(value * 86400);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    }
    
    // Handle string values
    if (typeof value === 'string') {
      const trimmedValue = value.trim();
      
      // Check if it's already a valid date-time string (contains date separator)
      if (trimmedValue.includes('/') || trimmedValue.includes('-')) {
        // It's a date or date-time string - return as-is (already formatted)
        return trimmedValue;
      }
      
      // Check if it's just a time string (HH:mm or HH:mm:ss)
      const timeParts = trimmedValue.split(':');
      if (timeParts.length >= 2 && timeParts[0].length <= 2) {
        const hours = timeParts[0].padStart(2, '0');
        const minutes = timeParts[1].padStart(2, '0');
        const seconds = timeParts.length > 2 ? timeParts[2].padStart(2, '0') : '00';
        return `${hours}:${minutes}:${seconds}`;
      }
      
      // Return as-is if we can't parse it
      return trimmedValue;
    }
    
    // Handle Date objects
    if (value instanceof Date) {
      const day = value.getDate().toString().padStart(2, '0');
      const month = (value.getMonth() + 1).toString().padStart(2, '0');
      const year = value.getFullYear();
      const hours = value.getHours().toString().padStart(2, '0');
      const minutes = value.getMinutes().toString().padStart(2, '0');
      const seconds = value.getSeconds().toString().padStart(2, '0');
      
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }
    
    // Return string representation for any other type
    return String(value);
  }

  // Validate weekly template format - allow any number of sheets
  private validateWeeklyTemplate(workbook: any): { valid: boolean, error: string } {
    // No sheet count restriction - allow 1, 2, 3, or any number of sheets
    // Skip header validation for performance - validation happens during processing
    return { valid: true, error: '' };
  }

  // Process individual sheet - FAST using limited range
  private processSheetSync(workbook: any, sheetName: string, sheetIndex: number) {
    const sheetStart = performance.now();
    const worksheet = workbook.Sheets[sheetName];
    
    if (!worksheet || !worksheet['!ref']) {
      this.allSheets.push({ name: sheetName, data: [] });
      return;
    }
    
    // CRITICAL: Limit the range to prevent processing thousands of empty cells
    // Excel saves a huge range if user ever scrolled/clicked far cells
    const originalRange = XLSX.utils.decode_range(worksheet['!ref']);
    
    // Find actual data boundaries by scanning for non-empty cells
    let maxRow = 0; // Start from 0 to catch all rows including header
    let maxCol = 0;
    
    // Scan up to 5000 rows and 50 columns to find actual data extent
    const scanMaxRow = Math.min(originalRange.e.r, 5000);
    const scanMaxCol = Math.min(originalRange.e.c, 50);
    
    // Scan columns first to find max column (usually faster and data is contiguous)
    for (let c = 0; c <= scanMaxCol; c++) {
      for (let r = 0; r <= Math.min(10, scanMaxRow); r++) { // Check first 10 rows for column detection
        const cell = worksheet[XLSX.utils.encode_cell({r, c})];
        if (cell && cell.v !== undefined && cell.v !== null && cell.v !== '') {
          if (c > maxCol) maxCol = c;
          break; // Found data in this column, move to next column
        }
      }
    }
    
    // Now scan all rows to find the last row with data
    // Start from header row and scan down until we find empty rows
    let consecutiveEmptyRows = 0;
    for (let r = 0; r <= scanMaxRow; r++) {
      let rowHasData = false;
      for (let c = 0; c <= maxCol; c++) {
        const cell = worksheet[XLSX.utils.encode_cell({r, c})];
        if (cell && cell.v !== undefined && cell.v !== null && cell.v !== '') {
          rowHasData = true;
          break;
        }
      }
      if (rowHasData) {
        maxRow = r;
        consecutiveEmptyRows = 0;
      } else {
        consecutiveEmptyRows++;
        // Stop scanning after 10 consecutive empty rows
        if (consecutiveEmptyRows > 10) break;
      }
    }
    
    // Ensure we include all data rows (no +1 needed as maxRow is already the last data row)
    maxCol = Math.min(maxCol + 2, 50);   // Max 50 columns with buffer
    
    // Override the worksheet range temporarily
    const limitedRef = XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: maxRow, c: maxCol }
    });
    
    const originalRef = worksheet['!ref'];
    worksheet['!ref'] = limitedRef;
    
    console.log(`[PERF] ${sheetName}: Original range ${originalRef}, Limited to ${limitedRef}`);
    
    // Use sheet_to_json with limited range - now much faster
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
      range: 1, // Start from row 2 (0-indexed: 1)
      defval: null,
      raw: true
    });
    
    // Restore original ref (in case needed elsewhere)
    worksheet['!ref'] = originalRef;
    
    console.log(`[PERF] sheet_to_json for ${sheetName}: ${(performance.now() - sheetStart).toFixed(0)}ms, rows: ${jsonData.length}`);
    
    if (jsonData.length === 0) {
      this.allSheets.push({ name: sheetName, data: [] });
      return;
    }
    
    // Build header mapping ONCE - use lookup object for O(1) mapping
    const headerLookup: any = {
      'no': 'no', 'number': 'no', 'id': 'no',
      'planner': 'planner',
      'customer': 'customer', 'client': 'customer',
      'product': 'product', 'material': 'product',
      'pickup location': 'pickupLocation', 'location': 'pickupLocation', 'pickup': 'pickupLocation',
      'vehicle': 'vehicle', 'truck': 'vehicle',
      'driver': 'driverName', 'driver name': 'driverName',
      'status': 'status',
      'trailer in': 'trailerIn', 'trailer': 'trailerIn', 'trailerin': 'trailerIn',
      'product est weight': 'productEstWeight', 'productestweight': 'productEstWeight', 'product weight': 'productEstWeight', 'weight': 'productEstWeight', 'est weight': 'productEstWeight', 'productweight': 'productEstWeight',
      'weight unit': 'weightUnit', 'unit': 'weightUnit',
      'product type': 'productType', 'producttype': 'productType', 'type': 'productType', 'material type': 'productType',
      'trailer in type': 'trailerInType', 'trailerintype': 'trailerInType', 'trailer intype': 'trailerInType', 'trailer type': 'trailerInType',
      'changeover location': 'changeoverLocation', 'changeover': 'changeoverLocation', 'change location': 'changeoverLocation', 'changeoverlocation': 'changeoverLocation',
      'changeover message': 'changeoverMessage', 'changeover msg': 'changeoverMessage', 'changeovermessage': 'changeoverMessage',
      'delivery location': 'deliveryLocation', 'delivery': 'deliveryLocation', 'deliverylocation': 'deliveryLocation',
      'trailer out': 'trailerOut', 'trailerout': 'trailerOut', 'trailer-out': 'trailerOut',
      'trailer out type': 'trailerOutType', 'trailerouttype': 'trailerOutType', 'trailer outtype': 'trailerOutType',
      'scheduled time': 'scheduledTime', 'scheduledtime': 'scheduledTime', 'schedule time': 'scheduledTime',
      'collection time': 'collectionTime', 'collectiontime': 'collectionTime', 'collect time': 'collectionTime',
      'collected time': 'collectedTime', 'collectedtime': 'collectedTime',
      'notes': 'notes', 'note': 'notes', 'remarks': 'notes', 'remark': 'notes'
    };
    
    // Calculate timestamp once for all rows
    const timestamp = new Date().toISOString();
    
    // Process rows - map Excel headers to our field names
    const sheetData: any[] = [];
    const rowCount = Math.min(jsonData.length, 5000); // Limit to 5000 rows per sheet to prevent hang
    
    for (let i = 0; i < rowCount; i++) {
      const row = jsonData[i];
      if (!row || Object.keys(row).length === 0) continue;
      
      // Build row with minimal processing
      const rowObject: any = {
        orderTemplateID: `imported_${sheetIndex}_${i}`,
        orderTemplateName: sheetName,
        orderTemplateDate: timestamp,
        checked: false
      };
      
      // Map each property from Excel header to our field name
      for (const excelHeader of Object.keys(row)) {
        const headerKey = excelHeader.toLowerCase().trim().replace(/\s+/g, ' ');
        const propName = headerLookup[headerKey] || headerKey.replace(/\s+/g, '');
        let cellValue = row[excelHeader];
        
        // Special handling for weight fields
        if (propName === 'productEstWeight' && cellValue) {
          const cleanValue = String(cellValue).replace(/,/g, '').replace(/[^\d.]/g, '');
          cellValue = cleanValue ? parseFloat(cleanValue) : cellValue;
        }
        
        // Special handling for date-time fields (scheduledTime, collectionTime, collectedTime)
        if ((propName === 'scheduledTime' || propName === 'collectionTime' || propName === 'collectedTime') && cellValue) {
          cellValue = this.parseDateTime(cellValue);
        }
        
        rowObject[propName] = cellValue ?? null;
      }
      
      sheetData.push(rowObject);
    }
    
    console.log(`[PERF] Sheet ${sheetName} complete: ${(performance.now() - sheetStart).toFixed(0)}ms, mapped ${sheetData.length} rows`);
    
    // Add this sheet's data to allSheets array
    this.allSheets.push({
      name: sheetName,
      data: sheetData
    });
  }
  
  // Finalize import after all sheets are processed
  private finalizeImport(file: File) {
    console.log(`[PERF] Total rows across all sheets: ${this.allSheets.reduce((sum, s) => sum + s.data.length, 0)}`);
    this.processingMessage = 'Complete!';
    this.isProcessing = false;
  }

  importTemplate() {
    console.log('[PERF] Import button clicked - emitting data');
    if (this.uploadedFile && this.templateName.trim()) {
      // Option 1: Send file to server for processing and storage
      this.uploadFileToServer(this.uploadedFile, this.templateName.trim());
    }
  }

  private uploadFileToServer(file: File, templateName: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('templateName', templateName);
    formData.append('uploadDate', new Date().toISOString());

    // TODO: Replace with your actual upload service
    // Example API call:
    // this.templateService.uploadTemplate(formData).subscribe({
    //   next: (response) => {
    //     console.log('File uploaded successfully:', response);
    //     this.importCompleted.emit({
    //       file: file,
    //       sheets: this.allSheets
    //     });
    //     this.closeModal();
    //   },
    //   error: (error) => {
    //     console.error('Upload failed:', error);
    //     alert('Failed to upload file. Please try again.');
    //   }
    // });

    // Emit to parent with ALL sheets and their data
    this.importCompleted.emit({
      file: file,
      sheets: this.allSheets // Send all sheets with their names and data
    });
    
    this.closeModal();
  }

  onExistingTemplateSelect() {
    if (this.selectedTemplateId) {
      // Find the selected template
      const selectedTemplate = this.availableTemplates.find(t => t.value == this.selectedTemplateId);
      
      if (selectedTemplate) {
        // Emit the template selection to parent component
        this.templateSelected.emit(selectedTemplate);
        
        // Close the modal
        this.closeModal();
      }
    }
  }
}