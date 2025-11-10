# Reconciliation Manager

**Component File:** `src/components/ReconciliationManager.tsx`  
**Route:** `/accounting-hub` (with tool='reconciliation')  
**Access Level:** Admin, Manager

## Overview
The Reconciliation Manager facilitates bank reconciliation by matching bank statement transactions with ledger entries. Users can upload bank statements, automatically match transactions, manually match unmatched items, and resolve discrepancies. This ensures the organization's books accurately reflect bank activity.

## UI Features

### Main Features
- **Bank Statement Upload:**
  - CSV/Excel file upload
  - PDF statement upload (with parsing)
  - Manual entry option
- **Reconciliation Tabs:**
  - Bank Transactions (from statement)
  - Ledger Transactions (from system)
  - Matched Pairs
  - Unmatched Items
  - Discrepancies
- **Automatic Matching:**
  - Match by amount and date
  - Match by reference number
  - Batch deposit matching
  - Confidence score display
- **Manual Matching:**
  - Select bank transaction
  - Select ledger transaction(s)
  - Create match
  - Unmatch if needed
- **Reconciliation Summary:**
  - Beginning balance
  - Ending balance (statement)
  - Ending balance (ledger)
  - Difference
  - Matched count
  - Unmatched count

### Bank Transactions Table
- Date
- Reference/Check Number
- Description
- Debit Amount
- Credit Amount
- Matched Status (checkmark icon)
- Select checkbox

### Ledger Transactions Table
- Date
- Reference Number
- Description
- Debit Amount
- Credit Amount
- Matched Status (checkmark icon)
- Batch indicator (if batch deposit)
- Select checkbox

### Matched Pairs Table
- Bank Date
- Ledger Date
- Description
- Amount
- Matched Date
- Unmatch button

### Reconciliation Form
- Bank Account selection
- Statement Date
- Beginning Balance
- Ending Balance (from statement)
- Upload Statement button
- Auto-Match button
- Complete Reconciliation button

## Data Requirements

### Reconciliation Data
- **id** (uuid) - Unique identifier
- **organization_id** (uuid) - Organization owner
- **account_id** (uuid) - Bank account being reconciled
- **account_name** (string) - Account name
- **reconciliation_date** (date) - Date of reconciliation
- **statement_date** (date) - Bank statement date
- **beginning_balance** (decimal) - Starting balance
- **ending_balance** (decimal) - Statement ending balance
- **statement_balance** (decimal) - Calculated statement balance
- **ledger_balance** (decimal) - Calculated ledger balance
- **difference** (decimal) - Difference between statement and ledger
- **status** (string) - 'in_progress', 'completed', 'reviewed'
- **reconciled_by_id** (uuid) - User performing reconciliation
- **reviewed_by_id** (uuid, nullable) - User who reviewed
- **notes** (text, nullable) - Reconciliation notes
- **statement_file_url** (string, nullable) - Uploaded statement
- **created_at** (datetime) - When created
- **updated_at** (datetime) - When updated

### Reconciliation Item Data
- **id** (uuid) - Unique identifier
- **reconciliation_id** (uuid) - Parent reconciliation
- **transaction_id** (uuid, nullable) - Ledger transaction ID
- **transaction_type** (string, nullable) - Type of transaction
- **transaction_date** (date) - Transaction date
- **description** (string) - Transaction description
- **amount** (decimal) - Transaction amount
- **is_cleared** (boolean) - Cleared/matched status
- **bank_reference** (string, nullable) - Bank reference number
- **ledger_reference** (string, nullable) - Ledger reference number
- **created_at** (datetime) - When created
- **updated_at** (datetime) - When updated

### Data Mutations
- **Create Reconciliation:** Start new reconciliation
- **Update Reconciliation:** Update in-progress reconciliation
- **Delete Reconciliation:** Delete in-progress reconciliation
- **Upload Statement:** Upload bank statement file
- **Auto-Match:** Automatically match transactions
- **Manual Match:** Manually match transactions
- **Unmatch:** Remove match
- **Complete Reconciliation:** Finalize reconciliation

## API Endpoints Required

### GET /api/v1/reconciliations
```
Description: Fetch reconciliations
Query Parameters:
  - organization_id (required, uuid)
  - account_id (optional, uuid)
  - status (optional, string) - 'in_progress', 'completed', 'reviewed', 'all'
  - start_date (optional, date)
  - end_date (optional, date)
  - page (optional, integer, default: 1)
  - per_page (optional, integer, default: 25)

Response: {
  data: [
    {
      id: "uuid",
      organization_id: "uuid",
      account_id: "uuid",
      account_name: "Operating Checking",
      reconciliation_date: "2024-11-08",
      statement_date: "2024-10-31",
      beginning_balance: 50000.00,
      ending_balance: 52500.00,
      statement_balance: 52500.00,
      ledger_balance: 52450.00,
      difference: 50.00,
      status: "in_progress",
      reconciled_by: "Jane Smith",
      reviewed_by: null,
      notes: null,
      created_at: "2024-11-08T10:00:00Z",
      updated_at: "2024-11-08T14:30:00Z"
    }
  ],
  meta: {
    total: 24,
    page: 1,
    per_page: 25,
    total_pages: 1
  }
}
```

### GET /api/v1/reconciliations/:id
```
Description: Get reconciliation with items
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  data: {
    id: "uuid",
    ...all reconciliation fields,
    items: [
      {
        id: "uuid",
        transaction_id: "uuid",
        transaction_type: "donation",
        transaction_date: "2024-10-15",
        description: "Donation from John Doe",
        amount: 150.00,
        is_cleared: true,
        bank_reference: "DEP-1234",
        ledger_reference: "DON-5678"
      }
    ],
    matched_count: 45,
    unmatched_bank_count: 3,
    unmatched_ledger_count: 2
  }
}
```

### POST /api/v1/reconciliations
```
Description: Create new reconciliation
Request Body: {
  organization_id: "uuid",
  account_id: "uuid",
  statement_date: "2024-10-31",
  beginning_balance: 50000.00,
  ending_balance: 52500.00,
  notes: null
}

Response: {
  data: {
    id: "uuid",
    ...all reconciliation fields
  },
  message: "Reconciliation created successfully"
}
```

### PUT /api/v1/reconciliations/:id
```
Description: Update reconciliation (in_progress only)
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  ending_balance: 52500.00,
  notes: "Updated notes"
}

Response: {
  data: {
    id: "uuid",
    ...updated fields
  },
  message: "Reconciliation updated successfully"
}
```

### DELETE /api/v1/reconciliations/:id
```
Description: Delete reconciliation (in_progress only)
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  message: "Reconciliation deleted successfully"
}
```

### POST /api/v1/reconciliations/:id/upload_statement
```
Description: Upload bank statement file
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  file: "multipart/form-data" (CSV, Excel, or PDF)
}

Response: {
  data: {
    id: "uuid",
    statement_file_url: "https://...",
    parsed_transactions: [
      {
        date: "2024-10-15",
        description: "ACH DEPOSIT",
        debit: 0.00,
        credit: 150.00,
        reference: "DEP-1234"
      }
    ]
  },
  message: "Statement uploaded and parsed successfully"
}

Note: Parses CSV/Excel automatically, PDF may require OCR
```

### POST /api/v1/reconciliations/:id/auto_match
```
Description: Automatically match transactions
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  match_criteria: {
    amount_tolerance: 0.01, // Allow $0.01 difference
    date_range_days: 3, // Match within 3 days
    match_by_reference: true
  }
}

Response: {
  data: {
    matched_count: 42,
    unmatched_bank_count: 5,
    unmatched_ledger_count: 3,
    matches: [
      {
        bank_transaction_id: "uuid",
        ledger_transaction_id: "uuid",
        confidence_score: 0.95
      }
    ]
  },
  message: "Auto-matching completed"
}
```

### POST /api/v1/reconciliations/:id/manual_match
```
Description: Manually match transactions
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  bank_transaction_ids: ["uuid1"],
  ledger_transaction_ids: ["uuid2", "uuid3"] // Can match one bank to multiple ledger
}

Response: {
  data: {
    match_id: "uuid",
    bank_amount: 500.00,
    ledger_amount: 500.00,
    difference: 0.00
  },
  message: "Transactions matched successfully"
}
```

### POST /api/v1/reconciliations/:id/unmatch
```
Description: Remove match
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  match_id: "uuid"
}

Response: {
  message: "Match removed successfully"
}
```

### POST /api/v1/reconciliations/:id/complete
```
Description: Complete reconciliation
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  force_complete: false // If true, complete even with discrepancies
}

Response: {
  data: {
    id: "uuid",
    status: "completed",
    difference: 0.00,
    completed_at: "2024-11-08T15:00:00Z"
  },
  message: "Reconciliation completed successfully"
}

Note: Fails if difference != 0 unless force_complete = true
```

### GET /api/v1/reconciliations/:id/unmatched_transactions
```
Description: Get unmatched transactions
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)
  - type (optional, string) - 'bank', 'ledger', 'both'

Response: {
  data: {
    bank_transactions: [
      {
        id: "uuid",
        date: "2024-10-20",
        description: "Unknown deposit",
        amount: 50.00,
        reference: "DEP-9999"
      }
    ],
    ledger_transactions: [
      {
        id: "uuid",
        date: "2024-10-22",
        description: "Check #1234",
        amount: 75.00,
        reference: "CHK-1234"
      }
    ]
  }
}
```

## Request/Response Schemas

### Reconciliation Schema
```typescript
interface Reconciliation {
  id: string;
  organization_id: string;
  account_id: string;
  account_name: string;
  reconciliation_date: string;
  statement_date: string;
  beginning_balance: number;
  ending_balance: number;
  statement_balance: number;
  ledger_balance: number;
  difference: number;
  status: 'in_progress' | 'completed' | 'reviewed';
  items?: ReconciliationItem[];
  matched_count?: number;
  unmatched_bank_count?: number;
  unmatched_ledger_count?: number;
  reconciled_by: string;
  reviewed_by?: string;
  notes?: string;
  statement_file_url?: string;
  created_at: string;
  updated_at: string;
}

interface ReconciliationItem {
  id: string;
  reconciliation_id: string;
  transaction_id?: string;
  transaction_type?: string;
  transaction_date: string;
  description: string;
  amount: number;
  is_cleared: boolean;
  bank_reference?: string;
  ledger_reference?: string;
}
```

## Authentication & Authorization

### Required Permissions
- `reconciliations:read` - View reconciliations
- `reconciliations:write` - Create and update reconciliations
- `reconciliations:delete` - Delete reconciliations
- `reconciliations:complete` - Complete reconciliations

### Role-Based Access
- **Admin:** Full access to all operations
- **Manager:** Can create, update, complete
- **Staff:** Can view only
- **Volunteer:** No access

## Business Logic & Validations

### Frontend Validations
- Statement date required
- Beginning balance required
- Ending balance required
- Bank account selection required
- Cannot complete with unmatched items (unless forced)
- Difference should be 0.00 to complete

### Backend Validations (Rails)
- Valid statement date
- Beginning balance must match previous ending balance
- Cannot edit/delete completed reconciliations
- Statement file must be valid format (CSV, Excel, PDF)
- Auto-match criteria must be reasonable
- Manual match amounts should be close (warn if > 5% difference)

### Business Rules
- Reconciliations done monthly or as needed
- Completed reconciliations are immutable
- Matched transactions marked as reconciled in ledger
- Unmatched items require investigation
- Discrepancies must be resolved before completion
- Statement upload optional (can enter manually)
- Batch deposits can match to multiple ledger entries
- Previous reconciliation's ending = current beginning

## State Management

### Local State
- `activeTab` - Current tab ('bank', 'ledger', 'matched', 'unmatched')
- `reconciliation` - Current reconciliation data
- `bankTransactions` - Bank statement transactions
- `ledgerTransactions` - Ledger transactions
- `matchedPairs` - Matched transaction pairs
- `selectedBankIds` - Selected bank transactions
- `selectedLedgerIds` - Selected ledger transactions
- `uploadDialogOpen` - Upload dialog state
- `isMatching` - Auto-matching in progress

### Global State (AppContext)
- `selectedEntity` - Current organization

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- Mock data - **TO BE REMOVED** - Transaction generation
- UI components (Card, Button, Table, Tabs, Dialog, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications
- CSV/Excel parser library
- PDF parser (if supporting PDF statements)

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load reconciliation", retry
2. **Upload Failed:** Show error "Failed to upload statement"
3. **Parse Failed:** Show error "Unable to parse statement file"
4. **Match Failed:** Show toast "Failed to match transactions"
5. **Cannot Complete:** Show error "Cannot complete with discrepancies"
6. **Permission Error:** Show toast "You don't have permission"

## Loading States
- **Initial load:** Skeleton table
- **Statement upload:** Progress bar
- **Auto-matching:** Show spinner with "Matching transactions..."
- **Complete reconciliation:** Show confirmation with spinner

## Mock Data to Remove
- `ReconciliationManager.tsx` - `generateMockBankTransactions()` function
- `ReconciliationManager.tsx` - Mock ledger transactions
- Move interfaces to `src/types/reconciliation.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/reconciliations.ts`
2. Create `src/types/reconciliation.ts`
3. Implement reconciliation list
4. Implement create reconciliation

### Phase 2: Statement Upload
1. Implement CSV parser
2. Implement Excel parser
3. Optionally implement PDF parser
4. Test various statement formats

### Phase 3: Matching Logic
1. Implement auto-match algorithm
2. Implement manual match
3. Implement unmatch
4. Test batch deposit matching

### Phase 4: Completion
1. Implement complete reconciliation
2. Update ledger transaction reconciled status
3. Test discrepancy handling
4. Implement review workflow

## Related Documentation
- [04-GENERAL-LEDGER.md](./04-GENERAL-LEDGER.md) - Source of ledger transactions
- [08-CHECK-DEPOSIT-MANAGER.md](./08-CHECK-DEPOSIT-MANAGER.md) - Creates deposits to reconcile
- [03-CHART-OF-ACCOUNTS.md](./03-CHART-OF-ACCOUNTS.md) - Bank accounts
- [01-DATA-SCHEMA.md](../01-DATA-SCHEMA.md) - Reconciliation data model
