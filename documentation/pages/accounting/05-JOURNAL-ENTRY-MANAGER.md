# Journal Entry Manager

**Component File:** `src/components/JournalEntryManager.tsx`  
**Route:** `/accounting-hub` (with tool='journal-entry')  
**Access Level:** Admin, Manager

## ✨ Double-Entry Accounting System (NEW)

**Status:** ✅ **FULLY IMPLEMENTED**

The Journal Entry Manager has been completely refactored to support proper double-entry accounting with Chart of Accounts integration.

### Key Features

#### Proper Double-Entry Structure
- **Grouped Entries:** Journal entries displayed as single records with multiple lines
- **Balanced Entries:** Debits must equal credits (validated on creation)
- **Line Items:** Each entry contains multiple debit/credit lines
- **Chart of Accounts:** All lines reference accounts from the Chart of Accounts

#### Entry Display
- **Table View:** Shows one row per journal entry (not per line)
- **Entry Totals:** Displays total debits and credits for each entry
- **Line Count:** Shows number of lines in each entry
- **Status Badges:** Draft/Posted/Voided status indicators
- **Detail View:** Comprehensive drawer showing all lines and metadata

#### Create Dialog
- **Multi-Line Entry:** Add unlimited line items
- **Account Selection:** Choose from Chart of Accounts (21 accounts)
- **Memo Fields:** Entry-level and line-level memos
- **Real-Time Validation:** Shows balance status as you type
- **Dual Add Buttons:** Add lines from top or bottom of list

#### Data Structure
```typescript
JournalEntry {
  id, organization_id, entity_id
  entry_number, entry_date
  description, memo
  status: 'draft' | 'posted' | 'voided'
  source_type: 'manual' | 'system'
  lines: JournalEntryLine[]
}

JournalEntryLine {
  id, journal_entry_id, line_number
  account: Account  // From Chart of Accounts
  description, memo
  debit_amount, credit_amount
}
```

#### Export
- **Grouped by Entry:** Each entry exports with all its lines
- **Totals Row:** Automatic totals for each entry
- **Full Details:** Account codes, names, descriptions, amounts
- **CSV/XLSX:** Both formats supported

### Benefits

✅ **Proper Accounting:** True double-entry system  
✅ **Chart of Accounts:** Standardized account structure  
✅ **Audit Trail:** Complete entry history with metadata  
✅ **User Friendly:** Clear visual feedback and validation  
✅ **Flexible:** Unlimited lines per entry  
✅ **Consistent:** Matches General Ledger styling  

---

## Overview
The Journal Entry Manager allows users to create, edit, and manage manual journal entries for adjustments, corrections, and other accounting transactions. Journal entries are the foundation of double-entry bookkeeping, ensuring debits equal credits for every transaction.

## UI Features

### Main Features
- **Journal Entry List:** View all journal entries with status
- **Date Range Filter:** Filter by date range
- **Status Filter:** Draft, Posted, Voided
- **Search:** Search by description or reference number
- **Create Entry:** Multi-line entry form with debit/credit validation
- **Edit Entry:** Edit draft entries
- **Post Entry:** Finalize entry (makes it immutable)
- **Void Entry:** Void posted entries
- **Balance Validation:** Real-time validation that debits = credits

### Journal Entry Table
- Entry Number (e.g., JE-2025-001)
- Date
- Description
- Total Debits
- Total Credits
- Status Badge (Draft, Posted, Voided)
- Created By
- Actions (View, Edit, Post, Void, Delete)

### Create/Edit Journal Entry Form
- **Header:**
  - Entry Date
  - Reference Number (auto-generated or manual)
  - Description
  - Entity/Organization
- **Lines (Multiple):**
  - Account (searchable dropdown)
  - Fund (optional)
  - Description
  - Debit Amount
  - Credit Amount
  - Add/Remove Line buttons
- **Footer:**
  - Total Debits (calculated)
  - Total Credits (calculated)
  - Difference (must be 0.00)
  - Save as Draft / Post Entry buttons

### Entry Detail Sheet
- Full entry details
- All lines with accounts
- Audit trail
- Edit button (if draft)
- Post button (if draft)
- Void button (if posted)

## Data Requirements

### Journal Entry Data
- **id** (uuid) - Unique identifier
- **organization_id** (uuid) - Organization owner
- **entry_number** (string) - Auto-generated or manual (e.g., JE-2025-001)
- **entry_date** (date) - Transaction date
- **description** (text) - Entry description
- **reference** (string, nullable) - Reference number, invoice, etc.
- **status** (string) - 'draft', 'posted', 'voided'
- **created_by_id** (uuid) - User who created
- **posted_by_id** (uuid, nullable) - User who posted
- **posted_at** (datetime, nullable) - When posted
- **voided_by_id** (uuid, nullable) - User who voided
- **voided_at** (datetime, nullable) - When voided
- **void_reason** (text, nullable) - Reason for voiding
- **created_at** (datetime) - When created
- **updated_at** (datetime) - When updated

### Journal Entry Line Data
- **id** (uuid) - Unique identifier
- **journal_entry_id** (uuid) - Parent entry
- **account_id** (uuid) - Chart of accounts reference
- **account_number** (string) - Account code
- **account_name** (string) - Account name
- **fund_id** (uuid, nullable) - Fund reference
- **fund_name** (string, nullable) - Fund name
- **debit_amount** (decimal) - Debit amount (default: 0)
- **credit_amount** (decimal) - Credit amount (default: 0)
- **description** (text, nullable) - Line description
- **line_order** (integer) - Display order
- **created_at** (datetime) - When created
- **updated_at** (datetime) - When updated

### Data Mutations
- **Create Entry:** Create new journal entry with lines
- **Update Entry:** Edit draft entry
- **Delete Entry:** Delete draft entry
- **Post Entry:** Finalize entry (makes immutable)
- **Void Entry:** Void posted entry (creates reversing entry)

## API Endpoints Required

### GET /api/v1/journal_entries
```
Description: Fetch journal entries
Query Parameters:
  - organization_id (required, uuid)
  - start_date (optional, date)
  - end_date (optional, date)
  - status (optional, string) - 'draft', 'posted', 'voided', 'all'
  - search (optional, string) - Search description or reference
  - page (optional, integer, default: 1)
  - per_page (optional, integer, default: 25)
  - sort_by (optional, string, default: 'date_desc')

Response: {
  data: [
    {
      id: "uuid",
      organization_id: "uuid",
      entry_number: "JE-2025-001",
      entry_date: "2024-11-08",
      description: "Monthly depreciation expense",
      reference: "DEP-NOV-2024",
      status: "posted",
      total_debits: 450.00,
      total_credits: 450.00,
      line_count: 2,
      created_by: "Jane Smith",
      posted_by: "John Doe",
      posted_at: "2024-11-08T15:00:00Z",
      created_at: "2024-11-08T14:30:00Z",
      updated_at: "2024-11-08T15:00:00Z"
    }
  ],
  meta: {
    total: 156,
    page: 1,
    per_page: 25,
    total_pages: 7,
    draft_count: 5,
    posted_count: 148,
    voided_count: 3
  }
}
```

### GET /api/v1/journal_entries/:id
```
Description: Get journal entry with lines
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  data: {
    id: "uuid",
    organization_id: "uuid",
    entry_number: "JE-2025-001",
    entry_date: "2024-11-08",
    description: "Monthly depreciation expense",
    reference: "DEP-NOV-2024",
    status: "posted",
    lines: [
      {
        id: "uuid",
        account_id: "uuid",
        account_number: "5310",
        account_name: "Depreciation Expense",
        fund_id: null,
        fund_name: null,
        debit_amount: 450.00,
        credit_amount: 0.00,
        description: "Equipment depreciation",
        line_order: 1
      },
      {
        id: "uuid",
        account_id: "uuid",
        account_number: "1500",
        account_name: "Accumulated Depreciation",
        fund_id: null,
        fund_name: null,
        debit_amount: 0.00,
        credit_amount: 450.00,
        description: "Equipment depreciation",
        line_order: 2
      }
    ],
    total_debits: 450.00,
    total_credits: 450.00,
    created_by: "Jane Smith",
    posted_by: "John Doe",
    posted_at: "2024-11-08T15:00:00Z",
    created_at: "2024-11-08T14:30:00Z",
    updated_at: "2024-11-08T15:00:00Z"
  }
}
```

### POST /api/v1/journal_entries
```
Description: Create new journal entry
Request Body: {
  organization_id: "uuid",
  entry_date: "2024-11-08",
  description: "Monthly depreciation expense",
  reference: "DEP-NOV-2024",
  status: "draft", // or "posted" to post immediately
  lines: [
    {
      account_id: "uuid",
      fund_id: null,
      debit_amount: 450.00,
      credit_amount: 0.00,
      description: "Equipment depreciation",
      line_order: 1
    },
    {
      account_id: "uuid",
      fund_id: null,
      debit_amount: 0.00,
      credit_amount: 450.00,
      description: "Equipment depreciation",
      line_order: 2
    }
  ]
}

Response: {
  data: {
    id: "uuid",
    entry_number: "JE-2025-001",
    ...all entry fields with lines
  },
  message: "Journal entry created successfully"
}
```

### PUT /api/v1/journal_entries/:id
```
Description: Update journal entry (draft only)
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  entry_date: "2024-11-08",
  description: "Updated description",
  reference: "DEP-NOV-2024",
  lines: [
    // Complete array of lines (replaces existing)
  ]
}

Response: {
  data: {
    id: "uuid",
    ...updated entry fields
  },
  message: "Journal entry updated successfully"
}

Note: Can only update draft entries
```

### DELETE /api/v1/journal_entries/:id
```
Description: Delete journal entry (draft only)
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  message: "Journal entry deleted successfully"
}

Note: Can only delete draft entries
```

### POST /api/v1/journal_entries/:id/post
```
Description: Post journal entry (finalize)
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid"
}

Response: {
  data: {
    id: "uuid",
    status: "posted",
    posted_by: "John Doe",
    posted_at: "2024-11-08T15:00:00Z"
  },
  message: "Journal entry posted successfully"
}

Note: Validates debits = credits before posting
```

### POST /api/v1/journal_entries/:id/void
```
Description: Void posted journal entry
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  void_reason: "Error in calculation"
}

Response: {
  data: {
    id: "uuid",
    status: "voided",
    voided_by: "John Doe",
    voided_at: "2024-11-08T16:00:00Z",
    void_reason: "Error in calculation",
    reversing_entry_id: "uuid" // ID of auto-created reversing entry
  },
  message: "Journal entry voided successfully"
}

Note: Creates automatic reversing entry
```

### GET /api/v1/journal_entries/next_number
```
Description: Get next available entry number
Query Parameters:
  - organization_id (required, uuid)

Response: {
  data: {
    next_number: "JE-2025-042"
  }
}
```

## Request/Response Schemas

### JournalEntry Schema
```typescript
interface JournalEntry {
  id: string;
  organization_id: string;
  entry_number: string;
  entry_date: string;
  description: string;
  reference?: string;
  status: 'draft' | 'posted' | 'voided';
  total_debits: number;
  total_credits: number;
  line_count: number;
  lines?: JournalEntryLine[];
  created_by: string;
  posted_by?: string;
  posted_at?: string;
  voided_by?: string;
  voided_at?: string;
  void_reason?: string;
  created_at: string;
  updated_at: string;
}

interface JournalEntryLine {
  id: string;
  journal_entry_id: string;
  account_id: string;
  account_number: string;
  account_name: string;
  fund_id?: string;
  fund_name?: string;
  debit_amount: number;
  credit_amount: number;
  description?: string;
  line_order: number;
}
```

## Authentication & Authorization

### Required Permissions
- `journal_entries:read` - View journal entries
- `journal_entries:write` - Create and edit entries
- `journal_entries:delete` - Delete draft entries
- `journal_entries:post` - Post entries
- `journal_entries:void` - Void posted entries

### Role-Based Access
- **Admin:** Full access to all operations
- **Manager:** Can create, edit, post, void
- **Staff:** Can view only
- **Volunteer:** No access

## Business Logic & Validations

### Frontend Validations
- Entry date required
- Description required
- At least 2 lines required
- Each line must have either debit OR credit (not both)
- Total debits must equal total credits
- All amounts must be positive
- Account selection required for each line

### Backend Validations (Rails)
- Debits must equal credits (enforced at database level)
- Cannot edit posted or voided entries
- Cannot delete posted or voided entries
- Cannot post entry with unbalanced debits/credits
- Entry date cannot be in closed accounting period
- Account must exist and be active
- Fund must exist if specified

### Business Rules
- Journal entries follow double-entry bookkeeping
- Every debit must have corresponding credit(s)
- Posted entries are immutable
- Voiding creates automatic reversing entry
- Entry numbers auto-increment (JE-YYYY-NNN)
- Draft entries can be saved and edited later
- Posted entries appear in General Ledger
- Voided entries marked but not deleted (audit trail)

## State Management

### Local State
- `entries` - List of journal entries
- `selectedEntry` - Currently selected entry
- `createEntryOpen` - Create dialog state
- `editEntryOpen` - Edit dialog state
- `detailSheetOpen` - Detail sheet state
- `entryForm` - Form state for new/edit entry
- `entryLines` - Array of lines in form
- `totalDebits` - Calculated total debits
- `totalCredits` - Calculated total credits
- `isBalanced` - Whether debits = credits

### Global State (AppContext)
- `selectedEntity` - Current organization

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- Mock data - **TO BE REMOVED** - `mockJournalEntries`
- UI components (Card, Button, Table, Sheet, Dialog, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load journal entries", retry
2. **Validation Error:** Show inline errors for unbalanced entry
3. **Cannot Edit Posted:** Show error "Cannot edit posted entries"
4. **Cannot Delete Posted:** Show error "Cannot delete posted entries"
5. **Post Failed:** Show toast "Failed to post entry: [reason]"
6. **Void Failed:** Show toast "Failed to void entry: [reason]"

## Loading States
- **Initial load:** Skeleton table
- **Form submission:** Disable buttons, show spinner
- **Post entry:** Show confirmation dialog with spinner
- **Void entry:** Show confirmation dialog with reason input

## Mock Data to Remove
- `JournalEntryManager.tsx` - `mockJournalEntries` array
- Move interfaces to `src/types/journal-entry.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/journal-entries.ts`
2. Create `src/types/journal-entry.ts`
3. Replace mock data with API calls
4. Implement list view

### Phase 2: CRUD Operations
1. Implement create entry form
2. Implement edit entry form
3. Implement delete entry
4. Test balance validation

### Phase 3: Post/Void
1. Implement post entry flow
2. Implement void entry flow
3. Test immutability rules

### Phase 4: Integration
1. Ensure posted entries appear in General Ledger
2. Test with reconciliation
3. Test with closed periods

## Related Documentation
- [04-GENERAL-LEDGER.md](./04-GENERAL-LEDGER.md) - Where entries appear
- [03-CHART-OF-ACCOUNTS.md](./03-CHART-OF-ACCOUNTS.md) - Account selection
- [01-DATA-SCHEMA.md](../01-DATA-SCHEMA.md) - Journal entry data model
