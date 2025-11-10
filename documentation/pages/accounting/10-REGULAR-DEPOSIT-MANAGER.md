# Regular Deposit Manager

**Component File:** `src/components/RegularDepositManager.tsx`  
**Route:** `/accounting` (with tool='regular-deposit') or `/deposit-hub`  
**Access Level:** Admin, Manager, Accounting Staff

## Overview
The Regular Deposit Manager allows users to manually record deposits that don't involve check scanning (cash, wire transfers, ACH, online payments, etc.). It provides a form-based interface for entering deposit details including payer information, amount, category, and bank information. Multiple deposits can be batched together before submission, creating corresponding ledger entries for accurate financial tracking.

## UI Features

### Main Features
- **Two-Step Process:**
  - Form Step - Enter deposit details
  - Complete Step - Review and submit batch
- **Deposit Form:**
  - Payer name
  - Reference number
  - Amount
  - Date
  - Income category selector
  - Memo/notes
  - Bank name
  - Nonprofit selector (for fiscal sponsors)
- **Batch Management:**
  - Add multiple deposits
  - Review deposit list
  - Edit/delete deposits
  - Total amount display
  - Submit batch button
- **Income Categories:**
  - 4000 - Donations
  - 4100 - Earned Income
  - 4200 - Cash Pledge Collections
  - 4300 - Grants
  - 4400 - Government Grants
  - 4500 - Investment Income
  - 4600 - Other Income
- **Back to Accounting Hub button**

### Form Step
```
Regular Deposit Entry

┌─────────────────────────────────────────┐
│ Deposit Information                     │
├─────────────────────────────────────────┤
│                                         │
│ Payer Name *                            │
│ [John Smith                         ]   │
│                                         │
│ Reference Number                        │
│ [TXN-12345                          ]   │
│                                         │
│ Amount *                                │
│ [500.00                             ]   │
│                                         │
│ Date                                    │
│ [2025-10-20                         ]   │
│                                         │
│ Income Category *                       │
│ [4000 - Donations                   ▼]  │
│                                         │
│ Nonprofit * (Fiscal Sponsor Only)       │
│ [Awakenings                         ▼]  │
│                                         │
│ Bank Name                               │
│ [Chase Bank                         ]   │
│                                         │
│ Memo                                    │
│ [Monthly donation                   ]   │
│ [                                   ]   │
│                                         │
│ [Add to Batch]                          │
└─────────────────────────────────────────┘

Current Batch (2 deposits, $1,250.00 total)
```

### Complete Step
```
Review Deposits

Payer Name      | Ref #      | Amount   | Date       | Category        | Nonprofit   | Actions
----------------|------------|----------|------------|-----------------|-------------|--------
John Smith      | TXN-12345  | $500.00  | 2025-10-20 | Donations       | Awakenings  | [Edit] [Delete]
Jane Doe        | TXN-12346  | $750.00  | 2025-10-20 | Grants          | Bloom       | [Edit] [Delete]

Total: $1,250.00

[Back to Form]  [Submit Deposits]
```

### Success Screen
```
┌─────────────────────────────────────────┐
│              ✓                          │
│                                         │
│   Deposits Submitted Successfully!      │
│                                         │
│   2 deposits totaling $1,250.00         │
│   have been recorded.                   │
│                                         │
│   Ledger entries have been created.     │
│                                         │
│   [Record More Deposits] [View Ledger]  │
└─────────────────────────────────────────┘
```

## Data Requirements

### Deposit Data
- **id** (uuid) - Deposit identifier
- **payer_name** (string) - Who paid
- **reference_number** (string, nullable) - Transaction reference
- **amount** (decimal) - Deposit amount
- **date** (date) - Deposit date
- **category** (string) - Income category code
- **category_name** (string) - Category display name
- **memo** (string, nullable) - Notes
- **bank_name** (string, nullable) - Bank name
- **entity_id** (uuid) - Nonprofit organization
- **created_by** (uuid) - User who recorded
- **created_at** (timestamp)

### Batch Submission
- **deposits** (array) - Array of deposit data
- **total_amount** (decimal) - Sum of all deposits
- **submission_date** (date) - When submitted

## API Endpoints Required

### POST /api/v1/deposits/regular
```
Description: Submit regular deposit batch
Request Body: {
  deposits: [
    {
      payer_name: "John Smith",
      reference_number: "TXN-12345",
      amount: 500.00,
      date: "2025-10-20",
      category: "4000",
      memo: "Monthly donation",
      bank_name: "Chase Bank",
      entity_id: "uuid"
    },
    {
      payer_name: "Jane Doe",
      reference_number: "TXN-12346",
      amount: 750.00,
      date: "2025-10-20",
      category: "4300",
      memo: "Grant payment",
      bank_name: "Wells Fargo",
      entity_id: "uuid"
    }
  ]
}

Response: {
  data: {
    deposit_ids: ["uuid1", "uuid2"],
    ledger_entry_ids: ["uuid3", "uuid4"],
    total_amount: 1250.00,
    count: 2
  },
  message: "2 deposits recorded successfully"
}
```

### GET /api/v1/deposits/categories
```
Description: Get income categories
Response: {
  data: [
    {
      code: "4000",
      name: "Donations"
    },
    {
      code: "4100",
      name: "Earned Income"
    },
    ...
  ]
}
```

## Request/Response Schemas

```typescript
interface DepositData {
  id: string;
  payer_name: string;
  reference_number?: string;
  amount: number;
  date: string;
  category: string;
  category_name: string;
  memo?: string;
  bank_name?: string;
  entity_id: string;
  created_by: string;
  created_at: string;
}

interface DepositBatch {
  deposits: DepositData[];
  total_amount: number;
  submission_date: string;
}
```

## Authentication & Authorization

### Required Permissions
- `deposits:create` - Record deposits
- `deposits:read` - View deposits

### Role-Based Access
- **Fiscal Sponsor:** Record deposits for any nonprofit
- **Nonprofit User:** Record deposits for their nonprofit only
- **Accounting Staff:** Full access
- **Donor/Volunteer:** No access

## Business Logic & Validations

### Frontend Validations
- Payer name required
- Amount required and > 0
- Date required
- Category required
- Entity required (fiscal sponsor)
- Amount format validation
- Date not in future

### Backend Validations (Rails)
- Valid organization access
- Valid category code
- Valid date format
- Amount positive
- Duplicate detection
- Valid entity assignment

### Business Rules
- Each deposit creates ledger entry
- Debit: Cash/Bank Account
- Credit: Income Category Account
- Batch submission atomic (all or nothing)
- Reference numbers tracked for reconciliation
- Deposits linked to entity for reporting
- Audit trail for all deposits

## State Management

### Local State
- `step` - 'form' or 'complete'
- `deposits` - Array of deposits in batch
- `currentDeposit` - Form data for current deposit

### Global State (AppContext)
- `selectedEntity` - Current organization

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- `INCOME_CATEGORIES` - Category list
- UI components (Card, Button, Input, Select, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications

## Error Handling

### Error Scenarios
1. **Missing Required Fields:** Show error "Please fill in all required fields"
2. **Invalid Amount:** Show error "Amount must be greater than 0"
3. **Empty Batch:** Show error "Please add at least one deposit"
4. **Submission Failed:** Show toast "Failed to submit deposits"
5. **Network Error:** Show toast "Connection error, please try again"

## Loading States
- **Add to Batch:** Button loading state
- **Submit:** Button loading state with progress
- **Success:** Fade transition to success screen

## Mock Data to Remove
- `RegularDepositManager.tsx` - `INCOME_CATEGORIES` (move to API)
- Move interfaces to `src/types/deposits.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/deposits.ts`
2. Create `src/types/deposits.ts`
3. Implement submission endpoint
4. Test batch processing

### Phase 2: Ledger Integration
1. Create ledger entries on submission
2. Test double-entry bookkeeping
3. Verify account balances
4. Add reconciliation support

### Phase 3: Advanced Features
1. Add deposit templates
2. Implement recurring deposits
3. Add bulk import from CSV
4. Implement approval workflow

## Related Documentation
- [08-CHECK-DEPOSIT-MANAGER.md](./08-CHECK-DEPOSIT-MANAGER.md)
- [04-GENERAL-LEDGER.md](./04-GENERAL-LEDGER.md)
- [09-RECONCILIATION-MANAGER.md](./09-RECONCILIATION-MANAGER.md)
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md)

## Additional Notes

### Use Cases
1. **Cash Deposits:** Recording cash donations
2. **Wire Transfers:** Recording wire payments
3. **ACH Deposits:** Recording ACH transactions
4. **Online Payments:** Recording Stripe/PayPal
5. **Grant Payments:** Recording grant disbursements

### Ledger Entries Created
For each deposit:
```
Debit:  Cash - Operating Account    $500.00
Credit: 4000 - Donations             $500.00
```

### Batch Processing
- Multiple deposits submitted together
- Single API call for efficiency
- Atomic transaction (all succeed or all fail)
- Rollback on any error
- Email confirmation sent

### Reconciliation
- Reference numbers aid reconciliation
- Deposits appear in bank reconciliation
- Can match to bank statement lines
- Unmatched deposits flagged

### Reporting
- Deposits by category
- Deposits by entity
- Deposits by date range
- Deposits by user
- Deposit trends

### Best Practices
- Enter deposits daily
- Use consistent reference numbers
- Include detailed memos
- Verify amounts before submission
- Reconcile regularly
- Review for duplicates
