# Sponsor Fee Allocation

**Component File:** `src/components/SponsorFeeAllocation.tsx`  
**Route:** `/tools` (with tool='sponsor-fee-allocation')  
**Access Level:** Admin, Manager

## Overview
Sponsor Fee Allocation is a tool for calculating and confirming monthly administrative fees charged to sponsored nonprofits. InFocus Ministries (the fiscal sponsor) charges a percentage-based admin fee on each nonprofit's income. This tool allows review, adjustment, and confirmation of these fees, with automatic journal entry generation upon confirmation.

## UI Features

### Main Features
- **Header:**
  - Title: "Sponsor Fee Allocation"
  - Subtitle varies by entity (InFocus sees all nonprofits, others see their own)
  - Back to Tools button
  - Confirm All button (InFocus only)
  - Export button

### Month Selector Card
- Month picker input
- Total Income display
- Total Admin Fees display (7.5% default rate)

### Summary Cards (InFocus only, 3 cards)
1. **Total Nonprofits** - Count of sponsored entities
2. **Confirmed** - Count of confirmed allocations
3. **Pending** - Count of pending allocations

### Allocations Table
Displays fee allocations with columns:
- **Nonprofit** - Entity name
- **Total Income** - Monthly income amount
- **Rate** - Admin fee percentage
- **Admin Fee** - Calculated fee amount (clickable to adjust)
- **Status** - Confirmed/Pending badge
- **Actions** - Confirm/Unconfirm buttons (InFocus only)

### Expandable Adjustment Row
When clicking on an admin fee amount (for pending allocations):
- Allocated Income input (can be less than total for discounts)
- Admin Fee Rate percentage input
- Calculated fee preview
- Save/Cancel buttons

### Export Dialog
Modal for selecting export format:
- CSV File option
- Excel Spreadsheet (.xlsx) option

### Desktop-Only Warning
Mobile users see a warning that this tool requires desktop access.

## Data Requirements

### FundAllocation Interface
```typescript
interface FundAllocation {
  entityId: string;
  entityName: string;
  totalIncome: number;
  allocatedIncome: number;
  adminFeeRate: number;
  adminFeeAmount: number;
  confirmed: boolean;
  journalEntryId?: string;
  confirmedBy?: string;
  confirmedAt?: string;
}
```

### Journal Entry Generation
When confirming an allocation, two journal entries are created:

**Nonprofit Entry (Expense):**
- Debit: 5900 - Admin Fee Expense
- Credit: 2200 - Due to InFocus

**InFocus Entry (Revenue):**
- Debit: 1300 - Due from Nonprofits
- Credit: 4900 - Admin Fee Revenue

## State Management

### Local State
- `month` - Selected month (YYYY-MM format)
- `allocations` - Array of fund allocations
- `expandedRow` - Currently expanded row for adjustment
- `editValues` - Form values for adjustment (allocatedIncome, rate)
- `exportDialogOpen` - Boolean controlling export dialog
- `exportFormat` - Selected export format ('csv' | 'xlsx')

### Global State (AppContext)
- `selectedEntity` - Current organization
- `setToolsTool` - Navigation function

## Key Functions

### Allocation Management
- `handleRowClick(entityId)` - Expands/collapses adjustment row
- `handleAdjustmentSave(entityId)` - Saves adjusted allocation
- `handleConfirm(entityId)` - Confirms single allocation and creates journal entries
- `handleConfirmAll()` - Confirms all pending allocations
- `handleUnconfirm(entityId)` - Reverts confirmed status

### Export
- `handleExport()` - Opens export dialog
- `handleConfirmExport()` - Exports data in selected format

### Validation
- Allocated income must be between 0 and total income
- Rate must be between 0% and 100%

## GL Integration

Upon confirmation, the tool:
1. Creates journal entries for both nonprofit and InFocus
2. Dispatches `journal-entries-created` custom event
3. Updates allocation with `journalEntryId`, `confirmedBy`, `confirmedAt`
4. Shows success toast with posted amount

## Dependencies

### Internal Dependencies
- `AppContext` - Global state and entity list
- `journalEntryHelpers` - Account types and journal entry creation
- `exportUtils` - Excel export functionality
- UI components (Card, Button, Badge, Input, Label, Table, Dialog, RadioGroup)
- `PageHeader` component
- `DesktopOnlyWarning` component

### External Libraries
- `lucide-react` - Icons (ArrowLeft, Download, CheckCircle, ChevronDown, ChevronUp, Edit)
- `sonner` - Toast notifications

## Use Cases

1. **Monthly Fee Review** - Review calculated admin fees for all nonprofits
2. **Fee Adjustment** - Apply discounts or rate changes for specific entities
3. **Batch Confirmation** - Confirm all fees at once for month-end processing
4. **Individual Confirmation** - Confirm fees one at a time with review
5. **Export for Records** - Download allocation data for external reporting
6. **Audit Trail** - Track who confirmed each allocation and when

## Fee Calculation

```
Admin Fee = Allocated Income × Admin Fee Rate

Default Rate: 7.5%
Example: $50,000 income × 7.5% = $3,750 admin fee
```

## Entity Views

| Entity | View | Actions |
|--------|------|---------|
| InFocus | All nonprofits | Confirm, Adjust, Export |
| Nonprofit | Own allocation only | View only, Export |

## Related Documentation
- [00-TOOLS-HUB.md](./00-TOOLS-HUB.md)
- [../accounting/05-JOURNAL-ENTRY-MANAGER.md](../accounting/05-JOURNAL-ENTRY-MANAGER.md)
- [../accounting/04-GENERAL-LEDGER.md](../accounting/04-GENERAL-LEDGER.md)
