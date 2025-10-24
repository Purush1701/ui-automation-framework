#  Testing Wrappers Documentation

Comprehensive guide for testing  Angular components using Playwright wrappers from `@companyName/ng-sdk/testing` (v0.10.13+).

## Table of Contents

### 📚 [Getting Started](#getting-started)
- [Overview](#overview)
- [Installation & Setup](#installation--setup)
- [Base Wrapper Concepts](#base-wrapper-concepts)
- [Quick Start Guide](#quick-start-guide)

### 🎛️ [Form Controls](#form-controls)
- [Text Inputs](#text-inputs) • [Amount Inputs](#amount-inputs) • [Dropdowns](#dropdowns) • [Date Pickers](#date-pickers)
- [File Upload](#file-upload) • [Checkboxes](#checkboxes) • [Specialized Inputs](#specialized-inputs)

### 🔧 [UI Components](#ui-components)
- [Buttons & Toggles](#buttons--toggles) • [Alerts & Dialogs](#alerts--dialogs) • [Tabs & Navigation](#tabs--navigation)

### 📊 [Data Display](#data-display)
- [Data Tables](#data-tables) • [Charts & Visualizations](#charts--visualizations) • [Property Displays](#property-displays)

### 🚀 [Advanced Usage](#advanced-usage)
- [Form Wrapper](#form-wrapper) • [Complex Workflows](#complex-workflows) • [Custom Components](#custom-components)

### 💡 [Best Practices](#best-practices)
- [Testing Patterns](#testing-patterns) • [Performance Tips](#performance-tips) • [Common Pitfalls](#common-pitfalls)

---

## Getting Started

### Overview

The  testing wrappers provide high-level Playwright-based APIs for testing  Angular components. All wrappers extend from a common `BaseWrapper` class and follow consistent patterns for element selection, interactions, state checking, and assertions.

**Key Benefits:**
- 🎯 **Consistent API** - Unified interface across all components
- 🔍 **Type Safety** - Full TypeScript support with IntelliSense
- 🚀 **High-Level Methods** - Simplified test writing with domain-specific operations
- 🛡️ **Built-in Assertions** - Component-specific expectation helpers
- ♿ **Accessibility Support** - Built-in accessibility testing capabilities

### Installation & Setup

```typescript
// Install the SDK (if not already installed)
npm install @companyName/ng-sdk

// Import wrappers in your test files
import {
InputWrapper,
ButtonWrapper,
DropdownWrapper,
  FormWrapper,
  // ... other wrappers
} from '@companyName/ng-sdk/testing';
```

### Base Wrapper Concepts

All  wrappers extend from `BaseWrapper`, providing these core capabilities:

```typescript
// Factory pattern for consistent instantiation
const input = InputWrapper.byTestId(page, 'user-email');

// Common interactions available on all wrappers
await input.click();           // Click the component
await input.focus();           // Focus the component  
await input.hover();           // Hover over the component

// State checking methods
const isVisible = await input.isVisible();
const isEnabled = await input.isEnabled();
const isFocused = await input.isFocused();

// Built-in assertion helpers
await input.expectToBeVisible();
await input.expectToBeEnabled();
await input.expectToHaveFocus();

// Accessibility helpers
const ariaLabel = await input.getAriaLabel();
await input.expectToHaveAriaLabel();

// Screenshot capabilities
await input.takeScreenshot('component-state.png');
```

### Quick Start Guide

Here's a complete example showing how to test a simple form:

```typescript
import { test } from '@playwright/test';
import { InputWrapper, ButtonWrapper, DropdownWrapper } from '@companyName/ng-sdk/testing';

test('user registration form', async ({ page }) => {
  await page.goto('/register');

  // Initialize wrappers using test IDs
  const nameInput = InputWrapper.byTestId(page, 'user-name');
  const emailInput = InputWrapper.byTestId(page, 'user-email');
  const countryDropdown = DropdownWrapper.byTestId(page, 'user-country');
  const submitButton = ButtonWrapper.byTestId(page, 'submit-form');

  // Fill form fields
  await nameInput.setValue('John Doe');
  await emailInput.setValue('john@example.com');
  await countryDropdown.setValue('US');

  // Validate form state
  await nameInput.expectToHaveValue('John Doe');
  await emailInput.expectToHaveValue('john@example.com');
  await countryDropdown.expectToHaveValue('US');

  // Submit form
  await submitButton.click();
  await submitButton.expectToBeLoading();
});
```

---

## Form Controls

This section covers all form input components and their testing wrappers. Each wrapper provides specialized methods for the component type while maintaining consistent APIs.

### Text Inputs

#### InputWrapper

The most commonly used wrapper for standard text input fields.

**Factory Method:**
```typescript
InputWrapper.byTestId(page, 'field-name')
```

**Key Operations:**
```typescript
// Input operations
await input.clear();                    // Clear the input
await input.fill('text');              // Fill with text
await input.setValue('complete text'); // Clear then fill
await input.paste('clipboard text');   // Paste from clipboard

// Value retrieval
const value = await input.getValue();          // Get current value
const placeholder = await input.getPlaceholder(); // Get placeholder text
const inputType = await input.getType();       // Get input type (email, text, etc.)

// Validation
await input.expectToHaveValue('expected');
await input.expectToBeEmpty();
await input.expectToHaveError();
```

**Use Cases:**
- Standard text fields (name, email, description)
- Password fields
- Search inputs
- Any basic HTML input element

#### TextareaWrapper  

For multi-line text input areas.

**Factory Method:**
```typescript
TextareaWrapper.byTestId(page, 'textarea-id')
```

**Key Operations:**
```typescript
await textarea.type('Multi-line\ntext content');
const value = await textarea.getValue();
await textarea.expectToHaveValue('Expected content');
```

### Amount Inputs

#### AmountInputWrapper

Specialized wrapper for monetary amount inputs with currency symbols.

**Factory Method:**
```typescript
AmountInputWrapper.byTestId(page, 'amount-field')
```

**Key Operations:**
```typescript
// Amount operations
await amountInput.setValue(1500.75);           // Set numeric value
await amountInput.setAssetSymbol('USD');       // Set currency
const numValue = await amountInput.getNumericValue(); // Get as number

// Asset symbol operations
const symbolText = await amountInput.getAssetSymbolText();
const hasSymbol = await amountInput.hasAssetSymbolFrame();
const type = await amountInput.getType(); // 'simple' | 'prefixed'

// Assertions
await amountInput.expectToHaveValue('1500.75');
await amountInput.expectToHaveAssetSymbol('USD');
await amountInput.expectTypeToMatch('prefixed');
```

**Use Cases:**
- Transaction amount fields
- Price inputs
- Financial calculations
- Budget entries

#### AmountRangeControlWrapper

For selecting amount ranges with currency support.

**Factory Method:**
```typescript
AmountRangeControlWrapper.byTestId(page, 'amount-range')
```

**Key Operations:**
```typescript
// Range operations
await amountRange.openMenu();              // Open range selector
await amountRange.setRange(100, 500);      // Set min/max values
await amountRange.selectAsset('USD');      // Choose currency
await amountRange.closeMenu();             // Close selector

// Validation
await amountRange.expectToHaveRange(100, 500);
await amountRange.expectToHaveValidRange();
await amountRange.expectToHaveSelectedAsset('USD');
```

### Dropdowns

#### DropdownWrapper

Comprehensive wrapper supporting single-select, multi-select, and autocomplete dropdowns.

**Factory Method:**
```typescript
DropdownWrapper.byTestId(page, 'dropdown-id')
```

**Core Operations:**
```typescript
// Single selection
await dropdown.setValue('option1');

// Multi-selection  
await dropdown.setValue(['option1', 'option2']);

// Autocomplete
await dropdown.setAutocompleteValue('search text', 'target_value');

// Clear operations
await dropdown.clear();
await dropdown.clearMultiSelect();
await dropdown.clearAutocomplete();

// Assertions
await dropdown.expectToHaveValue('option1');
await dropdown.expectToHaveValue(['option1', 'option2']); // Multi-select
await dropdown.expectAutocompleteOptionVisible('option1');
```

**Use Cases:**
- Country/state selectors
- Category selections
- Multi-tag inputs
- Search with suggestions

#### QuickSearchControlWrapper

Specialized wrapper for search inputs with autocomplete functionality.

**Factory Method:**
```typescript
QuickSearchControlWrapper.byTestId(page, 'search-control')
```

**Key Operations:**
```typescript
// Search operations
await quickSearch.fill('search term');
await quickSearch.selectOption('target-value');

// Dropdown handling
await quickSearch.expectDropdownToBeVisible();
await quickSearch.expectDropdownOptionVisible('option-value');

// Value operations
const searchValue = await quickSearch.getValue();
const dataValue = await quickSearch.getDataValue();
```

### Date Pickers

#### DatepickerWrapper

Single date selection with calendar interface.

**Factory Method:**
```typescript
DatepickerWrapper.byTestId(page, 'date-field')
```

**Key Operations:**
```typescript
// Calendar operations
await datepicker.openCalendarByButton();
await datepicker.selectDate(15);           // Select day 15
await datepicker.selectToday();
await datepicker.navigateToNextMonth();

// Value operations
const value = await datepicker.getValue();
const isEmpty = await datepicker.isEmpty();

// Assertions
await datepicker.expectCalendarToBeOpen();
await datepicker.expectToHaveValue();
```

#### DualDatepickerWrapper

Date range selection (start and end dates).

**Factory Method:**
```typescript
DualDatepickerWrapper.byTestId(page, 'date-range')
```

#### RangeControlNewWrapper

Advanced range control with preset date ranges.

**Factory Method:**
```typescript
RangeControlNewWrapper.byTestId(page, 'range-control')
```

**Key Operations:**
```typescript
// Preset selection
await rangeControl.openMenu();
await rangeControl.selectPreset('Last 30 days');

// Display operations  
const displayValue = await rangeControl.getDisplayValue();
await rangeControl.expectDisplayValue('Last 30 days');
```

### File Upload

#### FileUploadWrapper

Comprehensive file upload with document type support.

**Factory Method:**
```typescript
FileUploadWrapper.byTestId(page, 'file-upload')
```

**Key Operations:**
```typescript
// File operations
await fileUpload.upload('path/to/file.pdf');
await fileUpload.upload(['file1.pdf', 'file2.jpg']); // Multiple files

// Document types
await fileUpload.setDocumentType('file.pdf', 'Contract');
const docType = await fileUpload.getDocumentType('file.pdf');

// Management
await fileUpload.cancelFile('unwanted.pdf');
await fileUpload.clear(); // Remove all files

// Assertions
await fileUpload.expectToHaveUploadedCount(2);
await fileUpload.expectToHaveFiles(['file1.pdf', 'file2.jpg']);
await fileUpload.expectFileToHaveDocumentType('file.pdf', 'Contract');
```

### Checkboxes

#### CheckboxWrapper

Standard checkbox with three states: checked, unchecked, indeterminate.

**Factory Method:**
```typescript
CheckboxWrapper.byTestId(page, 'checkbox-id')
```

**Key Operations:**
```typescript
// State operations
await checkbox.check();
await checkbox.uncheck();
await checkbox.toggle();

// State checking
const isChecked = await checkbox.isChecked();
const isIndeterminate = await checkbox.isIndeterminate();

// Assertions
await checkbox.expectToBeChecked();
await checkbox.expectToBeUnchecked();
await checkbox.expectToBeIndeterminate();
```

### Specialized Inputs

#### OtpInputWrapper

One-Time Password input with multiple character fields.

**Factory Method:**
```typescript
OtpInputWrapper.byTestId(page, 'otp-input')
```

**Key Operations:**
```typescript
// Input operations
await otpInput.typeSequence('123456');      // Type complete OTP
await otpInput.typeCharacter(0, '1');       // Type single character
await otpInput.clear();                     // Clear all fields

// Navigation
await otpInput.focusInput(2);               // Focus specific field
await otpInput.navigateRight();             // Move to next field

// State checking
const isComplete = await otpInput.isComplete();
const value = await otpInput.getValue();    // Get complete OTP
const focusedIndex = await otpInput.getFocusedInputIndex();

// Assertions
await otpInput.expectToHaveValue('123456');
await otpInput.expectToBeComplete();
```

#### PhoneNumberInputWrapper

International phone number input with country code selection.

**Factory Method:**
```typescript
PhoneNumberInputWrapper.byTestId(page, 'phone-input')
```

**Key Operations:**
```typescript
// Country selection
await phoneInput.selectCountryCode('+1');
await phoneInput.openCountryDropdown();

// Phone number input
await phoneInput.setPhoneNumber('1234567890');

// Value retrieval
const phoneNumber = await phoneInput.getPhoneNumber();    // Digits only
const fullNumber = await phoneInput.getFullPhoneNumber(); // With country code
const countryCode = await phoneInput.getSelectedCountryCode();

// Assertions
await phoneInput.expectToHavePhoneNumber('1234567890');
await phoneInput.expectToHaveCountryCode('+1');
await phoneInput.expectToHaveFullPhoneNumber('+11234567890');
```

---

## UI Components

This section covers interactive UI components like buttons, toggles, alerts, and navigation elements.

### Buttons & Toggles

#### ButtonWrapper

Primary button component with various styles and states.

**Factory Method:**
```typescript
ButtonWrapper.byTestId(page, 'button-id')
```

**Key Operations:**
```typescript
// Basic interactions
await button.click();
await button.pressEnter();    // Keyboard activation
await button.pressSpace();    // Alternative activation

// State checking
const isLoading = await button.isLoading();
const text = await button.getText();
const hasIcon = await button.hasIcon();

// Style properties
const variant = await button.getVariant(); // 'ghost' | 'fab' | 'icon' | 'outlined' | 'filled'
const color = await button.getColor();     // 'primary' | 'secondary' | 'tertiary' | 'danger'
const size = await button.getSize();       // 'small' | 'medium' | 'large'

// Assertions
await button.expectToBeLoading();
await button.expectToHaveAccessibleName();
await button.expectToBeAccessible();
```

**Use Cases:**
- Form submission buttons
- Action triggers
- Navigation elements
- Call-to-action buttons

#### SlideToggleWrapper

Toggle switch component (on/off states).

**Factory Method:**
```typescript
SlideToggleWrapper.byTestId(page, 'toggle-id')
```

**Key Operations:**
```typescript
// Toggle operations
await slideToggle.check();      // Turn on
await slideToggle.uncheck();    // Turn off
await slideToggle.click();      // Toggle current state

// State checking
const isChecked = await slideToggle.isChecked();

// Assertions
await slideToggle.expectToBeChecked();
await slideToggle.expectToBeUnchecked();
await slideToggle.expectToHaveAriaChecked('true');
```

#### ButtonToggleGroupWrapper

Group of toggleable buttons (radio button style).

**Factory Method:**
```typescript
ButtonToggleGroupWrapper.byTestId(page, 'toggle-group')
```

### Alerts & Dialogs

#### AlertWrapper

Alert/notification messages with various severity levels.

**Factory Method:**
```typescript
AlertWrapper.byTestId(page, 'alert-id')
```

**Typical Usage:**
- Success/error notifications
- Warning messages
- Information displays

#### DialogWrapper

Modal dialog windows.

**Factory Method:**
```typescript
DialogWrapper.byTestId(page, 'dialog-id')
```

**Common Operations:**
```typescript
// Dialog interaction patterns
await dialog.expectToBeVisible();
// ... interact with dialog content ...
await dialog.close(); // or click outside/escape
```

### Tabs & Navigation

#### TabWrapper

Tabbed interface navigation.

**Factory Method:**
```typescript
TabWrapper.byTestId(page, 'tab-component')
```

### Status & Labels

#### StatusLabelWrapper

Status indicators with color coding and icons.

**Factory Method:**
```typescript
StatusLabelWrapper.byTestId(page, 'status-label')
```

**Use Cases:**
- Record status (Active, Inactive, Pending)
- Process states
- Approval workflows

#### TooltipWrapper

Hover/focus tooltip displays.

**Factory Method:**
```typescript
TooltipWrapper.byTestId(page, 'tooltip-trigger')
```

---

## Data Display

Components for presenting data, tables, charts, and property information.

### Data Tables

#### DataTableWrapper

Comprehensive wrapper for data tables with sorting, pagination, row actions, and property displays.

**Factory Method:**

```typescript
DataTableWrapper.byTestId(page, 'data-table')
```

**Key Operations:**

```typescript
// Table structure
await dataTable.waitForDataToLoad();
const rowCount = await dataTable.getRowCount();
const columns = await dataTable.getColumns();

// Cell operations
const cellValue = await dataTable.getCellValue(0, 'Name');
const propertyDisplay = await dataTable.getCellPropertyDisplay(0, 'Status');

// Sorting and navigation
await dataTable.sortColumnAscending('Date');
await dataTable.goToNextPage();

// Row actions
await dataTable.clickRowAction(0, 'Edit');
const actions = await dataTable.getRowActions(0);

// Assertions
await dataTable.expectToHaveRows(10);
await dataTable.expectCellToHaveValue(0, 'Name', 'John Doe');
await dataTable.expectColumnToBeSorted('Date', 'asc');
```

**Use Cases:**

- User management tables
- Transaction listings
- Product catalogs
- Any tabular data display

### Charts & Visualizations

#### ChartWrapper

Data visualization charts and graphs.

**Factory Method:**

```typescript
ChartWrapper.byTestId(page, 'chart-component')
```

#### MindMapWrapper

Hierarchical data visualization for organizational structures.

**Factory Method:**

```typescript
MindMapWrapper.byTestId(page, 'mind-map')
```

#### SkeletonWrapper

Loading placeholders that mimic content structure.

**Factory Method:**

```typescript
SkeletonWrapper.byTestId(page, 'skeleton-loader')
```

### Property Displays

#### PropertyDisplayWrapper

Formatted property values with icons, colors, and subtexts.

**Factory Method:**

```typescript
PropertyDisplayWrapper.byTestId(page, 'property-display')
```

#### PropertyGridWrapper

Key-value pair displays in grid format.

**Factory Method:**

```typescript
PropertyGridWrapper.byTestId(page, 'property-grid')
```

#### IconFrameWrapper / IconWrapper

Icon components with optional backgrounds and styling.

**Factory Methods:**

```typescript
IconFrameWrapper.byTestId(page, 'icon-frame')
IconWrapper.byTestId(page, 'icon')
```

#### CopyToClipboardWrapper

Copy-to-clipboard functionality with feedback.

**Factory Method:**

```typescript
CopyToClipboardWrapper.byTestId(page, 'copy-button')
```

---

## Advanced Usage

### Form Wrapper

The `FormWrapper` is the most powerful testing utility, automatically discovering form controls and providing unified operations.

**Configuration:**

```typescript
const formConfig = {
  controls: [
    { name: 'First Name' },                    // Auto-discovery by label
    { name: 'Email', selector: '[data-testid="email"]' }, // Custom selector
    { name: 'Country', dropdownType: DropdownType.SINGLE },
    { name: 'Skills', dropdownType: DropdownType.MULTI },
    { name: 'Phone Number' },                  // Phone input auto-detected
    { name: 'Verification Code' },             // OTP input auto-detected
    { name: 'Resume' },                        // File upload auto-detected
  ],
} as const;

const form = await FormWrapper.create(page, formConfig);
```

**Bulk Operations:**

```typescript
// Fill entire form at once
await form.fillControls({
  'First Name': 'John',
  'Email': 'john@example.com',
  'Country': 'US',
  'Skills': ['JavaScript', 'TypeScript'],
  'Phone Number': '1234567890',
  'Verification Code': '123456',
});

// Get all values
const values = await form.getControlValues();

// Validation
await form.expectNoFormErrors();
const errors = await form.getFormErrors();
```

**Individual Control Access:**

```typescript
// Get specialized wrappers
const phoneInput = form.getControl<PhoneNumberInputWrapper>('Phone Number');
await phoneInput.selectCountryCode('+1');

const otpInput = form.getControl<OtpInputWrapper>('Verification Code');
await otpInput.expectToBeComplete();
```

### Complex Workflows

#### Multi-Step Forms

```typescript
test('multi-step registration workflow', async ({ page }) => {
  // Step 1: Basic Information
  const basicForm = await FormWrapper.create(page, basicFormConfig);
  await basicForm.fillControls(basicData);
  await ButtonWrapper.byTestId(page, 'next-step').click();

  // Step 2: Contact Information
  const contactForm = await FormWrapper.create(page, contactFormConfig);
  await contactForm.fillControls(contactData);
  
  // Handle specialized inputs
  const phoneInput = contactForm.getControl<PhoneNumberInputWrapper>('Phone');
  await phoneInput.selectCountryCode('+1');
  
  await ButtonWrapper.byTestId(page, 'next-step').click();

  // Step 3: Verification
  const otpInput = OtpInputWrapper.byTestId(page, 'verification-code');
  await otpInput.typeSequence('123456');
  await otpInput.expectToBeComplete();
  
  await ButtonWrapper.byTestId(page, 'complete').click();
});
```

#### Data Table Workflows

```typescript
test('user management workflow', async ({ page }) => {
  const dataTable = DataTableWrapper.byTestId(page, 'users-table');
  
  // Search and filter
  const quickSearch = QuickSearchControlWrapper.byTestId(page, 'user-search');
  await quickSearch.fill('john');
  await quickSearch.selectOption('john-doe-123');
  
  // Sort and paginate
  await dataTable.sortColumnAscending('Last Login');
  if (await dataTable.hasNextPage()) {
    await dataTable.goToNextPage();
  }
  
  // Perform actions
  await dataTable.clickRowAction(0, 'Edit');
  
  // Edit user in modal
  const userForm = await FormWrapper.create(page, userFormConfig);
  await userForm.fillControls({ Status: 'Active' });
  
  await ButtonWrapper.byTestId(page, 'save-user').click();
});
```

---

## Best Practices

### Testing Patterns

#### 1. Use the Factory Pattern

```typescript
// ✅ Always use the static factory methods
const input = InputWrapper.byTestId(page, 'user-email');
const form = await FormWrapper.create(page, formConfig);
```

#### 2. Leverage Assertion Helpers

```typescript
// ✅ Use component-specific assertions
await input.expectToHaveValue('expected');
await dropdown.expectToHaveValue(['option1', 'option2']);
await dataTable.expectToHaveRows(10);

// ❌ Avoid low-level assertions
expect(await input.getValue()).toBe('expected');
```

#### 3. Handle Async Operations

```typescript
// ✅ Always await operations
await fileUpload.upload('file.pdf');
await fileUpload.expectToHaveUploadedCount(1);

// ✅ Wait for data loading
await dataTable.waitForDataToLoad();
```

### Performance Tips

#### 1. Bulk Operations

```typescript
// ✅ Use FormWrapper for multiple fields
await form.fillControls(allData);

// ❌ Avoid individual wrapper creation
const input1 = InputWrapper.byTestId(page, 'field1');
const input2 = InputWrapper.byTestId(page, 'field2');
```

#### 2. Efficient Element Location

```typescript
// ✅ Use descriptive, stable test IDs
const submitButton = ButtonWrapper.byTestId(page, 'submit-registration');

// ❌ Avoid generic or brittle selectors
const button = ButtonWrapper.byTestId(page, 'btn1');
```

### Common Pitfalls

#### 1. Component-Specific Usage

```typescript
// ✅ Use appropriate methods for component types
await otpInput.typeSequence('123456');      // For OTP
await phoneInput.setPhoneNumber('1234567890'); // For phone
await dropdown.setAutocompleteValue('search', 'value'); // For autocomplete

// ❌ Don't use generic fill for specialized components
await otpInput.fill('123456'); // Won't work properly
```

#### 2. Menu-Based Components

```typescript
// ✅ Handle menu state properly
await amountRange.openMenu();
await amountRange.setRange(100, 500);
await amountRange.expectToHaveValidRange();
await amountRange.closeMenu();
```

#### 3. Validation Timing

```typescript
// ✅ Trigger validation before checking
await form.fillControls(data);
await form.blurControls(['Email']); // Trigger validation
await form.expectNoFieldError('Email');
```

---

## Summary

This comprehensive guide covers all testing wrappers in `@companyName/ng-sdk/testing` v0.10.13+. Each wrapper provides:

- **Consistent Factory Methods** - `Component.byTestId(page, 'test-id')`
- **High-Level Operations** - Domain-specific methods for each component type
- **Built-in Assertions** - `expectTo*` methods for reliable testing
- **Type Safety** - Full TypeScript support with IntelliSense

**Key Components:**

- **Form Controls**: Input, Amount, Dropdown, Date, File Upload, OTP, Phone, Checkbox
- **UI Elements**: Button, Toggle, Alert, Dialog, Tab, Tooltip  
- **Data Display**: DataTable, Chart, Property Display, Icons
- **Advanced**: FormWrapper for unified form testing

For the most efficient testing, use `FormWrapper` for multi-field forms and leverage component-specific assertion helpers for reliable, maintainable tests.
