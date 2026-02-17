import { 
  Component, EventEmitter, Input, Output, ViewChild, HostListener,
  AfterViewInit, ChangeDetectorRef, OnChanges, SimpleChanges, OnDestroy, OnInit
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-template-paginator',
  templateUrl: './template-paginator.component.html',
  styleUrls: ['./template-paginator.component.css']
})
export class TemplatePaginatorComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() length: number = 100; // Total items
  @Input() pageSizeOptions: number[] = [10, 50, 100]; // Page size options
  @Input() showFirstLastButtons: boolean = true; // Show first/last buttons
  @Input() currentIndex: number = 1; // Current page index
  @Input() pageSize: number = 10; // Page size input from parent

  @Output() pageChange = new EventEmitter<PageEvent>(); // Emits page changes
  @Output() pageSizeChange = new EventEmitter<number>(); // Emits page size changes
  @Output() sheetAdded = new EventEmitter<any>(); // Emits when a new sheet is added
  @Output() sheetSelected = new EventEmitter<number>(); // Emits when a sheet is selected
  @Output() sheetClosed = new EventEmitter<number>(); // Emits when a sheet is closed

  // Sheet management properties
  sheets: any[] = [];
  activeSheetIndex: number = 0;
  selectedSheetIndex: number = 0; // Track which sheet's dropdown was clicked

  // Rename dialog properties
  showRenameDialog: boolean = false;
  newSheetName: string = '';
  renameSheetIndex: number = -1;
  renamePopupPosition: { x: number, y: number } = { x: 0, y: 0 };

  // Custom dropdown properties
  showCustomMenu: boolean = false;
  menuVisible: boolean = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private pageSubscription!: Subscription;
  private isFirstLoad: boolean = true; // Prevents duplicate triggers on first load

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Initialize with first sheet if none exist
    if (this.sheets.length === 0) {
      this.sheets = [
        {
          id: `sheet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // More unique ID
          name: 'Sheet 1',
          data: [],
          isEmpty: true
        }
      ];
      this.activeSheetIndex = 0;
    }
  }

  ngAfterViewInit() {
    console.log('Custom Paginator - ngAfterViewInit called');
    setTimeout(() => {
      this.setupPaginator();
      // Force change detection to ensure all menu triggers are initialized
      this.cdr.detectChanges();
      console.log('Custom Paginator - Setup complete, sheets:', this.sheets.length);
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['length'] || changes['currentIndex'] || changes['pageSize']) {
      this.setupPaginator();
    }
  }

  ngOnDestroy() {
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
  }

  private setupPaginator() {
    if (!this.paginator) return;

    this.paginator._intl.itemsPerPageLabel = 'Items per page';

    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      this.paginator.pageIndex = this.currentIndex - 1;
      this.paginator.pageSize = this.pageSize; // Set pageSize from input
      this.paginator._changePageSize(this.paginator.pageSize);
      return;
    }

    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }

    this.pageSubscription = this.paginator.page.subscribe((event: PageEvent) => {
      if (this.currentIndex !== event.pageIndex + 1 || this.pageSize !== event.pageSize) { 
        this.currentIndex = event.pageIndex + 1;
        this.pageSize = event.pageSize;

        this.pageChange.emit(event);
        this.pageSizeChange.emit(event.pageSize); // Emit pageSize changes
        this.cdr.detectChanges();
      }
    });
  }

  // Sheet management methods
  addSheet() {
    // Check if maximum sheets limit reached
    /*if (this.sheets.length >= 7) {
      alert('Maximum 7 sheets allowed. Please delete a sheet before adding a new one.');
      return;
    }*/

    const newSheetName = `Sheet ${this.sheets.length + 1}`;
    const newSheet = {
      id: `sheet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // More unique ID
      name: newSheetName,
      data: [], // Empty data for new sheet
      isEmpty: true // Flag to track if sheet has data
    };
    
    this.sheets.push(newSheet);
    this.activeSheetIndex = this.sheets.length - 1;
    this.sheetAdded.emit(newSheet);
    
    console.log(`New sheet "${newSheetName}" added. Total sheets: ${this.sheets.length}`);
  }

  // Check if can add more sheets
  canAddSheet(): boolean {
    //return this.sheets.length < 7;
    return true; // No limit for now
  }

  // Get active sheet data
  getActiveSheet() {
    if (this.activeSheetIndex >= 0 && this.activeSheetIndex < this.sheets.length) {
      return this.sheets[this.activeSheetIndex];
    }
    return null;
  }

  // Update active sheet with imported data
  updateActiveSheetData(data: any[], templateName?: string) {
    if (this.activeSheetIndex >= 0 && this.activeSheetIndex < this.sheets.length) {
      const currentSheet = this.sheets[this.activeSheetIndex];
      
      // Disable menus temporarily
      this.menuVisible = false;
      
      // Update sheet data
      const updatedSheet = {
        id: currentSheet.id,
        name: templateName && templateName.trim() ? templateName.trim() : currentSheet.name,
        data: [...data],
        isEmpty: data.length === 0
      };
      
      this.sheets[this.activeSheetIndex] = updatedSheet;
      
      console.log(`Active sheet "${updatedSheet.name}" updated with ${data.length} rows`);
      
      // Re-enable menus after update
      setTimeout(() => {
        this.menuVisible = true;
        this.cdr.detectChanges();
      }, 50);
    }
  }

  // Update sheet name directly (removed updateSheetNameSafely to fix dropdown issues)
  private updateSheetName(sheetIndex: number, newName: string) {
    if (sheetIndex >= 0 && sheetIndex < this.sheets.length) {
      this.sheets[sheetIndex].name = newName;
      console.log(`Sheet ${sheetIndex} renamed to: "${newName}"`);
    }
  }

  selectSheet(index: number) {
    if (index >= 0 && index < this.sheets.length) {
      this.activeSheetIndex = index;
      this.sheetSelected.emit(index);
    }
  }

  setSelectedSheetIndex(index: number) {
    this.selectedSheetIndex = index;
  }

  closeSheet(index: number, event: Event) {
    event.stopPropagation();
    
    if (this.sheets.length > 1 && index >= 0 && index < this.sheets.length) {
      this.sheets.splice(index, 1);
      
      // Adjust active sheet index if necessary
      if (this.activeSheetIndex >= this.sheets.length) {
        this.activeSheetIndex = this.sheets.length - 1;
      } else if (this.activeSheetIndex >= index) {
        this.activeSheetIndex = Math.max(0, this.activeSheetIndex - 1);
      }
      
      this.sheetClosed.emit(index);
    }
  }

  duplicateSheet(index: number) {
    if (index >= 0 && index < this.sheets.length) {
      const originalSheet = this.sheets[index];
      const duplicatedSheet = {
        id: `sheet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // More unique ID
        name: `${originalSheet.name} Copy`,
        data: [...(originalSheet.data || [])],
        isEmpty: originalSheet.isEmpty || false
      };
      
      this.sheets.splice(index + 1, 0, duplicatedSheet);
      this.activeSheetIndex = index + 1;
      this.sheetAdded.emit(duplicatedSheet);
    }
  }

  renameSheet(index: number) {
    if (index >= 0 && index < this.sheets.length) {
      const currentName = this.sheets[index].name;
      const newName = prompt('Enter new sheet name:', currentName);
      
      if (newName && newName.trim() && newName !== currentName) {
        this.sheets[index].name = newName.trim();
        // You can emit an event here if needed
        // this.sheetRenamed.emit({ index, oldName: currentName, newName: newName.trim() });
      }
    }
  }

  deleteSheet(index: number) {
    if (this.sheets.length > 1 && index >= 0 && index < this.sheets.length) {
      const confirmDelete = confirm(`Are you sure you want to delete "${this.sheets[index].name}"?`);
      
      if (confirmDelete) {
        this.sheets.splice(index, 1);
        
        // Adjust active sheet index if necessary
        if (this.activeSheetIndex >= this.sheets.length) {
          this.activeSheetIndex = this.sheets.length - 1;
        } else if (this.activeSheetIndex > index) {
          this.activeSheetIndex--;
        }
        
        this.sheetClosed.emit(index);
      }
    }
  }

  getActiveSheetData(): any[] {
    if (this.activeSheetIndex >= 0 && this.activeSheetIndex < this.sheets.length) {
      return this.sheets[this.activeSheetIndex].data || [];
    }
    return [];
  }

  // Show rename popup near the clicked button
  showRenamePopup(index: number, event: MouseEvent): void {
    const buttonElement = event.target as HTMLElement;
    const rect = buttonElement.getBoundingClientRect();
    
    this.renamePopupPosition = {
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY + 5
    };
    
    this.renameSheetIndex = index;
    this.newSheetName = this.sheets[index].name;
    this.showRenameDialog = true;
    
    // Focus input after a short delay
    setTimeout(() => {
      const inputElement = document.querySelector('.rename-input') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
        inputElement.select();
      }
    }, 100);
  }

  // Save the renamed sheet
  saveRename(): void {
    if (this.newSheetName?.trim() && this.renameSheetIndex >= 0) {
      this.sheets[this.renameSheetIndex].name = this.newSheetName.trim();
      this.cancelRename();
    }
  }

  // Cancel rename operation
  cancelRename(): void {
    this.showRenameDialog = false;
    this.newSheetName = '';
    this.renameSheetIndex = -1;
  }

  // Save current sheet data
  saveSheet(index: number): void {
    if (index >= 0 && index < this.sheets.length) {
      const sheetData = {
        sheetName: this.sheets[index].name,
        data: this.sheets[index].data || [],
        timestamp: new Date().toISOString()
      };
      
      // Here you would typically call an API to save the data
      console.log('Saving sheet:', sheetData);
      
      // For now, just show a success message
      alert(`Sheet "${this.sheets[index].name}" saved successfully!`);
      
      // You can emit an event if the parent needs to handle the save
      // this.sheetSaved.emit(sheetData);
    }
  }

  // Move sheet to the left
  moveSheetLeft(index: number): void {
    if (index > 0 && index < this.sheets.length) {
      // Swap with previous sheet
      const temp = this.sheets[index];
      this.sheets[index] = this.sheets[index - 1];
      this.sheets[index - 1] = temp;
      
      // Update active sheet index if needed
      if (this.activeSheetIndex === index) {
        this.activeSheetIndex = index - 1;
      } else if (this.activeSheetIndex === index - 1) {
        this.activeSheetIndex = index;
      }
    }
  }

  // Move sheet to the right
  moveSheetRight(index: number): void {
    if (index >= 0 && index < this.sheets.length - 1) {
      // Swap with next sheet
      const temp = this.sheets[index];
      this.sheets[index] = this.sheets[index + 1];
      this.sheets[index + 1] = temp;
      
      // Update active sheet index if needed
      if (this.activeSheetIndex === index) {
        this.activeSheetIndex = index + 1;
      } else if (this.activeSheetIndex === index + 1) {
        this.activeSheetIndex = index;
      }
    }
  }

  // Navigate between sheets using left/right buttons
  navigateSheet(direction: 'left' | 'right') {
    if (direction === 'left' && this.activeSheetIndex > 0) {
      this.selectSheet(this.activeSheetIndex - 1);
    } else if (direction === 'right' && this.activeSheetIndex < this.sheets.length - 1) {
      this.selectSheet(this.activeSheetIndex + 1);
    }
  }

  // Track function for ngFor to help Angular identify sheet changes
  trackBySheet(index: number, sheet: any): any {
    // Use a combination of id and index for better stability
    return sheet.id ? `sheet_${sheet.id}` : `index_${index}`;
  }

  // Method to refresh component state after major changes
  refreshComponent() {
    // Simple refresh - custom dropdowns are not affected by array changes
    this.cdr.detectChanges();
  }

  // Custom dropdown methods
  toggleCustomMenu(index: number, event: Event) {
    console.log('Toggle custom menu clicked for sheet:', index);
    event.preventDefault();
    event.stopPropagation();
    
    // Close other open menus first
    if (this.showCustomMenu && this.selectedSheetIndex !== index) {
      this.closeCustomMenu();
    }
    
    // Toggle the current menu
    if (this.selectedSheetIndex === index && this.showCustomMenu) {
      console.log('Closing custom menu');
      this.showCustomMenu = false;
    } else {
      console.log('Opening custom menu for sheet:', index);
      this.selectedSheetIndex = index;
      this.showCustomMenu = true;
    }
  }

  closeCustomMenu() {
    console.log('Closing custom menu');
    this.showCustomMenu = false;
  }

  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;

  setSheetIndex(index: number, event?: Event) {
    // Don't stop propagation - let matMenuTriggerFor handle the menu opening
    this.selectedSheetIndex = index;
    console.log('Sheet index set for menu:', this.selectedSheetIndex);
    // Force change detection to ensure the menu gets the correct index
    this.cdr.detectChanges();
  }

  openMenu(trigger: MatMenuTrigger, event: Event, sheetIndex?: number) {
    event.stopPropagation();
    event.preventDefault();
    
    // Store the sheet index if provided
    if (sheetIndex !== undefined) {
      this.selectedSheetIndex = sheetIndex;
      console.log('Sheet index set for menu:', this.selectedSheetIndex);
    }
    
    // Force change detection before opening menu
    this.cdr.detectChanges();
    
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      if (trigger && trigger.menuOpen === false) {
        trigger.openMenu();
        console.log('Menu opened for sheet:', this.selectedSheetIndex);
      }
    }, 0);
  }

  // Clear all sheets
  clearAllSheets() {
    this.sheets = [];
    this.activeSheetIndex = 0;
    console.log('All sheets cleared');
  }

  // Add a new sheet with data
  addSheetWithData(sheetName: string, data: any[]) {
    // Check if maximum sheets limit reached
    /*if (this.sheets.length >= 7) {
      console.warn('Maximum 7 sheets allowed. Cannot add more sheets.');
      return;
    }*/

    const newSheet = {
      id: `sheet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: sheetName,
      data: data, // Use reference instead of copying - much faster
      isEmpty: data.length === 0
    };
    
    this.sheets.push(newSheet);
    
    // Emit event
    this.sheetAdded.emit(newSheet);
  }

}

