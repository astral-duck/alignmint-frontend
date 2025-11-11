# General Ledger

**Component:** `GeneralLedger.tsx`  
**Module:** Accounting Hub  
**Status:** Refactored - Double-Entry Accounting System  
**Last Updated:** November 10, 2025

---

## Overview

The General Ledger is the **central hub** for all financial transactions in the system. It implements a proper double-entry accounting system with Chart of Accounts integration, running balance calculations, and comprehensive transaction tracking.

### Key Features
- ✅ Chart of Accounts integration
- ✅ Account-based transaction tracking
- ✅ Running balance calculation (backend-driven)
- ✅ Contact/Payee tracking
- ✅ Transaction type classification
- ✅ Memo field for detailed notes
- ✅ Reconciliation status tracking
- ✅ Advanced filtering (account, date, status)
- ✅ Export with all fields
- ✅ Transaction editing with validation

### Critical Architecture Note

**ALL transactions in the General Ledger originate from Journal Entries:**

```
Transaction Source (Donation, Expense, etc.)
    ↓
Creates Journal Entry (with multiple lines)
    ↓
Journal Entry Posted
    ↓
Creates Ledger Entries (one per line)
    ↓
Appears in General Ledger
```

This ensures:
- ✅ **Double-entry accounting** (debits always equal credits)
- ✅ **Atomic transactions** (all or nothing)
- ✅ **Audit trail** (can trace back to source)
- ✅ **Proper grouping** (related entries linked together)

**See:** `05-JOURNAL-ENTRY-MANAGER.md` for journal entry specifications

---

## Data Model

### Ledger Entry Structure

```typescript
interface LedgerEntry {
  id: string;
  journal_entry_id: string;      // CRITICAL: Links to source journal entry
  date: string;
  account: Account;              // Links to Chart of Accounts
  entityId: string;              // Fund/Nonprofit
  transactionType: TransactionType;
  referenceNumber?: string;
  contactName?: string;          // Payee/Donor name
  description: string;
  memo?: string;                 // Additional details
  debit: number;
  credit: number;
  runningBalance: number;        // Calculated by backend
  reconciled: boolean;
  // Legacy fields for backward compatibility
  source?: TransactionSource;
  category?: string;
  internalCode?: string;
}

interface Account {
  id: string;
  code: string;                  // e.g., "1000"
  name: string;                  // e.g., "IFM Checking/Peoples Bank"
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  full_name: string;             // e.g., "1000 - IFM Checking/Peoples Bank"
}

type TransactionType = 
  | 'deposit' 
  | 'check' 
  | 'journal_entry' 
  | 'transfer' 
  | 'payment' 
  | 'receipt';
```

---

## API Endpoints

### 1. List Ledger Entries

**GET** `/api/v1/general_ledger/entries`

**Query Parameters:**
```typescript
{
  organization_id: string;    // Required
  entity_id?: string;         // Optional - filter by fund/nonprofit
  account_id?: string;        // Optional - filter by account
  start_date?: string;        // Optional - YYYY-MM-DD
  end_date?: string;          // Optional - YYYY-MM-DD
  is_reconciled?: boolean;    // Optional - filter by reconciliation status
  transaction_type?: string;  // Optional - filter by type
  search?: string;            // Optional - search description, contact, reference
  page?: number;              // Default: 1
  per_page?: number;          // Default: 50, Max: 100
  sort_by?: string;           // Default: 'transaction_date'
  sort_order?: 'asc' | 'desc'; // Default: 'desc'
}
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "transaction_date": "2025-10-01",
      "account": {
        "id": "uuid",
        "code": "1000",
        "name": "IFM Checking/Peoples Bank",
        "type": "asset",
        "full_name": "1000 - IFM Checking/Peoples Bank"
      },
      "entity": {
        "id": "uuid",
        "name": "InFocus Ministries"
      },
      "transaction_type": "deposit",
      "reference_number": "DEP-1234",
      "contact_name": "John Doe",
      "description": "Donation from John Doe",
      "memo": "Monthly recurring donation",
      "debit_amount": "0.00",
      "credit_amount": "500.00",
      "running_balance": "41397.55",
      "is_reconciled": false,
      "reconciled_at": null,
      "created_at": "2025-10-01T10:00:00Z",
      "updated_at": "2025-10-01T10:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 50,
    "total_pages": 10,
    "total_count": 487,
    "summary": {
      "total_debits": "125430.50",
      "total_credits": "145230.75",
      "net_balance": "19800.25"
    }
  }
}
```

---

### 2. Get Account Summary

**GET** `/api/v1/general_ledger/accounts/:account_id/summary`

**Query Parameters:**
```typescript
{
  start_date: string;  // Required - YYYY-MM-DD
  end_date: string;    // Required - YYYY-MM-DD
  entity_id?: string;  // Optional
}
```

**Response:**
```json
{
  "data": {
    "account": {
      "id": "uuid",
      "code": "1000",
      "name": "IFM Checking/Peoples Bank",
      "full_name": "1000 - IFM Checking/Peoples Bank"
    },
    "period": {
      "start_date": "2025-10-01",
      "end_date": "2025-10-31"
    },
    "beginning_balance": "40897.55",
    "ending_balance": "45230.80",
    "total_debits": "12500.00",
    "total_credits": "16833.25",
    "net_change": "4333.25",
    "transaction_count": 45
  }
}
```

---

### 3. Create Ledger Entry

**POST** `/api/v1/general_ledger/entries`

**Request Body:**
```json
{
  "entry": {
    "account_id": "uuid",
    "entity_id": "uuid",
    "transaction_date": "2025-10-01",
    "transaction_type": "deposit",
    "reference_number": "DEP-1234",
    "contact_name": "John Doe",
    "description": "Donation from John Doe",
    "memo": "Monthly recurring donation",
    "debit_amount": "0.00",
    "credit_amount": "500.00"
  }
}
```

**Backend Responsibilities:**
- Validate account exists and is active
- Ensure either debit OR credit (not both, not neither)
- Calculate running balance for the account
- Update all subsequent running balances for that account
- Create audit log entry
- Return complete entry with calculated running_balance

**Response:** Same as GET single entry

---

### 4. Update Ledger Entry

**PATCH** `/api/v1/general_ledger/entries/:id`

**Request Body:** Same fields as create (partial updates allowed)

**Backend Responsibilities:**
- Prevent editing if `is_reconciled = true`
- Recalculate running balance for the account
- Update all subsequent balances for that account
- Create audit log entry
- Return updated entry

**Response:** Same as GET single entry

---

### 5. Delete Ledger Entry

**DELETE** `/api/v1/general_ledger/entries/:id`

**Backend Responsibilities:**
- Soft delete only (set `deleted_at`)
- Prevent deletion if reconciled
- Recalculate running balances for affected account
- Create audit log entry

---

### 6. Get Contacts (Autocomplete)

**GET** `/api/v1/general_ledger/contacts`

**Query Parameters:**
```typescript
{
  search: string;  // Search query
  limit?: number;  // Default: 10
}
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "contact_type": "donor"
    },
    {
      "id": "uuid",
      "name": "ABC Vendor",
      "contact_type": "vendor"
    }
  ]
}
```

---

### 7. Get Chart of Accounts

**GET** `/api/v1/chart_of_accounts`

**Query Parameters:**
```typescript
{
  organization_id: string;  // Required
  active_only?: boolean;    // Default: true
  account_type?: string;    // Optional - filter by type
}
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "code": "1000",
      "name": "IFM Checking/Peoples Bank",
      "type": "asset",
      "full_name": "1000 - IFM Checking/Peoples Bank",
      "is_active": true,
      "parent_id": null
    }
  ]
}
```

---

## Critical Backend Logic

### Running Balance Calculation

**CRITICAL:** Running balance MUST be calculated by the backend, not the frontend.

**Algorithm:**
```ruby
# When creating/updating/deleting a ledger entry:
def recalculate_running_balances(account_id, from_date)
  # Get all entries for this account from the date forward, ordered by date
  entries = LedgerEntry
    .where(account_id: account_id)
    .where('transaction_date >= ?', from_date)
    .order(:transaction_date, :created_at)
  
  # Get the balance before this date
  previous_balance = LedgerEntry
    .where(account_id: account_id)
    .where('transaction_date < ?', from_date)
    .sum('credit_amount - debit_amount')
  
  # Calculate running balance for each entry
  running_balance = previous_balance
  entries.each do |entry|
    running_balance += (entry.credit_amount - entry.debit_amount)
    entry.update_column(:running_balance, running_balance)
  end
end
```

**Why Backend?**
- Ensures data integrity
- Handles concurrent updates correctly
- Maintains consistency across all views
- Frontend just displays the value

---

### Transaction Type Rules

**Deposits:**
- Credit to revenue account (4xxx)
- Debit to asset account (1xxx)

**Checks/Payments:**
- Debit to expense account (5xxx)
- Credit to asset account (1xxx)

**Journal Entries:**
- Can be any combination
- Must balance (total debits = total credits)

**Transfers:**
- Debit one account, credit another
- Both typically asset accounts

---

## UI Components

### Main Table Columns

| Column | Description | Width |
|--------|-------------|-------|
| Flag | Unreconciled check indicator | 40px |
| Date | Transaction date | 100px |
| **Account** | Account code + name | 200px |
| Reference | Reference number | 110px |
| **Contact** | Payee/Donor name | 140px |
| Description | Transaction description | Flexible |
| **Type** | Transaction type badge | 100px |
| Debit | Debit amount (red) | 100px |
| Credit | Credit amount (green) | 100px |
| Balance | Running balance | 110px |
| Status | Reconciliation status | 90px |

**Bold** = New columns added in refactor

---

### Filters

1. **Search** - Description, account, contact, reference
2. **Account** - Dropdown from Chart of Accounts
3. **Date Range** - From/To date pickers
4. **Reconciliation Status** - All / Reconciled / Unreconciled
5. **Entity** - Organization selector (if fiscal sponsor)

---

### Transaction Drawer

**Fields:**
- Transaction ID (read-only)
- Date (date picker)
- **Account** (dropdown from Chart of Accounts)
- Reference Number (text input)
- **Contact/Payee** (autocomplete)
- Description (textarea)
- **Memo** (textarea, optional)
- **Transaction Type** (dropdown)
- Debit Amount (number input)
- Credit Amount (number input)
- Entity (dropdown)
- Reconciled (checkbox, if permitted)

**Validation:**
- Either debit OR credit (not both)
- Account must be selected
- Date required
- Amount > 0

---

## Integration Points

### Donations Manager → Journal Entry → General Ledger
When a donation is completed:
```
1. Create Journal Entry:
POST /api/v1/journal_entries
{
  entry_date: "2025-10-01",
  description: "Donation from John Doe",
  source_type: "donation",
  source_id: "donation-uuid",
  lines: [
    {
      account_id: "1000",  // Checking Account
      debit_amount: "500.00",
      credit_amount: "0.00",
      description: "Cash received"
    },
    {
      account_id: "4000",  // Donation Revenue
      debit_amount: "0.00",
      credit_amount: "500.00",
      description: "Donation revenue"
    }
  ]
}

2. Post Journal Entry:
POST /api/v1/journal_entries/:id/post

3. Backend creates 2 ledger entries (one per line)
4. Both appear in General Ledger
```

### Expenses Manager → Journal Entry → General Ledger
When an expense is paid:
```
1. Create Journal Entry:
POST /api/v1/journal_entries
{
  entry_date: "2025-10-01",
  description: "Office supplies - ABC Vendor",
  source_type: "expense",
  source_id: "expense-uuid",
  lines: [
    {
      account_id: "5300",  // Office Supplies Expense
      debit_amount: "150.00",
      credit_amount: "0.00",
      description: "Office supplies"
    },
    {
      account_id: "1000",  // Checking Account
      debit_amount: "0.00",
      credit_amount: "150.00",
      description: "Cash paid"
    }
  ]
}

2. Post Journal Entry → Creates 2 ledger entries
3. Both appear in General Ledger
```

### Reconciliation Manager → General Ledger
When a transaction is reconciled:
```
PATCH /api/v1/general_ledger/entries/:id
{
  is_reconciled: true,
  reconciled_at: "2025-10-15T14:30:00Z"
}
```

**Note:** Reconciliation updates existing ledger entries, doesn't create new ones.

---

## Export Functionality

### Export Fields
- Date
- Account (full name)
- Reference Number
- Contact/Payee
- Description
- Memo
- Entity
- Transaction Type
- Debit
- Credit
- Running Balance
- Status (Reconciled/Pending)

### Export Formats
- CSV
- Excel (XLSX)

---

## Business Rules

### Editing Rules
- ✅ Can edit unreconciled transactions
- ❌ Cannot edit reconciled transactions (must unreconcile first)
- ✅ Editing recalculates running balances

### Deletion Rules
- ✅ Can delete unreconciled transactions
- ❌ Cannot delete reconciled transactions
- ✅ Soft delete only (audit trail)

### Reconciliation Rules
- ✅ Can reconcile any transaction
- ✅ Can unreconcile (with permission)
- ✅ Reconciliation updates `is_reconciled` and `reconciled_at`

---

## Performance Considerations

### Indexing
```sql
-- Critical indexes for General Ledger
CREATE INDEX idx_ledger_entries_org_date ON ledger_entries(organization_id, transaction_date DESC);
CREATE INDEX idx_ledger_entries_account ON ledger_entries(account_id, transaction_date DESC);
CREATE INDEX idx_ledger_entries_entity ON ledger_entries(entity_id, transaction_date DESC);
CREATE INDEX idx_ledger_entries_reconciled ON ledger_entries(is_reconciled, transaction_date DESC);
CREATE INDEX idx_ledger_entries_search ON ledger_entries USING gin(to_tsvector('english', description || ' ' || COALESCE(contact_name, '')));
```

### Pagination
- Default: 50 entries per page
- Max: 100 entries per page
- Use cursor-based pagination for large datasets

### Caching
- Cache Chart of Accounts (rarely changes)
- Cache account summaries (invalidate on new transactions)
- Don't cache individual entries (real-time data)

---

## Security & Permissions

### Role-Based Access

**Fiscal Sponsor:**
- ✅ View all transactions across all nonprofits
- ✅ Create/edit/delete transactions for any nonprofit
- ✅ Reconcile any transaction

**Nonprofit User:**
- ✅ View transactions for their nonprofit only
- ✅ Create/edit/delete transactions for their nonprofit
- ✅ Reconcile transactions for their nonprofit

**Donor/Volunteer:**
- ❌ No access to General Ledger

### Data Isolation
```ruby
# Backend must filter by organization
scope :for_organization, ->(org_id) { where(organization_id: org_id) }
scope :for_entity, ->(entity_id) { where(entity_id: entity_id) }
```

---

## Testing Requirements

### Unit Tests
- Running balance calculation
- Transaction validation
- Account lookup
- Contact autocomplete

### Integration Tests
- Create transaction → Running balance updates
- Edit transaction → Subsequent balances recalculate
- Delete transaction → Balances adjust correctly
- Reconcile transaction → Status updates

### E2E Tests
- Complete donation flow → Appears in GL
- Complete expense flow → Appears in GL
- Reconciliation flow → Updates GL status
- Export flow → All fields included

---

## Migration Notes

### Frontend Changes (Completed)
- ✅ Updated `LedgerEntry` interface
- ✅ Added `Account` interface
- ✅ Mock data generates all new fields
- ✅ Removed frontend balance calculation
- ✅ Added Account, Contact, Type columns to table
- ✅ Updated drawer with new fields
- ✅ Added Account filter
- ✅ Updated export with new fields

### Backend TODO
- [ ] Update `ledger_entries` table schema
- [ ] Implement running balance calculation
- [ ] Create Chart of Accounts endpoints
- [ ] Add contact autocomplete endpoint
- [ ] Update create/update/delete endpoints
- [ ] Add account summary endpoint
- [ ] Implement proper validation
- [ ] Add audit logging
- [ ] Create database indexes

---

## Viewing Source Transactions

### Drill-Down from General Ledger

Every ledger entry has a `journal_entry_id` that links back to its source:

**UI Flow:**
1. User clicks on ledger entry in General Ledger
2. System fetches journal entry: `GET /api/v1/journal_entries/:id`
3. Modal/sheet opens showing:
   - Full journal entry with all lines
   - Source information (donation, expense, etc.)
   - Link to view source record
   - All related ledger entries grouped together

**Example:**
```
Ledger Entry: $500 credit to Donations
    ↓ (click to view)
Journal Entry: JE-2025-001
  Line 1: Debit $500 - Checking Account
  Line 2: Credit $500 - Donation Revenue
  Source: Donation #DON-123 from John Doe
    ↓ (click to view source)
Donation Record: Full donation details
```

This provides complete **audit trail** from report → ledger → journal entry → source transaction.

---

## Related Documentation

- `01-DATA-SCHEMA.md` - Complete ledger entry schema
- `02-API-REQUIREMENTS.md` - All API endpoints
- `03-COMPONENT-INTEGRATIONS.md` - Integration with other modules
- `04-CHART-OF-ACCOUNTS.md` - Chart of Accounts management
- `05-JOURNAL-ENTRY-MANAGER.md` - Journal entry specifications

---

*The General Ledger is the foundation of the accounting system. All financial transactions flow through Journal Entries into this module.*
