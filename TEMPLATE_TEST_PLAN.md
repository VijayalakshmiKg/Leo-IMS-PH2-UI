# Template Validation & Upload - Test Plan

## Test Environment Setup

### Prerequisites:
1. ✅ Angular development server running
2. ✅ Backend APIs implemented and accessible
3. ✅ Sample Excel files prepared (valid and invalid data)
4. ✅ Test customer with mapped data in database
5. ✅ Browser DevTools console open for debugging

---

## Test Suite 1: Import Validation

### Test Case 1.1: Import Valid Data
**Objective:** Verify that valid Excel data is imported and enriched with IDs

**Steps:**
1. Prepare Excel file with valid names:
   - Planner: "John Smith" (exists in database)
   - Customer: "ABC Company" (exists in database)
   - Product: "Steel Coils" (mapped to ABC Company)
   - etc.
2. Click "Import excel sheet" → "Weekly Template"
3. Select the prepared Excel file
4. Observe import process

**Expected Results:**
- ✅ All sheets imported successfully
- ✅ Toast message shows: "X sheet(s) imported! X/X rows validated successfully"
- ✅ No red highlighted cells
- ✅ Console shows: "✓ Template list updated successfully"
- ✅ Save Template button appears
- ✅ Each row has both ID and name properties populated

**Validation:**
```javascript
// Check in browser console
console.log(templateList[0]);
// Should show:
// {
//   planner: "John Smith",
//   plannerId: 123,
//   customer: "ABC Company", 
//   customerId: 456,
//   ...
// }
```

---

### Test Case 1.2: Import Invalid Data
**Objective:** Verify that invalid names are flagged during import

**Steps:**
1. Prepare Excel file with some invalid names:
   - Row 1: Planner: "Invalid Person" (does NOT exist)
   - Row 2: Customer: "XYZ Company" (valid)
   - Row 3: Product: "Non-existent Product" (invalid)
2. Import the file
3. Check validation summary

**Expected Results:**
- ⚠️ Toast message shows: "X sheet(s) imported! Y/X rows validated successfully" (where Y < X)
- ⚠️ Console shows warning with validation errors
- ⚠️ Invalid cells highlighted in red
- ⚠️ Warning icon (⚠) appears in invalid cells
- ⚠️ Hovering shows tooltip with error message
- ✅ Valid cells have both ID and name
- ✅ Invalid cells have name but NULL ID

**Validation:**
```javascript
// Check in console
console.log(component.validationErrors);
// Should show Map with error messages like:
// "sheet_0_0" => ["Invalid planner: \"Invalid Person\""]
```

---

### Test Case 1.3: Import Empty/Missing Data
**Objective:** Verify handling of empty cells

**Steps:**
1. Prepare Excel with empty cells
2. Import file
3. Check handling

**Expected Results:**
- ✅ Empty cells display as "-"
- ✅ No validation errors for empty fields
- ✅ NULL IDs for empty fields

---

## Test Suite 2: Customer-Dependent Cascade

### Test Case 2.1: Select Customer in New Row
**Objective:** Verify customer-dependent dropdowns reload

**Steps:**
1. Import template or start fresh
2. Click on Customer cell in row 1
3. Select "ABC Company" from dropdown
4. Observe network requests in DevTools
5. Click on Product cell

**Expected Results:**
- ✅ Customer dropdown shows available customers
- ✅ Selecting customer triggers 7 API calls:
  - GetProductsByCustomerId
  - GetLocationsByCustomerId
  - GetDriversByCustomerId
  - GetTrailerInsByCustomerId
  - GetTrailerInTypesByCustomerId
  - GetTrailerOutsByCustomerId
  - GetTrailerOutTypesByCustomerId
- ✅ Product dropdown now shows only ABC Company products
- ✅ Location dropdowns show only ABC Company locations
- ✅ Driver dropdown shows only ABC Company drivers
- ✅ Console logs: "Loading customer-dependent data for customer ID: 456"

---

### Test Case 2.2: Change Customer Selection
**Objective:** Verify dependent fields are cleared when customer changes

**Steps:**
1. Row has:
   - Customer: "ABC Company"
   - Product: "Steel Coils" (valid for ABC)
   - Driver: "John Doe" (valid for ABC)
2. Change customer to "XYZ Corporation"
3. Observe field changes

**Expected Results:**
- ✅ New customer-dependent dropdowns load
- ✅ Previously selected product/driver become invalid
- ✅ Invalid fields are cleared (both ID and name set to null/"")
- ✅ User sees empty values in cleared fields
- ✅ Console logs: "All customer-dependent data loaded"

---

### Test Case 2.3: Edit Customer-Dependent Field Without Customer
**Objective:** Verify fields are disabled without customer

**Steps:**
1. Click on Product cell (no customer selected)
2. Try to edit

**Expected Results:**
- ✅ Dropdown is disabled (gray background)
- ✅ Small text appears: "Please select customer first"
- ✅ Cannot select any value
- ✅ Same behavior for: Product, Pickup Location, Driver, Trailer In, Trailer In Type, Changeover Location, Delivery Location, Trailer Out, Trailer Out Type

---

## Test Suite 3: Edit Cell Validation

### Test Case 3.1: Edit Valid Field
**Objective:** Verify editing updates both ID and name

**Steps:**
1. Click on Planner cell
2. Select "Sarah Johnson" from dropdown
3. Tab or click away
4. Observe changes

**Expected Results:**
- ✅ Cell shows "Sarah Johnson"
- ✅ Data model has:
  - planner: "Sarah Johnson"
  - plannerId: 789
- ✅ If cell had validation error, red highlight disappears
- ✅ Console logs: (no errors)

**Validation:**
```javascript
// In browser console
console.log(templateList[rowIndex]);
// Should show both planner and plannerId updated
```

---

### Test Case 3.2: Edit Vehicle (Master Data)
**Objective:** Verify master data dropdowns work without customer

**Steps:**
1. Click on Vehicle cell (no customer selected)
2. Dropdown should work
3. Select a vehicle
4. Verify

**Expected Results:**
- ✅ Vehicle dropdown is NOT disabled
- ✅ Shows all vehicles from master table
- ✅ Selecting vehicle updates vehicleId and vehicle
- ✅ Same behavior for: Status, Product Type, Planner

---

### Test Case 3.3: Keyboard Navigation
**Objective:** Verify keyboard controls work

**Steps:**
1. Click on any editable cell
2. Press Escape
3. Edit again
4. Press Enter

**Expected Results:**
- ✅ Escape cancels edit and restores original value
- ✅ Enter saves changes
- ✅ Tab moves to next field

---

## Test Suite 4: Save Validation

### Test Case 4.1: Save Valid Template
**Objective:** Verify successful save with all valid data

**Steps:**
1. Import valid template
2. Click "Save Template"
3. Enter name: "Weekly Plan Dec 2025"
4. Submit

**Expected Results:**
- ✅ Prompt appears for template name
- ✅ API validates name (doesn't exist)
- ✅ API POST to /Planner/SaveTemplateWithDetails
- ✅ Request payload contains:
  ```json
  {
    "TemplateMaster": {
      "TemplateName": "Weekly Plan Dec 2025",
      "EmployeeId": 123,
      "CreatedBy": "CurrentUser"
    },
    "TemplateSheetDetails": [
      {"SheetName": "Monday"},
      {"SheetName": "Tuesday"},
      ...
    ],
    "TemplateDetails": [
      {
        "Sno": 1,
        "SheetName": "Monday",
        "PlannerID": 123,     // IDs ONLY, not names
        "CustomerID": 456,
        "ProductID": 789,
        ...
      }
    ]
  }
  ```
- ✅ Success toast: "Template 'Weekly Plan Dec 2025' saved successfully!"
- ✅ Grid clears
- ✅ hasLoadedData = false
- ✅ Template dropdown reloads with new template

---

### Test Case 4.2: Save with Duplicate Name
**Objective:** Verify duplicate name validation

**Steps:**
1. Import template
2. Click "Save Template"
3. Enter name: "Existing Template" (already exists)
4. Submit

**Expected Results:**
- ⚠️ API responds: isValid = false
- ⚠️ Error toast: "Template name already exists! Please use a different name."
- ⚠️ Save process stops
- ⚠️ Data remains in grid

---

### Test Case 4.3: Save with Validation Errors
**Objective:** Verify warning for invalid data

**Steps:**
1. Import template with some invalid rows
2. Click "Save Template"
3. Observe warning

**Expected Results:**
- ⚠️ Confirmation dialog appears:
  ```
  There are X row(s) with validation errors.
  
  Rows with invalid data will have NULL IDs in the database.
  
  Do you want to continue saving?
  ```
- ✅ Clicking "Cancel" stops save
- ✅ Clicking "OK" proceeds with save
- ✅ Invalid rows saved with NULL IDs for invalid fields

---

### Test Case 4.4: Save with Duplicate Sheet Names
**Objective:** Verify sheet name uniqueness

**Steps:**
1. Import template
2. Rename sheets to have duplicates (if possible)
3. Try to save

**Expected Results:**
- ⚠️ Error toast: "Sheet names must be unique! Please rename duplicate sheets."
- ⚠️ Save blocked

---

## Test Suite 5: Performance & UX

### Test Case 5.1: Large File Import
**Objective:** Verify performance with large dataset

**Steps:**
1. Prepare Excel with 7 sheets, 50 rows each (350 total rows)
2. Import file
3. Measure time

**Expected Results:**
- ✅ Import completes in < 5 seconds
- ✅ Validation runs without freezing UI
- ✅ Progress indicators show
- ✅ No browser crashes

---

### Test Case 5.2: API Call Optimization
**Objective:** Verify API calls are minimized

**Steps:**
1. Import template
2. Monitor Network tab in DevTools
3. Count API calls

**Expected Results:**
- ✅ Master data loaded once on component init (5 calls)
- ✅ Customer-dependent data loaded only when customer selected (7 calls per customer)
- ✅ No duplicate/redundant API calls
- ✅ Parallel execution where possible

---

### Test Case 5.3: Visual Feedback
**Objective:** Verify user gets clear feedback

**Steps:**
1. Perform various actions
2. Observe UI feedback

**Expected Results:**
- ✅ Loading spinners for API calls
- ✅ Disabled states for unavailable actions
- ✅ Clear error messages
- ✅ Success confirmations
- ✅ Validation errors visually obvious

---

## Test Suite 6: Edge Cases

### Test Case 6.1: No Customer Mapping
**Objective:** Handle customer with no mapped data

**Steps:**
1. Select customer with no products/drivers mapped
2. Try to edit dependent fields

**Expected Results:**
- ✅ Dropdowns show empty
- ✅ Placeholder text: "No options available"
- ✅ No errors/crashes

---

### Test Case 6.2: Network Failure
**Objective:** Handle API failures gracefully

**Steps:**
1. Disconnect network or block API
2. Try to load dropdowns
3. Observe behavior

**Expected Results:**
- ⚠️ Error toast: "Error loading data"
- ⚠️ Console shows error log
- ✅ App doesn't crash
- ✅ Dropdowns set to empty array

---

### Test Case 6.3: Special Characters
**Objective:** Handle special characters in names

**Steps:**
1. Import data with names containing: &, ', ", <, >
2. Edit cells with special characters
3. Save template

**Expected Results:**
- ✅ Characters display correctly
- ✅ Dropdown selection works
- ✅ Save succeeds
- ✅ Data retrieved correctly

---

## Test Suite 7: Backend Integration

### Test Case 7.1: Verify Backend Receives IDs Only
**Objective:** Confirm backend gets ID fields, not names

**Steps:**
1. Save template
2. Check backend logs or database
3. Verify saved data structure

**Expected Results:**
- ✅ TemplateDetails table has:
  - PlannerID (INT)
  - CustomerID (INT)
  - ProductID (INT)
  - etc. (all INT foreign keys)
- ✅ NO name columns in TemplateDetails
- ✅ Names retrieved via JOINs to master tables

---

### Test Case 7.2: Load Saved Template
**Objective:** Verify saved template loads correctly

**Steps:**
1. Save template with both valid and NULL IDs
2. Load template later
3. Verify display

**Expected Results:**
- ✅ Valid IDs resolve to names via JOINs
- ✅ NULL IDs display as "-"
- ✅ Both ID and name populated in UI model

---

## Regression Tests

### Test Case R.1: Existing Features Still Work
- ✅ Template dropdown selection
- ✅ Sheet navigation (tabs)
- ✅ Pagination
- ✅ Delete rows
- ✅ Duplicate rows
- ✅ Export to Excel/CSV
- ✅ Download templates

---

## Test Execution Checklist

### Before Testing:
- [ ] Backend APIs implemented and tested
- [ ] Database has test data (customers, products, locations, etc.)
- [ ] Sample Excel files prepared
- [ ] Development environment running

### During Testing:
- [ ] Test in Chrome
- [ ] Test in Edge
- [ ] Test in Firefox
- [ ] Check console for errors
- [ ] Monitor network requests
- [ ] Verify database state

### After Testing:
- [ ] Document all bugs found
- [ ] Verify all critical paths work
- [ ] Performance acceptable
- [ ] UX is intuitive
- [ ] Ready for deployment

---

## Bug Report Template

```markdown
**Bug ID:** BUG-XXX
**Title:** [Short description]
**Severity:** Critical / High / Medium / Low
**Component:** Import / Validation / Cascade / Save / UI

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**


**Actual Result:**


**Screenshots/Logs:**


**Environment:**
- Browser: 
- Angular Version: 
- Backend API Version: 
```

---

## Success Criteria

✅ **All tests pass with no critical/high severity bugs**
✅ **Import validation works correctly (95%+ accuracy)**
✅ **Customer cascade functions without errors**
✅ **Save operation stores only IDs**
✅ **Performance acceptable (< 5s for 350 rows)**
✅ **No browser console errors**
✅ **Backend APIs return correct data**
✅ **User experience is smooth and intuitive**

