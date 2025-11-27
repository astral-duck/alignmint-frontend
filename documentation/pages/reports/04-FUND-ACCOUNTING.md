# Fund Accounting

**Component File:** `src/components/FundAccounting.tsx`  
**Route:** `/accounting` (legacy component)  
**Access Level:** Admin, Manager, Accounting Staff

## Overview
Fund Accounting is a comprehensive component that combines multiple accounting functions into a tabbed interface. It provides reconciliation, expense management, reimbursement processing, and fund distribution capabilities in a single view.

**Note:** This component has been largely superseded by individual specialized components (ReconciliationManager, ExpensesManager, ReimbursementsManager, DistributionManager) but remains in the codebase for legacy support.

## UI Features

### Tab Navigation
Four main tabs:
1. **Reconciliation** - Match bank transactions to categories
2. **Expenses** - Submit and manage expense reports
3. **Reimbursements** - Process reimbursement requests
4. **Distribution** - Allocate funds across entities

### Reconciliation Tab
- Unreconciled transactions list
- Reconciled transactions list
- Transaction categorization dialog
- Entity assignment for fiscal sponsor view
- Running totals for unreconciled amounts

### Expenses Tab
- Pending expenses table
- Approved expenses table
- Reimbursed expenses table
- Submit expense dialog with:
  - Description
  - Amount
  - Category
  - Vendor
  - Date
  - Entity assignment
- View expense details dialog

### Reimbursements Tab
- Pending reimbursements list
- Approved reimbursements list
- Approve/deny actions
- Total amount tracking

### Distribution Tab
- Fund distribution interface
- Entity-to-entity transfers
- Distribution confirmation dialog

## Data Requirements

### Bank Transaction
```typescript
interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  reconciled: boolean;
  category?: string;
  entityId?: string;
}
```

### Expense
```typescript
interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  vendor: string;
  date: string;
  status: 'pending' | 'approved' | 'reimbursed';
  entityId: string;
}
```

### Reimbursement Request
```typescript
interface ReimbursementRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  totalAmount: number;
  status: 'pending' | 'approved' | 'denied';
  expenses: Expense[];
}
```

## State Management

### Local State
- `activeTab` - Current tab selection
- `reconcileDialogOpen` - Reconciliation dialog visibility
- `selectedTransaction` - Transaction being reconciled
- `submitExpenseOpen` - Expense submission dialog
- `viewExpenseOpen` - Expense detail view dialog
- `selectedExpense` - Expense being viewed
- `distributeOpen` - Distribution dialog
- `selectedReimbursement` - Reimbursement being processed
- `reconcileData` - Form data for reconciliation
- `expenseData` - Form data for expense submission

### Global State (AppContext)
- `selectedEntity` - Current organization filter

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- `mockData` - Bank transactions, expenses, reimbursements
- UI components (Card, Button, Badge, Tabs, Table, Dialog, Select, Input, Textarea)
- `PageHeader` component

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications

## Related Documentation
- [09-RECONCILIATION-MANAGER.md](../accounting/09-RECONCILIATION-MANAGER.md)
- [06-EXPENSES-MANAGER.md](../accounting/06-EXPENSES-MANAGER.md)
- [07-REIMBURSEMENTS-MANAGER.md](../accounting/07-REIMBURSEMENTS-MANAGER.md)
- [11-DISTRIBUTION-MANAGER.md](../accounting/11-DISTRIBUTION-MANAGER.md)
