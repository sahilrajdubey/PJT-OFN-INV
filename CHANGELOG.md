# Changelog - Inventory Management System Updates

## Summary of Changes

### 1. Inventory Types Updated
**Changed:** Removed "Computer Type" field and updated inventory types
- **Old Inventory Types:** PC, CPU, Printer, UPS
- **New Inventory Types:** PC, Laptop, CPU, UPS, Mouse, Keyboard, Webcam, Monitor, Switch, MediaConverter
- **Removed:** Computer Type dropdown (desktop, laptop, workstation, server)
- **Impact:** Each inventory type now has its own unique identifier sequence

### 2. Issue Equipment Form - Dynamic Issue Type
**Added:** Option to issue equipment to either a Section or an Employee

**Section Mode:**
- Only requires Section Name selection
- Sections available: ITC, HR, Security, Finance, Operations, Administration, Engineering, Marketing

**Employee Mode:**
- Requires all employee details:
  - Employee Name
  - Phone Number
  - Email
  - Designation
  - Section Name

**Removed Fields:**
- Location field (no longer tracked)

### 3. Unique Issue ID (UID)
**Added:** Every issued equipment now gets a unique UID
- **Format:** `UID-001`, `UID-002`, `UID-003`, etc.
- **Scope:** Global across all inventory types
- **Auto-increment:** Independent counter that increments with each new issue
- **Purpose:** Unique identifier for each issue transaction

### 4. Print Functionality
**Added:** Print button for each row in both databases

**Submissions Database Print:**
- Generates PDF with complete equipment details
- Shows inventory ID, specifications, purchase date
- Displays current status (Available/Issued)
- If issued, shows who it's issued to

**Issues Database Print:**
- Generates PDF with complete issue record
- Shows UID prominently
- Includes all equipment details
- Shows issue type (Section/Employee)
- Includes employee details if applicable

### 5. Database Schema Changes

**computer_submissions table:**
- `computer_type` field deprecated (always null)
- New inventory types supported

**computer_issues table (NEW FIELDS):**
- `uid` VARCHAR(255) NOT NULL UNIQUE - Global unique issue identifier
- `issue_type` VARCHAR(20) NOT NULL - 'section' or 'employee'
- `phone_number` VARCHAR(50) - Employee phone (nullable)
- `email` VARCHAR(255) - Employee email (nullable)
- `designation` VARCHAR(255) - Employee designation (nullable)

**computer_issues table (REMOVED FIELDS):**
- `location` - No longer tracked

**Field Behavior:**
- When `issue_type` = 'section': Only section name is populated
- When `issue_type` = 'employee': All employee fields are populated

### 6. Updated Features

**View Submissions Page:**
- Added print button for each inventory item
- Updated filter tabs to show all new inventory types
- Print generates comprehensive equipment report

**View Issues Page:**
- Added UID column display
- Added issue type indicator (Employee/Section)
- Added print button for each issue record
- Updated table to show relevant information based on issue type
- Edit modal now shows all new fields conditionally

### 7. Updated Documentation

**SUPABASE_SETUP.md:**
- Complete SQL migration script with DROP TABLE commands
- Clear instructions for updating existing databases
- Detailed schema documentation
- Field usage notes and examples

## Migration Guide

To update your existing database:

1. **Backup your data first!**
2. Open Supabase SQL Editor
3. Run the DROP TABLE commands from SUPABASE_SETUP.md
4. Run the CREATE TABLE commands for both tables
5. Restart your development server

**Note:** The DROP commands will delete all existing data. Make sure to export/backup if needed.

## Files Modified

1. `/app/forms/submission/page.tsx` - Updated inventory types, removed computer type
2. `/app/forms/issue/page.tsx` - Added issue type selection, dynamic fields, UID generation
3. `/app/forms/view/submissions/page.tsx` - Added print functionality, updated filters
4. `/app/forms/view/issues/page.tsx` - Added UID display, print functionality, updated fields
5. `/SUPABASE_SETUP.md` - Complete database schema update with migration instructions

## Testing Recommendations

1. Test submission of all new inventory types
2. Test issuing to both Section and Employee
3. Verify UID auto-increment works correctly
4. Test print functionality for both databases
5. Verify filtering works with new inventory types
6. Test edit functionality with new fields
