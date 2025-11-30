# Journal Entry Manager

**Component File:** `src/components/JournalEntryManager.tsx`  
**Route:** `/accounting-hub` (with tool='journal-entry')  
**Access Level:** Admin, Manager  
**Desktop Only:** Yes (complex multi-line entry requires larger screen)  
**Last Updated:** November 30, 2025

---

## Overview

The Journal Entry Manager is the **central hub** for all accounting transactions. It allows users to create, edit, and manage journal entries for adjustments, corrections, and serves as the posting mechanism for all other accounting modules (expenses, reimbursements, deposits, distributions).

**See:** [02-ACCOUNTING-SYSTEM-INTEGRATION.md](./02-ACCOUNTING-SYSTEM-INTEGRATION.md) for how all accounting modules connect.

---

## ✨ Key Features

### Double-Entry Accounting
- **Balanced Entries:** Debits must equal credits (validated in real-time)
- **Multi-Line Support:** Unlimited line items per entry
- **Chart of Accounts Integration:** All lines reference valid accounts
- **Fund Attribution:** Each line can be attributed to a specific fund/nonprofit

### Entry Numbers
- **Auto-Generated:** Format `JE-YYYY-NNN` (e.g., JE-2025-001)
- **Immutable:** Cannot be changed after creation
- **Sequential:** Automatically increments based on existing entries
- **Year-Based:** Resets sequence each calendar year

### Entry Management
- **Create via Drawer:** Slide-out panel for new entries
- **Edit via Drawer:** Click any entry to view/edit in drawer
- **All Entries Editable:** No draft/posted restriction in UI
- **Real-Time Validation:** Balance check as you type

### Table Display
- **Sorted by Entry Number:** Newest (highest) at top
- **Entry Totals:** Shows total debits/credits per entry
- **Line Count Badge:** Shows number of lines
- **Status Indicators:** Visual status badges
- **Click to Edit:** Any row opens the detail/edit drawer

---

## Data Structure

### JournalEntry Interface
```typescript
interface JournalEntry {
  id: string;
  organization_id: string;
  entity_id: string;              // Primary fund/nonprofit
  entry_number: string;           // Auto-generated: JE-YYYY-NNN
  entry_date: string;
  description: string;
  memo?: string;
  status: 'draft' | 'posted' | 'voided';
  source_type: 'manual' | 'expense' | 'reimbursement' | 'deposit' | 'distribution';
  source_id?: string;             // Reference to source transaction
  posted_at?: string;
  posted_by?: string;
  voided_at?: string;
  voided_by?: string;
  void_reason?: string;
  reversing_entry_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  lines: JournalEntryLine[];
}
```

### JournalEntryLine Interface
```typescript
interface JournalEntryLine {
  id: string;
  journal_entry_id: string;
  account: Account;               // From Chart of Accounts
  fund_id?: string;               // Fund attribution per line
  line_number: number;
  description: string;
  memo?: string;
  debit_amount: number;
  credit_amount: number;
}
```

### Account Interface
```typescript
interface Account {
  id: string;
  code: string;                   // e.g., "1000"
  name: string;                   // e.g., "IFM Checking"
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  full_name: string;              // e.g., "1000 - IFM Checking"
  is_active: boolean;
}
```

---

## UI Components

### Main Table View
| Column | Description |
|--------|-------------|
| Date | Entry date formatted |
| Entry Number | JE-YYYY-NNN (monospace) |
| Description | Entry description (truncated) |
| Entity | Fund/nonprofit name |
| Lines | Badge showing line count |
| Total Debits | Red, formatted currency |
| Total Credits | Green, formatted currency |
| Status | Badge (Posted/Draft/Voided) |

### Create Entry Drawer
Opens from "New Journal Entry" button:
- **Entry Number:** Read-only, shows what will be assigned
- **Date:** Date picker
- **Entity:** Dropdown of funds/nonprofits
- **Description:** Required text area
- **Memo:** Optional text area
- **Line Items:** Expandable list with:
  - Account dropdown
  - Line description
  - Debit amount
  - Credit amount
  - Fund dropdown (per line)
  - Remove button
- **Add Line Button:** Below last line
- **Totals Section:** Shows debits, credits, difference
- **Balance Indicator:** Green checkmark when balanced
- **Create Entry Button:** Disabled until balanced

### Edit Entry Drawer
Opens when clicking any table row:
- **View Mode:** Read-only display of all fields
- **Edit Button:** Switches to edit mode
- **Edit Mode:** Same fields as create, pre-populated
- **Save Changes Button:** Validates and saves
- **Cancel Button:** Discards changes

---

## Business Rules

### Entry Number Generation
```
1. Extract year from entry_date
2. Find highest existing number for that year
3. Increment by 1
4. Format as JE-YYYY-NNN (zero-padded)
```

### Validation Rules
- Entry date required
- Description required
- At least one line item required
- Total debits must equal total credits (within $0.01)
- Each line must have valid account
- Each line must have either debit OR credit (not both)
- All amounts must be non-negative

### Fund Attribution
- Each line can have its own fund_id
- Defaults to the entry's entity_id
- Enables multi-fund entries (e.g., expense allocations)

---

## Export Functionality

### Supported Formats
- **CSV:** Comma-separated values
- **XLSX:** Excel format with formatting

### Export Structure
Each entry exports with all its lines plus a totals row:
```
Entry Number | Date | Description | Entity | Line # | Account | Line Desc | Debit | Credit | Status
JE-2025-001 | 2025-11-30 | Monthly depreciation | IFM | 1 | 5310 - Equipment | Depreciation | 450.00 | 0.00 | Posted
JE-2025-001 | | | | 2 | 1700 - Accum Depr | Depreciation | 0.00 | 450.00 |
JE-2025-001 | | | | | TOTAL | | 450.00 | 450.00 |
```

---

## Integration with Other Modules

### Source Types
Journal entries can be created by:

| Source Type | Created When | Description |
|-------------|--------------|-------------|
| `manual` | User creates directly | Adjustments, corrections |
| `expense` | Expense marked as paid | Expense payment |
| `reimbursement` | Reimbursement paid | Employee reimbursement |
| `deposit` | Deposit finalized | Check or regular deposit |
| `distribution` | Distribution paid | Fiscal sponsor distribution |
| `void_reversal` | Entry voided | Automatic reversing entry |

### Linking to Source
When created by another module:
- `source_type` identifies the module
- `source_id` links to the source record
- Enables drill-down from General Ledger

---

## State Management

### Local State
```typescript
const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
const [isDrawerOpen, setIsDrawerOpen] = useState(false);
const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
const [isEditMode, setIsEditMode] = useState(false);
const [newEntry, setNewEntry] = useState({...});
const [editEntry, setEditEntry] = useState({...});
```

### Computed Values
```typescript
const totalDebits = lines.reduce((sum, line) => sum + line.debit_amount, 0);
const totalCredits = lines.reduce((sum, line) => sum + line.credit_amount, 0);
const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;
```

---

## Related Documentation

- [02-ACCOUNTING-SYSTEM-INTEGRATION.md](./02-ACCOUNTING-SYSTEM-INTEGRATION.md) - System integration guide
- [03-CHART-OF-ACCOUNTS.md](./03-CHART-OF-ACCOUNTS.md) - Account structure
- [04-GENERAL-LEDGER.md](./04-GENERAL-LEDGER.md) - Where posted entries appear

---

## API Endpoints

### Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/journal_entries` | List entries with filtering |
| GET | `/api/v1/journal_entries/:id` | Get entry with lines |
| POST | `/api/v1/journal_entries` | Create new entry |
| PUT | `/api/v1/journal_entries/:id` | Update entry |
| DELETE | `/api/v1/journal_entries/:id` | Delete entry |
| POST | `/api/v1/journal_entries/:id/post` | Post entry |
| POST | `/api/v1/journal_entries/:id/void` | Void entry |
| GET | `/api/v1/journal_entries/next_number` | Get next entry number |

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

## Migration Notes

### Backend Implementation
See [02-ACCOUNTING-SYSTEM-INTEGRATION.md](./02-ACCOUNTING-SYSTEM-INTEGRATION.md) for:
- Complete Rails service implementations
- Database schema with all fields
- Integration patterns with other modules
- Posting and voiding logic
