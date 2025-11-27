# Memorized Transactions

**Component File:** `src/components/MemorizedTransactions.tsx`  
**Route:** `/tools` (with tool='memorized-transactions')  
**Access Level:** Admin, Manager, Accounting Staff

## Overview
Memorized Transactions allows users to create and manage recurring journal entry templates. These templates can be scheduled to run automatically (monthly/quarterly) or executed manually, streamlining repetitive accounting tasks like rent payments, insurance premiums, and bank fees.

## UI Features

### Main Features
- **Header:**
  - Title: "Memorized Transactions"
  - Subtitle: "Create and manage recurring journal entries"
  - Back to Tools button
  - New Memorized Transaction button

### Summary Cards (3 cards)
1. **Total Memorized** - Count of all memorized transactions
2. **Scheduled** - Count of monthly/quarterly scheduled transactions
3. **Manual** - Count of manual-only transactions

### Transactions Table
Displays all memorized transactions with columns:
- **Name** - Transaction name with description
- **Nonprofit** - Associated entity
- **Schedule** - Badge showing Monthly/Quarterly/Manual
- **Amount** - Total debit amount
- **Next Run** - Next scheduled execution date
- **Last Run** - Last execution date or "Never"
- **Actions** - Play (run now), Edit, Delete buttons

### Create/Edit Sheet (Slide-out Panel)
Form for creating or editing memorized transactions:

**Basic Information:**
- Transaction Name (required)
- Description (optional)
- Nonprofit selector (required)
- Schedule type (Manual/Monthly/Quarterly)
- Next Run Date (for scheduled transactions)

**Journal Entry Lines:**
- Add/remove lines dynamically
- Each line includes:
  - Account selector (from Chart of Accounts)
  - Line description
  - Debit amount
  - Credit amount
- Totals display with balance validation
- Visual indicator for balanced/unbalanced entries

### Delete Confirmation Dialog
Modal confirmation before deleting a memorized transaction.

### Desktop-Only Warning
Mobile users see a warning that this tool requires desktop access.

## Data Requirements

### MemorizedTransaction Interface
```typescript
interface MemorizedTransaction {
  id: string;
  name: string;
  description: string;
  entity_id: string;
  schedule_type: 'monthly' | 'quarterly' | 'manual';
  next_run_date?: string;
  last_run_date?: string;
  is_active: boolean;
  lines: MemorizedLine[];
  created_at: string;
  created_by: string;
}
```

### MemorizedLine Interface
```typescript
interface MemorizedLine {
  id: string;
  account: Account;
  description: string;
  debit_amount: number;
  credit_amount: number;
}
```

### Account Interface
```typescript
interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  full_name: string;
  is_active: boolean;
}
```

## State Management

### Local State
- `transactions` - Array of memorized transactions
- `sheetOpen` - Boolean controlling create/edit sheet visibility
- `editingTransaction` - Currently editing transaction or null
- `deleteDialogOpen` - Boolean controlling delete confirmation
- `transactionToDelete` - Transaction pending deletion
- Form state: `formName`, `formDescription`, `formEntityId`, `formScheduleType`, `formNextRunDate`, `formLines`

### Global State (AppContext)
- `selectedEntity` - Current organization filter
- `setToolsTool` - Navigation function

## Key Functions

### Transaction Management
- `handleCreate()` - Opens sheet for new transaction
- `handleEdit(transaction)` - Opens sheet with transaction data
- `handleSave()` - Validates and saves transaction
- `handleDelete()` - Removes transaction after confirmation
- `handleRunNow(transaction)` - Creates journal entry from template

### Line Management
- `addLine()` - Adds new journal entry line
- `updateLine(lineId, field, value)` - Updates line field
- `removeLine(lineId)` - Removes line (minimum 2 required)

### Validation
- Transaction name required
- Nonprofit selection required
- Debits must equal credits
- Minimum 2 lines required

## Dependencies

### Internal Dependencies
- `AppContext` - Global state and entity list
- UI components (Card, Button, Badge, Input, Label, Select, Table, Sheet, Dialog, Textarea)
- `PageHeader` component
- `DesktopOnlyWarning` component

### External Libraries
- `lucide-react` - Icons (ArrowLeft, Plus, Clock, Edit, Trash2, Play, Calendar, RefreshCw)
- `sonner` - Toast notifications

## Use Cases

1. **Monthly Rent** - Schedule automatic rent expense entries
2. **Quarterly Insurance** - Record insurance premium payments
3. **Bank Fees** - Quick entry for recurring bank charges
4. **Payroll Accruals** - Template for payroll-related entries
5. **Depreciation** - Monthly depreciation expense entries

## Schedule Types

| Type | Description | Next Run Date |
|------|-------------|---------------|
| `manual` | Run on demand only | Not applicable |
| `monthly` | Runs on specified day each month | Required |
| `quarterly` | Runs on specified day each quarter | Required |

## Related Documentation
- [00-TOOLS-HUB.md](./00-TOOLS-HUB.md)
- [../accounting/05-JOURNAL-ENTRY-MANAGER.md](../accounting/05-JOURNAL-ENTRY-MANAGER.md)
- [../accounting/03-CHART-OF-ACCOUNTS.md](../accounting/03-CHART-OF-ACCOUNTS.md)
