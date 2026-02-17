import { AfterViewInit, Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from 'src/app/core/guards/can-deactivate.guard';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { customToaster } from 'src/app/shared/components/toaster/toaster.component';
import { TemplateService } from 'src/app/modules/template/template.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-planner-dashboard',
  templateUrl: './planner-dashboard.component.html',
  styleUrls: ['./planner-dashboard.component.css']
})
export class PlannerDashboardComponent implements OnInit, AfterViewInit, OnDestroy, CanComponentDeactivate {
        // --- Template dropdown helpers ---
        closeTemplateDropdown() {
          this.showTemplateDropdown = false;
        }

        get filteredTemplateOptions() {
          // Example: filter by searchTemplate if needed
          if (!this.searchTemplate) return this.templateOptions;
          return this.templateOptions.filter((opt: any) =>
            (opt.label || opt.name || '').toLowerCase().includes(this.searchTemplate.toLowerCase())
          );
        }

        selectTemplate(option: any) {
          // Check if there are any open planner sheets
          if (this.openPlannerSheetIds.size > 0) {
            const confirmed = confirm('This will close the current working planner sheet(s). Are you sure you want to continue?');
            
            if (!confirmed) {
              // User cancelled - don't proceed with template selection
              return;
            }
            
            // User confirmed - close all planner sheets
            this.closeAllPlannerSheets();
          }
          
          this.selectedTemplate = option;
          this.closeTemplateDropdown();
          // Load template data from API
          if (option && option.value) {
            this.loadTemplateFromAPI(option.value);
          }
        }

        // Close all open planner sheets and reset state
        closeAllPlannerSheets() {
          console.log('🗑️ Closing all planner sheets...');
          
          // Clear the tracked open sheet IDs
          this.openPlannerSheetIds.clear();
          
          // Reset paginator to default state with empty sheet
          if (this.plannerPaginator) {
            this.plannerPaginator.sheets = [{
              id: 'planner-sheet-' + Date.now(),
              name: 'Sheet 1',
              data: [],
              isTemplate: false
            }];
            this.plannerPaginator.activeSheetIndex = 0;
          }
          
          // Clear task list
          this.plannerTaskList = [];
          this.length = 0;
          
          // Force change detection to update checkbox states in dropdown
          this.cdr.detectChanges();
          
          console.log('✅ All planner sheets closed, openPlannerSheetIds cleared');
        }

        // Clear selected template and reset the view
        clearSelectedTemplate() {
          this.selectedTemplate = null;
          this.plannerTaskList = [];
          this.length = 0;
          
          // Reset paginator to default state with empty sheet
          if (this.plannerPaginator) {
            this.plannerPaginator.sheets = [{
              id: 'planner-sheet-' + Date.now(),
              name: 'Sheet 1',
              data: [],
              isTemplate: false
            }];
            this.plannerPaginator.activeSheetIndex = 0;
          }
          
          this.cdr.detectChanges();
          
          this.utilServ.toaster.next({ 
            type: customToaster.successToast, 
            message: 'Template removed successfully' 
          });
        }

        // --- Planner sheet dropdown helpers ---
        closePlannerSheetDropdown() {
          this.showPlannerSheetDropdown = false;
        }

        async togglePlannerSheetDropdown() {
          if (!this.showPlannerSheetDropdown) {
            // Load planner sheets when opening dropdown
            await this.loadPlannerSheetOptions();
          }
          this.showPlannerSheetDropdown = !this.showPlannerSheetDropdown;
        }

        // Load planner sheet options from API
        async loadPlannerSheetOptions() {
          try {
            let user: any = localStorage.getItem('loggedInUser');
      if (!user) {
        console.warn('⚠️ No logged in user found');
        return;
      }
      
      let parsedData = JSON.parse(user);
      console.log('🔍 Parsed user data:', parsedData);
      
      let employeeId = parsedData?.employeeId || parsedData?.EmployeeId || parsedData?.empId || parsedData?.EmpId || parsedData?.id || parsedData?.Id;
      
            console.log('🔄 Loading planner sheet options...');
            const res: any = await this.templateService.GetAllPlannerSheetsByEmpId(employeeId);
            console.log('📦 Planner Sheets API Response:', res);
            
            const dataArray = res?.result || res?.data || res || [];
            
            if (dataArray.length > 0) {
              console.log('📋 First planner sheet sample:', dataArray[0]);
              
              this.plannerSheetOptions = dataArray.map((sheet: any) => ({
                id: sheet.plannerSheetId || sheet.PlannerSheetId || sheet.plannerSheetID || sheet.PlannerSheetID || sheet.id,
                value: sheet.plannerSheetId || sheet.PlannerSheetId || sheet.plannerSheetID || sheet.PlannerSheetID || sheet.id,
                label: sheet.plannerSheetName || sheet.PlannerSheetName || sheet.name || sheet.Name,
                name: sheet.plannerSheetName || sheet.PlannerSheetName || sheet.name || sheet.Name,
                isActive: sheet.isActive || sheet.IsActive || false
              }));
              console.log('✅ Loaded', this.plannerSheetOptions.length, 'planner sheets:', this.plannerSheetOptions);
            } else {
              this.plannerSheetOptions = [];
              console.log('ℹ️ No planner sheets found');
            }
            
            // Force change detection
            this.cdr.detectChanges();
            
          } catch (error) {
            console.error('❌ Error loading planner sheet options:', error);
            this.plannerSheetOptions = [];
          }
        }

        get filteredPlannerSheetOptions() {
          if (!this.searchPlannerSheet) return this.plannerSheetOptions;
          return this.plannerSheetOptions.filter((opt: any) =>
            (opt.label || opt.name || '').toLowerCase().includes(this.searchPlannerSheet.toLowerCase())
          );
        }

        // TrackBy function for planner sheet options
        trackByPlannerSheetId(index: number, option: any): any {
          return option.id;
        }

        // Toggle planner sheet selection (checkbox behavior)
        async togglePlannerSheetSelection(option: any) {
          if (!option || !option.id) {
            return;
          }
          
          console.log('📋 Toggle planner sheet selection:', option);
          
          // Check if this planner sheet is already open
          if (this.isPlannerSheetAlreadyOpen(option.id)) {
            // Sheet is already open - ask confirmation to close it
            const sheetName = option.name || option.label;
            const confirmed = confirm(`Are you sure you want to close the planner sheet "${sheetName}"? Any unsaved changes will be lost.`);
            
            if (confirmed) {
              // Remove the sheet from paginator
              this.removePlannerSheetFromUI(option.id);
              this.utilServ.toaster.next({ 
                type: customToaster.successToast, 
                message: `Planner sheet "${sheetName}" closed` 
              });
            }
          } else {
            // Sheet is not open - load it
            console.log('📂 Opening planner sheet:', option.name || option.label);
            await this.loadPlannerSheetFromAPI(option);
            this.utilServ.toaster.next({ 
              type: customToaster.successToast, 
              message: `Planner sheet "${option.name || option.label}" opened` 
            });
          }
          
          // Force change detection to update checkbox state
          this.cdr.detectChanges();
          
          // Don't close dropdown - allow multiple selections
          // this.closePlannerSheetDropdown();
        }

        // Remove a planner sheet from the UI (paginator)
        removePlannerSheetFromUI(plannerSheetId: any) {
          if (!this.plannerPaginator || !this.plannerPaginator.sheets) {
            return;
          }
          
          const sheetId = Number(plannerSheetId);
          const sheetIndex = this.plannerPaginator.sheets.findIndex((sheet: any) => {
            const existingId = Number(sheet.plannerSheetId || sheet.PlannerSheetId || sheet.plannerSheetID || 0);
            return existingId === sheetId && sheetId !== 0;
          });
          
          if (sheetIndex >= 0) {
            console.log(`🗑️ Removing sheet at index ${sheetIndex}`);
            
            // Remove from tracked open sheet IDs
            this.openPlannerSheetIds.delete(sheetId);
            console.log('📋 Removed from openPlannerSheetIds:', sheetId, 'Remaining:', Array.from(this.openPlannerSheetIds));
            
            // Remove the sheet from the array
            this.plannerPaginator.sheets.splice(sheetIndex, 1);
            
            // If we removed the active sheet, switch to another sheet
            if (this.plannerPaginator.activeSheetIndex === sheetIndex) {
              // Switch to previous sheet or first sheet
              const newActiveIndex = Math.max(0, sheetIndex - 1);
              if (this.plannerPaginator.sheets.length > 0) {
                this.plannerPaginator.selectSheet(newActiveIndex);
                // Update plannerTaskList with the new active sheet's data
                const newActiveSheet = this.plannerPaginator.sheets[newActiveIndex];
                this.plannerTaskList = newActiveSheet.data || [];
                this.length = this.plannerTaskList.length;
              } else {
                // No sheets left
                this.plannerTaskList = [];
                this.length = 0;
              }
            } else if (this.plannerPaginator.activeSheetIndex > sheetIndex) {
              // Adjust active index if we removed a sheet before it
              this.plannerPaginator.activeSheetIndex--;
            }
            
            console.log(`✅ Sheet removed. Remaining sheets: ${this.plannerPaginator.sheets.length}`);
            
            // Force refresh of dropdown options to update checkbox states
            this.refreshPlannerSheetDropdown();
          }
        }

        // Force refresh the planner sheet dropdown to update checkbox states
        private refreshPlannerSheetDropdown() {
          // Temporarily hide and show the dropdown to force complete re-render
          const wasOpen = this.showPlannerSheetDropdown;
          if (wasOpen) {
            this.showPlannerSheetDropdown = false;
            this.cdr.detectChanges();
            
            // Re-open after a brief delay
            setTimeout(() => {
              this.showPlannerSheetDropdown = true;
              this.cdr.detectChanges();
            }, 0);
          }
        }

        // Navigate to an already open sheet in the paginator
        navigateToOpenSheet(plannerSheetId: any) {
          if (!this.plannerPaginator || !this.plannerPaginator.sheets) {
            return;
          }
          
          const sheetId = Number(plannerSheetId);
          const sheetIndex = this.plannerPaginator.sheets.findIndex((sheet: any) => {
            const existingId = Number(sheet.plannerSheetId || sheet.PlannerSheetId || sheet.plannerSheetID || 0);
            return existingId === sheetId && sheetId !== 0;
          });
          
          if (sheetIndex >= 0) {
            this.plannerPaginator.selectSheet(sheetIndex);
            console.log(`✅ Navigated to sheet at index ${sheetIndex}`);
          }
        }

        async selectPlannerSheet(option: any) {
          this.selectedPlannerSheet = option;
          this.closePlannerSheetDropdown();
          
          // Load the planner sheet data from API
          if (option && option.id) {
            console.log('📋 Selected planner sheet:', option);
            
            // Check if this planner sheet is already open in the paginator
            if (this.isPlannerSheetAlreadyOpen(option.id)) {
              console.log('⚠️ Planner sheet is already open:', option.name || option.label);
              this.utilServ.toaster.next({ 
                type: customToaster.warningToast, 
                message: `Planner sheet "${option.name || option.label}" is already open` 
              });
              return;
            }
            
            await this.loadPlannerSheetFromAPI(option);
          }
        }

        // Check if a planner sheet is already open (using tracked Set)
        isPlannerSheetAlreadyOpen(plannerSheetId: any): boolean {
          const sheetId = Number(plannerSheetId);
          return sheetId !== 0 && this.openPlannerSheetIds.has(sheetId);
        }

        // Update the openPlannerSheetIds set based on paginator sheets
        updateOpenPlannerSheetIds() {
          this.openPlannerSheetIds.clear();
          if (this.plannerPaginator && this.plannerPaginator.sheets) {
            this.plannerPaginator.sheets.forEach((sheet: any) => {
              const sheetId = Number(sheet.plannerSheetId || sheet.PlannerSheetId || sheet.plannerSheetID || 0);
              if (sheetId !== 0) {
                this.openPlannerSheetIds.add(sheetId);
              }
            });
          }
          console.log('📋 Open planner sheet IDs updated:', Array.from(this.openPlannerSheetIds));
        }

        // Load planner sheet data from API when selected
        async loadPlannerSheetFromAPI(option: any) {
          try {
            const plannerSheetId = option.id || option.value || option.plannerSheetId || option.PlannerSheetId;
            const plannerSheetName = option.name || option.label || option.plannerSheetName || 'Sheet';
            
            console.log(`🔄 Loading planner sheet from API: ${plannerSheetName} (ID: ${plannerSheetId})`);
            
            const response: any = await this.templateService.getPlannerSheetById(plannerSheetId);
            console.log('📦 Planner Sheet API Response:', response);
            
            if (!response || !response.result) {
              console.warn(`⚠️ No data found for planner sheet: ${plannerSheetName}`);
              return;
            }
            
            const plannerResult = response.result;
            console.log('📊 Planner result:', plannerResult);
            
            // Get the planner sheet details array from the response
            // API returns: { plannerSheetMaster: {...}, plannerSheetDetails: [...] }
            const plannerDetails = plannerResult.plannerSheetDetails || plannerResult.PlannerSheetDetails || 
                                   (Array.isArray(plannerResult) ? plannerResult : [plannerResult]);
            
            // Get sheet name from master if available
            const masterData = plannerResult.plannerSheetMaster || plannerResult.PlannerSheetMaster;
            const sheetName = masterData?.plannerSheetName || masterData?.PlannerSheetName || plannerSheetName;
            
            console.log('📋 Planner details array:', plannerDetails);
            
            // Convert API data to tasks
            let tasks: any[] = [];
            if (Array.isArray(plannerDetails) && plannerDetails.length > 0) {
              tasks = this.convertPlannerSheetDetailsToTasks(plannerDetails);
            }
            
            console.log(`📋 Converted ${tasks.length} tasks:`, tasks);
            
            if (tasks.length > 0) {
              // Add a NEW sheet with the loaded data
              this.plannerPaginator.addSheet();
              const newSheetIndex = this.plannerPaginator.sheets.length - 1;
              const newSheet = this.plannerPaginator.sheets[newSheetIndex];
              
              // Set sheet properties - ensure plannerSheetId is stored as number
              newSheet.name = sheetName;
              newSheet.originalName = sheetName; // Store original name for rename validation
              newSheet.data = tasks;
              newSheet.plannerSheetId = Number(plannerSheetId);
              
              // Add to tracked open sheet IDs
              this.openPlannerSheetIds.add(Number(plannerSheetId));
              console.log('📋 Added to openPlannerSheetIds:', Number(plannerSheetId), 'Sheet object:', newSheet);
              
              // Make the new sheet active
              this.plannerPaginator.sheets.forEach((s: any, idx: number) => {
                s.isActive = (idx === newSheetIndex);
              });
              
              console.log(`✅ Added new sheet "${newSheet.name}" with ${tasks.length} tasks`);
              
              // Also update the main task list for display
              this.plannerTaskList = tasks;
              this.length = tasks.length;
              
              console.log('📊 plannerTaskList updated:', this.plannerTaskList);
            } else {
              console.warn('⚠️ No tasks found in API response');
            }
            
            // Force change detection
            this.cdr.detectChanges();
            console.log('✅ Planner sheet loaded successfully, plannerTaskList length:', this.plannerTaskList.length);
            
          } catch (error) {
            console.error('❌ Error loading planner sheet from API:', error);
          }
        }
        
        // Convert planner sheet details from API to task format
        private convertPlannerSheetDetailsToTasks(details: any[]): any[] {
          return details.map((detail: any, index: number) => {
            console.log('🔄 Converting detail:', detail);
            
            // Handle productEstWeight - it may already be formatted as "14200.00kg"
            let productEstWeight = detail.productEstWeight || detail.ProductEstWeight || '';
            let productEstWeightValue = detail.productEstWeightValue || detail.ProductEstWeightValue || '';
            let weightUnit = detail.productEstWeightUnits || detail.ProductEstWeightUnits || detail.weightUnit || detail.WeightUnit || 'kg';
            
            // If productEstWeight is formatted, parse it to extract value and unit
            if (productEstWeight && !productEstWeightValue) {
              const weightMatch = productEstWeight.toString().match(/^([\d.]+)\s*(\w+)?$/);
              if (weightMatch) {
                productEstWeightValue = weightMatch[1];
                weightUnit = weightMatch[2] || 'kg';
              }
            }
            
            if (detail.productEstWeightValue && detail.productEstWeightUnits) {
              productEstWeight = `${detail.productEstWeightValue}${detail.productEstWeightUnits}`;
            }
            
            const task = {
              no: this.formatTaskNumber(detail.sno || detail.Sno || (index + 1)),
              taskID: detail.taskID || detail.TaskID || 0,
              planner: detail.planner || detail.Planner || '',
              plannerId: detail.plannerID || detail.PlannerID || null,
              customer: detail.customer || detail.Customer || '',
              customerId: detail.customerID || detail.CustomerID || null,
              product: detail.product || detail.Product || '',
              productId: detail.productID || detail.ProductID || null,
              pickupLocation: detail.pickupLocation || detail.PickupLocation || '',
              pickupLocationId: detail.pickupLocationID || detail.PickupLocationID || null,
              vehicle: detail.vehicle || detail.Vehicle || '',
              vehicleId: detail.vehicleID || detail.VehicleID || null,
              driverName: detail.driver || detail.Driver || '',
              driverId: detail.driverID || detail.DriverID || null,
              status: detail.status || detail.Status || '',
              statusId: detail.statusID || detail.StatusID || null,
              trailerIn: detail.trailerIn || detail.TrailerIn || '',
              trailerInId: detail.trailerInID || detail.TrailerInID || null,
              productEstWeight: productEstWeight,
              productEstWeightValue: productEstWeightValue,
              weightUnit: weightUnit,
              productType: detail.productType || detail.ProductType || '',
              productTypeId: detail.productTypeID || detail.ProductTypeID || null,
              trailerInType: detail.trailerInType || detail.TrailerInType || '',
              trailerInTypeId: detail.trailerInTypeID || detail.TrailerInTypeID || null,
              changeoverLocation: detail.changeoverLocation || detail.ChangeoverLocation || '',
              changeoverLocationId: detail.changeoverLocationID || detail.ChangeoverLocationID || null,
              changeoverMessage: detail.changeoverMessage || detail.ChangeoverMessage || '',
              deliveryLocation: detail.deliveryLocation || detail.DeliveryLocation || '',
              deliveryLocationId: detail.deliveryLocationId || detail.DeliveryLocationID || null,
              trailerOut: detail.trailerOut || detail.TrailerOut || '',
              trailerOutId: detail.trailerOutID || detail.TrailerOutID || null,
              trailerOutType: detail.trailerOutType || detail.TrailerOutType || '',
              trailerOutTypeId: detail.trailerOutTypeID || detail.TrailerOutTypeID || null,
              scheduledTime: detail.scheduledTime || detail.ScheduledTime || '',
              collectionTime: detail.collectionTime || detail.CollectionTime || '',
              collectedTime: detail.collectedTime || detail.CollectedTime || '',
              notes: detail.notes || detail.Notes || '',
              checked: false
            };
            
            console.log('✅ Converted task:', task);
            return task;
          });
        }

        // --- Timeline items for template ---
        timelineItems = [
          { status: 'Scheduled', time: '22/11/2025, 9:00 AM' },
          { status: 'Pending', time: '22/11/2025, 9:00 AM' },
          { status: 'Accepted', time: '22/11/2025, 4:05 AM' },
          { status: 'In transit', time: '22/11/2025, 4:16 AM' },
          { status: 'Collected', time: '22/11/2025, 6:15 AM' },
          { status: 'Arrived', time: '22/11/2025, 7:15 AM' },
          { status: 'Completed', time: '22/11/2025, 7:25 AM' }
        ];
      // Master data loader methods for dropdowns
      async loadDriverOptions() {
        try {
          console.log('🔄 Loading drivers from master API...');
          const res: any = await this.templateService.getAllDrivers();
          console.log('📦 Drivers API Response:', res);
          const dataArray = res?.result || res?.data || res || [];
          // Filter only active drivers
          const activeDrivers = dataArray.filter((item: any) => 
            item.isActive === true || item.IsActive === true || item.isActive === 1 || item.IsActive === 1
          );
          this.driverOptions = activeDrivers.map((item: any) => {
            const firstName = item.firstName || item.FirstName || '';
            const lastName = item.lastName || item.LastName || '';
            const fullName = `${firstName} ${lastName}`.trim() || item.driverName || item.DriverName || item.name || '';
            return {
              value: item.driverId || item.DriverId || item.driverID || item.DriverID || item.id,
              name: fullName
            };
          });
          console.log(`✓ Loaded ${this.driverOptions.length} drivers`, this.driverOptions);
        } catch (error) {
          console.error('Error loading drivers:', error);
          this.driverOptions = [];
        }
      }

      async loadTrailerOptions() {
        try {
          console.log('🔄 Loading trailers from master API...');
          const res: any = await this.templateService.getAllTrailers();
          console.log('📦 Trailers API Response:', res);
          const dataArray = res?.result || res?.data || res || [];
          this.trailerInOptions = dataArray.map((item: any) => ({
            value: item.trailerId || item.TrailerId || item.trailerID || item.TrailerID || item.id,
            name: item.trailerNumber || item.TrailerNumber || item.trailerName || item.TrailerName || item.name || ''
          }));
          this.trailerOutOptions = [...this.trailerInOptions];
          console.log(`✓ Loaded ${this.trailerInOptions.length} trailers`, this.trailerInOptions);
        } catch (error) {
          console.error('Error loading trailers:', error);
          this.trailerInOptions = [];
          this.trailerOutOptions = [];
        }
      }

      async loadTrailerTypeOptions() {
        try {
          console.log('🔄 Loading trailer types from master API...');
          const res: any = await this.templateService.getAllTrailerTypes();
          console.log('📦 Trailer Types API Response:', res);
          const dataArray = res?.result || res?.data || res || [];
          this.trailerTypeOptions = dataArray.map((item: any) => ({
            value: item.trailerTypeId || item.TrailerTypeId || item.trailerTypeID || item.TrailerTypeID || item.id,
            name: item.trailerTypeName || item.TrailerTypeName || item.name || ''
          }));
          this.trailerOutTypeOptions = [...this.trailerTypeOptions];
          console.log(`✓ Loaded ${this.trailerTypeOptions.length} trailer types`, this.trailerTypeOptions);
        } catch (error) {
          console.error('Error loading trailer types:', error);
          this.trailerTypeOptions = [];
          this.trailerOutTypeOptions = [];
        }
      }

      // Load customer-specific product options
      async loadProductOptions(customerId: any) {
        if (!customerId) {
          console.warn('⚠️ No customerId provided for loading products');
          this.productOptions = [];
          return;
        }
        try {
          console.log('🔄 Loading products for customer:', customerId);
          
          // Ensure productTypeOptions are loaded for fallback lookup
          if (this.productTypeOptions.length === 0) {
            console.log('🔄 Loading productTypeOptions first...');
            await this.loadProductTypeOptions();
          }
          console.log('📋 productTypeOptions available for lookup:', this.productTypeOptions);
          
          const res: any = await this.templateService.getCustomerProducts(customerId);
          console.log('📦 Products API Response:', res);
          const dataArray = res?.result || res?.data || res || [];
          this.productOptions = dataArray.map((item: any) => {
            // Extract productType from various possible field names (comprehensive check)
            // Note: null values should be treated as empty
            let productTypeValue = item.productType || item.ProductType || item.productTypeName || 
                                     item.ProductTypeName || item.product_type || item.producttype ||
                                     item.type || item.Type || item.typeName || item.TypeName || '';
            const productTypeIdValue = item.productTypeID || item.productTypeId || item.ProductTypeID || 
                                       item.ProductTypeId || item.productTypeid || item.product_type_id || 
                                       item.typeId || item.TypeId || item.typeID || item.TypeID || null;
            
            console.log(`🔍 Raw item data - productTypeID: ${item.productTypeID}, productTypeName: ${item.productTypeName}`);
            console.log(`🔍 Extracted - productTypeValue: "${productTypeValue}", productTypeIdValue: ${productTypeIdValue}`);
            console.log(`🔍 productTypeOptions.length: ${this.productTypeOptions.length}`);
            
            // If we have productTypeId but no productType name, look it up from productTypeOptions
            if (!productTypeValue && productTypeIdValue && this.productTypeOptions.length > 0) {
              console.log(`🔍 Looking up productTypeId ${productTypeIdValue} in productTypeOptions...`);
              const productTypeOption = this.productTypeOptions.find((pt: any) => {
                console.log(`   Comparing: ${Number(pt.value)} === ${Number(productTypeIdValue)} -> ${Number(pt.value) === Number(productTypeIdValue)}`);
                return Number(pt.value) === Number(productTypeIdValue);
              });
              if (productTypeOption) {
                productTypeValue = productTypeOption.name;
                console.log(`✅ Found productType "${productTypeValue}" from productTypeOptions for productTypeId ${productTypeIdValue}`);
              } else {
                console.log(`⚠️ No match found in productTypeOptions for productTypeId ${productTypeIdValue}`);
              }
            }
            
            console.log(`📦 Product: ${item.productName || item.ProductName || item.name}, ProductType: ${productTypeValue}, ProductTypeId: ${productTypeIdValue}`);
            
            return {
              value: item.productId || item.ProductId || item.productID || item.ProductID || item.id,
              name: item.productName || item.ProductName || item.name || '',
              productType: productTypeValue,
              productTypeId: productTypeIdValue
            };
          });
          console.log(`✓ Loaded ${this.productOptions.length} products with productType info:`, this.productOptions);
        } catch (error) {
          console.error('Error loading products:', error);
          this.productOptions = [];
        }
      }
 //loadDeliveryLocationOptions
 
  async loadDeliveryLocationOptions() {
    // Skip if already loaded
    if (this.deliveryLocationOptions.length > 0) return;
    
    try {
      const res: any = await this.templateService.getAllDeliveryLocations();
      
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
        this.deliveryLocationOptions = dataArray.map((item: any) => ({
          value: item.deliverylocationId || item.deliveryLocationID || item.deliverylocationID || item.id || item.ID,
          name: item.deliverylocationName || item.deliveryLocationName || item.name || item.Name || ''
        })).filter((loc: any) => loc.value !== undefined && loc.value !== null && loc.name);
        
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
    // Skip if already loaded
    if (this.changeoverLocationOptions.length > 0) return;
    
    try {
      const res: any = await this.templateService.getAllChangeoverLocations();
      
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
        this.changeoverLocationOptions = dataArray.map((item: any) => ({
          value: item.changeoverlocationId || item.changeoverLocationID || item.changeoverlocationID || item.id || item.ID,
          name: item.changeoverlocationName || item.changeoverLocationName || item.name || item.Name || ''
        })).filter((loc: any) => loc.value !== undefined && loc.value !== null && loc.name);
        
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
      // Load customer-specific location options
      async loadLocationOptions(customerId: any) {
        if (!customerId) {
          console.warn('⚠️ No customerId provided for loading locations');
          this.pickupLocationOptions = [];
         // this.changeoverLocationOptions = [];
         // this.deliveryLocationOptions = [];
          return;
        }
        try {
          console.log('🔄 Loading locations for customer:', customerId);
          const res: any = await this.templateService.getCustomerLocations(customerId);
          console.log('📦 Locations API Response:', res);
          const dataArray = res?.result || res?.data || res || [];
          const locationOptions = dataArray.map((item: any) => ({
            value: item.locationId || item.LocationId || item.locationID || item.LocationID || item.id,
            name: item.locationName || item.LocationName || item.name || ''
          }));
          this.pickupLocationOptions = [...locationOptions];
         // this.changeoverLocationOptions = [...locationOptions];
         // this.deliveryLocationOptions = [...locationOptions];
          console.log(`✓ Loaded ${locationOptions.length} locations`);
        } catch (error) {
          console.error('Error loading locations:', error);
          this.pickupLocationOptions = [];
         // this.changeoverLocationOptions = [];
         // this.deliveryLocationOptions = [];
        }
      }

    // Restored properties for view changes, modals, and filters
    selectedViewColumn: string = 'customer';
    selectedChangesDate: Date = new Date();
    viewChangesSelections: { [key: string]: string[] } = {};
    showTimelineModal: boolean = false;
    selectedTimelineTask: any = null;
    showDocumentsModal: boolean = false;
    selectedDocumentsTask: any = null;
    documentsList = [
      { name: 'IMG_001', type: 'JPG', date: '21/11/2025, 8:00 PM', size: '2.5 MB' },
      { name: 'IMG_002', type: 'JPG', date: '21/11/2025, 8:15 PM', size: '1.8 MB' }
    ];
    viewChangesColumns = [
      { key: 'customer', label: 'Customer' },
      { key: 'product', label: 'Product' },
      { key: 'pickupLocation', label: 'Pickup location' },
      { key: 'vehicle', label: 'Vehicle' },
      { key: 'driverName', label: 'Driver' },
      { key: 'trailerIn', label: 'Trailer In' },
      { key: 'productEstWeight', label: 'Product est weight' },
      { key: 'productType', label: 'Product category' },
      { key: 'trailerInType', label: 'Trailer In Type' },
      { key: 'changeoverLocation', label: 'Changeover location' },
      { key: 'deliveryLocation', label: 'Delivery location' },
      { key: 'trailerOut', label: 'Trailer Out' },
      { key: 'trailerOutType', label: 'Trailer Out type' },
      { key: 'scheduledTime', label: 'Scheduled Time' },
      { key: 'collectionTime', label: 'Collection Time' }
    ];
    showColumnFilterPopup: string | null = null;
    activeColumnFilters: { [key: string]: string[] } = {};
    pendingColumnFilters: { [key: string]: string[] } = {}; // Temporary filters before Apply
    columnFilterSearch: { [key: string]: string } = {};
    columnDistinctValues: { [key: string]: string[] } = {};
  @ViewChild('plannerPaginator', { static: false }) plannerPaginator: any;
  
  plannerTaskList: any[] = [];
  allChecked: boolean = false;
  length: number = 0;
  currentSheetId: string = '';
  showImportModal: boolean = false;
  showTemplateDropdown: boolean = false;
  selectedTemplate: any = null;
  searchTemplate: string = '';
  
  // Planner Sheet dropdown
  showPlannerSheetDropdown: boolean = false;
  selectedPlannerSheet: string = '';
  searchPlannerSheet: string = '';
  plannerSheetOptions: any[] = [];
  openPlannerSheetIds: Set<number> = new Set(); // Track which sheets are open
  
  // Save Planner Sheet dialog
  showSavePlannerDialog: boolean = false;
  newPlannerSheetName: string = '';
  isPlannerSheetActive: boolean = false;
  plannerSheetNameError: string = '';
  existingPlannerSheetNames: string[] = [];
  isValidatingSheetName: boolean = false;
  sheetNameValidationPassed: boolean = false;
  
  // Refresh state
  isRefreshing: boolean = false;
  
  // Auto-refresh configuration
  autoRefreshEnabled: boolean = false;
  autoRefreshInterval: number = 30000; // 30 seconds
  private autoRefreshSubscription: any = null;
  lastRefreshTime: Date | null = null;
  
  // Validation Error Modal
  showValidationErrorModal: boolean = false;
  validationErrorTitle: string = '';
  validationErrors: { field: string; messages: string[] }[] = [];
  
  customerSearchText: string = '';
  selectedDate: Date = new Date();
  showSortDropdown: boolean = false;
  selectedSort: string = 'date';
  showFilterPanel: boolean = false;
  selectedCategory: string = 'planner';
  filterSearchText: string = '';
  selectedFilters: { [key: string]: string[] } = {};
  showCreateTaskDropdown: boolean = false;
  showLiveStatusSidebar: boolean = false;
  selectedLiveStatusTask: any = null;
  liveStatusSearchText: string = '';
  currentLiveStatusMonth: string = 'October';
  currentLiveStatusYear: number = 2025;
  
  // Column management properties
  columnFilters: { [key: string]: string } = {};
  columnSorts: { [key: string]: 'asc' | 'desc' | null } = {};
  columnWidths: { [key: string]: number } = {};
  showColumnManager: boolean = false;
  draggedColumn: string | null = null;
  
  // Row drag and drop properties
  draggedRowIndex: number | null = null;
  dropTargetIndex: number | null = null;
  isDraggingRow: boolean = false;
  
  // Cell drag and drop properties (within same column)
  draggedCellInfo: { rowIndex: number; columnKey: string; value: any } | null = null;
  dropTargetCellInfo: { rowIndex: number; columnKey: string } | null = null;
  isDraggingCell: boolean = false;
  
  // Table columns configuration
  tableColumns = [
    { key: 'taskID', label: 'Task ID', fullLabel: 'Task ID', visible: false, width: 100, filterable: false, sortable: false },
    { key: 'no', label: 'No', fullLabel: 'Number', visible: true, width: 45, filterable: true, sortable: true },
    { key: 'planner', label: 'Planner', fullLabel: 'Planner', visible: true, width: 80, filterable: true, sortable: true },
    { key: 'customer', label: 'Customer', fullLabel: 'Customer', visible: true, width: 90, filterable: true, sortable: true },
    { key: 'pickupLocation', label: 'Pickup', fullLabel: 'Pickup Location', visible: true, width: 80, filterable: true, sortable: true },
    { key: 'product', label: 'Product', fullLabel: 'Product', visible: true, width: 80, filterable: true, sortable: true },
    { key: 'productType', label: 'Prod Type', fullLabel: 'Product Type', visible: true, width: 75, filterable: true, sortable: true, editable: false },
    { key: 'collectionTime', label: 'Coll Time', fullLabel: 'Collection Time', visible: true, width: 80, filterable: true, sortable: true },
    { key: 'deliveryLocation', label: 'Delivery', fullLabel: 'Delivery Location', visible: true, width: 80, filterable: true, sortable: true },
    { key: 'scheduledTime', label: 'Sched Time', fullLabel: 'Scheduled Time', visible: true, width: 85, filterable: true, sortable: true },
    { key: 'driverName', label: 'Driver', fullLabel: 'Driver Name', visible: true, width: 70, filterable: true, sortable: true },
    { key: 'vehicle', label: 'Vehicle', fullLabel: 'Vehicle', visible: true, width: 70, filterable: true, sortable: true },
    { key: 'trailerInType', label: 'Trailer Type', fullLabel: 'Trailer In Type', visible: true, width: 80, filterable: true, sortable: true },
    { key: 'trailerOut', label: 'Trailer Out', fullLabel: 'Trailer Out', visible: true, width: 75, filterable: true, sortable: true },
    { key: 'trailerIn', label: 'Trailer In', fullLabel: 'Trailer In', visible: true, width: 75, filterable: true, sortable: true },
    { key: 'status', label: 'Status', fullLabel: 'Status', visible: true, width: 70, filterable: true, sortable: true },
    { key: 'productEstWeight', label: 'Est Weight', fullLabel: 'Product Estimated Weight', visible: false, width: 80, filterable: true, sortable: true },
    { key: 'changeoverLocation', label: 'Changeover', fullLabel: 'Changeover Location', visible: false, width: 90, filterable: true, sortable: true },
    { key: 'changeoverMessage', label: 'Change Msg', fullLabel: 'Changeover Message', visible: false, width: 90, filterable: true, sortable: true },
    { key: 'notes', label: 'Notes', fullLabel: 'Notes', visible: false, width: 80, filterable: true, sortable: true }
  ];
  
  // Template options (days of the week)
  templateOptions: any[] = [];

  // Sort options
  sortOptions = [
    { id: 'date', label: 'Date', value: 'date' },
    { id: 'customer', label: 'Customer', value: 'customer' },
    { id: 'status', label: 'Status', value: 'status' },
    { id: 'driver', label: 'Driver', value: 'driverName' },
    { id: 'vehicle', label: 'Vehicle', value: 'vehicle' },
    { id: 'product', label: 'Product', value: 'product' }
  ];

  // Filter categories
  filterCategories = [
    { key: 'planner', label: 'Planner' },
    { key: 'customer', label: 'Customer' },
    { key: 'product', label: 'Product' },
    { key: 'category', label: 'Category' },
    { key: 'vehicle', label: 'Vehicle' },
    { key: 'driver', label: 'Driver' },
    { key: 'trailerIn', label: 'Trailer In' },
    { key: 'trailerOut', label: 'Trailer Out' },
    { key: 'status', label: 'Status' },
    { key: 'time', label: 'Time' }
  ];

  // Dropdown options for editable cells (loaded from DB)
  plannerOptions: any[] = [];
  customerOptions: any[] = [];
  productOptions: any[] = [];
  pickupLocationOptions: any[] = [];
  vehicleOptions: any[] = [];
  driverOptions: any[] = [];
  statusOptions: any[] = [];
  trailerInOptions: any[] = [];
  trailerOutOptions: any[] = [];
  productWeightOptions = ['500kg', '800kg', '1.2 tonnes', '1.5 tonnes', '1.8 tonnes', '2.1 tonnes', '2.5 tonnes', '2.9 tonnes', '3.2 tonnes', '3.8 tonnes', '4.1 tonnes', '5.8 tonnes', '6.5 tonnes'];
  productTypeOptions: any[] = [];
  trailerTypeOptions: any[] = [];
  trailerOutTypeOptions: any[] = [];
  changeoverLocationOptions: any[] = [];
  deliveryLocationOptions: any[] = []; 
  
  // Weight unit options - static data
  weightUnitOptions = [
    { value: 'kg', name: 'kg' },
    { value: 'g', name: 'g' },
    { value: 'ton', name: 'Tonnes' },
    { value: 'lb', name: 'lbs' },
    { value: 'oz', name: 'oz' }
  ];

  // Sample filter values for each category
  filterValues: { [key: string]: any[] } = {
    planner: [
      { id: 'planner1', label: 'John Doe', value: 'john-doe' },
      { id: 'planner2', label: 'Jane Smith', value: 'jane-smith' },
      { id: 'planner3', label: 'Mike Johnson', value: 'mike-johnson' }
    ],
    customer: [
      { id: 'cust1', label: 'AVARA FOODS', value: 'AVARA-FOODS' },
      { id: 'cust2', label: 'CRANSWICK', value: 'CRANSWICK' },
      { id: 'cust3', label: 'KINTORE', value: 'KINTORE' }
    ],
    product: [
      { id: 'prod1', label: 'Offal', value: 'offal' },
      { id: 'prod2', label: 'Animal', value: 'animal' },
      { id: 'prod3', label: 'Ca3', value: 'ca3' }
    ],
    status: [
      { id: 'scheduled', label: 'scheduled', value: 'scheduled' },
      { id: 'in-transit', label: 'In transit', value: 'in-transit' },
      { id: 'completed', label: 'Completed', value: 'completed' },
      { id: 'cancelled', label: 'Cancelled', value: 'cancelled' }
    ]
  };

  // Editable cell properties
  editingCell = {
    rowIndex: -1,
    field: ''
  };

  get logedInUser() {
    let user: any = localStorage.getItem('userData');
    return JSON.parse(user)?.roleType;
  }

  constructor(
    public route: Router,
    public dialog: MatDialog,
    public utilServ: UtilityService,
    private cdr: ChangeDetectorRef,
    private templateService: TemplateService
  ) {}

  // Prevent accidental browser close/refresh
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.hasUnsavedData()) {
      $event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    }
  }

  // Close all dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    // Check if click is outside template dropdown
    if (this.showTemplateDropdown && !target.closest('.import-template-dropdown')) {
      this.showTemplateDropdown = false;
    }
    
    // Check if click is outside planner sheet dropdown
    if (this.showPlannerSheetDropdown && !target.closest('.planner-sheet-dropdown')) {
      this.showPlannerSheetDropdown = false;
    }
    
    // Check if click is outside sort dropdown
    if (this.showSortDropdown && !target.closest('.sort-by-container')) {
      this.showSortDropdown = false;
    }
    
    // Check if click is outside create task dropdown
    if (this.showCreateTaskDropdown && !target.closest('.create-task-container')) {
      this.showCreateTaskDropdown = false;
    }
    
    // Check if click is outside column filter popup
    if (this.showColumnFilterPopup && !target.closest('.column-filter-popup') && !target.closest('.filter-btn')) {
      this.showColumnFilterPopup = null;
    }
  }

  // Check if there's unsaved data
  hasUnsavedData(): boolean {
    return this.plannerTaskList && this.plannerTaskList.length > 0;
  }

  // Navigation guard for route changes within the app
  canDeactivate(): boolean {
    if (this.hasUnsavedData()) {
      return confirm('Are you sure you want to leave this page? Any unsaved changes will be lost.');
    }
    return true;
  }

  ngOnInit(): void {
    this.plannerTaskList = [];
    this.length = 0;
   // this.loadPlannerTasks();
   
    // Load active planner sheets
    this.loadActivePlannerSheets();
    
    // Load existing planner sheet names for validation
    this.loadExistingPlannerSheetNames();
    
    // Start auto-refresh timer
    this.startAutoRefresh();
  }

  ngAfterViewInit() {
    // Load initial data
    console.log('Planner Dashboard - AfterViewInit');
    
    // Ensure paginator is properly initialized after navigation
    setTimeout(() => {
      console.log('Planner Dashboard - Forcing change detection for paginator initialization');
      this.cdr.detectChanges();
      
      // Set initial sheet ID after paginator is ready
      if (this.plannerPaginator && this.plannerPaginator.sheets && this.plannerPaginator.sheets.length > 0) {
        this.currentSheetId = this.plannerPaginator.sheets[0].id;
        console.log('Planner Dashboard - Initial sheet ID set:', this.currentSheetId);
      }
    }, 150);
    
    //this.loadTemplateData('monday');
  }

  // Load Active Planner Sheets
  async loadActivePlannerSheets() {
    try {
      console.log('🔄 Loading active planner sheets...');

      // Show loading indicator
      this.utilServ.toaster.next({ 
        type: customToaster.infoToast, 
        message: 'Loading active planner sheets...' 
      });

      // Call API to get active planner sheets
      const response: any = await this.templateService.getActivePlannerSheets();
      console.log('📋 Active Planner Sheets Response:', response);

      if (!response || !response.result || response.result.length === 0) {
        console.log('ℹ️ No active planner sheets found');
        this.utilServ.toaster.next({ 
          type: customToaster.infoToast, 
          message: 'No active planner sheets found' 
        });
        return;
      }

      const activePlannerSheets = response.result;
      console.log(`✅ Found ${activePlannerSheets.length} active planner sheet(s)`);

      // Wait for paginator to be ready
      await this.waitForPaginator();

      // Load each active planner sheet
      for (const plannerSheet of activePlannerSheets) {
        await this.loadPlannerSheetData(plannerSheet);
      }

      this.utilServ.toaster.next({ 
        type: customToaster.successToast, 
        message: `Loaded ${activePlannerSheets.length} active planner sheet(s)` 
      });

    } catch (error: any) {
      console.error('❌ Error loading active planner sheets:', error);
      this.utilServ.toaster.next({ 
        type: customToaster.errorToast, 
        message: 'Failed to load active planner sheets' 
      });
    }
  }

  // Refresh planner data from API - only refreshes the current/active sheet
  async refreshPlannerData() {
    if (this.isRefreshing) {
      return;
    }

    try {
      this.isRefreshing = true;
      console.log('🔄 Refreshing current planner sheet...');

      // Get the active sheet from paginator
      const activeSheet = this.getActiveSheet();
      
      if (!activeSheet) {
        console.warn('⚠️ No active sheet found to refresh');
        this.utilServ.toaster.next({ 
          type: customToaster.warningToast, 
          message: 'No active sheet to refresh' 
        });
        return;
      }

      const plannerSheetId = activeSheet.plannerSheetId || activeSheet.PlannerSheetId || activeSheet.plannerSheetID;
      const sheetName = activeSheet.name || 'Sheet';

      // If the sheet doesn't have a plannerSheetId, it's a new unsaved sheet - nothing to refresh from API
      if (!plannerSheetId || plannerSheetId === 0) {
        console.log('ℹ️ Current sheet is not saved yet, nothing to refresh from API');
        this.utilServ.toaster.next({ 
          type: customToaster.infoToast, 
          message: 'This sheet has not been saved yet. Nothing to refresh.' 
        });
        return;
      }

      this.utilServ.toaster.next({ 
        type: customToaster.infoToast, 
        message: `Refreshing "${sheetName}"...` 
      });

      console.log(`🔄 Refreshing planner sheet: ${sheetName} (ID: ${plannerSheetId})`);

      // Fetch fresh data from API for this specific sheet
      const response: any = await this.templateService.getPlannerSheetById(plannerSheetId);
      console.log('📦 Refresh - Planner Sheet API Response:', response);

      if (!response || !response.result) {
        console.warn(`⚠️ No data found for planner sheet: ${sheetName}`);
        this.utilServ.toaster.next({ 
          type: customToaster.warningToast, 
          message: `No data found for "${sheetName}"` 
        });
        return;
      }

      const plannerResult = response.result;
      
      // Get the planner sheet details array from the response
      const plannerDetails = plannerResult.plannerSheetDetails || plannerResult.PlannerSheetDetails || 
                             (Array.isArray(plannerResult) ? plannerResult : [plannerResult]);

      // Get sheet name from master if available
      const masterData = plannerResult.plannerSheetMaster || plannerResult.PlannerSheetMaster;
      const refreshedSheetName = masterData?.plannerSheetName || masterData?.PlannerSheetName || sheetName;

      // Convert API data to tasks
      let tasks: any[] = [];
      if (Array.isArray(plannerDetails) && plannerDetails.length > 0) {
        tasks = this.convertPlannerSheetDetailsToTasks(plannerDetails);
      }

      console.log(`📋 Refreshed ${tasks.length} tasks for sheet "${refreshedSheetName}"`);

      // Update the active sheet's data
      activeSheet.data = tasks;
      activeSheet.name = refreshedSheetName;

      // Update the main task list for display
      this.plannerTaskList = tasks;
      this.length = tasks.length;

      // Force change detection
      this.cdr.detectChanges();

      this.utilServ.toaster.next({ 
        type: customToaster.successToast, 
        message: `"${refreshedSheetName}" refreshed successfully` 
      });

      console.log('✅ Planner sheet refresh complete');

    } catch (error: any) {
      console.error('❌ Error refreshing planner sheet:', error);
      this.utilServ.toaster.next({ 
        type: customToaster.errorToast, 
        message: 'Failed to refresh planner sheet' 
      });
    } finally {
      this.isRefreshing = false;
      this.cdr.detectChanges();
    }
  }

  // Load existing planner sheet names for duplicate validation
  async loadExistingPlannerSheetNames() {
    try {
      console.log('🔄 Loading existing planner sheet names for validation...');
      const response: any = await this.templateService.getAllPlannerSheets();
      console.log('📦 getAllPlannerSheets response:', response);
      
      // Handle different response formats
      let dataArray: any[] = [];
      if (response && response.result && Array.isArray(response.result)) {
        dataArray = response.result;
      } else if (response && Array.isArray(response)) {
        dataArray = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        dataArray = response.data;
      }
      
      console.log('📋 Raw planner sheets data:', dataArray);
      
      if (dataArray.length > 0) {
        this.existingPlannerSheetNames = dataArray.map((sheet: any) => {
          const name = sheet.plannerSheetName || sheet.PlannerSheetName || sheet.sheetName || sheet.SheetName || sheet.name || sheet.Name || '';
          console.log('  - Sheet name found:', name);
          return name.toLowerCase().trim();
        }).filter((name: string) => name !== '');
        
        console.log(`✅ Loaded ${this.existingPlannerSheetNames.length} existing planner sheet names:`, this.existingPlannerSheetNames);
      } else {
        this.existingPlannerSheetNames = [];
        console.log('ℹ️ No existing planner sheet names found');
      }
    } catch (error) {
      console.error('❌ Error loading planner sheet names:', error);
      this.existingPlannerSheetNames = [];
    }
  }

  // Validate planner sheet name (check for duplicates)
  validatePlannerSheetName(name: string): boolean {
    console.log('🔍 Validating planner sheet name:', name);
    console.log('📋 Existing names:', this.existingPlannerSheetNames);
    
    if (!name || name.trim() === '') {
      this.plannerSheetNameError = 'Sheet name is required';
      console.log('❌ Validation failed: Empty name');
      return false;
    }
    
    const normalizedName = name.toLowerCase().trim();
    console.log('🔄 Normalized name:', normalizedName);
    
    if (this.existingPlannerSheetNames.includes(normalizedName)) {
      this.plannerSheetNameError = 'A planner sheet with this name already exists. Please choose a different name.';
      console.log('❌ Validation failed: Duplicate name found');
      return false;
    }
    
    this.plannerSheetNameError = '';
    console.log('✅ Validation passed');
    return true;
  }

  // Wait for paginator to be ready
  private waitForPaginator(): Promise<void> {
    return new Promise((resolve) => {
      const checkPaginator = () => {
        if (this.plannerPaginator) {
          resolve();
        } else {
          setTimeout(checkPaginator, 100);
        }
      };
      checkPaginator();
    });
  }

  // Load individual planner sheet data
  async loadPlannerSheetData(plannerSheet: any) {
    try {
      const plannerSheetId = plannerSheet.plannerSheetId || plannerSheet.PlannerSheetId;
      const plannerSheetName = plannerSheet.plannerSheetName || plannerSheet.PlannerSheetName || 'Sheet';

      console.log(`📄 Loading planner sheet: ${plannerSheetName} (ID: ${plannerSheetId})`);

      // Get planner sheet details
      const detailsResponse: any = await this.templateService.getPlannerSheetById(plannerSheetId);
      console.log('📊 Planner Sheet Details Response:', detailsResponse);

      if (!detailsResponse || !detailsResponse.result) {
        console.warn(`⚠️ No details found for planner sheet: ${plannerSheetName}`);
        return;
      }

      const plannerDetails = detailsResponse.result;
      
      // Group details by sheet name if multiple sheets exist in response
      const sheetGroups: { [key: string]: any[] } = {};
      
      plannerDetails.forEach((detail: any) => {
        const sheetName = detail.sheetName || detail.SheetName || plannerSheetName;
        if (!sheetGroups[sheetName]) {
          sheetGroups[sheetName] = [];
        }
        sheetGroups[sheetName].push(detail);
      });

      // Create sheets from grouped data
      for (const [sheetName, details] of Object.entries(sheetGroups)) {
        const tasks = this.convertPlannerDetailsToTasks(details);
        
        if (tasks.length > 0) {
          // Add new sheet to paginator
          this.plannerPaginator.addSheet();
          const newSheetIndex = this.plannerPaginator.sheets.length - 1;
          const newSheet = this.plannerPaginator.sheets[newSheetIndex];
          
          // Rename the sheet
          newSheet.name = sheetName;
          newSheet.originalName = sheetName; // Store original name for rename validation
          newSheet.data = tasks;
          
          // Store the planner sheet ID for future reference
          newSheet.plannerSheetId = plannerSheetId;
          
          // Add to tracked open sheet IDs
          this.openPlannerSheetIds.add(Number(plannerSheetId));
          
          console.log(`✅ Added sheet "${sheetName}" with ${tasks.length} tasks`);
        }
      }

      // Update the current sheet data if it's the first sheet
      if (this.plannerPaginator.sheets.length > 0 && this.plannerTaskList.length === 0) {
        const firstSheet = this.plannerPaginator.sheets[0];
        this.plannerTaskList = firstSheet.data || [];
        this.length = this.plannerTaskList.length;
        this.currentSheetId = firstSheet.id;
        
        // Set active sheet
        this.plannerPaginator.selectSheet(0);
        
        this.cdr.detectChanges();
      }

    } catch (error: any) {
      console.error('❌ Error loading planner sheet data:', error);
    }
  }

  // Helper to format task number with leading zero for 1-9
  private formatTaskNumber(num: number | string): string {
    const n = typeof num === 'string' ? parseInt(num, 10) : num;
    if (isNaN(n)) return '01';
    return n < 10 ? `0${n}` : `${n}`;
  }

  // Convert planner details to task format
  private convertPlannerDetailsToTasks(details: any[]): any[] {
    return details.map((detail: any, index: number) => {
      // Parse weight and unit
      let productEstWeight = '';
      const weight = detail.productEstWeight || detail.ProductEstWeight;
      const unit = detail.weightUnit || detail.WeightUnit || 'kg';
      
      if (weight) {
        productEstWeight = `${weight}${unit}`;
      }

      return {
        no: this.formatTaskNumber(index + 1),
        taskID: detail.taskID || detail.TaskID || 0,
        planner: detail.planner || detail.Planner || '',
        customer: detail.customer || detail.Customer || '',
        customerId: detail.customerID || detail.CustomerID || null,
        product: detail.product || detail.Product || '',
        pickupLocation: detail.pickupLocation || detail.PickupLocation || '',
        vehicle: detail.vehicle || detail.Vehicle || '',
        driverName: detail.driver || detail.Driver || '',
        status: detail.status || detail.Status || '',
        trailerIn: detail.trailerIn || detail.TrailerIn || '',
        productEstWeight: productEstWeight,
        productType: detail.productType || detail.ProductType || '',
        trailerInType: detail.trailerInType || detail.TrailerInType || '',
        changeoverLocation: detail.changeoverLocation || detail.ChangeoverLocation || '',
        changeoverMessage: detail.changeoverMessage || detail.ChangeoverMessage || '',
        deliveryLocation: detail.deliveryLocation || detail.DeliveryLocation || '',
        trailerOut: detail.trailerOut || detail.TrailerOut || '',
        trailerOutType: detail.trailerOutType || detail.TrailerOutType || '',
        scheduledTime: detail.scheduledTime || detail.ScheduledTime || '',
        collectionTime: detail.collectionTime || detail.CollectionTime || '',
        collectedTime: detail.collectedTime || detail.CollectedTime || '',
        notes: detail.notes || detail.Notes || '',
        checked: false
      };
    });
  }





  ngOnDestroy() {
    console.log('Planner Dashboard - Component destroying');
    
    // Stop auto-refresh
    this.stopAutoRefresh();
    
    // Reset all component state
    this.plannerTaskList = [];
    
    // Clear any open modals/dialogs
    this.showViewChanges = false;
    this.showTimelineModal = false;
    this.showDocumentsModal = false;
    this.showFilterPanel = false;
    this.showTemplateDropdown = false;
    this.showCreateTaskDropdown = false;
    this.showColumnManager = false;
    this.showColumnFilterPopup = null;
    
    // Reset body overflow in case filter panel was open
    document.body.style.overflow = 'auto';
  }

  // ===== Auto-Refresh Methods =====
  
  // Start auto-refresh timer
  startAutoRefresh() {
    if (this.autoRefreshSubscription) {
      return; // Already running
    }
    
    console.log(`🔄 Starting auto-refresh (every ${this.autoRefreshInterval / 1000}s)`);
    
    this.autoRefreshSubscription = setInterval(() => {
      if (this.autoRefreshEnabled && !this.isRefreshing) {
        console.log('⏰ Auto-refresh triggered');
        this.silentRefreshPlannerData();
      }
    }, this.autoRefreshInterval);
  }
  
  // Stop auto-refresh timer
  stopAutoRefresh() {
    if (this.autoRefreshSubscription) {
      console.log('🛑 Stopping auto-refresh');
      clearInterval(this.autoRefreshSubscription);
      this.autoRefreshSubscription = null;
    }
  }
  
  // Toggle auto-refresh on/off
  toggleAutoRefresh() {
    this.autoRefreshEnabled = !this.autoRefreshEnabled;
    console.log(`Auto-refresh ${this.autoRefreshEnabled ? 'enabled' : 'disabled'}`);
    
    this.utilServ.toaster.next({ 
      type: customToaster.infoToast, 
      message: `Auto-refresh ${this.autoRefreshEnabled ? 'enabled' : 'disabled'}` 
    });
  }
  
  // Silent refresh (no toaster messages) for auto-refresh
  async silentRefreshPlannerData() {
    if (this.isRefreshing) {
      return;
    }

    try {
      this.isRefreshing = true;
      
      // Get the active sheet from paginator
      const activeSheet = this.getActiveSheet();
      
      if (!activeSheet) {
        return;
      }

      const plannerSheetId = activeSheet.plannerSheetId || activeSheet.PlannerSheetId || activeSheet.plannerSheetID;

      // If the sheet doesn't have a plannerSheetId, skip refresh
      if (!plannerSheetId || plannerSheetId === 0) {
        return;
      }

      console.log(`🔄 [Auto] Refreshing planner sheet ID: ${plannerSheetId}`);

      // Fetch fresh data from API
      const response: any = await this.templateService.getPlannerSheetById(plannerSheetId);

      if (!response || !response.result) {
        return;
      }

      const plannerResult = response.result;
      
      // Get the planner sheet details array from the response
      const plannerDetails = plannerResult.plannerSheetDetails || plannerResult.PlannerSheetDetails || 
                             (Array.isArray(plannerResult) ? plannerResult : [plannerResult]);

      // Get sheet name from master if available
      const masterData = plannerResult.plannerSheetMaster || plannerResult.PlannerSheetMaster;
      const refreshedSheetName = masterData?.plannerSheetName || masterData?.PlannerSheetName || activeSheet.name;

      // Convert API data to tasks
      let tasks: any[] = [];
      if (Array.isArray(plannerDetails) && plannerDetails.length > 0) {
        tasks = this.convertPlannerSheetDetailsToTasks(plannerDetails);
      }

      // Update the active sheet's data
      activeSheet.data = tasks;
      activeSheet.name = refreshedSheetName;

      // Update the main task list for display
      this.plannerTaskList = tasks;
      this.length = tasks.length;
      
      // Update last refresh time
      this.lastRefreshTime = new Date();

      // Force change detection
      this.cdr.detectChanges();

      console.log(`✅ [Auto] Refreshed ${tasks.length} tasks at ${this.lastRefreshTime.toLocaleTimeString()}`);

    } catch (error: any) {
      console.error('❌ [Auto] Error refreshing planner sheet:', error);
    } finally {
      this.isRefreshing = false;
    }
  }
  
  // Get formatted last refresh time
  getLastRefreshTime(): string {
    if (!this.lastRefreshTime) {
      return 'Never';
    }
    return this.lastRefreshTime.toLocaleTimeString();
  }

  loadPlannerTasks() {
    // Start with empty list initially
    this.plannerTaskList = [];
    
    // Load sample data after component is fully initialized
    setTimeout(() => {
      if (this.plannerTaskList.length === 0) {
        console.log('Loading sample data for planner dashboard');
        this.loadTemplateData('monday');
      }
    }, 500);
  }

  // Checkbox management
  toggleAll() {
    this.plannerTaskList.forEach(task => task.checked = this.allChecked);
  }

  updateMasterCheckbox(event: any) {
    const checkedCount = this.plannerTaskList.filter(task => task.checked).length;
    this.allChecked = checkedCount === this.plannerTaskList.length;
  }

  hasSelectedRows(): boolean {
    return this.plannerTaskList.some(task => task.checked);
  }

  // Helper method to sync plannerTaskList with the active sheet in paginator
  syncWithActiveSheet() {
    if (this.plannerPaginator && this.plannerPaginator.sheets && this.plannerPaginator.sheets.length > 0) {
      // Use activeSheetIndex from paginator to get the correct active sheet
      const activeSheetIndex = this.plannerPaginator.activeSheetIndex;
      if (activeSheetIndex >= 0 && activeSheetIndex < this.plannerPaginator.sheets.length) {
        const activeSheet = this.plannerPaginator.sheets[activeSheetIndex];
        // Deep copy to avoid shared references
        activeSheet.data = JSON.parse(JSON.stringify(this.plannerTaskList));
        console.log('✓ Synced plannerTaskList to active sheet:', activeSheet.name, 'Data count:', activeSheet.data.length);
      }
    }
  }

  // Helper method to get the active sheet from paginator
  getActiveSheet(): any {
    if (this.plannerPaginator && this.plannerPaginator.sheets && this.plannerPaginator.sheets.length > 0) {
      const activeSheetIndex = this.plannerPaginator.activeSheetIndex;
      if (activeSheetIndex >= 0 && activeSheetIndex < this.plannerPaginator.sheets.length) {
        return this.plannerPaginator.sheets[activeSheetIndex];
      }
    }
    return null;
  }

  deleteSelectedRows() {
    if (confirm('Are you sure you want to delete the selected tasks?')) {
      this.plannerTaskList = this.plannerTaskList.filter(task => !task.checked);
      this.length = this.plannerTaskList.length;
      this.allChecked = false;
      
      // Renumber all rows after deletion
      this.renumberRows();
      
      // Sync with active sheet
      this.syncWithActiveSheet();
      
      // Force change detection to update the UI
      this.cdr.detectChanges();
      
      this.utilServ.toaster.next({ 
        type: customToaster.successToast, 
        message: 'Selected tasks deleted successfully' 
      });
    }
  }

  // Method to renumber all rows after add/delete operations
  private renumberRows(): void {
    this.plannerTaskList.forEach((task: any, index: number) => {
      task.no = this.formatTaskNumber(index + 1);
    });
    console.log('✓ Rows renumbered:', this.plannerTaskList.map(t => t.no));
  }

  // Row Drag and Drop Methods
  onRowDragStart(index: number, event: DragEvent): void {
    this.draggedRowIndex = index;
    this.isDraggingRow = true;
    
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', index.toString());
      
      // Create a custom drag image (optional)
      const row = event.target as HTMLElement;
      if (row) {
        row.classList.add('dragging');
      }
    }
    
    console.log('🔄 Started dragging row:', index);
  }

  onRowDragOver(index: number, event: DragEvent): void {
    event.preventDefault();
    
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    
    // Only update if target changed
    if (this.dropTargetIndex !== index) {
      this.dropTargetIndex = index;
    }
  }

  onRowDragEnter(index: number, event: DragEvent): void {
    event.preventDefault();
    this.dropTargetIndex = index;
  }

  onRowDragLeave(event: DragEvent): void {
    // Only clear if leaving the table area entirely
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (!relatedTarget || !relatedTarget.closest('tbody')) {
      // Keep dropTargetIndex to show indicator
    }
  }

  onRowDragEnd(event: DragEvent): void {
    this.isDraggingRow = false;
    this.draggedRowIndex = null;
    this.dropTargetIndex = null;
    
    // Remove dragging class from all rows
    const rows = document.querySelectorAll('tr.dragging');
    rows.forEach(row => row.classList.remove('dragging'));
    
    console.log('✓ Drag ended');
  }

  onRowDrop(targetIndex: number, event: DragEvent): void {
    event.preventDefault();
    
    if (this.draggedRowIndex === null || this.draggedRowIndex === targetIndex) {
      this.onRowDragEnd(event);
      return;
    }
    
    console.log(`📦 Dropping row from ${this.draggedRowIndex} to ${targetIndex}`);
    
    // Get the actual task list (not filtered/sorted)
    const tasks = this.plannerTaskList;
    
    // Remove the dragged item
    const [draggedTask] = tasks.splice(this.draggedRowIndex, 1);
    
    // Adjust target index if we removed an item before it
    const adjustedTargetIndex = this.draggedRowIndex < targetIndex ? targetIndex - 1 : targetIndex;
    
    // Insert at new position
    tasks.splice(adjustedTargetIndex, 0, draggedTask);
    
    // Renumber all rows
    this.renumberRows();
    
    // Sync with active sheet
    this.syncWithActiveSheet();
    
    // Force change detection
    this.cdr.detectChanges();
    
    // Reset drag state
    this.onRowDragEnd(event);
    
    this.utilServ.toaster.next({ 
      type: customToaster.successToast, 
      message: 'Row reordered successfully' 
    });
    
    console.log('✅ Row reordered. New order:', tasks.map(t => t.no));
  }

  // Check if row is the current drop target
  isDropTarget(index: number): boolean {
    return this.isDraggingRow && this.dropTargetIndex === index && this.draggedRowIndex !== index;
  }

  // Check if row is being dragged
  isDraggedRow(index: number): boolean {
    return this.draggedRowIndex === index;
  }

  // ===== Cell Drag and Drop Methods (within same column) =====
  
  onCellDragStart(rowIndex: number, columnKey: string, value: any, event: DragEvent): void {
    // Stop propagation to prevent row drag from being triggered
    event.stopPropagation();
    
    // Don't allow dragging while editing
    if (this.editingCell.rowIndex !== -1) {
      event.preventDefault();
      return;
    }
    
    // Don't allow dragging non-editable columns or 'no' column
    if (this.isNonEditableColumn(columnKey) || columnKey === 'no') {
      event.preventDefault();
      return;
    }
    
    // Don't allow dragging empty cells
    if (!value || value === '-') {
      event.preventDefault();
      return;
    }
    
    this.draggedCellInfo = { rowIndex, columnKey, value };
    this.isDraggingCell = true;
    
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setData('text/plain', JSON.stringify({ rowIndex, columnKey, value }));
    }
    
    console.log('🔄 Started dragging cell:', { rowIndex, columnKey, value });
  }

  onCellDragOver(rowIndex: number, columnKey: string, event: DragEvent): void {
    // Stop propagation to prevent row drag events
    event.stopPropagation();
    
    // Only allow drop on same column
    if (!this.draggedCellInfo || this.draggedCellInfo.columnKey !== columnKey) {
      return;
    }
    
    event.preventDefault();
    
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
    
    // Update drop target
    if (!this.dropTargetCellInfo || 
        this.dropTargetCellInfo.rowIndex !== rowIndex || 
        this.dropTargetCellInfo.columnKey !== columnKey) {
      this.dropTargetCellInfo = { rowIndex, columnKey };
    }
  }

  onCellDragEnter(rowIndex: number, columnKey: string, event: DragEvent): void {
    // Only allow drop on same column
    if (!this.draggedCellInfo || this.draggedCellInfo.columnKey !== columnKey) {
      return;
    }
    
    event.preventDefault();
    this.dropTargetCellInfo = { rowIndex, columnKey };
  }

  onCellDragLeave(event: DragEvent): void {
    // Only clear if leaving the cell area
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (!relatedTarget || !relatedTarget.closest('.cell-drag-area')) {
      this.dropTargetCellInfo = null;
    }
  }

  onCellDragEnd(event: DragEvent): void {
    this.isDraggingCell = false;
    this.draggedCellInfo = null;
    this.dropTargetCellInfo = null;
    
    console.log('✓ Cell drag ended');
  }

  onCellDrop(targetRowIndex: number, targetColumnKey: string, event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (!this.draggedCellInfo) {
      this.onCellDragEnd(event);
      return;
    }
    
    // Only allow drop on same column
    if (this.draggedCellInfo.columnKey !== targetColumnKey) {
      console.log('❌ Cannot drop on different column');
      this.onCellDragEnd(event);
      return;
    }
    
    // Don't allow drop on same cell
    if (this.draggedCellInfo.rowIndex === targetRowIndex) {
      console.log('ℹ️ Dropped on same cell, no action needed');
      this.onCellDragEnd(event);
      return;
    }
    
    console.log(`📦 Dropping cell value from row ${this.draggedCellInfo.rowIndex} to row ${targetRowIndex} in column ${targetColumnKey}`);
    
    // Get the displayed tasks
    const displayedTasks = this.getFilteredAndSortedTasks();
    const sourceTask = displayedTasks[this.draggedCellInfo.rowIndex];
    const targetTask = displayedTasks[targetRowIndex];
    
    if (!sourceTask || !targetTask) {
      console.warn('⚠️ Source or target task not found');
      this.onCellDragEnd(event);
      return;
    }
    
    // Move the value from source to target (copy then clear source)
    const sourceValue = sourceTask[targetColumnKey];
    targetTask[targetColumnKey] = sourceValue;
    
    // Also copy related ID fields if they exist
    const idFieldMap: { [key: string]: string } = {
      'customer': 'customerId',
      'product': 'productId',
      'pickupLocation': 'pickupLocationId',
      'vehicle': 'vehicleId',
      'driverName': 'driverId',
      'status': 'statusId',
      'trailerIn': 'trailerInId',
      'trailerOut': 'trailerOutId',
      'productType': 'productTypeId',
      'trailerInType': 'trailerInTypeId',
      'trailerOutType': 'trailerOutTypeId',
      'changeoverLocation': 'changeoverLocationId',
      'deliveryLocation': 'deliveryLocationId',
      'planner': 'plannerId'
    };
    
    const idField = idFieldMap[targetColumnKey];
    if (idField && sourceTask[idField] !== undefined) {
      targetTask[idField] = sourceTask[idField];
      console.log(`📋 Also moved ${idField}: ${sourceTask[idField]}`);
      // Clear the source ID field
      sourceTask[idField] = null;
    }
    
    // Special handling for weight column
    if (targetColumnKey === 'productEstWeight') {
      targetTask.productEstWeightValue = sourceTask.productEstWeightValue;
      targetTask.weightUnit = sourceTask.weightUnit;
      // Clear source weight fields
      sourceTask.productEstWeightValue = '';
      sourceTask.weightUnit = '';
    }
    
    // Clear the source cell value (move operation)
    sourceTask[targetColumnKey] = '';
    
    // Sync with active sheet
    this.syncWithActiveSheet();
    
    // Force change detection
    this.cdr.detectChanges();
    
    // Reset drag state
    this.onCellDragEnd(event);
    
    this.utilServ.toaster.next({ 
      type: customToaster.successToast, 
      message: `Cell value moved to row ${targetRowIndex + 1}` 
    });
    
    console.log('✅ Cell value moved successfully');
  }

  // Check if cell is the current drop target
  isCellDropTarget(rowIndex: number, columnKey: string): boolean {
    return this.isDraggingCell && 
           this.dropTargetCellInfo !== null &&
           this.dropTargetCellInfo.rowIndex === rowIndex && 
           this.dropTargetCellInfo.columnKey === columnKey &&
           this.draggedCellInfo !== null &&
           this.draggedCellInfo.rowIndex !== rowIndex;
  }

  // Check if cell is being dragged
  isDraggedCell(rowIndex: number, columnKey: string): boolean {
    return this.draggedCellInfo !== null &&
           this.draggedCellInfo.rowIndex === rowIndex && 
           this.draggedCellInfo.columnKey === columnKey;
  }

  // Editable cell methods
  async startEdit(rowIndex: number, field: string, event: Event) {
    event.stopPropagation();
    this.editingCell = { rowIndex, field };
    
    // Get task from the filtered/sorted list (same as displayed in table)
    const displayedTasks = this.getFilteredAndSortedTasks();
    const task = displayedTasks[rowIndex];
    
    if (!task) {
      console.warn(`⚠️ Task not found at rowIndex ${rowIndex}`);
      return;
    }
    
    // Prevent editing status if TaskID has a value (task already exists in backend)
    if (field === 'status') {
      const taskId = task.taskID || task.TaskID || task.taskId;
      if (taskId !== null && taskId !== undefined && taskId !== 0 && taskId !== '') {
        console.log(`⚠️ Status editing blocked - TaskID exists: ${taskId}`);
        this.utilServ.toaster.next({ 
          type: customToaster.warningToast, 
          message: 'Status cannot be edited for existing tasks' 
        });
        return;
      }
    }
    
    let customerId = task?.customerId || task?.CustomerID || task?.customerID;
    
    // If customerId is not set but customer name exists, try to find it from customerOptions
    if (!customerId && task?.customer) {
      // First ensure customer options are loaded
      if (this.customerOptions.length === 0) {
        await this.loadCustomerOptions();
      }
      // Find customer ID from customer name (case-insensitive, trim whitespace)
      const customerName = (task.customer || '').toLowerCase().trim();
      const customerObj = this.customerOptions.find((c: any) => {
        const optName = (c.name || '').toLowerCase().trim();
        return optName === customerName || optName.includes(customerName) || customerName.includes(optName);
      });
      if (customerObj) {
        console.log('🔍 Found customer object:', customerObj);
        customerId = customerObj.value;
        // Update task with customerId for future edits
        if (customerId) {
          task.customerId = customerId;
          console.log(`✓ Found customerId ${customerId} for customer "${task.customer}"`);
        } else {
          console.warn(`⚠️ Customer object found but value is undefined:`, customerObj);
        }
      } else {
        console.warn(`⚠️ Could not find customerId for customer "${task.customer}". Available customers:`, this.customerOptions.map(c => ({ name: c.name, value: c.value })));
      }
    }
    
    console.log(`🔍 Planner Dashboard - Starting edit for field: ${field}, row: ${rowIndex}, customerId: ${customerId}, customer: ${task?.customer}`);
    console.log('📋 Task data:', task);
    
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
        // Load customer-specific products
        if (customerId) {
          await this.loadProductOptions(customerId);
        } else if (task?.customer) {
          // Customer name exists but ID not found - show specific error
          console.warn(`⚠️ Customer "${task.customer}" not found in customer list`);
          this.utilServ.toaster.next({ 
            type: customToaster.warningToast, 
            message: `Customer "${task.customer}" not recognized. Please re-select the customer.` 
          });
        } else {
          console.warn('⚠️ Please select a customer first to load products');
          this.utilServ.toaster.next({ 
            type: customToaster.warningToast, 
            message: 'Please select a customer first' 
          });
        }
        break;

      case 'pickupLocation':
      //case 'changeoverLocation':
      //case 'deliveryLocation':
        // Load customer-specific locations
        if (customerId) {
          await this.loadLocationOptions(customerId);
        } else if (task?.customer) {
          // Customer name exists but ID not found - show specific error
          console.warn(`⚠️ Customer "${task.customer}" not found in customer list`);
          this.utilServ.toaster.next({ 
            type: customToaster.warningToast, 
            message: `Customer "${task.customer}" not recognized. Please re-select the customer.` 
          });
        } else {
          console.warn('⚠️ Please select a customer first to load locations');
          this.utilServ.toaster.next({ 
            type: customToaster.warningToast, 
            message: 'Please select a customer first' 
          });
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
        }
        break;
        
      case 'trailerIn':
        if (this.trailerInOptions.length === 0) {
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
        if (this.trailerOutOptions.length === 0) {
          await this.loadTrailerOptions();
        }
        break;
        

      case 'trailerOutType':
        if (this.trailerOutTypeOptions.length === 0) {
          await this.loadTrailerTypeOptions();
        }
        break;
    }

    setTimeout(() => {
      const input = document.querySelector(`#cellInput`) as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }, 0);
  }

  stopEdit() {
    this.editingCell = { rowIndex: -1, field: '' };
    // Sync changes with active sheet after edit
    this.syncWithActiveSheet();
  }

  cancelEdit() {
    this.editingCell = { rowIndex: -1, field: '' };
  }

  // Template dropdown methods
  async toggleTemplateDropdown() {
    if (!this.showTemplateDropdown) {
      // Load templates when opening dropdown
      await this.loadTemplateOptions();
    }
    this.showTemplateDropdown = !this.showTemplateDropdown;
  }

  // Load template options from API
  async loadTemplateOptions() {
    try {
      console.log('🔄 Loading template options...');
      
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
      
      if (!employeeId) {
        console.warn('⚠️ No employee ID found for loading templates');
        return;
      }
      
      const res: any = await this.templateService.getAllTemplatesByEmployeeId(employeeId);
      console.log('📦 Templates API Response:', res);
      console.log('📦 Response type:', typeof res);
      console.log('📦 Response keys:', res ? Object.keys(res) : 'null');
      
      let templates: any[] = [];
      
      // Handle different response formats
      if (res && res.result && Array.isArray(res.result)) {
        console.log('✓ Response has result array with', res.result.length, 'items');
        templates = res.result;
      } else if (res && Array.isArray(res)) {
        console.log('✓ Response is direct array with', res.length, 'items');
        templates = res;
      } else if (res && res.data && Array.isArray(res.data)) {
        console.log('✓ Response has data array with', res.data.length, 'items');
        templates = res.data;
      }
      
      if (templates.length > 0) {
        console.log('📋 First template sample:', templates[0]);
        
        this.templateOptions = templates.map((template: any) => ({
          id: template.templateID || template.TemplateID || template.templateId || template.TemplateId || template.id,
          value: template.templateID || template.TemplateID || template.templateId || template.TemplateId || template.id,
          label: template.templateName || template.TemplateName || template.name || template.Name,
          name: template.templateName || template.TemplateName || template.name || template.Name
        }));
        console.log('✅ Loaded', this.templateOptions.length, 'templates:', this.templateOptions);
      } else {
        this.templateOptions = [];
        console.log('ℹ️ No templates found');
      }
      
      // Force change detection to update UI
      this.cdr.detectChanges();
      
    } catch (error) {
      console.error('❌ Error loading template options:', error);
      this.templateOptions = [];
      this.cdr.detectChanges();
    }
  }



  async loadTemplateFromAPI(templateId: number) {
    try {
      console.log('🔍 Planner Dashboard - Loading template details for ID:', templateId);
      
      // Show loading indicator
      this.utilServ.toaster.next({ 
        type: customToaster.infoToast, 
        message: 'Loading template...' 
      });
      
      const res: any = await this.templateService.getTemplateByTemID(templateId);
      console.log('📦 Planner Dashboard - Template API Response:', res);
      
      if (res && res.result) {
        const templateData = res.result;
        
        // Extract sheet details
        const sheetDetails = templateData.templateSheetDetails || [];
        const templateDetails = templateData.templateDetails || [];
        
        console.log('📄 Sheet Details:', sheetDetails);
        console.log('📋 Template Details:', templateDetails);
        
        // Group template details by sheet name
        const sheetDataMap = new Map<string, any[]>();
        
        templateDetails.forEach((detail: any, index: number) => {
          const sheetName = detail.sheetName || detail.SheetName || 'Sheet 1';
          if (!sheetDataMap.has(sheetName)) {
            sheetDataMap.set(sheetName, []);
          }
          
          // Get current count for this sheet to generate proper row number
          const currentSheetData = sheetDataMap.get(sheetName)!;
          const rowNumber = currentSheetData.length + 1;
          
          // Combine productEstWeight and weightUnit
          let productEstWeight = detail.productEstWeight || detail.ProductEstWeight || '';
          const weightUnit = detail.productEstWeightUnits || detail.ProductEstWeightUnits || detail.weightUnit || detail.WeightUnit || '';
          
          // If we have separate weight value and unit, combine them
          if (productEstWeight && weightUnit && !productEstWeight.toString().includes(weightUnit)) {
            productEstWeight = `${productEstWeight}${weightUnit}`;
          }
          
          // Map template detail to task format with TaskID = 0
          const taskData = {
            taskID: 0, // Set TaskID to 0 for new tasks from template
            no: this.formatTaskNumber(rowNumber),
            planner: detail.planner || detail.Planner || '',
            customer: detail.customer || detail.Customer || '',
            customerId: detail.customerId || detail.CustomerID || detail.CustomerId || null, // Store customer ID for dropdown loading
            product: detail.product || detail.Product || '',
            pickupLocation: detail.pickupLocation || detail.PickupLocation || '',
            vehicle: detail.vehicle || detail.Vehicle || '',
            driverName: detail.driver || detail.Driver || detail.driverName || detail.DriverName || '',
            status: detail.status || detail.Status || 'DRAFT',
            trailerIn: detail.trailerIn || detail.TrailerIn || '',
            productEstWeight: productEstWeight,
            weightUnit: weightUnit,
            productType: detail.productType || detail.ProductType || '',
            trailerInType: detail.trailerInType || detail.TrailerInType || '',
            changeoverLocation: detail.changeoverLocation || detail.ChangeoverLocation || '',
            trailerOut: detail.trailerOut || detail.TrailerOut || '',
            trailerOutType: detail.trailerOutType || detail.TrailerOutType || '',
            scheduledTime: detail.scheduledTime || detail.ScheduledTime || '',
            collectionTime: detail.collectionTime || detail.CollectionTime || '',
            collectedTime: detail.collectedTime || detail.CollectedTime || '',
            deliveryLocation: detail.deliveryLocation || detail.DeliveryLocation || '',
            checked: false
          };
          
          currentSheetData.push(taskData);
        });
        
        // Sort sheets by DisplayOrder
        const sortedSheets = sheetDetails.sort((a: any, b: any) => {
          const orderA = a.displayOrder || a.DisplayOrder || 0;
          const orderB = b.displayOrder || b.DisplayOrder || 0;
          return orderA - orderB;
        });
        
        console.log('📊 Sorted Sheets:', sortedSheets);
        console.log('🗂️ Sheet Data Map:', sheetDataMap);
        
        // If we have a paginator, update sheets
        if (this.plannerPaginator && sortedSheets.length > 0) {
          // Create sheet structure for paginator
          const sheets = sortedSheets.map((sheet: any, index: number) => {
            const sheetName = sheet.sheetName || sheet.SheetName || `Sheet ${index + 1}`;
            const sheetData = sheetDataMap.get(sheetName) || [];
            
            return {
              id: `sheet${index + 1}`,
              name: sheetName,
              isActive: index === 0,
              data: sheetData,
              isTemplate: true // Mark as template sheet to hide delete/duplicate in paginator
            };
          });
          
          console.log('✅ Created sheets for paginator:', sheets);
          
          // Update paginator sheets
          this.plannerPaginator.sheets = sheets;
          
          // Load first sheet data
          if (sheets.length > 0 && sheets[0].data) {
            this.plannerTaskList = [...sheets[0].data];
            this.length = this.plannerTaskList.length;
            this.currentSheetId = sheets[0].id;
          }
          
          // Trigger change detection
          this.cdr.detectChanges();
          
          this.utilServ.toaster.next({ 
            type: customToaster.successToast, 
            message: `Template loaded successfully with ${sheets.length} sheet(s) and ${templateDetails.length} task(s)` 
          });
        } else {
          // Fallback: Load all data into single view if no paginator
          const allTasks: any[] = [];
          sheetDataMap.forEach((tasks) => {
            allTasks.push(...tasks);
          });
          
          this.plannerTaskList = allTasks;
          this.length = this.plannerTaskList.length;
          
          this.utilServ.toaster.next({ 
            type: customToaster.successToast, 
            message: `Template loaded successfully with ${allTasks.length} task(s)` 
          });
        }
        
      } else {
        console.warn('⚠ Planner Dashboard - No template data found');
        this.utilServ.toaster.next({ 
          type: customToaster.warningToast, 
          message: 'No data found in selected template' 
        });
      }
    } catch (error) {
      console.error('❌ Planner Dashboard - Error loading template:', error);
      this.utilServ.toaster.next({ 
        type: customToaster.errorToast, 
        message: 'Failed to load template. Please try again.' 
      });
    }
  }

  // View Changes Panel Properties
  showViewChanges: boolean = false;


  viewChanges() {
    this.showViewChanges = true;
    console.log('View Changes opened, current tasks:', this.plannerTaskList);
    console.log('Selected column:', this.selectedViewColumn);
    
    // Initialize selections if empty
    this.viewChangesColumns.forEach(col => {
      if (!this.viewChangesSelections[col.key]) {
        this.viewChangesSelections[col.key] = [];
      }
    });
  }

  closeViewChanges() {
    this.showViewChanges = false;
  }

  selectViewColumn(columnKey: string) {
    this.selectedViewColumn = columnKey;
  }

  getColumnDistinctValues(columnKey: string): string[] {
    if (!columnKey || this.plannerTaskList.length === 0) {
      console.log('No column key or empty task list:', columnKey, this.plannerTaskList.length);
      return [];
    }
    
    const values = this.plannerTaskList
      .map(task => task[columnKey])
      .filter((value, index, self) => value && self.indexOf(value) === index)
      .sort();
    
    //console.log('Distinct values for', columnKey, ':', values);
    return values;
  }

  getTaskCountForValue(columnKey: string, value: string): number {
    return this.plannerTaskList.filter(task => task[columnKey] === value).length;
  }

  getLastUpdatedForValue(columnKey: string, value: string): string {
    // Mock last updated dates with variety for demonstration
    const mockDates = [
      '2 hours ago',
      'Yesterday',
      '3 days ago',
      '1 week ago',
      '2 weeks ago'
    ];
    
    // Create a pseudo-random but consistent index based on value
    const index = (value.length + columnKey.length) % mockDates.length;
    return mockDates[index];
  }

  getDefaultValue(columnKey: string, value: string): string {
    // Mock default value - in real implementation, this would come from original task data
    const defaultValues: any = {
      'customer': 'Standard Customer',
      'product': 'Offal',
      'pickupLocation': 'Default Location',
      'vehicle': 'Standard Vehicle',
      'driverName': 'Default Driver',
      'trailerIn': 'Standard Trailer',
      'productType': 'Standard Type'
    };
    return defaultValues[columnKey] || value.split(' ')[0] || 'Offal';
  }

  getChangedValue(columnKey: string, value: string): string {
    // Mock changed value - in real implementation, this would come from updated task data
    const changedValues: any = {
      'customer': 'Avara Foods',
      'product': 'Bones',
      'pickupLocation': 'New Location', 
      'vehicle': 'Changed Vehicle',
      'driverName': 'New Driver',
      'trailerIn': 'Modified Trailer',
      'productType': 'Bones'
    };
    return changedValues[columnKey] || 'Bones';
  }

  isViewChangesValueSelected(columnKey: string, value: string): boolean {
    return this.viewChangesSelections[columnKey]?.includes(value) || false;
  }

  toggleValueSelection(columnKey: string, value: string, event: any) {
    if (!this.viewChangesSelections[columnKey]) {
      this.viewChangesSelections[columnKey] = [];
    }
    
    if (event.target.checked) {
      if (!this.viewChangesSelections[columnKey].includes(value)) {
        this.viewChangesSelections[columnKey].push(value);
      }
    } else {
      const index = this.viewChangesSelections[columnKey].indexOf(value);
      if (index > -1) {
        this.viewChangesSelections[columnKey].splice(index, 1);
      }
    }
  }

  getSelectedCount(columnKey: string): number {
    return this.viewChangesSelections[columnKey]?.length || 0;
  }

  onChangesDateChange() {
    console.log('Changes date changed:', this.selectedChangesDate);
    // Implement date-based filtering logic here
  }

  onCustomerSearch() {
    // The filtering will be handled by getFilteredAndSortedTasks() method
    // which is called automatically when the table renders
    console.log('Searching customers:', this.customerSearchText);
  }

  onSearchFocus() {
    // Handle search input focus
    console.log('Customer search focused');
  }

  onSearchBlur() {
    // Handle search input blur
    console.log('Customer search blurred');
  }

  onDateChange(event: any) {
    if (event && event.value) {
      this.selectedDate = event.value;
      console.log('Date changed to:', event.value);
      // You can add logic here to filter tasks by selected date
      // or perform any other date-related operations
    }
  }

  // Sort functionality methods
  toggleSortOptions() {
    this.showSortDropdown = !this.showSortDropdown;
  }

  selectSortOption(option: any) {
    this.selectedSort = option.value;
    this.showSortDropdown = false;
    this.sortTasks(option.value);
    
    this.utilServ.toaster.next({ 
      type: customToaster.infoToast, 
      message: `Tasks sorted by ${option.label}` 
    });
  }

  sortTasks(sortBy: string) {
    if (!this.plannerTaskList || this.plannerTaskList.length === 0) {
      return;
    }

    this.plannerTaskList.sort((a: any, b: any) => {
      let aValue = a[sortBy] || '';
      let bValue = b[sortBy] || '';

      // Convert to strings for comparison
      aValue = aValue.toString().toLowerCase();
      bValue = bValue.toString().toLowerCase();

      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    });

    console.log('Tasks sorted by:', sortBy);
  }

  closeSortDropdown() {
    this.showSortDropdown = false;
  }

  // Filter panel functionality methods
  toggleFilterPanel() {
    this.showFilterPanel = !this.showFilterPanel;
    if (this.showFilterPanel) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  closeFilterPanel() {
    this.showFilterPanel = false;
    document.body.style.overflow = 'auto';
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterSearchText = '';
  }

  getFilterCount(category: string): number {
    return this.selectedFilters[category] ? this.selectedFilters[category].length : 0;
  }

  getFilteredValues(): any[] {
    const values = this.filterValues[this.selectedCategory] || [];
    if (!this.filterSearchText) {
      return values;
    }
    return values.filter(item => 
      item.label.toLowerCase().includes(this.filterSearchText.toLowerCase())
    );
  }

  onFilterSearch() {
    // Search functionality is handled by getFilteredValues()
  }

  toggleCategoryFilterValue(item: any) {
    if (!this.selectedFilters[this.selectedCategory]) {
      this.selectedFilters[this.selectedCategory] = [];
    }
    
    const index = this.selectedFilters[this.selectedCategory].indexOf(item.value);
    if (index > -1) {
      this.selectedFilters[this.selectedCategory].splice(index, 1);
    } else {
      this.selectedFilters[this.selectedCategory].push(item.value);
    }
  }

  isCategoryValueSelected(value: string): boolean {
    return this.selectedFilters[this.selectedCategory]?.includes(value) || false;
  }

  clearCategoryFilters() {
    this.selectedFilters[this.selectedCategory] = [];
  }

  clearAllFilters() {
    this.selectedFilters = {};
  }

  cancelFilters() {
    this.selectedFilters = {};
    this.closeFilterPanel();
    this.utilServ.toaster.next({ 
      type: customToaster.infoToast, 
      message: 'Filters cancelled' 
    });
  }

  applyFilters() {
    // Apply the selected filters to the task list
    console.log('Applying filters:', this.selectedFilters);
    
    this.closeFilterPanel();
    
    const totalFilters = Object.values(this.selectedFilters).reduce((sum, arr) => sum + arr.length, 0);
    if (totalFilters > 0) {
      this.utilServ.toaster.next({ 
        type: customToaster.successToast, 
        message: `${totalFilters} filter(s) applied` 
      });
    } else {
      this.utilServ.toaster.next({ 
        type: customToaster.infoToast, 
        message: 'No filters selected' 
      });
    }
  }

  // Create Task functionality methods
  toggleCreateTaskOptions() {
    this.showCreateTaskDropdown = !this.showCreateTaskDropdown;
  }

  createNormalTask() {
    this.showCreateTaskDropdown = false;
    
    // Generate new task with default values
    const newTaskNumber = this.generateNewTaskNumber();
    const newTask = {
      taskID: 0,
      no: newTaskNumber,
      planner: '',
      plannerId: null,
      customer: '',
      customerId: null,
      product: '',
      productId: null,
      pickupLocation: '',
      pickupLocationId: null,
      vehicle: '',
      vehicleId: null,
      driverName: '',
      driverId: null,
      status: 'DRAFT',
      trailerIn: '',
      trailerInId: null,
      productEstWeight: '',
      productEstWeightValue: '',
      weightUnit: 'kg',
      productType: '',
      productTypeId: null,
      trailerInType: '',
      trailerInTypeId: null,
      changeoverLocation: '',
      changeoverLocationId: null,
      changeoverMessage: '',
      trailerOut: '',
      trailerOutId: null,
      scheduledTime: '',
      collectionTime: '',
      collectedTime: '',
      deliveryLocation: '',
      deliveryLocationId: null,
      notes: '',
      checked: false
    };
    
    const activeSheet = this.getActiveSheet();
    console.log('🆕 Creating normal task for active sheet:', activeSheet?.name || 'No active sheet');
    console.log('📊 Before add - plannerTaskList length:', this.plannerTaskList.length);
    
    // Add new task to the current plannerTaskList (this is the working copy for current sheet)
    this.plannerTaskList.push(newTask);
    this.length = this.plannerTaskList.length;
    
    console.log('📊 After add - plannerTaskList length:', this.plannerTaskList.length);
    
    // Sync with the active sheet using the helper method
    this.syncWithActiveSheet();
    
    // Trigger change detection
    this.cdr.detectChanges();
    
    console.log('✅ Normal task created successfully for sheet:', activeSheet?.name || 'default');
    this.utilServ.toaster.next({ 
      type: customToaster.successToast, 
      message: `New task ${newTaskNumber} created successfully` 
    });
  }
  
  generateNewTaskNumber(): string {
    const today = new Date();
    const prefix = this.getTaskPrefix(today.getDay());
    const existingNumbers = this.plannerTaskList
      .filter(task => {
        const taskNo = String(task.no || '');
        return taskNo.startsWith(prefix);
      })
      .map(task => {
        const taskNo = String(task.no || '');
        const match = taskNo.match(/(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      });
    
    // If no tasks with prefix found, just get the max number from all tasks
    if (existingNumbers.length === 0) {
      const allNumbers = this.plannerTaskList.map(task => {
        const taskNo = String(task.no || '');
        const match = taskNo.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });
      const nextNumber = allNumbers.length > 0 ? Math.max(...allNumbers) + 1 : 1;
      return this.formatTaskNumber(nextNumber);
    }
    
    const nextNumber = Math.max(...existingNumbers) + 1;
    return this.formatTaskNumber(nextNumber);
  }
  
  getTaskPrefix(dayOfWeek: number): string {
    const prefixes = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return prefixes[dayOfWeek];
  }

  // Row Actions Methods
  getCheckedTasks() {
    // Use plannerTaskList which is the working copy for the current active sheet
    return this.plannerTaskList.filter(task => task.checked);
  }

  // Check if any selected task has 'Assigned' status
  hasSelectedAssignedTasks(): boolean {
    return this.getCheckedTasks().some(task => {
      const status = (task.status || '').toLowerCase().trim();
      return status === 'assigned';
    });
  }

  async assignSelectedTasks() {
    const checkedTasks = this.getCheckedTasks();
    if (checkedTasks.length === 0) return;
    
    // Validate that all selected tasks have a driver assigned
    const tasksWithoutDriver = checkedTasks.filter((task: any) => 
      !task.driverName || task.driverName.trim() === ''
    );
    
    if (tasksWithoutDriver.length > 0) {
      const taskNumbers = tasksWithoutDriver.map((t: any) => t.no || 'Unknown').join(', ');
      this.utilServ.toaster.next({ 
        type: customToaster.errorToast, 
        message: `Add Driver for task(s): ${taskNumbers}. Driver is required before assigning.` 
      });
      return;
    }
    
    try {
      // Get current sheet info using helper method
      const currentSheet = this.getActiveSheet();
      let plannerSheetID: number | null = null;

      if (currentSheet) {
        // If sheet has an ID property from saved planner
        plannerSheetID = currentSheet.plannerSheetId || currentSheet.PlannerSheetId || null;
      }

      // Always save the sheet before assigning tasks (whether new or existing)
      console.log('📋 Saving planner sheet before assigning tasks...');
      
      // Call savePlannerWithDetails and wait for it to complete
      // Pass existing plannerSheetID if available for update, otherwise create new
      if (plannerSheetID) {
        // Update existing sheet - pass sheet name and ID
        const sheetName = currentSheet?.name || currentSheet?.plannerSheetName || currentSheet?.PlannerSheetName;
        await this.savePlannerWithDetails(sheetName, plannerSheetID);
      } else {
        // Create new sheet
        await this.savePlannerWithDetails();
      }
      
      // Re-fetch the plannerSheetID after save
      const updatedSheet = this.getActiveSheet();
      if (updatedSheet) {
        plannerSheetID = updatedSheet.plannerSheetId || updatedSheet.PlannerSheetId || null;
      }
      
      // If still no plannerSheetID after save attempt, the save was cancelled or failed
      if (!plannerSheetID) {
        console.log('❌ Planner sheet save was cancelled or failed. Cannot proceed with assignment.');
        return;
      }
      
      console.log('✅ Planner sheet saved successfully with ID:', plannerSheetID);
    
    // Show confirmation dialog
    if (!confirm(`Are you sure you want to assign ${checkedTasks.length} task(s)?`)) {
      return;
    }

      // Prepare tasks for API
      const tasksToAssign = checkedTasks.map((task: any) => {
        // Get weight value and unit from UI fields
        let productEstWeight: number | null = null;
        let productEstWeightUnit: string = task.weightUnit || 'kg';
        
        // Use productEstWeightValue directly (UI uses separate fields for value and unit)
        if (task.productEstWeightValue !== null && task.productEstWeightValue !== undefined && task.productEstWeightValue !== '') {
          const weightValue = parseFloat(task.productEstWeightValue);
          if (!isNaN(weightValue)) {
            productEstWeight = weightValue;
          }
        } 
        // Fallback: try to parse from combined productEstWeight field (for legacy data)
        else if (task.productEstWeight) {
          const weightStr = String(task.productEstWeight);
          const weightMatch = weightStr.match(/^([\d.]+)\s*([a-zA-Z]*)/);
          if (weightMatch) {
            productEstWeight = parseFloat(weightMatch[1]);
            productEstWeightUnit = weightMatch[2] || productEstWeightUnit;
          }
        }
        
        return {
          SNo: task.no || '',
          TaskID: task.taskID || 0,
          PlannerName: task.planner || '',
          PlannerSheetID: plannerSheetID,
          Status: 'Assigned',
          CustomerID: task.customerId || null,
          Customer: task.customer || '',
          Product: task.product || '',
          PickupLocation: task.pickupLocation || '',
          Vehicle: task.vehicle || '',
          Driver: task.driverName || '',
          TrailerIn: task.trailerIn || '',
          ProductEstWeight: productEstWeight,
          ProductEstWeightUnits: productEstWeightUnit,
          ProductType: task.productType || '',
          TrailerInType: task.trailerInType || '',
          ChangeoverLocation: task.changeoverLocation || '',
          TrailerOut: task.trailerOut || '',
          TrailerOutType: task.trailerOutType || '',
          ScheduledTime: task.scheduledTime || '',
          CollectionTime: task.collectionTime || '',
          CollectedTime: task.collectedTime || '',
          DeliveryLocation: task.deliveryLocation || ''
        };
      });

      console.log('🚀 Assigning tasks:', tasksToAssign);

      // Call API
      const response: any = await this.templateService.assignTasks(tasksToAssign);
      
      console.log('✅ Assign tasks response:', response);

      if (response && (response.success || response.assignedTasks)) {
        // Extract assigned tasks from response
        const assignedTasks = response.assignedTasks || response.result || [];
        const assignedTasksArray = Array.isArray(assignedTasks) ? assignedTasks : [assignedTasks];
        
        // Update tasks with returned data from API
        checkedTasks.forEach((task: any, index: number) => {
          const assignedTask = assignedTasksArray[index];
          if (assignedTask) {
            // Update taskID from response
            task.taskID = assignedTask.taskID || assignedTask.TaskID || task.taskID;
            
            // Update status from response
            task.status = assignedTask.status || assignedTask.Status || 'Assigned';
            
            // Update planner name from response if provided
            if (assignedTask.plannerName || assignedTask.PlannerName) {
              task.planner = assignedTask.plannerName || assignedTask.PlannerName;
            }
            
            // Update driver from response if provided
            if (assignedTask.driver || assignedTask.Driver) {
              task.driverName = assignedTask.driver || assignedTask.Driver;
            }
          } else {
            task.status = 'Assigned';
          }
          task.checked = false; // Uncheck after assigning
        });

        // Update active sheet data if using paginator
        if (this.plannerPaginator && currentSheet && currentSheet.data) {
          currentSheet.data = [...this.plannerTaskList];
        }

        this.cdr.detectChanges();
        
        const totalProcessed = response.totalTasksProcessed || assignedTasksArray.length;
        this.utilServ.toaster.next({ 
          type: customToaster.successToast, 
          message: response.message || `${totalProcessed} task(s) assigned successfully` 
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('❌ Error assigning tasks:', error);
      console.log('📋 Error object structure:', JSON.stringify(error, null, 2));
      console.log('📋 error.error:', error?.error);
      console.log('📋 error.ErrorCode:', error?.ErrorCode);
      
      // The HttpErrorInterceptor transforms the error - check for the 'error' property it adds
      // error.error contains the original API response body with validation errors
      const errorBody = error?.error;
      const hasValidationErrors = errorBody?.errors || 
                                   (error?.ErrorCode === 400 && errorBody?.title);
      
      if (hasValidationErrors) {
        console.log('📋 Found validation errors, showing modal');
        this.showValidationErrors(errorBody, 'Failed to Assign Tasks');
      } else {
        // Extract the best available error message
        const errorMessage = errorBody?.title || 
                            errorBody?.message || 
                            error?.Message ||
                            error?.message || 
                            error?.Status ||
                            'Unknown error';
        console.log('📋 No validation errors found, showing toast with message:', errorMessage);
        this.utilServ.toaster.next({ 
          type: customToaster.errorToast, 
          message: 'Failed to assign tasks: ' + errorMessage 
        });
      }
    }
  }

  // Parse and display validation errors from API response
  showValidationErrors(errorResponse: any, title: string = 'Validation Error') {
    console.log('📋 Parsing validation errors:', errorResponse);
    console.log('📋 errorResponse type:', typeof errorResponse);
    console.log('📋 errorResponse.errors:', errorResponse?.errors);
    
    this.validationErrorTitle = errorResponse?.title || title;
    this.validationErrors = [];
    
    if (errorResponse?.errors && typeof errorResponse.errors === 'object') {
      // Parse the errors object from API
      for (const [field, messages] of Object.entries(errorResponse.errors)) {
        // Clean up field names for display
        let displayField = field;
        
        // Handle JSON path format like "$[0].ProductEstWeight" -> "Row 1: ProductEstWeight"
        const jsonPathMatch = field.match(/\$\[(\d+)\]\.(\w+)/);
        if (jsonPathMatch) {
          const rowIndex = parseInt(jsonPathMatch[1]) + 1; // Convert to 1-based index
          const fieldName = this.formatFieldName(jsonPathMatch[2]);
          displayField = `Row ${rowIndex}: ${fieldName}`;
        } else {
          displayField = this.formatFieldName(field);
        }
        
        // Ensure messages is an array
        const messageArray = Array.isArray(messages) ? messages : [String(messages)];
        
        // Format error messages
        const formattedMessages = messageArray.map((msg: any) => {
          const msgStr = String(msg);
          // Make technical messages more user-friendly
          if (msgStr.includes('JSON value could not be converted')) {
            const typeMatch = msgStr.match(/System\.Nullable`1\[System\.(\w+)\]/);
            const expectedType = typeMatch ? typeMatch[1].toLowerCase() : 'number';
            return `Invalid value format. Expected a ${expectedType === 'int32' ? 'whole number' : expectedType}.`;
          }
          return msgStr;
        });
        
        this.validationErrors.push({
          field: displayField,
          messages: formattedMessages
        });
      }
    } else if (errorResponse?.title || errorResponse?.message) {
      // If no specific errors but has a title/message, show that
      this.validationErrors.push({
        field: 'Error',
        messages: [errorResponse.title || errorResponse.message]
      });
    }
    
    // If still no errors to show, add a generic message
    if (this.validationErrors.length === 0) {
      this.validationErrors.push({
        field: 'Error',
        messages: ['An unexpected error occurred. Please check the data and try again.']
      });
    }
    
    console.log('📋 Formatted validation errors:', this.validationErrors);
    this.showValidationErrorModal = true;
    this.cdr.detectChanges();
  }
  
  // Helper method to format field names for display
  formatFieldName(fieldName: string): string {
    // Handle camelCase and PascalCase field names
    return fieldName
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capitals
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  }
  
  // Close validation error modal
  closeValidationErrorModal() {
    this.showValidationErrorModal = false;
    this.validationErrors = [];
    this.validationErrorTitle = '';
  }

  duplicateSelectedTasks() {
    const checkedTasks = this.getCheckedTasks();
    if (checkedTasks.length === 0) {
      this.utilServ.toaster.next({ 
        type: customToaster.warningToast, 
        message: 'Please select at least one row to duplicate' 
      });
      return;
    }
    
    if (confirm(`Are you sure you want to duplicate ${checkedTasks.length} task(s)?`)) {
      const duplicatedTasks: any[] = [];
      const activeSheet = this.getActiveSheet();
      
      console.log('📄 Duplicating tasks for active sheet:', activeSheet?.name || 'No active sheet');
      
      // Work directly with plannerTaskList (current sheet's working copy)
      
      // Process checked tasks in reverse order to maintain correct indices when inserting
      const sortedCheckedTasks = [...checkedTasks].sort((a, b) => {
        const indexA = this.plannerTaskList.findIndex(t => t === a || t.no === a.no);
        const indexB = this.plannerTaskList.findIndex(t => t === b || t.no === b.no);
        return indexB - indexA; // Reverse order
      });
      
      sortedCheckedTasks.forEach((task) => {
        // Find the original task index
        const originalIndex = this.plannerTaskList.findIndex(t => t === task || t.no === task.no);
        
        if (originalIndex === -1) {
          console.warn('Task not found in plannerTaskList:', task);
          return;
        }
        
        // Create duplicate with new task number and reset taskID to 0 (deep copy)
        const duplicateTask = {
          ...JSON.parse(JSON.stringify(task)),
          taskID: 0, // New task, not saved yet
          no: this.generateNewTaskNumber(),
          status:   'DRAFT',
          checked: false
        };
        
        duplicatedTasks.push(duplicateTask);
        
        // Insert duplicate right after the original task
        this.plannerTaskList.splice(originalIndex + 1, 0, duplicateTask);
      });
      
      // Uncheck original tasks
      checkedTasks.forEach((task: any) => task.checked = false);
      this.allChecked = false;
      this.length = this.plannerTaskList.length;
      
      // Sync with active sheet using helper
      this.syncWithActiveSheet();
      
      // Force change detection
      this.cdr.detectChanges();
      
      this.utilServ.toaster.next({ 
        type: customToaster.successToast, 
        message: `${duplicatedTasks.length} task(s) duplicated successfully` 
      });
    }
  }

  deleteSelectedTasks() {
    const checkedTasks = this.getCheckedTasks();
    if (checkedTasks.length === 0) {
      this.utilServ.toaster.next({ 
        type: customToaster.warningToast, 
        message: 'Please select at least one row to delete' 
      });
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${checkedTasks.length} task(s)? This action cannot be undone.`)) {
      // Get task numbers for reference
      const taskNumbers = checkedTasks.map((task: any) => task.no);
      const activeSheet = this.getActiveSheet();
      
      console.log('📄 Deleting tasks from active sheet:', activeSheet?.name || 'No active sheet');
      
      // Remove checked tasks from plannerTaskList
      this.plannerTaskList = this.plannerTaskList.filter((task: any) => !task.checked);
      this.length = this.plannerTaskList.length;
      
      // Renumber all rows after deletion
      this.renumberRows();
      
      // Sync with active sheet using helper
      this.syncWithActiveSheet();
      
      // Reset allChecked
      this.allChecked = false;
      
      // Force change detection
      this.cdr.detectChanges();
      
      this.utilServ.toaster.next({ 
        type: customToaster.successToast, 
        message: `${checkedTasks.length} task(s) deleted successfully` 
      });
      
      console.log('Deleted tasks:', taskNumbers);
    }
  }

  createChangeoverTask() {
    this.showCreateTaskDropdown = false;
    // TODO: Implement changeover task creation functionality
    // This could open a different modal or form specific to changeover tasks
    console.log('Creating changeover task');
    /*this.utilServ.toaster.next({ 
      type: customToaster.infoToast, 
      message: 'Changeover task creation feature coming soon' 
    });*/
     this.showCreateTaskDropdown = false;
    
    // Generate new task with default values
    const newTaskNumber = this.generateNewTaskNumber();
    const newTask = {
      taskID: 0,
      no: newTaskNumber,
      planner: '',
      plannerId: null,
      customer: '',
      customerId: null,
      product: '',
      productId: null,
      pickupLocation: '',
      pickupLocationId: null,
      vehicle: '',
      vehicleId: null,
      driverName: '',
      driverId: null,
      status: 'DRAFT',
      trailerIn: '',
      trailerInId: null,
      productEstWeight: '',
      productEstWeightValue: '',
      weightUnit: 'kg',
      productType: '',
      productTypeId: null,
      trailerInType: '',
      trailerInTypeId: null,
      changeoverLocation: '',
      changeoverLocationId: null,
      changeoverMessage: '',
      trailerOut: '',
      trailerOutId: null,
      scheduledTime: '',
      collectionTime: '',
      collectedTime: '',
      deliveryLocation: '',
      deliveryLocationId: null,
      notes: '',
      checked: false
    };
    
    // Add new task to the beginning of the list
    this.plannerTaskList.unshift(newTask);
    this.length = this.plannerTaskList.length;
    
    // Sync with active sheet using helper
    this.syncWithActiveSheet();
    
    this.cdr.detectChanges();
    
    console.log('Changeover task created:', newTask);
    this.utilServ.toaster.next({ 
      type: customToaster.successToast, 
      message: `Changeover task ${newTaskNumber} created successfully` 
    });
  }

  closeCreateTaskDropdown() {
    this.showCreateTaskDropdown = false;
  }

  // Advanced table methods
  getVisibleColumns() {
    return this.tableColumns.filter(col => col.visible);
  }

  getColumnOptions(columnKey: string): string[] {
    const optionsMap: { [key: string]: any[] } = {
      'planner': this.plannerOptions,
      'customer': this.customerOptions,
      'product': this.productOptions,
      'pickupLocation': this.pickupLocationOptions,
      'vehicle': this.vehicleOptions,
      'driverName': this.driverOptions,
      'status': this.statusOptions,
      'trailerIn': this.trailerInOptions,
      'productEstWeight': this.productWeightOptions,
      'productType': this.productTypeOptions,
      'trailerInType': this.trailerTypeOptions,
      'changeoverLocation': this.changeoverLocationOptions,
      'trailerOut': this.trailerOutOptions,
      'trailerOutType': this.trailerOutTypeOptions,
      'deliveryLocation': this.deliveryLocationOptions
    };
    
    const options = optionsMap[columnKey] || [];
    
    // If options are objects with 'name' property, extract the names
    if (options.length > 0 && typeof options[0] === 'object' && options[0].name) {
      return options.map((opt: any) => opt.name);
    }
    
    // Otherwise return as-is (for string arrays like productWeightOptions)
    return options;
  }

  // Handle dropdown change to update associated ID fields
  onDropdownChange(task: any, columnKey: string, selectedValue: string) {
    console.log(`🔄 Dropdown changed: ${columnKey} = "${selectedValue}"`);
    
    // Map column keys to their ID fields and option arrays
    const columnToIdMap: { [key: string]: { idField: string, options: any[] } } = {
      'customer': { idField: 'customerId', options: this.customerOptions },
      'product': { idField: 'productId', options: this.productOptions },
      'pickupLocation': { idField: 'pickupLocationId', options: this.pickupLocationOptions },
      'changeoverLocation': { idField: 'changeoverLocationId', options: this.changeoverLocationOptions },
      'deliveryLocation': { idField: 'deliveryLocationId', options: this.deliveryLocationOptions },
      'vehicle': { idField: 'vehicleId', options: this.vehicleOptions },
      'driverName': { idField: 'driverId', options: this.driverOptions },
      'status': { idField: 'statusId', options: this.statusOptions },
      'trailerIn': { idField: 'trailerInId', options: this.trailerInOptions },
      'trailerOut': { idField: 'trailerOutId', options: this.trailerOutOptions },
      'trailerInType': { idField: 'trailerInTypeId', options: this.trailerTypeOptions },
      'productType': { idField: 'productTypeId', options: this.productTypeOptions },
      'planner': { idField: 'plannerId', options: this.plannerOptions }
    };
    
    const mapping = columnToIdMap[columnKey];
    if (mapping && mapping.options) {
      // Find the selected option and update the ID field
      const selectedOption = mapping.options.find((opt: any) => 
        opt.name === selectedValue || opt.value === selectedValue
      );
      
      if (selectedOption) {
        task[mapping.idField] = selectedOption.value;
        // Also ensure the display name is set correctly
        task[columnKey] = selectedOption.name;
        console.log(`✅ Updated ${columnKey} = "${selectedOption.name}", ${mapping.idField} = ${selectedOption.value}`);
      } else {
        task[mapping.idField] = null;
        console.log(`⚠️ Could not find ID for ${columnKey} = "${selectedValue}". Available options:`, mapping.options);
      }
    }
    
    // Special logging for planner to help debug
    if (columnKey === 'planner') {
      console.log('👤 Planner update details:');
      console.log('   - Selected value from dropdown:', selectedValue);
      console.log('   - task.planner:', task.planner);
      console.log('   - task.plannerId:', task.plannerId);
      console.log('   - plannerOptions:', this.plannerOptions);
    }
    
    // If product changed, auto-populate product type
    if (columnKey === 'product') {
      console.log('🔄 Product changed, looking for productType...');
      console.log('📦 Available productOptions:', this.productOptions);
      
      const selectedProduct = this.productOptions.find((opt: any) => 
        opt.name === selectedValue || opt.value === selectedValue || String(opt.value) === String(selectedValue)
      );
      
      console.log('🔍 Selected product object:', selectedProduct);
      
      if (selectedProduct) {
        if (selectedProduct.productType) {
          task.productType = selectedProduct.productType;
          task.productTypeId = selectedProduct.productTypeId || null;
          console.log(`✅ Auto-populated productType = "${selectedProduct.productType}", productTypeId = ${selectedProduct.productTypeId}`);
        } else {
          // Try to find productType from productTypeOptions if we have the productTypeId
          if (selectedProduct.productTypeId && this.productTypeOptions.length > 0) {
            const productTypeOption = this.productTypeOptions.find((pt: any) => 
              Number(pt.value) === Number(selectedProduct.productTypeId)
            );
            if (productTypeOption) {
              task.productType = productTypeOption.name;
              task.productTypeId = selectedProduct.productTypeId;
              console.log(`✅ Found productType from productTypeOptions: "${productTypeOption.name}"`);
            } else {
              task.productType = '';
              task.productTypeId = null;
              console.log(`⚠️ ProductTypeId ${selectedProduct.productTypeId} not found in productTypeOptions`);
            }
          } else {
            task.productType = '';
            task.productTypeId = null;
            console.log(`⚠️ No productType found for selected product: "${selectedValue}"`);
          }
        }
      } else {
        task.productType = '';
        task.productTypeId = null;
        console.log(`⚠️ Product not found in productOptions for value: "${selectedValue}"`);
      }
    }
    
    // If customer changed, clear dependent fields and their IDs
    if (columnKey === 'customer') {
      console.log('🔄 Customer changed, clearing dependent fields...');
      // Clear product and location fields since they depend on customer
      task.product = '';
      task.productId = null;
      task.productType = '';
      task.productTypeId = null;
      task.pickupLocation = '';
      task.pickupLocationId = null;
      task.changeoverLocation = '';
      task.changeoverLocationId = null;
      task.deliveryLocation = '';
      task.deliveryLocationId = null;
      
      // Clear the options so they reload on next edit
      this.productOptions = [];
      this.productTypeOptions = [];
      this.pickupLocationOptions = [];
      this.changeoverLocationOptions = [];
      this.deliveryLocationOptions = [];
      
      console.log('✅ Dependent fields cleared');
    }
    
    // Sync changes with active sheet after dropdown change
    this.syncWithActiveSheet();
    
    // Debug: Log the updated task
    console.log('📋 Task after dropdown change:', JSON.stringify(task, null, 2));
  }

  // Check if column is a time input field
  isTimeColumn(columnKey: string): boolean {
    const timeColumns = ['collectionTime'];
    return timeColumns.includes(columnKey);
  }

  // Check if column is a datetime input field (date + time)
  isDateTimeColumn(columnKey: string): boolean {
    const dateTimeColumns = ['scheduledTime'];
    return dateTimeColumns.includes(columnKey);
  }

  // Check if column should be a text input field
  isTextColumn(columnKey: string): boolean {
    const textColumns = ['changeoverMessage', 'notes'];
    return textColumns.includes(columnKey);
  }

  // Check if column is the product est weight field
  isWeightColumn(columnKey: string): boolean {
    return columnKey === 'productEstWeight';
  }

  // Check if column is non-editable (read-only)
  isNonEditableColumn(columnKey: string): boolean {
    const column = this.tableColumns.find(col => col.key === columnKey);
    return column?.editable === false || columnKey === 'productType' || columnKey === 'status';
  }

  // Get cell tooltip based on column type and value
  getCellTooltip(columnKey: string, value: any): string {
    const isNonEditable = this.isNonEditableColumn(columnKey);
    const hasValue = value && value !== '-';
    const isDraggable = !isNonEditable && columnKey !== 'no' && hasValue;
    
    if (isNonEditable) {
      return 'This field is read-only';
    }
    
    if (isDraggable) {
      return 'Double-click to edit • Drag icon to move value';
    }
    
    return 'Double-click to edit';
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

  toggleColumnManager() {
    this.showColumnManager = !this.showColumnManager;
  }

  toggleColumnVisibility(columnKey: string) {
    const column = this.tableColumns.find(col => col.key === columnKey);
    if (column) {
      column.visible = !column.visible;
    }
  }

  toggleColumnSort(columnKey: string) {
    const currentSort = this.columnSorts[columnKey];
    // Reset all other sorts
    this.columnSorts = {};
    // Set new sort
    if (!currentSort) {
      this.columnSorts[columnKey] = 'asc';
    } else if (currentSort === 'asc') {
      this.columnSorts[columnKey] = 'desc';
    } else {
      this.columnSorts[columnKey] = null;
    }
  }

  applyColumnFilter(columnKey: string) {
    // Filter is applied in getFilteredAndSortedTasks()
  }

  getFilteredAndSortedTasks() {
    // plannerTaskList is the single source of truth for the current active sheet
    // It gets synced with sheet.data when switching sheets
    let filteredTasks = [...this.plannerTaskList];

    // Apply customer search filter first
    if (this.customerSearchText && this.customerSearchText.trim()) {
      const searchText = this.customerSearchText.toLowerCase();
      filteredTasks = filteredTasks.filter(task => {
        return task.customer?.toLowerCase().includes(searchText) || false;
      });
    }

    // Apply column filters (old text-based)
    Object.keys(this.columnFilters).forEach(columnKey => {
      const filterValue = this.columnFilters[columnKey];
      if (filterValue && filterValue.trim()) {
        filteredTasks = filteredTasks.filter(task => {
          const cellValue = task[columnKey]?.toString().toLowerCase() || '';
          return cellValue.includes(filterValue.toLowerCase());
        });
      }
    });
    
    // Apply new column filters (checkbox-based)
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

  // Column resizing
  startResize(columnKey: string, event: MouseEvent) {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = this.getColumnWidth(columnKey);

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - startX);
      this.setColumnWidth(columnKey, Math.max(80, newWidth)); // Minimum width of 80px
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  getColumnWidth(columnKey: string): number {
    const column = this.tableColumns.find(col => col.key === columnKey);
    return column?.width || 100;
  }

  setColumnWidth(columnKey: string, width: number) {
    const column = this.tableColumns.find(col => col.key === columnKey);
    if (column) {
      column.width = width;
    }
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
        // Reorder columns
        const draggedColumn = this.tableColumns.splice(draggedIndex, 1)[0];
        this.tableColumns.splice(targetIndex, 0, draggedColumn);
      }
      this.draggedColumn = null;
    }
  }



  loadTemplateData(templateDay: string) {
    // Comprehensive sample template data based on selected day
    const templateData: any = {
      'monday': [
        {
          no: '01',
          planner: 'John Doe',
          customer: 'AVARA FOODS',
          product: 'Offal',
          pickupLocation: 'A Junction, 19 street',
          vehicle: 'BD51SMR',
          driverName: 'David Wilson',
          status: 'pending',
          trailerIn: '736',
          productEstWeight: '500kg',
          productType: 'Offal waste',
          trailerInType: 'Bulker',
          changeoverLocation: 'B Junction, 19 street',
          trailerOut: '283',
          trailerOutType: 'Tanker',
          scheduledTime: '08:30',
          collectionTime: '10:15',
          collectedTime: '10:45',
          deliveryLocation: '',
          checked: false
        },
        {
          no: '02',
          planner: 'Robert Brown',
          customer: 'CRANSWICK',
          product: 'Bones',
          pickupLocation: 'B Junction, 19 street',
          vehicle: 'XZ12QWE',
          driverName: 'Rafal Rabczak',
          status: 'accepted',
          trailerIn: '456',
          productEstWeight: '800kg',
          productType: 'Animal waste',
          trailerInType: 'Bulker',
          changeoverLocation: 'C Junction, 19 street',
          trailerOut: '786',
          trailerOutType: 'Tanker',
          scheduledTime: '02:30',
          collectionTime: '07:19',
          collectedTime: '10:45',
          deliveryLocation: '',
          checked: false
        },
        {
          no: '03',
          planner: 'Alice Johnson',
          customer: 'WOODHEADS',
          product: 'Carcass',
          pickupLocation: 'E Junction, 11 street',
          vehicle: 'UV78YZX',
          driverName: 'Andrzej Golebiewski',
          status: 'completed',
          trailerIn: '231',
          productEstWeight: '530kg',
          productType: 'Ca3 waste',
          trailerInType: 'Bulker',
          changeoverLocation: 'B Junction, 19 street',
          trailerOut: '283',
          trailerOutType: 'Tanker',
          scheduledTime: '08:30',
          collectionTime: '10:15',
          collectedTime: '10:45',
          deliveryLocation: '',
          checked: false
        }
      ],
      'tuesday': [
        {
          no: '01',
          planner: 'Alice Johnson',
          customer: 'IQBAL',
          product: 'Bones',
          pickupLocation: 'B Junction, 19 street',
          vehicle: 'XZ12QWE',
          driverName: 'Rafal Rabczak',
          status: 'accepted',
          trailerIn: '456',
          productEstWeight: '800kg',
          productType: 'Animal waste',
          trailerInType: 'Bulker',
          changeoverLocation: 'C Junction, 19 street',
          trailerOut: '786',
          trailerOutType: 'Tanker',
          scheduledTime: '02:30',
          collectionTime: '07:19',
          collectedTime: '10:45',
          deliveryLocation: '',
          checked: false
        },
         {
          no: '02',
          planner: 'John Doe',
          customer: 'AVARA FOODS',
          product: 'Offal',
          pickupLocation: 'A Junction, 19 street',
          vehicle: 'BD51SMR',
          driverName: 'David Wilson',
          status: 'pending',
          trailerIn: '736',
          productEstWeight: '500kg',
          productType: 'Offal waste',
          trailerInType: 'Bulker',
          changeoverLocation: 'B Junction, 19 street',
          trailerOut: '283',
          trailerOutType: 'Tanker',
          scheduledTime: '08:30',
          collectionTime: '10:15',
          collectedTime: '10:45',
          deliveryLocation: '',
          checked: false
        }
      ],
      'wednesday': [
        {
          no: '01',
          planner: 'Emma Davis',
          customer: 'WOODHEADS',
          product: 'Carcass',
          pickupLocation: 'E Junction, 11 street',
          vehicle: 'UV78YZX',
          driverName: 'Andrzej Golebiewski',
          status: 'completed',
          trailerIn: '231',
          productEstWeight: '530kg',
          productType: 'Ca3 waste',
          trailerInType: 'Bulker',
          changeoverLocation: 'B Junction, 19 street',
          trailerOut: '283',
          trailerOutType: 'Tanker',
          scheduledTime: '08:30',
          collectionTime: '10:15',
          collectedTime: '10:45',
          deliveryLocation: '',
          checked: false
        },
        {
          no: '02',
          planner: 'Paul Wilson',
          customer: 'BANHAM',
          product: 'Carcass',
          pickupLocation: 'E Junction, 11 street',
          vehicle: 'UV78YZX',
          driverName: 'Andrzej Golebiewski',
          status: 'completed',
          trailerIn: '231',
          productEstWeight: '530kg',
          productType: 'Ca3 waste',
          trailerInType: 'Bulker',
          changeoverLocation: 'B Junction, 19 street',
          trailerOut: '283',
          trailerOutType: 'Tanker',
          scheduledTime: '08:30',
          collectionTime: '10:15',
          collectedTime: '10:45',
          deliveryLocation: '',
          checked: false
        }
      ],
      'thursday': [
         {
          no: '01',
          planner: 'Mark Williams',
          customer: 'LOW LOADER',
          product: 'Feathers',
          pickupLocation: 'D Junction, 19 street',
          vehicle: 'MN56OPR',
          driverName: 'David Wilson',
          status: 'pending',
          trailerIn: '736',
          productEstWeight: '500kg',
          productType: 'Offal waste',
          trailerInType: 'Bulker',
          changeoverLocation: 'B Junction, 19 street',
          trailerOut: '283',
          trailerOutType: 'Tanker',
          scheduledTime: '08:30',
          collectionTime: '10:15',
          collectedTime: '10:45',
          deliveryLocation: '',
          checked: false
        },
        {
          no: '02',
          planner: 'Robert Brown',
          customer: 'CRANSWICK',
          product: 'Bones',
          pickupLocation: 'B Junction, 19 street',
          vehicle: 'XZ12QWE',
          driverName: 'Rafal Rabczak',
          status: 'accepted',
          trailerIn: '456',
          productEstWeight: '800kg',
          productType: 'Animal waste',
          trailerInType: 'Bulker',
          changeoverLocation: 'C Junction, 19 street',
          trailerOut: '786',
          trailerOutType: 'Tanker',
          scheduledTime: '02:30',
          collectionTime: '07:19',
          collectedTime: '10:45',
          deliveryLocation: '',
          checked: false
        },
        {
          no: '03',
          planner: 'Alice Johnson',
          customer: 'WOODHEADS',
          product: 'Carcass',
          pickupLocation: 'E Junction, 11 street',
          vehicle: 'UV78YZX',
          driverName: 'Andrzej Golebiewski',
          status: 'completed',
          trailerIn: '231',
          productEstWeight: '530kg',
          productType: 'Ca3 waste',
          trailerInType: 'Bulker',
          changeoverLocation: 'B Junction, 19 street',
          trailerOut: '283',
          trailerOutType: 'Tanker',
          scheduledTime: '08:30',
          collectionTime: '10:15',
          collectedTime: '10:45',
          deliveryLocation: '',
          checked: false
        }
      ],
      'friday': [
        {
          no: '01',
          planner: 'Alice Johnson',
          customer: 'WOODHEADS',
          product: 'Carcass',
          pickupLocation: 'E Junction, 11 street',
          vehicle: 'UV78YZX',
          driverName: 'Andrzej Golebiewski',
          status: 'completed',
          trailerIn: '231',
          productEstWeight: '530kg',
          productType: 'Ca3 waste',
          trailerInType: 'Bulker',
          changeoverLocation: 'B Junction, 19 street',
          trailerOut: '283',
          trailerOutType: 'Tanker',
          scheduledTime: '08:30',
          collectionTime: '10:15',
          collectedTime: '10:45',
          deliveryLocation: '',
          checked: false
        }
      ],
      'saturday': [
        {
          no: '01',
          planner: 'Alice Johnson',
          customer: 'IQBAL',
          product: 'Bones',
          pickupLocation: 'B Junction, 19 street',
          vehicle: 'XZ12QWE',
          driverName: 'Rafal Rabczak',
          status: 'accepted',
          trailerIn: '456',
          productEstWeight: '800kg',
          productType: 'Animal waste',
          trailerInType: 'Bulker',
          changeoverLocation: 'C Junction, 19 street',
          trailerOut: '786',
          trailerOutType: 'Tanker',
          scheduledTime: '02:30',
          collectionTime: '07:19',
          collectedTime: '10:45',
          deliveryLocation: '',
          checked: false
        },
         {
          no: '02',
          planner: 'John Doe',
          customer: 'AVARA FOODS',
          product: 'Offal',
          pickupLocation: 'A Junction, 19 street',
          vehicle: 'BD51SMR',
          driverName: 'David Wilson',
          status: 'pending',
          trailerIn: '736',
          productEstWeight: '500kg',
          productType: 'Offal waste',
          trailerInType: 'Bulker',
          changeoverLocation: 'B Junction, 19 street',
          trailerOut: '283',
          trailerOutType: 'Tanker',
          scheduledTime: '08:30',
          collectionTime: '10:15',
          collectedTime: '10:45',
          deliveryLocation: '',
          checked: false
        }
      ]
    };

    const templateTasks = templateData[templateDay] || [];
    // Clear existing list and add new template data
    this.plannerTaskList = [...templateTasks];
    this.length = this.plannerTaskList.length;
    
    this.utilServ.toaster.next({ 
      type: customToaster.successToast, 
      message: `${templateTasks.length} task(s) loaded from ${templateDay} template` 
    });
  }

  // Save Planner functionality
  async savePlannerWithDetails(sheetName?: string, plannerSheetId?: number) {
    try {
      // Validate that we have data to save
      if (!this.plannerPaginator || !this.plannerPaginator.sheets || this.plannerPaginator.sheets.length === 0) {
        this.utilServ.toaster.next({ 
          type: customToaster.warningToast, 
          message: 'No data to save. Please load or create tasks first.' 
        });
        return;
      }

      // Get logged in user data
      let user: any = localStorage.getItem('loggedInUser');
      if (!user) {
        this.utilServ.toaster.next({ 
          type: customToaster.errorToast, 
          message: 'User not logged in. Please login again.' 
        });
        return;
      }
      
      let parsedUser = JSON.parse(user);
      const plannerId = parsedUser.employeeId || parsedUser.EmployeeId || parsedUser.id;
      const createdBy = parsedUser.userName || parsedUser.UserName || parsedUser.name || 'Unknown';

      // Use provided sheet name or prompt user for planner sheet name
      let plannerSheetName = sheetName;
      let isActive = this.isPlannerSheetActive;
      
      // Refresh existing planner sheet names for validation
      await this.loadExistingPlannerSheetNames();
      
      // Skip name popup if updating existing planner sheet
      if (!plannerSheetName && !plannerSheetId) {
        // Show custom dialog instead of prompt only for new sheets
        return new Promise<void>((resolve) => {
          this.newPlannerSheetName = '';
          this.isPlannerSheetActive = false;
          this.sheetNameValidationPassed = false;
          this.plannerSheetNameError = '';
          this.showSavePlannerDialog = true;
          
          console.log('📋 Dialog opened, waiting for user input...');
          
          // Wait for user to confirm or cancel
          const checkDialog = setInterval(() => {
            if (!this.showSavePlannerDialog) {
              clearInterval(checkDialog);
              console.log('📋 Dialog closed, checking validation...');
              console.log('📋 sheetNameValidationPassed:', this.sheetNameValidationPassed);
              console.log('📋 newPlannerSheetName:', this.newPlannerSheetName);
              
              // Only proceed with save if validation passed
              if (this.sheetNameValidationPassed && this.newPlannerSheetName && this.newPlannerSheetName.trim() !== '') {
                console.log('✅ Proceeding with save...');
                // Continue with save using the provided name and isActive flag
                this.savePlannerWithDetails(this.newPlannerSheetName).then(resolve);
              } else {
                console.log('❌ Save cancelled - validation not passed or name empty');
                this.utilServ.toaster.next({ 
                  type: customToaster.infoToast, 
                  message: 'Save cancelled' 
                });
                resolve();
              }
            }
          }, 100);
        });
      }
      
      // If no name provided but has plannerSheetId, it means updating existing sheet
      if (!plannerSheetName && plannerSheetId) {
        this.utilServ.toaster.next({ 
          type: customToaster.errorToast, 
          message: 'Sheet name is required for update' 
        });
        return;
      }

      console.log('🔍 Planner Dashboard - Saving planner with details');
      console.log('📝 Planner Sheet Name:', plannerSheetName);
      console.log('👤 Planner ID:', plannerId);
      console.log('✍️ Created By:', createdBy);

      // Show loading indicator
      this.utilServ.toaster.next({ 
        type: customToaster.infoToast, 
        message: 'Saving planner...' 
      });

      // Sync plannerTaskList with active sheet before saving to ensure latest UI data is captured
      this.syncWithActiveSheet();

      // Collect sheet details from the active sheet only
      const plannerSheetDetails: any[] = [];
      let sno = 1;

      // Get the active sheet
      const activeSheet = this.plannerPaginator.getActiveSheet();
      if (!activeSheet) {
        this.utilServ.toaster.next({ 
          type: customToaster.warningToast, 
          message: 'No active sheet found to save' 
        });
        return;
      }

      const activeSheetName = activeSheet.name || 'Sheet 1';
      // Use plannerTaskList directly as it contains the most up-to-date UI data
      const sheetData = this.plannerTaskList || [];

      console.log(`📄 Processing active sheet: ${activeSheetName} with ${sheetData.length} tasks`);

      // Process each task in the active sheet
      sheetData.forEach((task: any) => {
          // Get weight value and unit directly from UI fields
          let productEstWeight: number | null = null;
          let weightUnit: string = task.weightUnit || 'kg';

          console.log(`📦 Task ${task.no} - productEstWeightValue:`, task.productEstWeightValue, 'weightUnit:', task.weightUnit);

          // Use productEstWeightValue directly (UI uses separate fields for value and unit)
          if (task.productEstWeightValue !== null && task.productEstWeightValue !== undefined && task.productEstWeightValue !== '') {
            const weightValue = parseFloat(task.productEstWeightValue);
            if (!isNaN(weightValue)) {
              productEstWeight = weightValue;
              console.log(`📦 Task ${task.no} - Using productEstWeightValue: ${productEstWeight}, unit: ${weightUnit}`);
            }
          } 
          // Fallback: try to parse from combined productEstWeight field (for legacy data)
          else if (task.productEstWeight) {
            const weightStr = String(task.productEstWeight).trim();
            console.log(`📦 Task ${task.no} - Fallback - Weight string:`, weightStr);
            const weightMatch = weightStr.match(/^([\d.]+)\s*([a-zA-Z]*)/);
            if (weightMatch) {
              productEstWeight = parseFloat(weightMatch[1]);
              weightUnit = weightMatch[2] || weightUnit;
              console.log(`📦 Task ${task.no} - Parsed from productEstWeight: ${productEstWeight}, unit: ${weightUnit}`);
            }
          }

          const detail = {
            Sno: sno++,
            TaskID: task.taskID || 0,
            SheetName: activeSheetName,
            Planner: task.planner || '',
            PlannerId: task.plannerId || null,
            Customer: task.customer || '',
            CustomerID: task.customerId || null,
            Product: task.product || '',
            ProductId: task.productId || null,
            PickupLocation: task.pickupLocation || '',
            PickupLocationId: task.pickupLocationId || null,
            Vehicle: task.vehicle || '',
            VehicleId: task.vehicleId || null,
            Driver: task.driverName || '',
            DriverId: task.driverId || null,
            Status: task.status || '',
            TrailerIn: task.trailerIn || '',
            TrailerInId: task.trailerInId || null,
            ProductEstWeight: productEstWeight,
            WeightUnit: weightUnit,
            ProductType: task.productType || '',
            ProductTypeId: task.productTypeId || null,
            TrailerInType: task.trailerInType || '',
            TrailerInTypeId: task.trailerInTypeId || null,
            ChangeoverLocation: task.changeoverLocation || '',
            ChangeoverLocationId: task.changeoverLocationId || null,
            ChangeoverMessage: task.changeoverMessage || '',
            DeliveryLocation: task.deliveryLocation || '',
            DeliveryLocationId: task.deliveryLocationId || null,
            TrailerOut: task.trailerOut || '',
            TrailerOutId: task.trailerOutId || null,
            TrailerOutType: task.trailerOutType || '',
            ScheduledTime: task.scheduledTime || '',
            CollectionTime: task.collectionTime || '',
            CollectedTime: task.collectedTime || '',
            Notes: task.notes || ''
          };

          plannerSheetDetails.push(detail);
        });

      console.log('📊 Total details to save:', plannerSheetDetails.length);

      // Prepare the request payload
      const payload: any = {
        PlannerSheetMaster: {
          PlannerSheetName: plannerSheetName?.trim() || '',
          PlannerId: plannerId,
          CreatedBy: createdBy,
          IsActive: isActive
        },
        PlannerSheetDetails: plannerSheetDetails
      };
      
      // Add PlannerSheetId if updating existing sheet
      if (plannerSheetId) {
        payload.PlannerSheetMaster.PlannerSheetId = plannerSheetId;
        console.log('🔄 Updating existing planner sheet with ID:', plannerSheetId);
      } else {
        console.log('➕ Creating new planner sheet');
      }

      console.log('📦 Save Payload:', payload);

      // Call the API
      const res: any = await this.templateService.savePlannerWithDetails(payload);
      console.log('✅ Save Response:', res);

      if (res && (res.success || res.result)) {
        const action = plannerSheetId ? 'updated' : 'saved';
        this.utilServ.toaster.next({ 
          type: customToaster.successToast, 
          message: `Planner "${plannerSheetName}" ${action} successfully with ${plannerSheetDetails.length} task(s)!` 
        });
        
        // If this was a new save, update the sheet with the returned plannerSheetId
        if (!plannerSheetId) {
          // Try to extract plannerSheetId from various response formats
          let returnedPlannerSheetId = null;
          
          if (res.result) {
            returnedPlannerSheetId = res.result.plannerSheetId 
              || res.result.PlannerSheetId 
              || res.result.plannerSheetID 
              || res.result.PlannerSheetID;
          }
          
          // If not in result, check if it's directly in response
          if (!returnedPlannerSheetId) {
            returnedPlannerSheetId = res.plannerSheetId 
              || res.PlannerSheetId 
              || res.plannerSheetID 
              || res.PlannerSheetID;
          }
          
          console.log('🔍 Extracted plannerSheetId from response:', returnedPlannerSheetId);
          
          if (returnedPlannerSheetId) {
            const currentSheet = this.plannerPaginator.getActiveSheet();
            if (currentSheet) {
              currentSheet.plannerSheetId = returnedPlannerSheetId;
              console.log('✅ Sheet updated with new plannerSheetId:', returnedPlannerSheetId);
              
              // Also update in sheets array to ensure persistence
              const activeIndex = this.plannerPaginator.activeSheetIndex;
              if (activeIndex >= 0 && this.plannerPaginator.sheets[activeIndex]) {
                this.plannerPaginator.sheets[activeIndex].plannerSheetId = returnedPlannerSheetId;
              }
            }
          } else {
            console.warn('⚠️ No plannerSheetId returned from API. Response:', res);
          }
          
          // Add the new sheet name to existing names list to prevent duplicates in same session
          if (plannerSheetName) {
            this.existingPlannerSheetNames.push(plannerSheetName.toLowerCase().trim());
          }
        }
        
        // Reset dialog state
        this.newPlannerSheetName = '';
        this.isPlannerSheetActive = false;
        this.plannerSheetNameError = '';

        // Optionally clear the data after successful save
        // this.clearAllSheets();
      } else {
        throw new Error(res?.message || 'Failed to save planner');
      }

    } catch (error: any) {
      console.error('❌ Planner Dashboard - Error saving planner:', error);
      
      // Show error message
      const errorMessage = error?.error?.message || error?.message || 'Unknown error occurred';
      this.utilServ.toaster.next({ 
        type: customToaster.errorToast, 
        message: `Failed to save planner: ${errorMessage}` 
      });
    }
  }

  // Clear all sheets (optional helper method)
  clearAllSheets() {
    if (this.plannerPaginator && this.plannerPaginator.sheets) {
      this.plannerPaginator.sheets.forEach((sheet: any) => {
        sheet.data = [];
      });
    }
    this.plannerTaskList = [];
    this.length = 0;
    this.cdr.detectChanges();
  }

  // Dropdown loading methods
  async loadPlannerOptions() {
    try {
      const res: any = await this.templateService.getAllPlanners();
      const dataArray = res?.result || res || [];
      this.plannerOptions = dataArray.map((item: any) => {
        // Try to get full name from various possible fields
        const fullName = item.fullName || item.FullName || 
                        item.plannerFullName || item.PlannerFullName ||
                        (item.firstName && item.lastName ? `${item.firstName} ${item.lastName}`.trim() : null) ||
                        (item.FirstName && item.LastName ? `${item.FirstName} ${item.LastName}`.trim() : null) ||
                        item.plannerName || item.PlannerName || 
                        item.name || item.Name;
        
        return {
          value: item.plannerId || item.PlannerId || item.id || item.ID,
          name: fullName
        };
      });
      console.log(`✓ Loaded ${this.plannerOptions.length} planners`, this.plannerOptions);
    } catch (error) {
      console.error('Error loading planners:', error);
      this.plannerOptions = [];
    }
  }

  async loadCustomerOptions() {
    try {
      const res: any = await this.templateService.getAllCustomers();
      console.log('📦 Customers API Response:', res);
      const dataArray = res?.result || res || [];
      if (dataArray.length > 0) {
        console.log('📋 First customer sample:', dataArray[0]);
      }
      this.customerOptions = dataArray.map((item: any) => ({
        value: item.customerId || item.CustomerId || item.customerID || item.CustomerID || item.id || item.Id || item.ID,
        name: item.customerName || item.CustomerName || item.name || item.Name
      }));
      console.log(`✓ Loaded ${this.customerOptions.length} customers`, this.customerOptions);
    } catch (error) {
      console.error('Error loading customers:', error);
      this.customerOptions = [];
    }
  }

  async loadVehicleOptions() {
    try {
      const res: any = await this.templateService.getAllVehicles();
      const dataArray = res?.result || res || [];
      this.vehicleOptions = dataArray.map((item: any) => ({
        value: item.vehicleId || item.id,
        name: item.vehicleNumber || item.vehicleName || item.name
      }));
      console.log(`✓ Loaded ${this.vehicleOptions.length} vehicles`);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      this.vehicleOptions = [];
    }
  }

  async loadStatusOptions() {
    try {
     // const res: any = await this.templateService.getAllStatuses();
      //let dataArray = res?.result || res || [];
      let dataArray: any[] = [];
      // Add example values if API returns empty data
      if (!dataArray || dataArray.length === 0) {
        dataArray = [
          { statusId: 1, statusName: 'Draft' },  
          { statusId: 7, statusName: 'Cancelled' } 
        ];
        console.log('Using example status values');
      }
      
      this.statusOptions = dataArray.map((item: any) => ({
        value: item.statusId || item.id,
        name: item.statusName || item.name
      }));
      console.log(`✓ Loaded ${this.statusOptions.length} statuses`);
    } catch (error) {
      console.error('Error loading statuses:', error);
      this.statusOptions = [];
    }
  }

  async loadProductTypeOptions() {
    try {
      console.log('🔄 Loading product types...');
      const res: any = await this.templateService.getAllProductTypes();
      console.log('📦 ProductTypes API Response:', res);
      const dataArray = res?.result || res?.data || res || [];
      this.productTypeOptions = dataArray.map((item: any) => ({
        value: item.productTypeID || item.productTypeId || item.ProductTypeID || item.ProductTypeId || item.id || item.ID,
        name: item.productTypeName || item.ProductTypeName || item.name || item.Name || ''
      }));
      console.log(`✓ Loaded ${this.productTypeOptions.length} product types:`, this.productTypeOptions);
    } catch (error) {
      console.error('Error loading product types:', error);
      this.productTypeOptions = [];
    }
  }



  // Import/Export methods
  importExcel() {
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.handleExcelFile(file);
      }
    };
    input.click();
  }

  private handleExcelFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length > 1) {
          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1);
          
          const mappedData = rows.map((row: any, index: number) => ({
            no: row[0] || `${index + 1}`,
            planner: row[1] || 'Current User',
            customer: row[2] || '-',
            product: row[3] || '-',
            pickupLocation: row[4] || '-',
            vehicle: row[5] || '-',
            driverName: row[6] || '-',
            status: row[7] || 'pending',
            trailerIn: row[8] || '-',
            productEstWeight: row[9] || '-',
            productType: row[10] || '-',
            trailerInType: row[11] || '-',
            changeoverLocation: row[12] || '-',
            checked: false
          }));

          this.plannerTaskList.push(...mappedData);
          this.length = this.plannerTaskList.length;
          this.utilServ.toaster.next({ 
            type: customToaster.successToast, 
            message: `Successfully imported ${mappedData.length} tasks from ${file.name}` 
          });
        }
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        this.utilServ.toaster.next({ 
          type: customToaster.errorToast, 
          message: 'Failed to import Excel file' 
        });
      }
    };
    reader.readAsArrayBuffer(file);
  }

  exportToExcel() {
    if (!this.plannerTaskList || this.plannerTaskList.length === 0) {
      this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'No data to export' });
      return;
    }

    try {
      // Export columns in the same order as tableColumns (excluding hidden columns)
      const exportData = this.plannerTaskList.map((item: any) => {
        const row: any = {};
        this.tableColumns
          .filter(col => col.visible)
          .forEach(col => {
            const key = col.key;
            const label = col.label;
            // Map key to item property
            switch(key) {
              case 'no': row[label] = item.no || '-'; break;
              case 'planner': row[label] = item.planner || '-'; break;
              case 'customer': row[label] = item.customer || '-'; break;
              case 'pickupLocation': row[label] = item.pickupLocation || '-'; break;
              case 'product': row[label] = item.product || '-'; break;
              case 'productType': row[label] = item.productType || '-'; break;
              case 'collectionTime': row[label] = item.collectionTime || '-'; break;
              case 'deliveryLocation': row[label] = item.deliveryLocation || '-'; break;
              case 'scheduledTime': row[label] = item.scheduledTime || '-'; break;
              case 'driverName': row[label] = item.driverName || '-'; break;
              case 'vehicle': row[label] = item.vehicle || '-'; break;
              case 'trailerInType': row[label] = item.trailerInType || '-'; break;
              case 'trailerOut': row[label] = item.trailerOut || '-'; break;
              case 'trailerIn': row[label] = item.trailerIn || '-'; break;
              case 'status': row[label] = item.status || '-'; break;
              case 'productEstWeight': row[label] = item.productEstWeight || '-'; break;
              case 'changeoverLocation': row[label] = item.changeoverLocation || '-'; break;
              case 'changeoverMessage': row[label] = item.changeoverMessage || '-'; break;
              case 'notes': row[label] = item.notes || '-'; break;
              case 'taskID': row[label] = item.taskID || '-'; break;
              default: row[label] = item[key] || '-';
            }
          });
        return row;
      });

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Planner Tasks');
      
      const now = new Date();
      const dateStr = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}`;
      const fileName = `planner_tasks_export_${dateStr}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      this.utilServ.toaster.next({ type: customToaster.successToast, message: 'Excel file exported successfully' });
    } catch (error) {
      console.error('Export to Excel failed:', error);
      this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'Failed to export Excel file' });
    }
  }

  exportToCSV() {
    if (!this.plannerTaskList || this.plannerTaskList.length === 0) {
      this.utilServ.toaster.next({ type: customToaster.errorToast, message: 'No data to export' });
      return;
    }

    try {
      // Export columns in the same order as tableColumns (excluding hidden columns)
      const visibleColumns = this.tableColumns.filter(col => col.visible);
      
      const csvData = this.plannerTaskList.map((item: any) => {
        const row: any = {};
        visibleColumns.forEach(col => {
          const key = col.key;
          const label = col.label;
          // Map key to item property
          switch(key) {
            case 'no': row[label] = item.no || '-'; break;
            case 'planner': row[label] = item.planner || '-'; break;
            case 'customer': row[label] = item.customer || '-'; break;
            case 'pickupLocation': row[label] = item.pickupLocation || '-'; break;
            case 'product': row[label] = item.product || '-'; break;
            case 'productType': row[label] = item.productType || '-'; break;
            case 'collectionTime': row[label] = item.collectionTime || '-'; break;
            case 'deliveryLocation': row[label] = item.deliveryLocation || '-'; break;
            case 'scheduledTime': row[label] = item.scheduledTime || '-'; break;
            case 'driverName': row[label] = item.driverName || '-'; break;
            case 'vehicle': row[label] = item.vehicle || '-'; break;
            case 'trailerInType': row[label] = item.trailerInType || '-'; break;
            case 'trailerOut': row[label] = item.trailerOut || '-'; break;
            case 'trailerIn': row[label] = item.trailerIn || '-'; break;
            case 'status': row[label] = item.status || '-'; break;
            case 'productEstWeight': row[label] = item.productEstWeight || '-'; break;
            case 'changeoverLocation': row[label] = item.changeoverLocation || '-'; break;
            case 'changeoverMessage': row[label] = item.changeoverMessage || '-'; break;
            case 'notes': row[label] = item.notes || '-'; break;
            case 'taskID': row[label] = item.taskID || '-'; break;
            default: row[label] = item[key] || '-';
          }
        });
        return row;
      });

      // Use visibleColumns to get headers in correct order
      const headers = visibleColumns.map(col => col.label);
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        const now = new Date();
        const dateStr = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}`;
        link.setAttribute('href', url);
        link.setAttribute('download', `planner_tasks_export_${dateStr}.csv`);
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
  }

  // Get CSS class for status column based on status value
  getStatusClass(status: string): string {
    if (!status) return '';
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'completed':
        return 'status-cell status-completed';
      case 'pending':
        return 'status-cell status-pending';
      case 'draft':
        return 'status-cell status-draft';
      default:
        return 'status-cell';
    }
  }

  // View Timeline for completed task
  viewTimeline(task: any): void {
    console.log('Viewing timeline for task:', task);
    // TODO: Implement timeline view functionality
    // This could open a modal, navigate to a timeline page, or show a sidebar
    this.utilServ.toaster.next({ 
      type: customToaster.infoToast, 
      message: `Opening timeline for task ${task.no || 'N/A'}` 
    });
  }

  // View Documents for completed task
  viewDocuments(task: any): void {
    console.log('Viewing documents for task:', task);
    // TODO: Implement documents view functionality
    // This could open a document viewer, show a list of documents, etc.
    this.utilServ.toaster.next({ 
      type: customToaster.infoToast, 
      message: `Opening documents for task ${task.no || 'N/A'}` 
    });
  }

  // Check if task is completed (more robust checking)
  isTaskCompleted(task: any): boolean {
    if (!task || !task.status) {
      return false;
    }
    
    const status = task.status.toString().toLowerCase().trim();
    console.log('Checking task status:', status, 'for task:', task.no);
    return status === 'completed';
  }

  // Check if any selected tasks are completed
  hasSelectedCompletedTasks(): boolean {
    const checkedTasks = this.getCheckedTasks();
    return checkedTasks.some((task: any) => this.isTaskCompleted(task));
  }

  // View Timeline for all selected completed tasks
  viewTimelineForSelected(): void {
    const completedTasks = this.getCheckedTasks().filter((task: any) => this.isTaskCompleted(task));
    console.log('Viewing timeline for selected completed tasks:', completedTasks);
    
    if (completedTasks.length === 0) {
      this.utilServ.toaster.next({ 
        type: customToaster.warningToast, 
        message: 'No completed tasks selected' 
      });
      return;
    }

    if (completedTasks.length === 1) {
      this.selectedTimelineTask = completedTasks[0];
      this.showTimelineModal = true;
    } else {
      // For multiple tasks, show the first one or implement a selection dialog
      this.selectedTimelineTask = completedTasks[0];
      this.showTimelineModal = true;
      this.utilServ.toaster.next({ 
        type: customToaster.infoToast, 
        message: `Showing timeline for first selected task. ${completedTasks.length} completed tasks selected.` 
      });
    }
  }

  // View Documents for all selected completed tasks
  viewDocumentsForSelected(): void {
    const completedTasks = this.getCheckedTasks().filter((task: any) => this.isTaskCompleted(task));
    console.log('Viewing documents for selected completed tasks:', completedTasks);
    
    if (completedTasks.length === 0) {
      this.utilServ.toaster.next({ 
        type: customToaster.warningToast, 
        message: 'No completed tasks selected' 
      });
      return;
    }

    if (completedTasks.length === 1) {
      this.selectedDocumentsTask = completedTasks[0];
      this.showDocumentsModal = true;
    } else {
      // For multiple tasks, show the first one or implement a selection dialog
      this.selectedDocumentsTask = completedTasks[0];
      this.showDocumentsModal = true;
      this.utilServ.toaster.next({ 
        type: customToaster.infoToast, 
        message: `Showing documents for first selected task. ${completedTasks.length} completed tasks selected.` 
      });
    }
  }

  // Close timeline modal
  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineTask = null;
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
      
      // Initialize pending filters from active filters (copy current selections)
      this.pendingColumnFilters[columnKey] = this.activeColumnFilters[columnKey] 
        ? [...this.activeColumnFilters[columnKey]] 
        : [];
      
      // Position popup near the clicked filter icon
      this.positionFilterPopup(event.target as HTMLElement);
    }
  }
  
  positionFilterPopup(target: HTMLElement): void {
    // Use setTimeout to ensure DOM is updated
    setTimeout(() => {
      const popup = document.querySelector('.column-filter-popup') as HTMLElement;
      if (popup && target) {
        const rect = target.getBoundingClientRect();
        const popupWidth = 280;
        const popupHeight = 400;
        
        // Get menu header height (assuming typical menu header is around 60-80px)
        const menuHeader = document.querySelector('.header, .navbar, .menu-header, .top-nav') as HTMLElement;
        const headerHeight = menuHeader ? menuHeader.offsetHeight : 80; // fallback to 80px
        
        // Calculate position relative to viewport, ensuring it's below menu
        let left = rect.left;
        let top = Math.max(rect.bottom + 8, headerHeight + 20); // Ensure it's below header with margin
        
        // Adjust if popup would go off-screen
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Adjust horizontal position
        if (left + popupWidth > viewportWidth) {
          left = Math.max(8, rect.right - popupWidth);
        }
        
        // Adjust vertical position - if still not enough space, show above the filter icon
        if (top + popupHeight > viewportHeight && rect.top > popupHeight + headerHeight + 20) {
          top = Math.max(headerHeight + 20, rect.top - popupHeight - 8);
        }
        
        // Final check - ensure minimum margins from edges and header
        left = Math.max(8, Math.min(left, viewportWidth - popupWidth - 8));
        top = Math.max(headerHeight + 20, Math.min(top, viewportHeight - popupHeight - 8));
        
        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
      }
    }, 0);
  }

  loadColumnDistinctValues(columnKey: string): void {
    const allValues = this.plannerTaskList
      .map(task => task[columnKey])
      .filter(value => value !== null && value !== undefined && value !== '')
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
    // Use pending filters when popup is open, otherwise use active filters
    if (this.showColumnFilterPopup === columnKey) {
      return this.pendingColumnFilters[columnKey]?.includes(value) || false;
    }
    return this.activeColumnFilters[columnKey]?.includes(value) || false;
  }

  toggleFilterValue(columnKey: string, value: string): void {
    // Work with pending filters (not applied until Apply button is clicked)
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
    // Select all in pending filters
    this.pendingColumnFilters[columnKey] = [...this.getFilteredDistinctValues(columnKey)];
  }

  clearAllFilterValues(columnKey: string): void {
    // Clear pending filters
    this.pendingColumnFilters[columnKey] = [];
  }

  applyColumnFilters(): void {
    // Apply pending filters to active filters
    if (this.showColumnFilterPopup) {
      const columnKey = this.showColumnFilterPopup;
      this.activeColumnFilters[columnKey] = this.pendingColumnFilters[columnKey] 
        ? [...this.pendingColumnFilters[columnKey]] 
        : [];
    }
    this.showColumnFilterPopup = null;
  }

  cancelColumnFilter(): void {
    // Discard pending filters (don't apply changes)
    if (this.showColumnFilterPopup) {
      delete this.pendingColumnFilters[this.showColumnFilterPopup];
    }
    this.showColumnFilterPopup = null;
  }

  closeColumnFilterPopup(): void {
    // Discard pending filters when closing via X button (same as cancel)
    if (this.showColumnFilterPopup) {
      delete this.pendingColumnFilters[this.showColumnFilterPopup];
    }
    this.showColumnFilterPopup = null;
  }

  getColumnLabel(columnKey: string): string {
    const column = this.tableColumns.find(col => col.key === columnKey);
    return column ? column.label : columnKey;
  }

  // Sheet management methods
  /* 
  // Sheet management methods - commented out since custom paginator handles internally
  onSheetAdded(event: any): void {
    console.log('Adding new sheet:', event);
    
    // Handle different event formats from custom paginator
    const sheetName = typeof event === 'string' ? event : (event?.sheetName || `Sheet ${this.nextSheetId}`);
    
    const newSheet = {
      id: `sheet${this.nextSheetId}`,
      name: sheetName,
      isActive: false,
      data: []
    };
    
    this.sheets.push(newSheet);
    this.nextSheetId++;
    
    // Switch to the new sheet
    this.onSheetChanged(this.sheets.length - 1);
    
    this.utilServ.toaster.next({ 
      type: customToaster.successToast, 
      message: `Sheet "${sheetName}" created successfully` 
    });
  }

  onSheetRenamed(event: any): void {
    console.log('Renaming sheet:', event);
    
    // Handle different event formats
    let sheetId: string;
    let newName: string;
    
    if (typeof event === 'object' && event.sheetId && event.newName) {
      sheetId = event.sheetId;
      newName = event.newName;
    } else {
      // Fallback - use current selected sheet
      sheetId = this.selectedSheetId;
      newName = event?.newName || event || 'Renamed Sheet';
    }
    
    const sheet = this.sheets.find(s => s.id === sheetId);
    if (sheet) {
      const oldName = sheet.name;
      const normalizedNewName = newName.toLowerCase().trim();
      const normalizedOldName = oldName.toLowerCase().trim();
      
      // If name hasn't changed, just return silently
      if (normalizedNewName === normalizedOldName) {
        return;
      }
      
      // Validate new name is not empty
      if (!newName || newName.trim() === '') {
        this.utilServ.toaster.next({ 
          type: customToaster.errorToast, 
          message: 'Sheet name cannot be empty. Please provide a valid name.' 
        });
        // Revert the name in paginator if it was changed
        if (this.plannerPaginator) {
          const paginatorSheet = this.plannerPaginator.sheets.find((s: any) => s.id === sheetId);
          if (paginatorSheet) {
            paginatorSheet.name = oldName;
            this.cdr.detectChanges();
          }
        }
        return;
      }
      
      // Check if new name already exists in existing planner sheet names (excluding current sheet's old name)
      const existingNamesExcludingCurrent = this.existingPlannerSheetNames.filter(
        name => name !== normalizedOldName
      );
      
      if (existingNamesExcludingCurrent.includes(normalizedNewName)) {
        this.utilServ.toaster.next({ 
          type: customToaster.errorToast, 
          message: `A planner sheet with the name "${newName}" already exists. Please choose a different name.` 
        });
        // Revert the name in paginator
        if (this.plannerPaginator) {
          const paginatorSheet = this.plannerPaginator.sheets.find((s: any) => s.id === sheetId);
          if (paginatorSheet) {
            paginatorSheet.name = oldName;
            this.cdr.detectChanges();
          }
        }
        return;
      }
      
      // Update sheet name
      sheet.name = newName;
      
      // Update existingPlannerSheetNames: remove old name and add new name
      const oldNameIndex = this.existingPlannerSheetNames.indexOf(normalizedOldName);
      if (oldNameIndex > -1) {
        this.existingPlannerSheetNames.splice(oldNameIndex, 1);
      }
      this.existingPlannerSheetNames.push(normalizedNewName);
      
      this.utilServ.toaster.next({ 
        type: customToaster.successToast, 
        message: `Sheet renamed from "${oldName}" to "${newName}"` 
      });
    }
  }

  onSheetDeleted(event: any): void {
    console.log('Deleting sheet:', event);
    
    // Handle different event formats
    const sheetId = typeof event === 'string' ? event : (event?.sheetId || this.selectedSheetId);
    
    if (this.sheets.length <= 1) {
      this.utilServ.toaster.next({ 
        type: customToaster.warningToast, 
        message: 'Cannot delete the last sheet' 
      });
      return;
    }
    
    const sheetIndex = this.sheets.findIndex(s => s.id === sheetId);
    const sheetName = this.sheets[sheetIndex]?.name;
    
    if (sheetIndex > -1) {
      this.sheets.splice(sheetIndex, 1);
      
      // If deleted sheet was active, switch to first available sheet
      if (this.selectedSheetId === sheetId) {
        this.onSheetChanged(0);
      }
      
      this.utilServ.toaster.next({ 
        type: customToaster.successToast, 
        message: `Sheet "${sheetName}" deleted successfully` 
      });
    }
  }

  loadSheetData(sheetId: string): void {
    // In a real implementation, you would load data from backend based on sheetId
    // For demo purposes, we'll keep the same data
    console.log('Loading data for sheet:', sheetId);
    
    // You can implement different data loading logic per sheet here
    // this.plannerTaskList = await this.loadTasksForSheet(sheetId);
  }

  getSheetName(sheetId: string): string {
    const sheet = this.sheets.find(s => s.id === sheetId);
    return sheet ? sheet.name : 'Unknown Sheet';
  }
  */

  // Handle sheet deletion from paginator
  onSheetDeleted(event: any): void {
    console.log('PlannerDashboard - Sheet deleted:', event);
    
    // Extract sheet information from event
    const deletedSheet = event;
    const sheetId = deletedSheet?.id;
    const sheetName = deletedSheet?.name || 'Unknown Sheet';
    const plannerSheetId = deletedSheet?.plannerSheetId;
    
    // Remove the sheet from openPlannerSheetIds if it's tracked
    if (plannerSheetId && this.openPlannerSheetIds) {
      this.openPlannerSheetIds.delete(plannerSheetId);
      console.log('PlannerDashboard - Removed planner sheet ID from tracking:', plannerSheetId);
    }
    
    // If the deleted sheet was the active sheet, clear the table data
    if (this.plannerPaginator && this.plannerPaginator.sheets.length === 0) {
      // All sheets deleted - clear the entire task list
      this.plannerTaskList = [];
      this.length = 0;
    } else if (this.plannerPaginator) {
      // Update the task list to show data from the new active sheet
      const activeSheet = this.plannerPaginator.getActiveSheet();
      if (activeSheet) {
        this.plannerTaskList = activeSheet.data || [];
        this.length = this.plannerTaskList.length;
        console.log('PlannerDashboard - Switched to sheet:', activeSheet.name, 'with', this.plannerTaskList.length, 'tasks');
      } else {
        // No active sheet - clear the table
        this.plannerTaskList = [];
        this.length = 0;
      }
    }
    
    // Force change detection to update the view
    this.cdr.detectChanges();
    
    // Show success notification
    this.utilServ.toaster.next({ 
      type: customToaster.successToast, 
      message: `Sheet "${sheetName}" deleted successfully` 
    });
  }

  // Live Status Sidebar
  toggleLiveStatus(): void {
    this.showLiveStatusSidebar = !this.showLiveStatusSidebar;
    
    if (this.showLiveStatusSidebar && this.plannerTaskList.length > 0) {
      // Set first task as selected by default
      this.selectedLiveStatusTask = this.plannerTaskList[0];
    }
  }

  closeLiveStatusSidebar(): void {
    this.showLiveStatusSidebar = false;
    this.selectedLiveStatusTask = null;
  }

  clearLiveStatusSearch(): void {
    this.liveStatusSearchText = '';
  }

  previousMonth(): void {
    if (this.currentLiveStatusMonth === 'October') {
      this.currentLiveStatusMonth = 'September';
    }
    // Add more month navigation logic as needed
  }

  nextMonth(): void {
    if (this.currentLiveStatusMonth === 'October') {
      this.currentLiveStatusMonth = 'November';
    }
    // Add more month navigation logic as needed
  }

  // Planner Paginator Event Handlers
  onPageChange(event: any): void {
    console.log('Planner Dashboard - Page changed:', event);
    // Handle page change logic here
  }

  onSheetSelected(sheet: any): void {
    console.log('Planner Dashboard - Sheet selected:', sheet);
    
    // Save current sheet data before switching (deep copy to avoid reference issues)
    if (this.plannerPaginator && this.currentSheetId) {
      const currentSheet = this.plannerPaginator.sheets.find((s: any) => s.id === this.currentSheetId);
      if (currentSheet) {
        // Deep copy to avoid shared references between sheets
        currentSheet.data = JSON.parse(JSON.stringify(this.plannerTaskList));
        console.log('Planner Dashboard - Saved data for sheet:', this.currentSheetId, 'Data count:', currentSheet.data.length);
      }
    }
    
    // Load data for the selected sheet (deep copy to avoid reference issues)
    if (sheet && sheet.data && sheet.data.length > 0) {
      // Deep copy to ensure this sheet's data is independent
      this.plannerTaskList = JSON.parse(JSON.stringify(sheet.data));
      this.length = this.plannerTaskList.length;
      console.log('Planner Dashboard - Loaded data for sheet:', sheet.id, 'Data count:', this.plannerTaskList.length);
    } else {
      // Empty sheet - show empty grid
      this.plannerTaskList = [];
      this.length = 0;
      console.log('Planner Dashboard - Showing empty grid for sheet:', sheet.id);
    }
    
    this.currentSheetId = sheet.id;
    this.cdr.detectChanges();
  }

  onSheetAdded(sheet: any): void {
    console.log('Planner Dashboard - Sheet added:', sheet);
    
    // Save current sheet data before switching to new sheet (deep copy)
    if (this.plannerPaginator && this.currentSheetId) {
      const currentSheet = this.plannerPaginator.sheets.find((s: any) => s.id === this.currentSheetId);
      if (currentSheet) {
        currentSheet.data = JSON.parse(JSON.stringify(this.plannerTaskList));
        console.log('Planner Dashboard - Saved data before adding new sheet:', currentSheet.data.length);
      }
    }
    
    // When a new sheet is added, clear the task list to show empty grid
    this.plannerTaskList = [];
    this.length = 0;
    this.currentSheetId = sheet.id;
    this.cdr.detectChanges();
    
    this.utilServ.toaster.next({ 
      type: customToaster.successToast, 
      message: `New sheet "${sheet.name}" created` 
    });
  }

  onSheetSaved(sheet: any): void {
    console.log('Planner Dashboard - Sheet save requested:', sheet);
    console.log('🔍 Sheet plannerSheetId:', sheet.plannerSheetId, '| PlannerSheetId:', sheet.PlannerSheetId, '| plannerSheetID:', sheet.plannerSheetID);
    
    // Check if sheet has plannerSheetId (already saved) - check multiple property name variations
    const existingSheetId = sheet.plannerSheetId || sheet.PlannerSheetId || sheet.plannerSheetID || sheet.PlannerSheetID || null;
    
    if (existingSheetId) {
      console.log('📝 Updating existing planner sheet with ID:', existingSheetId);
      // For existing sheets, validate the name if it was renamed
      this.validateAndSaveExistingSheet(sheet.name, existingSheetId, sheet.originalName);
    } else {
      console.log('➕ Creating new planner sheet:', sheet.name);
      // New sheet - validate name first, then save or prompt for new name
      this.validateAndSaveNewSheet(sheet.name);
    }
  }

  // Validate sheet name for existing planner sheet and save
  async validateAndSaveExistingSheet(sheetName: string, plannerSheetId: number, originalName?: string): Promise<void> {
    // Refresh existing names before validation
    await this.loadExistingPlannerSheetNames();
    
    console.log('📋 Validating existing sheet rename...');
    console.log('📋 New name:', sheetName);
    console.log('📋 Original name:', originalName);
    console.log('📋 Existing names:', this.existingPlannerSheetNames);
    
    const normalizedNewName = sheetName.toLowerCase().trim();
    const normalizedOriginalName = (originalName || '').toLowerCase().trim();
    
    // If name hasn't changed, just save
    if (normalizedNewName === normalizedOriginalName) {
      console.log('✅ Name unchanged, proceeding with save');
      this.savePlannerWithDetails(sheetName, plannerSheetId);
      return;
    }
    
    // Check if new name conflicts with another existing sheet (excluding original name)
    const existingNamesExcludingCurrent = this.existingPlannerSheetNames.filter(
      name => name !== normalizedOriginalName
    );
    
    if (existingNamesExcludingCurrent.includes(normalizedNewName)) {
      // Name is duplicate, show dialog with error
      console.log('❌ Duplicate name found, showing dialog');
      this.newPlannerSheetName = sheetName;
      this.isPlannerSheetActive = false;
      this.sheetNameValidationPassed = false;
      this.plannerSheetNameError = `A planner sheet with the name "${sheetName}" already exists. Please choose a different name.`;
      this.showSavePlannerDialog = true;
      
      // Store the plannerSheetId for when user confirms with new name
      (this as any).pendingPlannerSheetId = plannerSheetId;
      (this as any).pendingOriginalName = originalName;
      
      this.utilServ.toaster.next({ 
        type: customToaster.errorToast, 
        message: `A planner sheet with the name "${sheetName}" already exists. Please choose a different name.` 
      });
    } else {
      // Name is valid, proceed with save
      console.log('✅ Name is unique, proceeding with save');
      this.savePlannerWithDetails(sheetName, plannerSheetId);
    }
  }

  // Validate sheet name and save, or show dialog if name is duplicate
  async validateAndSaveNewSheet(sheetName: string): Promise<void> {
    // Refresh existing names before validation
    await this.loadExistingPlannerSheetNames();
    
    console.log('📋 Loaded existing names for validation:', this.existingPlannerSheetNames);
    console.log('🔍 Checking sheet name:', sheetName);
    
    // Validate the sheet name
    if (sheetName && this.validatePlannerSheetName(sheetName)) {
      // Name is valid, proceed with save
      this.savePlannerWithDetails(sheetName);
    } else {
      // Name is invalid (duplicate or empty), show dialog with error
      this.newPlannerSheetName = sheetName || '';
      this.isPlannerSheetActive = false;
      this.sheetNameValidationPassed = false;
      // Set error message if it's a duplicate
      if (sheetName && sheetName.trim() !== '') {
        this.plannerSheetNameError = 'A planner sheet with this name already exists. Please choose a different name.';
      } else {
        this.plannerSheetNameError = 'Sheet name is required';
      }
      this.showSavePlannerDialog = true;
    }
  }

  onSheetClosed(sheet: any): void {
    console.log('Planner Dashboard - Sheet closed:', sheet);
    
    // Remove the closed sheet from openPlannerSheetIds to uncheck in dropdown
    // Check multiple possible property names for the planner sheet ID
    const closedSheetId = Number(
      sheet.plannerSheetId || 
      sheet.PlannerSheetId || 
      sheet.plannerSheetID || 
      sheet.PlannerSheetID ||
      // Also check if the id itself is a numeric planner sheet ID (not a generated one)
      (sheet.id && !String(sheet.id).startsWith('planner-sheet-') ? sheet.id : 0) ||
      0
    );
    
    console.log('📋 Attempting to remove sheet ID:', closedSheetId, 'from openPlannerSheetIds:', Array.from(this.openPlannerSheetIds));
    
    if (closedSheetId !== 0 && this.openPlannerSheetIds.has(closedSheetId)) {
      this.openPlannerSheetIds.delete(closedSheetId);
      console.log('📋 Successfully removed from openPlannerSheetIds:', closedSheetId, 'Remaining:', Array.from(this.openPlannerSheetIds));
    } else {
      console.log('📋 Sheet ID not found in openPlannerSheetIds or is 0');
    }
    
    // Clear the task list if the closed sheet was the active one
    // The paginator already handles switching to another sheet
    // We just need to update our local task list to match the new active sheet
    if (this.plannerPaginator && this.plannerPaginator.sheets.length > 0) {
      const activeSheet = this.plannerPaginator.getActiveSheet();
      if (activeSheet) {
        this.plannerTaskList = JSON.parse(JSON.stringify(activeSheet.data || []));
        this.length = this.plannerTaskList.length;
        console.log('Planner Dashboard - Switched to sheet:', activeSheet.name, 'with', this.plannerTaskList.length, 'tasks');
      }
    } else {
      // No sheets left, clear task list
      this.plannerTaskList = [];
      this.length = 0;
    }
    
    this.cdr.detectChanges();
  }

  // Close documents modal
  closeDocumentsModal(): void {
    this.showDocumentsModal = false;
    this.selectedDocumentsTask = null;
  }

  // View individual image
  viewImage(document: any): void {
    console.log('Viewing image:', document);
    this.utilServ.toaster.next({ 
      type: customToaster.infoToast, 
      message: `Opening ${document.name}.${document.type}` 
    });
    // TODO: Implement image viewer functionality
  }

  // Download all images
  downloadImages(): void {
    console.log('Downloading all images for task:', this.selectedDocumentsTask?.no);
    this.utilServ.toaster.next({ 
      type: customToaster.successToast, 
      message: `Downloading ${this.documentsList.length} images` 
    });
    // TODO: Implement bulk download functionality
  }

  // Get planner initials for display
  getPlannerInitials(plannerName: string): string {
    if (!plannerName) return '';
    
    const names = plannerName.trim().split(' ');
    if (names.length === 1) {
      // Single name - take first two characters
      return names[0].substring(0, 2).toUpperCase();
    } else {
      // Multiple names - take first letter of each name (max 2)
      return names.slice(0, 2).map(name => name.charAt(0).toUpperCase()).join('');
    }
  }

  // Save Planner Dialog methods
  confirmSavePlannerSheet(): void {
    console.log('🔘 confirmSavePlannerSheet called');
    console.log('📝 newPlannerSheetName:', this.newPlannerSheetName);
    
    if (this.newPlannerSheetName && this.newPlannerSheetName.trim() !== '') {
      // Validate for duplicate names
      console.log('🔍 Validating sheet name...');
      if (this.validatePlannerSheetName(this.newPlannerSheetName)) {
        console.log('✅ Validation passed, setting flags and closing dialog');
        this.sheetNameValidationPassed = true;
        this.showSavePlannerDialog = false;
        
        // Check if we're updating an existing sheet (has pending plannerSheetId)
        const pendingSheetId = (this as any).pendingPlannerSheetId;
        
        // Update the sheet name in the paginator if we have a pending sheet ID
        if (pendingSheetId && this.plannerPaginator) {
          const sheet = this.plannerPaginator.sheets.find((s: any) => 
            s.plannerSheetId === pendingSheetId || 
            s.PlannerSheetId === pendingSheetId || 
            s.plannerSheetID === pendingSheetId
          );
          if (sheet) {
            console.log('📝 Updating sheet name in paginator from:', sheet.name, 'to:', this.newPlannerSheetName);
            sheet.name = this.newPlannerSheetName;
            sheet.originalName = this.newPlannerSheetName; // Update original name after successful rename
            this.cdr.detectChanges();
          }
        }
        
        // Directly call save with the validated name
        console.log('💾 Calling savePlannerWithDetails with name:', this.newPlannerSheetName, 'pendingSheetId:', pendingSheetId);
        this.savePlannerWithDetails(this.newPlannerSheetName, pendingSheetId || undefined);
        
        // Clear pending values
        (this as any).pendingPlannerSheetId = null;
        (this as any).pendingOriginalName = null;
      } else {
        console.log('❌ Validation failed, keeping dialog open');
        this.sheetNameValidationPassed = false;
      }
      // If validation fails, error message is set by validatePlannerSheetName
    } else {
      console.log('❌ Sheet name is empty');
      this.plannerSheetNameError = 'Sheet name is required';
      this.sheetNameValidationPassed = false;
    }
  }

  // Called when user types in the sheet name input to clear error
  onSheetNameInput(): void {
    if (this.plannerSheetNameError) {
      this.plannerSheetNameError = '';
    }
  }

  cancelSavePlannerSheet(): void {
    this.newPlannerSheetName = '';
    this.isPlannerSheetActive = false;
    this.plannerSheetNameError = '';
    this.sheetNameValidationPassed = false;
    this.showSavePlannerDialog = false;
    
    // Clear pending values
    (this as any).pendingPlannerSheetId = null;
    (this as any).pendingOriginalName = null;
  }

}
