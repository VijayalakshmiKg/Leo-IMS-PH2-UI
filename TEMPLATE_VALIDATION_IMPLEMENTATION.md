# Template Data Validation & Upload Implementation Guide

## Overview
This implementation provides a comprehensive solution for validating template data with ID/Name management, customer-dependent cascading dropdowns, and multi-layer validation.

---

## 1. Database Design Recommendation

### ✅ **SAVE ONLY IDs IN DATABASE**

**TemplateDetails Table Structure:**
```sql
CREATE TABLE TemplateDetails (
    Sno INT,
    SheetName VARCHAR(100),
    PlannerID INT,              -- Foreign Key to Planner
    CustomerID INT,             -- Foreign Key to Customer
    ProductID INT,              -- Foreign Key to Product
    PickupLocationID INT,       -- Foreign Key to Location
    VehicleID INT,              -- Foreign Key to Vehicle
    DriverID INT,               -- Foreign Key to Driver
    StatusID INT,               -- Foreign Key to Status
    TrailerInID INT,            -- Foreign Key to Trailer
    ProductTypeID INT,          -- Foreign Key to ProductType
    TrailerInTypeID INT,        -- Foreign Key to TrailerType
    ChangeoverLocationID INT,   -- Foreign Key to Location
    DeliveryLocationID INT,     -- Foreign Key to Location
    TrailerOutID INT,           -- Foreign Key to Trailer
    TrailerOutTypeID INT,       -- Foreign Key to TrailerType
    ProductEstWeight DECIMAL,
    WeightUnit VARCHAR(10),
    ChangeoverMessage VARCHAR(500),
    ScheduledTime DATETIME,
    CollectionTime DATETIME,
    CollectedTime DATETIME,
    Notes VARCHAR(1000)
)
```

**Benefits:**
- ✅ Data normalization (single source of truth)
- ✅ Data integrity (names can change, IDs remain constant)
- ✅ Storage efficiency (IDs are smaller than names)
- ✅ Foreign key constraints for referential integrity
- ✅ Easier data updates (update master table, all references update)

---

## 2. Data Flow Architecture

### UI Data Model (Both ID and Name)
```typescript
{
  planner: 'John Smith',          // Display in grid
  plannerId: 123,                 // Use for save/validation
  
  customer: 'ABC Company',
  customerId: 456,
  
  product: 'Steel Coils',
  productId: 789,
  // ... etc for all fields
}
```

### Backend API Payload (IDs Only)
```typescript
{
  PlannerID: 123,
  CustomerID: 456,
  ProductID: 789,
  // ... etc
}
```

---

## 3. Validation Strategy - Multi-Layer Approach

### Layer 1: **Import Validation** (Immediate)
**When:** As soon as Excel file is imported
**What:** Validate all names against dropdown options, enrich with IDs
**Result:** Flag invalid rows, show validation summary

```typescript
onImportCompleted(event) {
  // Validate each row
  const validatedData = sheet.data.map((row, index) => 
    this.validateAndEnrichRow(row, index, sheet.name)
  );
  
  // Show summary
  this.showValidationSummary();
}
```

### Layer 2: **Edit Validation** (Real-time)
**When:** User edits a cell
**What:** Dropdown only shows valid options, automatically sets ID
**Result:** Prevents invalid data entry

```typescript
onDropdownChange(rowIndex, field, selectedId) {
  // Update both ID and name
  row[mapping.idField] = selected.value;
  row[mapping.nameField] = selected.name;
  
  // Clear validation error
  this.validationErrors.delete(rowKey);
}
```

### Layer 3: **Save Validation** (Final Check)
**When:** Before saving template
**What:** Verify no validation errors remain
**Result:** Warn user about invalid rows, allow save with NULLs or cancel

```typescript
saveTemplate() {
  if (this.validationErrors.size > 0) {
    confirm('There are validation errors. Continue?');
  }
}
```

---

## 4. Customer-Dependent Cascading Dropdowns

### Mapping Rules:
When customer is selected, these dropdowns reload:

| Dropdown | API Endpoint | Mapping Table |
|----------|--------------|---------------|
| Product | `/Planner/GetProductsByCustomerId` | CustomerProductMapping |
| Pickup Location | `/Planner/GetLocationsByCustomerId` | CustomerLocationMapping |
| Driver | `/Planner/GetDriversByCustomerId` | CustomerDriverMapping |
| Trailer In | `/Planner/GetTrailerInsByCustomerId` | CustomerTrailerInMapping |
| Trailer In Type | `/Planner/GetTrailerInTypesByCustomerId` | CustomerTrailerInTypeMapping |
| Changeover Location | `/Planner/GetLocationsByCustomerId` | CustomerLocationMapping |
| Delivery Location | `/Planner/GetLocationsByCustomerId` | CustomerLocationMapping |
| Trailer Out | `/Planner/GetTrailerOutsByCustomerId` | CustomerTrailerOutMapping |
| Trailer Out Type | `/Planner/GetTrailerOutTypesByCustomerId` | CustomerTrailerOutTypeMapping |

### Master Data (Not Customer-Dependent):
- **Vehicle**: All vehicles from master table
- **Status**: All statuses from master table
- **Product Type**: All product types from master table
- **Planner**: All planners/employees
- **Weight Unit**: Static options (kg, g, ton, lb, oz)

---

## 5. HTML Template Implementation

### Example: Editable Cell with Dropdown (Customer Field)

```html
<!-- Display mode -->
<td *ngIf="editingCell.rowIndex !== i || editingCell.field !== 'customer'" 
    (click)="startEdit(i, 'customer', $event)"
    [class.validation-error]="hasValidationError(i, 'customer')"
    [title]="getValidationError(i)">
  {{ getDisplayValue(template, 'customer') }}
</td>

<!-- Edit mode -->
<td *ngIf="editingCell.rowIndex === i && editingCell.field === 'customer'">
  <select 
    [(ngModel)]="template.customerId"
    (change)="onDropdownChange(i, 'customer', template.customerId)"
    (blur)="stopEdit()"
    class="form-control"
    autofocus>
    <option value="">-- Select Customer --</option>
    <option *ngFor="let option of customerOptions" 
            [value]="option.value">
      {{ option.name }}
    </option>
  </select>
</td>
```

### Example: Editable Cell with Dropdown (Product - Customer Dependent)

```html
<!-- Display mode -->
<td *ngIf="editingCell.rowIndex !== i || editingCell.field !== 'product'" 
    (click)="startEdit(i, 'product', $event)"
    [class.validation-error]="hasValidationError(i, 'product')"
    [title]="getValidationError(i)">
  {{ getDisplayValue(template, 'product') }}
</td>

<!-- Edit mode -->
<td *ngIf="editingCell.rowIndex === i && editingCell.field === 'product'">
  <select 
    [(ngModel)]="template.productId"
    (change)="onDropdownChange(i, 'product', template.productId)"
    (blur)="stopEdit()"
    class="form-control"
    [disabled]="!template.customerId"
    autofocus>
    <option value="">-- Select Product --</option>
    <option *ngFor="let option of productOptions" 
            [value]="option.value">
      {{ option.name }}
    </option>
  </select>
  <small *ngIf="!template.customerId" class="text-muted">
    Select customer first
  </small>
</td>
```

### CSS for Validation Errors

```css
/* Add to template-home.component.css */

.validation-error {
  background-color: #ffe6e6 !important;
  border: 1px solid #ff4444 !important;
  position: relative;
}

.validation-error::after {
  content: '⚠';
  position: absolute;
  top: 2px;
  right: 2px;
  color: #ff4444;
  font-size: 14px;
}

td.validation-error {
  cursor: help;
}
```

---

## 6. API Endpoints Summary

### Backend APIs Required:

```csharp
// Master Data APIs
GET /Planner/GetAllPlanners
GET /Planner/GetAllCustomers
GET /Planner/GetAllVehicles
GET /Planner/GetAllStatuses
GET /Planner/GetAllProductTypes

// Customer-Dependent Mapping APIs
GET /Planner/GetProductsByCustomerId?customerId={id}
GET /Planner/GetLocationsByCustomerId?customerId={id}
GET /Planner/GetDriversByCustomerId?customerId={id}
GET /Planner/GetTrailerInsByCustomerId?customerId={id}
GET /Planner/GetTrailerInTypesByCustomerId?customerId={id}
GET /Planner/GetTrailerOutsByCustomerId?customerId={id}
GET /Planner/GetTrailerOutTypesByCustomerId?customerId={id}

// Template Operations
GET /Planner/GetAllTemplatesByEmployeeId?employeeId={id}
GET /Planner/ValidateTemplateName?templateName={name}
POST /Planner/SaveTemplateWithDetails
```

### Expected API Response Format:

```json
{
  "success": true,
  "result": [
    {
      "customerId": 123,
      "customerName": "ABC Company"
    },
    {
      "customerId": 456,
      "customerName": "XYZ Corporation"
    }
  ]
}
```

---

## 7. Implementation Checklist

### ✅ **Completed in TypeScript:**
- [x] Field mappings for ID/Name pairs
- [x] Validation error tracking (Map)
- [x] validateAndEnrichRow method
- [x] showValidationSummary method
- [x] onDropdownChange handler
- [x] loadCustomerDependentData method
- [x] clearInvalidCustomerDependentFields method
- [x] startEdit with customer-dependent loading
- [x] saveTemplateToBackend with IDs only
- [x] Master data loading (planners, customers, vehicles, etc.)
- [x] Customer-dependent data loading (products, locations, drivers, trailers)
- [x] Helper methods (findOptionByName, findOptionById, getDisplayValue)
- [x] Validation helper methods (hasValidationError, getValidationError)

### 🔨 **TODO - HTML Template Updates:**
- [ ] Update all editable cells to bind to ID fields (not names)
- [ ] Add `(change)="onDropdownChange()"` to all dropdowns
- [ ] Add validation error classes `[class.validation-error]`
- [ ] Add validation error tooltips `[title]="getValidationError(i)"`
- [ ] Disable customer-dependent dropdowns when no customer selected
- [ ] Add CSS for validation error styling

### 🔨 **TODO - Backend API Implementation:**
- [ ] Implement customer-dependent mapping APIs
- [ ] Ensure SaveTemplateWithDetails accepts ID fields (not names)
- [ ] Add proper error handling and logging
- [ ] Test all API endpoints

---

## 8. Testing Scenarios

### Test Case 1: Import with Valid Data
1. Import Excel with valid names
2. ✅ All rows should be enriched with IDs
3. ✅ No validation errors
4. ✅ Success message shows "X/X rows validated"

### Test Case 2: Import with Invalid Data
1. Import Excel with some invalid names
2. ⚠️ Validation summary should show errors
3. ⚠️ Invalid rows highlighted in red
4. ⚠️ Tooltips show specific errors

### Test Case 3: Customer Change Cascade
1. Select a customer in a row
2. ✅ All dependent dropdowns reload
3. ✅ Previously invalid selections are cleared
4. ✅ Only customer-specific options show

### Test Case 4: Save with Validation Errors
1. Attempt to save with invalid rows
2. ⚠️ Confirmation dialog appears
3. ✅ Can save with NULLs or cancel

### Test Case 5: Edit Cell Validation
1. Click to edit a cell
2. ✅ Only valid options show in dropdown
3. ✅ Selecting option updates both ID and name
4. ✅ Validation error clears immediately

---

## 9. Performance Optimization

### Data Loading Strategy:
1. **On Component Init:**
   - Load master data (planners, customers, vehicles, statuses, product types)
   - ~5 parallel API calls

2. **On Import:**
   - Validate against loaded master data
   - No additional API calls needed

3. **On Customer Selection:**
   - Load customer-dependent data
   - ~7 parallel API calls
   - Cache per customer ID (optional)

4. **On Edit:**
   - Reuse cached dropdown data
   - Only reload if customer changed

### Caching Strategy (Optional):
```typescript
customerDataCache: Map<number, {
  products: any[],
  locations: any[],
  drivers: any[],
  // ... etc
}> = new Map();
```

---

## 10. Error Handling

### Import Errors:
- Show warning toast with error count
- Console log detailed errors
- Allow user to continue with partial data

### API Errors:
- Log to console
- Show user-friendly error toast
- Set dropdown to empty array (prevents crashes)
- Allow retry

### Validation Errors:
- Highlight invalid rows visually
- Show tooltips with specific issues
- Allow save with warnings (user confirms)

---

## Summary

This implementation provides:

1. ✅ **ID-only database storage** (recommended best practice)
2. ✅ **Multi-layer validation** (import, edit, save)
3. ✅ **Customer-dependent cascading** (proper data relationships)
4. ✅ **Dropdown pre-selection** (correct values when editing)
5. ✅ **Visual validation feedback** (red highlights, tooltips)
6. ✅ **Data integrity** (only valid IDs saved to database)

**Next Steps:**
1. Update HTML template with dropdown bindings
2. Add CSS for validation error styling
3. Implement backend APIs
4. Test all scenarios
5. Deploy and monitor

