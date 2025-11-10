# General Ledger

**Component File:** `src/components/GeneralLedger.tsx`  
**Route:** `/accounting-hub` (with tool='general-ledger')  
**Access Level:** Admin, Manager, Staff (view only)

## Overview
The General Ledger is the central repository of all financial transactions for the organization. It displays a chronological list of all debits and credits across all accounts, with filtering, search, and reconciliation capabilities. This is the source of truth for all financial reporting.

## UI Features

### Main Features
- **Date Range Filter:** Select start and end dates
- **Account Filter:** Filter by specific account
- **Category Filter:** Filter by transaction category
- **Source Filter:** Filter by transaction source (donation, expense, journal entry, etc.)
- **Reconciliation Filter:** Show only reconciled/unreconciled transactions
- **Search:** Search by description or reference number
- **Running Balance:** Display running balance for filtered view
- **Export:** Export ledger to CSV/Excel

### Ledger Table Columns
- Date
- Description
- Source (badge: Donation, Expense, Journal Entry, etc.)
- Account/Category
- Internal Code (account number)
- Reference Number
- Debit Amount
- Credit Amount
- Running Balance
- Reconciled Status (checkmark icon)
- Actions (Edit, Flag for review)

### Transaction Detail Sheet
- Full transaction details
- Edit capability (for journal entries)
- Link to source record
- Reconciliation status
- Audit trail (who created, when)

### Summary Cards
- Total Debits (period)
- Total Credits (period)
- Net Change
- Unreconciled Transactions Count

## Data Requirements

### Ledger Entry Data
- **id** (uuid) - Unique identifier
- **organization_id** (uuid) - Organization owner
- **transaction_date** (date) - Transaction date
- **description** (text) - Transaction description
- **source_type** (string) - 'donation', 'expense', 'journal_entry', 'reimbursement', 'deposit', 'reconciliation'
- **source_id** (uuid) - ID of source record
- **account_id** (uuid) - Chart of accounts reference
- **account_number** (string) - Account code
- **account_name** (string) - Account name
- **fund_id** (uuid, nullable) - Fund reference
- **debit_amount** (decimal) - Debit amount (expenses, assets increase)
- **credit_amount** (decimal) - Credit amount (income, liabilities increase)
- **reference_number** (string, nullable) - Check number, invoice number, etc.
- **is_reconciled** (boolean) - Reconciliation status
- **reconciled_at** (datetime, nullable) - When reconciled
- **reconciled_by_id** (uuid, nullable) - Who reconciled
- **flagged** (boolean) - Flagged for review
- **notes** (text, nullable) - Additional notes
- **created_by_id** (uuid) - User who created
- **created_at** (datetime) - When created
- **updated_at** (datetime) - When updated

### Data Mutations
- **Flag Transaction:** Mark for review
- **Unflag Transaction:** Remove flag
- **Mark Reconciled:** Mark as reconciled
- **Mark Unreconciled:** Unmark reconciliation
- **Edit Transaction:** Edit journal entry transactions only
- **Add Note:** Add note to transaction

## API Endpoints Required

### GET /api/v1/ledger/entries
```
Description: Fetch general ledger entries
Query Parameters:
  - organization_id (required, uuid)
  - start_date (optional, date) - Filter by date range
  - end_date (optional, date) - Filter by date range
  - account_id (optional, uuid) - Filter by account
  - fund_id (optional, uuid) - Filter by fund
  - source_type (optional, string) - Filter by source type
  - is_reconciled (optional, boolean) - Filter by reconciliation status
  - flagged (optional, boolean) - Filter flagged transactions
  - search (optional, string) - Search description or reference
  - page (optional, integer, default: 1)
  - per_page (optional, integer, default: 100)
  - sort_by (optional, string, default: 'date_desc')

Response: {
  data: [
    {
      id: "uuid",
      organization_id: "uuid",
      transaction_date: "2024-11-08",
      description: "Donation from John Doe",
      source_type: "donation",
      source_id: "uuid",
      account_id: "uuid",
      account_number: "4500",
      account_name: "Direct Public Support",
      fund_id: "uuid",
      fund_name: "General Fund",
      debit_amount: 0.00,
      credit_amount: 100.00,
      reference_number: "DON-12345",
      is_reconciled: true,
      reconciled_at: "2024-11-09T10:00:00Z",
      reconciled_by: "Jane Smith",
      flagged: false,
      notes: null,
      created_by: "System",
      created_at: "2024-11-08T14:30:00Z",
      updated_at: "2024-11-09T10:00:00Z"
    }
  ],
  meta: {
    total: 1523,
    page: 1,
    per_page: 100,
    total_pages: 16,
    total_debits: 250000.00,
    total_credits: 275000.00,
    net_change: 25000.00,
    unreconciled_count: 45
  }
}
```

### GET /api/v1/ledger/entries/:id
```
Description: Get single ledger entry details
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  data: {
    id: "uuid",
    ...all ledger entry fields,
    source_record: {
      // Full details of source record (donation, expense, etc.)
    },
    audit_trail: [
      {
        action: "created",
        user: "Jane Smith",
        timestamp: "2024-11-08T14:30:00Z"
      }
    ]
  }
}
```

### PUT /api/v1/ledger/entries/:id/flag
```
Description: Flag transaction for review
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  flagged: true,
  notes: "Needs review - unusual amount"
}

Response: {
  data: {
    id: "uuid",
    flagged: true,
    notes: "Needs review - unusual amount"
  },
  message: "Transaction flagged successfully"
}
```

### PUT /api/v1/ledger/entries/:id/reconcile
```
Description: Mark transaction as reconciled
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  is_reconciled: true
}

Response: {
  data: {
    id: "uuid",
    is_reconciled: true,
    reconciled_at: "2024-11-08T10:30:00Z",
    reconciled_by: "Jane Smith"
  },
  message: "Transaction marked as reconciled"
}
```

### POST /api/v1/ledger/entries/:id/notes
```
Description: Add note to transaction
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  note: "Verified with bank statement"
}

Response: {
  data: {
    id: "uuid",
    notes: "Verified with bank statement",
    updated_at: "2024-11-08T10:30:00Z"
  },
  message: "Note added successfully"
}
```

### GET /api/v1/ledger/summary
```
Description: Get ledger summary for date range
Query Parameters:
  - organization_id (required, uuid)
  - start_date (required, date)
  - end_date (required, date)
  - account_id (optional, uuid)
  - fund_id (optional, uuid)

Response: {
  data: {
    period: {
      start_date: "2024-01-01",
      end_date: "2024-11-08"
    },
    total_debits: 250000.00,
    total_credits: 275000.00,
    net_change: 25000.00,
    transaction_count: 1523,
    reconciled_count: 1478,
    unreconciled_count: 45,
    flagged_count: 3,
    by_account_type: {
      asset: { debits: 100000.00, credits: 50000.00 },
      liability: { debits: 25000.00, credits: 30000.00 },
      equity: { debits: 0.00, credits: 25000.00 },
      income: { debits: 0.00, credits: 150000.00 },
      expense: { debits: 125000.00, credits: 0.00 }
    },
    by_source_type: {
      donation: 150000.00,
      expense: 75000.00,
      journal_entry: 50000.00
    }
  }
}
```

### GET /api/v1/ledger/export
```
Description: Export ledger to CSV/Excel
Query Parameters:
  - organization_id (required, uuid)
  - start_date (optional, date)
  - end_date (optional, date)
  - account_id (optional, uuid)
  - format (optional, string) - 'csv' or 'excel', default: 'csv'

Response: File download
```

### GET /api/v1/ledger/trial_balance
```
Description: Generate trial balance report
Query Parameters:
  - organization_id (required, uuid)
  - as_of_date (required, date)

Response: {
  data: {
    as_of_date: "2024-11-08",
    accounts: [
      {
        account_number: "1000",
        account_name: "Cash and Cash Equivalents",
        account_type: "asset",
        debit_balance: 125000.00,
        credit_balance: 0.00
      },
      {
        account_number: "4500",
        account_name: "Direct Public Support",
        account_type: "income",
        debit_balance: 0.00,
        credit_balance: 150000.00
      }
    ],
    totals: {
      total_debits: 250000.00,
      total_credits: 250000.00,
      difference: 0.00,
      in_balance: true
    }
  }
}
```

## Request/Response Schemas

### LedgerEntry Schema
```typescript
interface LedgerEntry {
  id: string;
  organization_id: string;
  transaction_date: string;
  description: string;
  source_type: 'donation' | 'expense' | 'journal_entry' | 'reimbursement' | 'deposit' | 'reconciliation';
  source_id: string;
  account_id: string;
  account_number: string;
  account_name: string;
  fund_id?: string;
  fund_name?: string;
  debit_amount: number;
  credit_amount: number;
  reference_number?: string;
  is_reconciled: boolean;
  reconciled_at?: string;
  reconciled_by?: string;
  flagged: boolean;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface LedgerSummary {
  period: {
    start_date: string;
    end_date: string;
  };
  total_debits: number;
  total_credits: number;
  net_change: number;
  transaction_count: number;
  reconciled_count: number;
  unreconciled_count: number;
  flagged_count: number;
  by_account_type: Record<string, { debits: number; credits: number }>;
  by_source_type: Record<string, number>;
}
```

## Authentication & Authorization

### Required Permissions
- `ledger:read` - View ledger entries
- `ledger:write` - Edit entries (journal entries only)
- `ledger:reconcile` - Mark transactions as reconciled
- `ledger:export` - Export ledger data

### Role-Based Access
- **Admin:** Full access to all ledger operations
- **Manager:** Can view, reconcile, flag, export
- **Staff:** Can view and export only
- **Volunteer:** No access

## Business Logic & Validations

### Frontend Validations
- Date range required for filtering
- Cannot edit system-generated entries (only journal entries)
- Cannot unreconcile transactions from closed periods

### Backend Validations (Rails)
- Ledger entries are immutable (except journal entries)
- Debits must equal credits for journal entries
- Cannot delete ledger entries (audit trail)
- Reconciliation requires proper permissions
- Closed accounting periods cannot be modified

### Business Rules
- All financial transactions create ledger entries automatically
- Donations create credit entries to income accounts
- Expenses create debit entries to expense accounts
- Journal entries can have multiple debits and credits
- Running balance calculated in real-time
- Trial balance must always balance (total debits = total credits)
- Reconciled transactions locked from editing
- Flagged transactions require review before closing period

## State Management

### Local State
- `dateRange` - Start and end dates
- `accountFilter` - Selected account
- `sourceFilter` - Selected source type
- `reconciledFilter` - Reconciliation status filter
- `searchQuery` - Search input
- `selectedEntry` - Currently selected entry
- `detailSheetOpen` - Detail sheet state
- `entries` - Ledger entries array
- `summary` - Summary statistics

### Global State (AppContext)
- `selectedEntity` - Current organization

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- Mock data - **TO BE REMOVED** - `generateMockTransactions()`
- UI components (Card, Button, Table, Sheet, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications
- Date library for date range picker

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load ledger entries", retry
2. **Permission Error:** Show toast "You don't have permission"
3. **Invalid Date Range:** Show error "End date must be after start date"
4. **Export Failed:** Show toast "Export failed. Please try again."
5. **Reconciliation Failed:** Show toast "Failed to reconcile transaction"

## Loading States
- **Initial load:** Skeleton table with 20 rows
- **Date range change:** Loading overlay on table
- **Export:** Show progress indicator
- **Detail sheet:** Loading spinner while fetching details

## Mock Data to Remove
- `GeneralLedger.tsx` - `generateMockTransactions()` function
- Move `LedgerEntry` interface to `src/types/ledger.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/ledger.ts`
2. Create `src/types/ledger.ts`
3. Replace mock data with API calls
4. Implement date range filtering

### Phase 2: Advanced Features
1. Implement reconciliation marking
2. Implement flagging system
3. Implement notes functionality
4. Implement export functionality

### Phase 3: Real-time Updates
1. Consider WebSocket for real-time ledger updates
2. Or implement polling for new transactions
3. Update running balance calculations

### Phase 4: Performance
1. Implement virtual scrolling for large datasets
2. Optimize balance calculations
3. Add caching for frequently accessed date ranges

## Related Documentation
- [03-CHART-OF-ACCOUNTS.md](./03-CHART-OF-ACCOUNTS.md) - Account structure
- [05-JOURNAL-ENTRY-MANAGER.md](./05-JOURNAL-ENTRY-MANAGER.md) - Manual entries
- [06-RECONCILIATION-MANAGER.md](./06-RECONCILIATION-MANAGER.md) - Bank reconciliation
- [01-DATA-SCHEMA.md](../01-DATA-SCHEMA.md) - Ledger data model
