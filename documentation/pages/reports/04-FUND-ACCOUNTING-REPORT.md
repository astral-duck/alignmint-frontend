# Fund Accounting Report

**Component File:** `src/components/FundAccounting.tsx`  
**Route:** `/reports` (with tool='fund-accounting')  
**Access Level:** Admin, Manager

## Overview
The Fund Accounting Report provides a comprehensive view of fund-specific financial activities including reconciliation, expense tracking, reimbursements, and distribution management. This report is critical for fiscal sponsors managing multiple nonprofit funds, ensuring proper segregation and tracking of financial activities for each entity.

## UI Features

### Main Features
- **Summary Metrics Cards:**
  - Unreconciled Transactions (count and total amount)
  - Pending Expenses (count and total amount)
  - Approved Expenses (count and total amount)
  - Pending Payouts/Reimbursements (count and total amount)
- **Tab Navigation:**
  - Reconciliation Tab
  - Expenses Tab
  - Reimbursements Tab
  - Distribution Tab
- **Reconciliation Tab:**
  - Unreconciled transactions table
  - Reconcile button for each transaction
  - Reconciliation dialog with category and entity assignment
  - Reconciled transactions history
- **Expenses Tab:**
  - Pending expenses table
  - Approved expenses table
  - Submit new expense button
  - View expense details
  - Approve/reject actions
- **Reimbursements Tab:**
  - Pending reimbursement requests
  - Approved reimbursements
  - Process reimbursement button
  - View reimbursement details
- **Distribution Tab:**
  - Fund distribution management
  - Distribute funds to nonprofits
  - Distribution history

### Summary Cards Layout
```
┌─────────────────────┐ ┌─────────────────────┐
│ 🔴 Unreconciled     │ │ ⏰ Pending Expenses │
│ 12 transactions     │ │ 8 expenses          │
│ $5,432.10           │ │ $2,150.00           │
└─────────────────────┘ └─────────────────────┘

┌─────────────────────┐ ┌─────────────────────┐
│ ✅ Approved         │ │ 📤 Pending Payouts  │
│ 15 expenses         │ │ 5 reimbursements    │
│ $8,900.00           │ │ $1,250.00           │
└─────────────────────┘ └─────────────────────┘
```

### Reconciliation Tab
```
Unreconciled Transactions

Date       | Description              | Vendor    | Amount    | Type   | Actions
-----------|--------------------------|-----------|-----------|--------|----------
2025-10-15 | Office Supplies Purchase | Staples   | -$245.00  | Debit  | [Reconcile]
2025-10-14 | Donation - John Doe      | -         | +$500.00  | Credit | [Reconcile]
2025-10-13 | Monthly Rent Payment     | Landlord  | -$1,500   | Debit  | [Reconcile]
```

### Reconciliation Dialog
- **Transaction Details:** Date, description, amount, vendor
- **Category Selector:** Dropdown of expense/income categories
- **Entity Assignment:** Select which nonprofit entity
- **Notes:** Optional reconciliation notes
- **Actions:** Reconcile or Cancel

## Data Requirements

### Summary Metrics
- **unreconciled_count** (integer) - Number of unreconciled transactions
- **unreconciled_total** (decimal) - Total amount unreconciled
- **pending_expenses_count** (integer) - Number of pending expenses
- **pending_expenses_total** (decimal) - Total pending expenses
- **approved_expenses_count** (integer) - Number of approved expenses
- **approved_expenses_total** (decimal) - Total approved expenses
- **pending_reimbursements_count** (integer) - Number of pending reimbursements
- **pending_reimbursements_total** (decimal) - Total pending reimbursements

### Bank Transaction (Unreconciled)
- **id** (uuid)
- **date** (date)
- **description** (string)
- **vendor** (string, nullable)
- **amount** (decimal)
- **type** (enum) - 'credit' or 'debit'
- **reconciled** (boolean) - false for unreconciled
- **category** (string, nullable)
- **entity_id** (uuid, nullable)

### Expense
- **id** (uuid)
- **date** (date)
- **description** (string)
- **amount** (decimal)
- **category** (string)
- **vendor** (string)
- **status** (enum) - 'pending', 'approved', 'rejected', 'reimbursed'
- **entity_id** (uuid)
- **submitter_id** (uuid)
- **approver_id** (uuid, nullable)
- **receipt_url** (string, nullable)

### Reimbursement Request
- **id** (uuid)
- **employee_id** (uuid)
- **employee_name** (string)
- **submission_date** (date)
- **total_amount** (decimal)
- **status** (enum) - 'pending', 'approved', 'rejected', 'paid'
- **expense_items** (array) - List of expenses
- **entity_id** (uuid)
- **notes** (string, nullable)

### Distribution
- **id** (uuid)
- **from_entity_id** (uuid) - Fiscal sponsor
- **to_entity_id** (uuid) - Nonprofit
- **amount** (decimal)
- **distribution_date** (date)
- **purpose** (string)
- **status** (enum) - 'pending', 'completed'

## API Endpoints Required

### GET /api/v1/fund_accounting/summary
```
Description: Get fund accounting summary metrics
Query Parameters:
  - organization_id (required, uuid)

Response: {
  data: {
    unreconciled: {
      count: 12,
      total: 5432.10
    },
    pending_expenses: {
      count: 8,
      total: 2150.00
    },
    approved_expenses: {
      count: 15,
      total: 8900.00
    },
    pending_reimbursements: {
      count: 5,
      total: 1250.00
    }
  }
}
```

### GET /api/v1/fund_accounting/unreconciled_transactions
```
Description: Get unreconciled bank transactions
Query Parameters:
  - organization_id (required, uuid)
  - page (optional, integer)
  - per_page (optional, integer)

Response: {
  data: [
    {
      id: "uuid",
      date: "2025-10-15",
      description: "Office Supplies Purchase",
      vendor: "Staples",
      amount: -245.00,
      type: "debit",
      reconciled: false,
      category: null,
      entity_id: null
    }
  ],
  meta: {
    total: 12,
    page: 1,
    per_page: 50
  }
}
```

### POST /api/v1/fund_accounting/reconcile_transaction
```
Description: Reconcile a bank transaction
Request Body: {
  transaction_id: "uuid",
  category: "Office Supplies",
  entity_id: "uuid",
  notes: "Monthly office supplies"
}

Response: {
  data: {
    id: "uuid",
    reconciled: true,
    category: "Office Supplies",
    entity_id: "uuid"
  },
  message: "Transaction reconciled successfully"
}
```

### GET /api/v1/fund_accounting/expenses
```
Description: Get expenses by status
Query Parameters:
  - organization_id (required, uuid)
  - status (optional, enum) - 'pending', 'approved', 'rejected', 'reimbursed'
  - page (optional, integer)
  - per_page (optional, integer)

Response: {
  data: [
    {
      id: "uuid",
      date: "2025-10-10",
      description: "Conference Registration",
      amount: 350.00,
      category: "Training",
      vendor: "Conference Inc",
      status: "pending",
      entity_id: "uuid",
      submitter_id: "uuid",
      submitter_name: "John Doe",
      receipt_url: "https://..."
    }
  ],
  meta: {
    total: 8,
    page: 1,
    per_page: 50
  }
}
```

### POST /api/v1/fund_accounting/approve_expense
```
Description: Approve an expense
Request Body: {
  expense_id: "uuid",
  notes: "Approved for reimbursement"
}

Response: {
  data: {
    id: "uuid",
    status: "approved",
    approver_id: "uuid",
    approved_at: "2025-10-20T10:00:00Z"
  },
  message: "Expense approved successfully"
}
```

### GET /api/v1/fund_accounting/reimbursements
```
Description: Get reimbursement requests
Query Parameters:
  - organization_id (required, uuid)
  - status (optional, enum) - 'pending', 'approved', 'rejected', 'paid'
  - page (optional, integer)
  - per_page (optional, integer)

Response: {
  data: [
    {
      id: "uuid",
      employee_id: "uuid",
      employee_name: "Jane Smith",
      submission_date: "2025-10-15",
      total_amount: 450.00,
      status: "pending",
      expense_items: [
        {
          description: "Travel - Client Meeting",
          amount: 250.00,
          category: "Travel"
        },
        {
          description: "Meals - Business Lunch",
          amount: 200.00,
          category: "Meals"
        }
      ],
      entity_id: "uuid"
    }
  ],
  meta: {
    total: 5,
    page: 1,
    per_page: 50
  }
}
```

### POST /api/v1/fund_accounting/process_reimbursement
```
Description: Process a reimbursement request
Request Body: {
  reimbursement_id: "uuid",
  action: "approve", // or "reject"
  notes: "Approved for payment"
}

Response: {
  data: {
    id: "uuid",
    status: "approved",
    processed_at: "2025-10-20T10:00:00Z"
  },
  message: "Reimbursement processed successfully"
}
```

### POST /api/v1/fund_accounting/distribute_funds
```
Description: Distribute funds to nonprofit
Request Body: {
  from_entity_id: "uuid", // Fiscal sponsor
  to_entity_id: "uuid",   // Nonprofit
  amount: 5000.00,
  purpose: "Monthly distribution",
  distribution_date: "2025-10-20"
}

Response: {
  data: {
    id: "uuid",
    status: "completed",
    created_at: "2025-10-20T10:00:00Z"
  },
  message: "Funds distributed successfully"
}
```

## Request/Response Schemas

```typescript
interface FundAccountingSummary {
  unreconciled: { count: number; total: number };
  pending_expenses: { count: number; total: number };
  approved_expenses: { count: number; total: number };
  pending_reimbursements: { count: number; total: number };
}

interface BankTransaction {
  id: string;
  date: string;
  description: string;
  vendor?: string;
  amount: number;
  type: 'credit' | 'debit';
  reconciled: boolean;
  category?: string;
  entity_id?: string;
}

interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  vendor: string;
  status: 'pending' | 'approved' | 'rejected' | 'reimbursed';
  entity_id: string;
  submitter_id: string;
  submitter_name: string;
  approver_id?: string;
  receipt_url?: string;
}

interface ReimbursementRequest {
  id: string;
  employee_id: string;
  employee_name: string;
  submission_date: string;
  total_amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  expense_items: ExpenseItem[];
  entity_id: string;
  notes?: string;
}

interface ExpenseItem {
  description: string;
  amount: number;
  category: string;
}

interface Distribution {
  id: string;
  from_entity_id: string;
  to_entity_id: string;
  amount: number;
  distribution_date: string;
  purpose: string;
  status: 'pending' | 'completed';
}
```

## Authentication & Authorization

### Required Permissions
- `fund_accounting:read` - View fund accounting data
- `fund_accounting:reconcile` - Reconcile transactions
- `fund_accounting:approve_expenses` - Approve expenses
- `fund_accounting:process_reimbursements` - Process reimbursements
- `fund_accounting:distribute` - Distribute funds (fiscal sponsor only)

### Role-Based Access
- **Fiscal Sponsor:** Full access to all functions including distribution
- **Nonprofit User:** Access to their entity's data only, cannot distribute
- **Staff:** View-only access
- **Donor/Volunteer:** No access

## Business Logic & Validations

### Frontend Validations
- Category required for reconciliation
- Entity required for reconciliation
- Amount must be positive for distributions
- Distribution date cannot be in future

### Backend Validations (Rails)
- Valid organization access
- Transaction not already reconciled
- Expense exists and not already approved
- Reimbursement exists and not already processed
- Sufficient funds for distribution
- Valid entity relationships

### Business Rules
- Only unreconciled transactions can be reconciled
- Expenses must be approved before reimbursement
- Reimbursements create ledger entries when paid
- Distributions only from fiscal sponsor to nonprofits
- All transactions create audit trail

## State Management

### Local State
- `activeTab` - Current tab ('reconciliation', 'expenses', 'reimbursements', 'distribution')
- `reconcileDialogOpen` - Reconciliation dialog visibility
- `selectedTransaction` - Transaction being reconciled
- `submitExpenseOpen` - Submit expense dialog
- `viewExpenseOpen` - View expense details dialog
- `selectedExpense` - Expense being viewed
- `distributeOpen` - Distribution dialog
- `selectedReimbursement` - Reimbursement being processed

### Global State (AppContext)
- `selectedEntity` - Current organization

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- Mock data - **TO BE REMOVED** - `getBankTransactions()`, `getExpenses()`, `getReimbursementRequests()`
- UI components (Card, Button, Table, Dialog, Tabs, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load data"
2. **Reconciliation Failed:** Show toast "Failed to reconcile"
3. **Approval Failed:** Show toast "Failed to approve expense"
4. **Distribution Failed:** Show toast "Distribution failed"
5. **Permission Error:** Show toast "No permission"

## Loading States
- **Initial load:** Skeleton cards and tables
- **Tab change:** Loading spinner
- **Action processing:** Button loading state
- **Dialog actions:** Disabled buttons during processing

## Mock Data to Remove
- `FundAccounting.tsx` - `getBankTransactions()`, `getExpenses()`, `getReimbursementRequests()` from mockData
- `mockData.ts` - Mock fund accounting data
- Move interfaces to `src/types/fund-accounting.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/fund-accounting.ts`
2. Create `src/types/fund-accounting.ts`
3. Implement summary endpoint
4. Implement transaction endpoints

### Phase 2: Reconciliation
1. Implement reconciliation UI
2. Test category assignment
3. Test entity assignment
4. Add reconciliation history

### Phase 3: Expense & Reimbursement
1. Implement expense approval workflow
2. Implement reimbursement processing
3. Test approval notifications
4. Add payment tracking

### Phase 4: Distribution
1. Implement distribution UI (fiscal sponsor only)
2. Test fund transfers
3. Add distribution history
4. Implement audit logging

## Related Documentation
- [../accounting/09-RECONCILIATION-MANAGER.md](../accounting/09-RECONCILIATION-MANAGER.md)
- [../accounting/06-EXPENSES-MANAGER.md](../accounting/06-EXPENSES-MANAGER.md)
- [../accounting/07-REIMBURSEMENTS-MANAGER.md](../accounting/07-REIMBURSEMENTS-MANAGER.md)
- [../accounting/04-GENERAL-LEDGER.md](../accounting/04-GENERAL-LEDGER.md)
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md)

## Additional Notes

### Fund Segregation
- Each nonprofit has separate fund tracking
- Fiscal sponsor manages all funds
- Strict data isolation between entities
- All transactions tagged with entity_id

### Workflow Integration
1. **Bank Transaction** → Reconciliation → **General Ledger Entry**
2. **Expense Submission** → Approval → **Reimbursement** → Payment → **Ledger Entry**
3. **Distribution Request** → Approval → **Fund Transfer** → **Ledger Entries** (both entities)

### Audit Trail
All actions logged:
- Who reconciled transaction
- Who approved expense
- Who processed reimbursement
- Who distributed funds
- Timestamps for all actions
