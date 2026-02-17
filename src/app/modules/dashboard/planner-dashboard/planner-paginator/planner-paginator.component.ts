import { Component, Input, Output, EventEmitter, ViewChild, ViewChildren, QueryList, ChangeDetectorRef, OnInit, OnDestroy, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { TemplateService } from 'src/app/modules/template/template.service';

export interface PlannerSheet {
  id: string;
  name: string;
  data?: any;
  isTemplate?: boolean; // Flag to identify template sheets
  plannerSheetId?: number; // The actual planner sheet ID from the backend
  originalName?: string; // Track original name for rename validation
}

@Component({
  selector: 'app-planner-paginator',
  templateUrl: './planner-paginator.component.html',
  styleUrls: ['./planner-paginator.component.css']
})
export class PlannerPaginatorComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild('plannerSheetMenu', { static: true }) plannerSheetMenu!: MatMenu;
  @ViewChildren(MatMenuTrigger) menuTriggers!: QueryList<MatMenuTrigger>;
  @ViewChild('renameInput') renameInput!: ElementRef<HTMLInputElement>;

  @Input() length = 0;
  @Input() pageSizeOptions: number[] = [10, 25, 50];
  @Input() showFirstLastButtons = true;
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() sheetAdded = new EventEmitter<PlannerSheet>();
  @Output() sheetSelected = new EventEmitter<PlannerSheet>();
  @Output() sheetDeleted = new EventEmitter<PlannerSheet>();
  @Output() sheetRenamed = new EventEmitter<{sheet: PlannerSheet, oldName: string}>();
  @Output() sheetDuplicated = new EventEmitter<PlannerSheet>();
  @Output() sheetMoved = new EventEmitter<{sheet: PlannerSheet, direction: 'left' | 'right'}>();
  @Output() sheetSaved = new EventEmitter<PlannerSheet>();
  @Output() sheetClosed = new EventEmitter<PlannerSheet>();

  sheets: PlannerSheet[] = [];
  activeSheetIndex = 0;
  selectedSheetIndex = 0;
  componentId = 'planner-' + Math.random().toString(36).substr(2, 9);
  
  // Rename popup properties
  showRenameDialog = false;
  newSheetName = '';
  renamePopupPosition = { x: 0, y: 0 };
  isOpeningRenamePopup = false; // Flag to prevent document click interference
  
  // Menu state tracking
  isMenuOpen = false;

  // Close menu when clicking outside - using capture phase to get event before it's stopped
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Don't process if rename dialog is open or being opened
    if (this.showRenameDialog || this.isOpeningRenamePopup) return;
    
    if (!this.isMenuOpen) return;
    
    const target = event.target as HTMLElement;
    
    // Check if click is on the menu panel or menu trigger button (should NOT close)
    const isInsideMenu = target.closest('.mat-menu-panel') || 
                         target.closest('.mat-mdc-menu-panel') ||
                         target.closest('.planner-sheet-dropdown-btn') ||
                         target.closest('.mat-menu-item') ||
                         target.closest('.mat-mdc-menu-item') ||
                         target.closest('.cdk-overlay-pane') ||
                         target.closest('.planner-rename-popup') ||
                         target.closest('.planner-rename-popup-overlay');
    
    // If menu is open and click is outside menu content, close it
    if (!isInsideMenu) {
      console.log('PlannerPaginator - Closing menu due to outside click');
      this.closeAllMenus();
    }
  }

  // Also listen for escape key to close menu
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.isMenuOpen) {
      this.closeAllMenus();
    }
  }

  // Helper method to close all menu triggers
  closeAllMenus() {
    if (this.menuTriggers) {
      this.menuTriggers.forEach(trigger => {
        if (trigger.menuOpen) {
          trigger.closeMenu();
        }
      });
    }
    this.isMenuOpen = false;
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private templateService: TemplateService
  ) {}

  ngOnInit() {
    console.log('PlannerPaginator - Initializing with componentId:', this.componentId);
    // Clear any existing state completely
    this.resetComponentState();
    
    // Initialize immediately with a default sheet
    this.initializeComponent();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    console.log('PlannerPaginator - Destroying component:', this.componentId);
    this.cleanupComponent();
  }

  resetComponentState() {
    console.log('PlannerPaginator - Resetting component state for:', this.componentId);
    this.sheets = [];
    this.activeSheetIndex = 0;
    this.selectedSheetIndex = 0;
    this.showRenameDialog = false;
    this.newSheetName = '';
    this.isOpeningRenamePopup = false;
  }

  initializeComponent() {
    console.log('PlannerPaginator - Initializing component:', this.componentId);
    // Ensure we start fresh and always have at least one sheet
    if (this.sheets.length === 0) {
      console.log('PlannerPaginator - Creating initial sheet');
      this.addSheet();
    }
    
    // Force change detection to update the template
    this.cdr.detectChanges();
    
    console.log('PlannerPaginator - Component initialized with sheets:', this.sheets.length);
  }

  cleanupComponent() {
    console.log('PlannerPaginator - Cleaning up component:', this.componentId);
    this.resetComponentState();
    
    // Clear any DOM references
    this.showRenameDialog = false;
  }

  trackBySheet(index: number, sheet: PlannerSheet): string {
    return sheet.id;
  }

  addSheet() {
    const newSheet: PlannerSheet = {
      id: 'planner-sheet-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      name: `Sheet ${this.sheets.length + 1}`,
      data: [] // Will be populated by parent component
    };
    
    this.sheets.push(newSheet);
    this.activeSheetIndex = this.sheets.length - 1;
    
    console.log('PlannerPaginator - Sheet added:', newSheet);
    console.log('PlannerPaginator - Total sheets:', this.sheets.length);
    console.log('PlannerPaginator - Active sheet index:', this.activeSheetIndex);
    
    this.sheetAdded.emit(newSheet);
    this.cdr.detectChanges();
    
    // Notify parent that sheet needs data
    console.log('PlannerPaginator - New sheet created, parent should populate data');
  }

  selectSheet(index: number) {
    if (index >= 0 && index < this.sheets.length) {
      this.activeSheetIndex = index;
      this.sheetSelected.emit(this.sheets[index]);
      console.log('PlannerPaginator - Sheet selected:', this.sheets[index]);
    }
  }

  // Check if the selected sheet is a template sheet
  isSelectedSheetTemplate(): boolean {
    if (this.selectedSheetIndex >= 0 && this.selectedSheetIndex < this.sheets.length) {
      return this.sheets[this.selectedSheetIndex]?.isTemplate === true;
    }
    return false;
  }

  openSheetMenu(index: number, event: Event) {
    event.stopPropagation();
    this.selectedSheetIndex = index;
    console.log('PlannerPaginator - Opening sheet menu for index:', index);
  }

  duplicateSheet(index: number) {
    if (index >= 0 && index < this.sheets.length) {
      const originalSheet = this.sheets[index];
      const newSheet: PlannerSheet = {
        id: 'planner-sheet-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        name: originalSheet.name + ' Copy',
        data: JSON.parse(JSON.stringify(originalSheet.data || {})) // Deep copy
      };
      
      this.sheets.splice(index + 1, 0, newSheet);
      this.activeSheetIndex = index + 1;
      this.sheetDuplicated.emit(newSheet);
      console.log('PlannerPaginator - Sheet duplicated:', newSheet);
      this.cdr.detectChanges();
    }
  }

  async deleteSheet(index: number) {
    if (this.sheets.length > 1 && index >= 0 && index < this.sheets.length) {
      const deletedSheet = this.sheets[index];
      
      // Show confirmation dialog before deleting
      const confirmed = confirm(`Are you sure you want to delete the sheet "${deletedSheet.name}"? This action cannot be undone.`);
      if (!confirmed) {
        return;
      }
      
      // Check if the sheet has a valid planner sheet ID (numeric ID from backend)
      const plannerSheetId = this.getPlannerSheetId(deletedSheet);
      
      if (plannerSheetId) {
        try {
          // Call API to delete the planner sheet
          console.log('PlannerPaginator - Deleting planner sheet from backend, ID:', plannerSheetId);
          await this.templateService.deletePlannerSheet(plannerSheetId);
          console.log('PlannerPaginator - Successfully deleted planner sheet from backend');
        } catch (error) {
          console.error('PlannerPaginator - Failed to delete planner sheet from backend:', error);
          // Continue with local deletion even if API fails
        }
      }
      
      this.sheets.splice(index, 1);
      
      // Adjust active sheet index
      if (this.activeSheetIndex >= this.sheets.length) {
        this.activeSheetIndex = this.sheets.length - 1;
      } else if (index <= this.activeSheetIndex && this.activeSheetIndex > 0) {
        this.activeSheetIndex--;
      }
      
      this.sheetDeleted.emit(deletedSheet);
      console.log('PlannerPaginator - Sheet deleted:', deletedSheet);
      this.cdr.detectChanges();
    }
  }

  // Helper method to extract planner sheet ID from sheet object
  private getPlannerSheetId(sheet: PlannerSheet): number | null {
    // Check various possible property names for the planner sheet ID
    const sheetData = sheet as any;
    const id = sheetData.plannerSheetId || sheetData.PlannerSheetId || 
               sheetData.plannerSheetID || sheetData.PlannerSheetID;
    
    // Only return if it's a valid numeric ID (not a generated client-side ID)
    if (id && typeof id === 'number' && id > 0) {
      return id;
    }
    
    // Also check if the sheet.id is a numeric planner sheet ID
    if (sheet.id && !sheet.id.startsWith('planner-sheet-')) {
      const numericId = Number(sheet.id);
      if (!isNaN(numericId) && numericId > 0) {
        return numericId;
      }
    }
    
    return null;
  }

  navigateSheet(direction: 'left' | 'right') {
    if (direction === 'left' && this.activeSheetIndex > 0) {
      this.selectSheet(this.activeSheetIndex - 1);
    } else if (direction === 'right' && this.activeSheetIndex < this.sheets.length - 1) {
      this.selectSheet(this.activeSheetIndex + 1);
    }
  }

  showRenamePopup(index: number, event: Event) {
    event.stopPropagation();
    
    if (index >= 0 && index < this.sheets.length) {
      this.selectedSheetIndex = index;
      this.newSheetName = this.sheets[index].name;
      
      // Set flag to prevent document click from interfering
      this.isOpeningRenamePopup = true;
      
      // Close the menu first
      this.closeAllMenus();
      
      // Use setTimeout to show the popup after the menu animation completes
      setTimeout(() => {
        // Calculate position - center of the viewport for better UX
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        this.renamePopupPosition = {
          x: (viewportWidth - 300) / 2, // 300 is approximate popup width
          y: (viewportHeight - 150) / 2 // 150 is approximate popup height
        };
        
        this.showRenameDialog = true;
        this.isOpeningRenamePopup = false;
        this.cdr.detectChanges();
        
        // Focus the input after a short delay
        setTimeout(() => {
          if (this.renameInput && this.renameInput.nativeElement) {
            this.renameInput.nativeElement.focus();
            this.renameInput.nativeElement.select();
          }
        }, 50);
      }, 150); // Wait for menu close animation
    }
  }

  saveRename() {
    if (this.newSheetName && this.newSheetName.trim() && this.selectedSheetIndex >= 0 && this.selectedSheetIndex < this.sheets.length) {
      const oldName = this.sheets[this.selectedSheetIndex].name;
      this.sheets[this.selectedSheetIndex].name = this.newSheetName.trim();
      
      this.sheetRenamed.emit({
        sheet: this.sheets[this.selectedSheetIndex],
        oldName: oldName
      });
      
      console.log('PlannerPaginator - Sheet renamed from', oldName, 'to', this.newSheetName);
    }
    
    this.cancelRename();
  }

  cancelRename() {
    this.showRenameDialog = false;
    this.newSheetName = '';
    this.cdr.detectChanges();
  }

  moveSheetLeft(index: number) {
    if (index > 0 && index < this.sheets.length) {
      const sheet = this.sheets[index];
      this.sheets[index] = this.sheets[index - 1];
      this.sheets[index - 1] = sheet;
      
      // Update active sheet index if needed
      if (this.activeSheetIndex === index) {
        this.activeSheetIndex = index - 1;
      } else if (this.activeSheetIndex === index - 1) {
        this.activeSheetIndex = index;
      }
      
      this.sheetMoved.emit({ sheet: sheet, direction: 'left' });
      console.log('PlannerPaginator - Sheet moved left:', sheet);
      this.cdr.detectChanges();
    }
  }

  moveSheetRight(index: number) {
    if (index >= 0 && index < this.sheets.length - 1) {
      const sheet = this.sheets[index];
      this.sheets[index] = this.sheets[index + 1];
      this.sheets[index + 1] = sheet;
      
      // Update active sheet index if needed
      if (this.activeSheetIndex === index) {
        this.activeSheetIndex = index + 1;
      } else if (this.activeSheetIndex === index + 1) {
        this.activeSheetIndex = index;
      }
      
      this.sheetMoved.emit({ sheet: sheet, direction: 'right' });
      console.log('PlannerPaginator - Sheet moved right:', sheet);
      this.cdr.detectChanges();
    }
  }

  saveSheet(index: number) {
    if (index >= 0 && index < this.sheets.length) {
      const sheet = this.sheets[index];
      this.sheetSaved.emit(sheet);
      console.log('PlannerPaginator - Sheet saved:', sheet);
    }
  }

  closeSheet(index: number) {
    if (index >= 0 && index < this.sheets.length) {
      const closedSheet = this.sheets[index];
      
      // Remove the sheet from the array
      this.sheets.splice(index, 1);
      
      // Adjust active sheet index
      if (this.sheets.length === 0) {
        // If no sheets left, add a new default sheet
        this.addSheet();
      } else if (this.activeSheetIndex >= this.sheets.length) {
        this.activeSheetIndex = this.sheets.length - 1;
      } else if (index < this.activeSheetIndex) {
        this.activeSheetIndex--;
      } else if (index === this.activeSheetIndex) {
        // If we closed the active sheet, select the previous one or the first one
        if (this.activeSheetIndex > 0) {
          this.activeSheetIndex--;
        }
        // Emit sheet selected for the new active sheet
        if (this.sheets.length > 0) {
          this.sheetSelected.emit(this.sheets[this.activeSheetIndex]);
        }
      }
      
      this.sheetClosed.emit(closedSheet);
      console.log('PlannerPaginator - Sheet closed:', closedSheet);
      this.cdr.detectChanges();
    }
  }

  getActiveSheetData(): any {
    if (this.sheets.length > 0 && this.activeSheetIndex >= 0 && this.activeSheetIndex < this.sheets.length) {
      return this.sheets[this.activeSheetIndex].data || [];
    }
    return [];
  }

  getActiveSheet(): PlannerSheet | null {
    if (this.sheets.length > 0 && this.activeSheetIndex >= 0 && this.activeSheetIndex < this.sheets.length) {
      return this.sheets[this.activeSheetIndex];
    }
    return null;
  }

  setActiveSheetData(data: any): void {
    if (this.sheets.length > 0 && this.activeSheetIndex >= 0 && this.activeSheetIndex < this.sheets.length) {
      this.sheets[this.activeSheetIndex].data = data;
    }
  }

  // Diagnostic method for testing
  testMenuFunctionality() {
    console.log('=== PLANNER PAGINATOR DIAGNOSTICS ===');
    console.log('Component ID:', this.componentId);
    console.log('Sheets count:', this.sheets.length);
    console.log('Active sheet index:', this.activeSheetIndex);
    console.log('Selected sheet index:', this.selectedSheetIndex);
    console.log('Sheets:', this.sheets);
    
    // Check if menu elements exist
    const menuElement = document.getElementById(`planner-sheet-menu-${this.componentId}`);
    console.log('Menu element found:', !!menuElement);
    console.log('ViewChild plannerSheetMenu:', !!this.plannerSheetMenu);
    
    // Check for mat-menu in DOM
    const matMenus = document.querySelectorAll('mat-menu');
    console.log('Total mat-menu elements in DOM:', matMenus.length);
    
    // Check for cdk-overlay-pane (where Material menus render)
    const overlayPanes = document.querySelectorAll('.cdk-overlay-pane');
    console.log('CDK overlay panes:', overlayPanes.length);
    
    // Check if trigger buttons exist
    for (let i = 0; i < this.sheets.length; i++) {
      const triggerId = `planner-menu-trigger-${this.componentId}-${i}`;
      const triggerElement = document.getElementById(triggerId);
      console.log(`Trigger ${i} (${triggerId}):`, !!triggerElement);
    }
    
    console.log('=== END DIAGNOSTICS ===');
  }




  setSheetIndex(index: number, event?: Event) {
    // Don't stop propagation - let matMenuTriggerFor handle the menu opening
    this.selectedSheetIndex = index;
    console.log('PlannerPaginator - Sheet index set for menu:', this.selectedSheetIndex);
    // Force change detection to ensure the menu gets the correct index
    this.cdr.detectChanges();
  }

  onMenuOpened() {
    console.log('PlannerPaginator - Menu opened successfully!');
    this.isMenuOpen = true;
  }

  onMenuClosed() {
    console.log('PlannerPaginator - Menu closed');
    this.isMenuOpen = false;
  }

  // Test menu item clicking
  testMenuItemClick() {
    console.log('=== TESTING MENU ITEM INTERACTION ===');
    
    setTimeout(() => {
      const menuItems = document.querySelectorAll('.mat-menu-item, .mat-mdc-menu-item');
      console.log(`Found ${menuItems.length} menu items in DOM`);
      
      menuItems.forEach((item, index) => {
        const itemText = item.textContent?.trim();
        const isClickable = window.getComputedStyle(item).pointerEvents !== 'none';
        const rect = item.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;
        
        console.log(`Item ${index + 1}: "${itemText}" - clickable: ${isClickable}, visible: ${isVisible}, rect: ${rect.width}x${rect.height}`);
        
        // Add click event listener for testing
        if (isClickable && isVisible) {
          (item as HTMLElement).addEventListener('click', (e) => {
            console.log(`✅ Menu item "${itemText}" clicked successfully!`);
            e.preventDefault();
            e.stopPropagation();
          }, { once: true });
        }
      });
      
      console.log('✨ Click test setup complete - try clicking menu items now');
    }, 100);
  }
}